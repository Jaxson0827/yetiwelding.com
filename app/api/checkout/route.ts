import { NextRequest, NextResponse } from 'next/server';
import type { EmbedSpec } from '@/lib/steelEmbeds/types';
import type { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import { generateOrderConfirmationEmail } from '@/lib/emails/orderConfirmation';
import { generateInternalNotificationEmail } from '@/lib/emails/internalNotification';
import { sendEmail } from '@/lib/emails/sendEmail';
import { priceEmbed } from '@/lib/steelEmbeds/pricing';
import { priceGate } from '@/lib/dumpsterGates/pricing';
import { calculateShippingLive, getPickupOnlyCalculation } from '@/lib/shipping/calculator';
import { prisma } from '@/lib/db/prisma';
import { normalizeAndValidateCartItems } from '@/lib/checkout/cartValidation';
import { getCartKey as getGateCartKey } from '@/lib/dumpsterGates/types';
import { getDumpsterGateSizeDisplay } from '@/lib/dumpsterGates/validation';
import { getEmbedCartKey } from '@/lib/steelEmbeds/key';
import { getClientIp, pgFixedWindowRateLimit } from '@/lib/rateLimit';
import crypto from 'crypto';

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
  freight?: {
    deliveryType?: 'commercial' | 'residential';
    liftgateRequired?: boolean;
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
    // Rate limit: 10 quote/checkout requests per 10 minutes per IP
    const ip = getClientIp(request);
    const rateLimitOk = await pgFixedWindowRateLimit({
      keyPrefix: 'rl:checkout',
      identity: ip,
      limit: 10,
      windowSeconds: 10 * 60,
    });
    if (!rateLimitOk) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { items, customerInfo, shippingMethod } = body;

    const validated = normalizeAndValidateCartItems(items);
    if (!validated.ok) {
      return NextResponse.json({ error: 'Invalid cart items', details: validated.errors }, { status: 400 });
    }

    if (!customerInfo?.name || !customerInfo?.email || !customerInfo?.phone) {
      return NextResponse.json(
        { error: 'Customer name, email, and phone are required' },
        { status: 400 }
      );
    }

    const normalizedItems = validated.normalizedItems;

    // Quote/Manual flow only (no Stripe payment here). Recompute totals server-side.
    const embedSpecs: EmbedSpec[] = normalizedItems
      .filter((it) => it.productType === 'steel-plate-embeds')
      .map((it) => it.configuration as EmbedSpec);

    const gateConfigs: DumpsterGateConfig[] = normalizedItems
      .filter((it) => it.productType === 'dumpster-gate')
      .map((it) => it.configuration as DumpsterGateConfig);

    const embedsSubtotal = embedSpecs.reduce((sum, spec) => {
      const bd = priceEmbed(spec);
      return sum + bd.unitPrice * (spec.quantity || 1);
    }, 0);

    const gatesSubtotal = gateConfigs.reduce((sum, cfg) => {
      const bd = priceGate(cfg);
      return sum + bd.totalPrice;
    }, 0);

    const subtotalComputed = Math.round((embedsSubtotal + gatesSubtotal) * 100) / 100;

    const shippingCalc =
      customerInfo?.shippingAddress?.zip && customerInfo?.shippingAddress?.state
        ? await calculateShippingLive(
            normalizedItems as any,
            customerInfo.shippingAddress as any,
            shippingMethod,
            (customerInfo as CustomerInfo).freight as any
          )
        : getPickupOnlyCalculation(shippingMethod);
    const chosen = shippingCalc.options?.find((o: any) => o.method === shippingMethod) || shippingCalc.options?.[0];
    const shippingCostComputed = chosen?.cost || 0;
    const totalComputed = Math.round((subtotalComputed + shippingCostComputed) * 100) / 100;

    const jobId = `JOB-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const trackingToken = crypto.randomBytes(32).toString('hex');

    const subtotalCents = Math.round(subtotalComputed * 100);
    const shippingCents = Math.round(shippingCostComputed * 100);
    const totalCents = Math.round(totalComputed * 100);

    // Store in Postgres
    const created = await prisma.order.create({
      data: {
        jobId,
        checkoutId: null,
        stripeSessionId: null,
        paymentIntentId: null,
        trackingToken,
        status: 'pending',
        paymentStatus: 'quote_requested',
        currency: 'usd',
        subtotalCents,
        shippingCents,
        taxCents: null,
        totalCents,
        customerEmail: (customerInfo as CustomerInfo).email,
        customerInfo: customerInfo as any,
        shippingMethod: shippingMethod || (shippingCalc as any).selectedMethod || null,
        notes: customerInfo?.shippingAddress?.zip && customerInfo?.shippingAddress?.state ? [] : ['shipping_tbd: quote_request_missing_state_zip'],
        flags:
          customerInfo?.shippingAddress?.zip && customerInfo?.shippingAddress?.state
            ? null
            : ({ shippingTbd: true } as any),
        items: {
          create: normalizedItems.map((it) => {
            if (it.productType === 'steel-plate-embeds') {
              const cfg = it.configuration as EmbedSpec;
              const breakdown = priceEmbed(cfg);
              const qty = cfg.quantity || 1;
              const unitCents = Math.round(breakdown.unitPrice * 100);
              const totalItemCents = unitCents * qty;
              return {
                productType: it.productType,
                sku: getEmbedCartKey(cfg),
                quantity: qty,
                unitPriceCents: unitCents,
                totalPriceCents: totalItemCents,
                configuration: cfg as any,
                name: 'Steel Plate Embed',
                description: `${cfg.plate.length}" × ${cfg.plate.width}" × ${cfg.plate.thickness}" • ${cfg.plate.material}`,
              };
            }
            const cfg = it.configuration as DumpsterGateConfig;
            const breakdown = priceGate(cfg);
            const qty = cfg.quantity || 1;
            const unitCents = Math.round(breakdown.unitPrice * 100);
            const totalItemCents = unitCents * qty;
            const sizeDisplay = getDumpsterGateSizeDisplay(cfg);
            return {
              productType: it.productType,
              sku: getGateCartKey(cfg),
              quantity: qty,
              unitPriceCents: unitCents,
              totalPriceCents: totalItemCents,
              configuration: cfg as any,
              name: 'Dumpster Gate',
              description: `Size: ${sizeDisplay} • Style: ${cfg.style.replace('-', ' ')}`,
            };
          }),
        },
      },
      include: { items: true },
    });

    const orderData = {
      orderId: created.id,
      jobId: created.jobId,
      items: created.items.map((it: any) => ({
        id: it.id,
        productType: it.productType,
        configuration: it.configuration,
        price: it.totalPriceCents / 100,
      })),
      steelEmbeds: embedSpecs,
      dumpsterGates: gateConfigs,
      customerInfo: customerInfo as CustomerInfo,
      orderTotal: totalComputed,
      subtotal: subtotalComputed,
      shippingCost: shippingCostComputed,
      shippingMethod: shippingMethod || (shippingCalc as any).selectedMethod || null,
      taxAmount: null,
      taxRate: null,
      isTaxExempt: false,
      paymentIntentId: null,
      paymentStatus: 'quote_requested',
      trackingToken,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
      status: created.status,
    };

    // Send emails (non-blocking - don't fail order if email fails)
    const emailResults = {
      customerConfirmation: { sent: false, error: null as string | null },
      internalNotification: { sent: false, error: null as string | null },
    };

    try {
      // Send order confirmation email to customer
      const confirmationEmail = generateOrderConfirmationEmail(
        jobId,
        normalizedItems as any,
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
      const businessEmail = process.env.BUSINESS_EMAIL;
      
      if (businessEmail) {
        const internalEmail = generateInternalNotificationEmail(
          jobId,
          normalizedItems as any,
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

export const runtime = 'nodejs';