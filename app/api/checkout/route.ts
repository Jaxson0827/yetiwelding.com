import { NextRequest, NextResponse } from 'next/server';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import { generateOrderConfirmationEmail } from '@/lib/emails/orderConfirmation';
import { generateInternalNotificationEmail } from '@/lib/emails/internalNotification';
import { sendEmail } from '@/lib/emails/sendEmail';
import { priceEmbed } from '@/lib/steelEmbeds/pricing';
import { priceGate } from '@/lib/dumpsterGates/pricing';
import { calculateShipping } from '@/lib/shipping/calculator';
import { kvRateLimitFixedWindow, kvSetJson, kvSetString, KvNotConfiguredError } from '@/lib/storage/kv';
import { KV_KEYS } from '@/lib/storage/keys';
import crypto from 'crypto';

interface CartItem {
  id: string;
  productType: 'steel-plate-embeds' | 'dumpster-gate';
  configuration: EmbedSpec | DumpsterGateConfig;
  price: number;
  isCustomFabrication?: boolean;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  specialInstructions?: string;
  useBillingAddress: boolean;
}

/**
 * Unified checkout API that processes orders for both product types
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit (best effort in dev; required in production)
    try {
      const xff = request.headers.get('x-forwarded-for');
      const ip = xff ? xff.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
      const ok = await kvRateLimitFixedWindow(`rl:quote_checkout:${ip}`, 10, 10 * 60);
      if (!ok) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
      }
    } catch (e) {
      if (!(e instanceof KvNotConfiguredError)) throw e;
    }

    const body = await request.json();
    const { items, customerInfo, shippingMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    if (!customerInfo) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    // Quote/Manual flow only (no Stripe payment here). Recompute totals server-side.
    const embedSpecs: EmbedSpec[] = items
      .filter((it: CartItem) => it.productType === 'steel-plate-embeds')
      .map((it: CartItem) => it.configuration as EmbedSpec);

    const gateConfigs: DumpsterGateConfig[] = items
      .filter((it: CartItem) => it.productType === 'dumpster-gate')
      .map((it: CartItem) => it.configuration as DumpsterGateConfig);

    const embedsSubtotal = embedSpecs.reduce((sum, spec) => {
      const bd = priceEmbed(spec);
      return sum + bd.unitPrice * (spec.quantity || 1);
    }, 0);

    const gatesSubtotal = gateConfigs.reduce((sum, cfg) => {
      const bd = priceGate(cfg);
      return sum + bd.totalPrice;
    }, 0);

    const subtotalComputed = Math.round((embedsSubtotal + gatesSubtotal) * 100) / 100;

    const shippingCalc = customerInfo?.shippingAddress?.zip
      ? calculateShipping(items as any, customerInfo.shippingAddress as any, shippingMethod)
      : { options: [], selectedMethod: shippingMethod || null };
    const chosen = shippingCalc.options?.find((o: any) => o.method === shippingMethod) || shippingCalc.options?.[0];
    const shippingCostComputed = chosen?.cost || 0;
    const totalComputed = Math.round((subtotalComputed + shippingCostComputed) * 100) / 100;

    const jobId = `JOB-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const orderId = crypto.randomUUID();
    const trackingToken = crypto.randomBytes(32).toString('hex');

    // Prepare order data
    const orderData = {
      orderId,
      jobId,
      items: items as CartItem[],
      steelEmbeds: embedSpecs,
      dumpsterGates: gateConfigs,
      customerInfo: customerInfo as CustomerInfo,
      orderTotal: totalComputed,
      subtotal: subtotalComputed,
      shippingCost: shippingCostComputed,
      shippingMethod: shippingMethod || shippingCalc.selectedMethod || null,
      taxAmount: null,
      taxRate: null,
      isTaxExempt: false,
      paymentIntentId: null,
      paymentStatus: 'quote_requested',
      trackingToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
    };

    // Store in KV (required for serverless reliability)
    await kvSetJson(KV_KEYS.order(orderId), orderData);
    await kvSetString(KV_KEYS.orderByJob(jobId), orderId, 365 * 24 * 60 * 60);

    // Send emails (non-blocking - don't fail order if email fails)
    const emailResults = {
      customerConfirmation: { sent: false, error: null as string | null },
      internalNotification: { sent: false, error: null as string | null },
    };

    try {
      // Send order confirmation email to customer
      const confirmationEmail = generateOrderConfirmationEmail(
        jobId,
        items as CartItem[],
        customerInfo as CustomerInfo,
        totalComputed,
        {
          trackingUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yetiwelding.com'}/order/track/${encodeURIComponent(jobId)}?token=${encodeURIComponent(trackingToken)}`,
        }
      );

      const customerEmailResult = await sendEmail({
        to: customerInfo.email,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html,
        text: confirmationEmail.text,
        replyTo: process.env.BUSINESS_EMAIL || process.env.RESEND_FROM_EMAIL,
      });

      emailResults.customerConfirmation.sent = customerEmailResult.success;
      emailResults.customerConfirmation.error = customerEmailResult.error || null;

      if (customerEmailResult.success) {
        console.log('Order confirmation email sent to customer:', customerInfo.email);
      } else {
        console.error('Failed to send order confirmation email:', customerEmailResult.error);
      }
    } catch (error) {
      console.error('Error sending customer confirmation email:', error);
      emailResults.customerConfirmation.error = error instanceof Error ? error.message : 'Unknown error';
    }

    try {
      // Send internal notification email to team
      const businessEmail = process.env.BUSINESS_EMAIL || process.env.RESEND_FROM_EMAIL;
      
      if (businessEmail) {
        const internalEmail = generateInternalNotificationEmail(
          jobId,
          items as CartItem[],
          customerInfo as CustomerInfo,
          totalComputed,
          {
            trackingUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yetiwelding.com'}/order/track/${encodeURIComponent(jobId)}?token=${encodeURIComponent(trackingToken)}`,
          }
        );

        const internalEmailResult = await sendEmail({
          to: businessEmail,
          subject: internalEmail.subject,
          html: internalEmail.html,
          text: internalEmail.text,
          replyTo: customerInfo.email,
        });

        emailResults.internalNotification.sent = internalEmailResult.success;
        emailResults.internalNotification.error = internalEmailResult.error || null;

        if (internalEmailResult.success) {
          console.log('Internal notification email sent to team:', businessEmail);
        } else {
          console.error('Failed to send internal notification email:', internalEmailResult.error);
        }
      } else {
        console.warn('BUSINESS_EMAIL not configured - skipping internal notification');
        emailResults.internalNotification.error = 'BUSINESS_EMAIL not configured';
      }
    } catch (error) {
      console.error('Error sending internal notification email:', error);
      emailResults.internalNotification.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // TODO: In production, implement:
    // 1. Save orderData to database
    // 2. Flag for review if custom fabrication
    // 3. Store PDF in persistent storage
    // 4. Create separate job IDs if needed for different product types

    return NextResponse.json({
      success: true,
      jobId,
      trackingToken,
      orderData,
      emails: emailResults, // Include email status for debugging
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your order' },
      { status: 500 }
    );
  }
}

