import { NextRequest, NextResponse } from 'next/server';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import { generateShopPacket } from '@/lib/steelEmbeds/generateShopPacket';
import { storeOrder } from '../steel-embeds/order-status/route';
import { generateOrderConfirmationEmail } from '@/lib/emails/orderConfirmation';
import { generateInternalNotificationEmail } from '@/lib/emails/internalNotification';
import { sendEmail } from '@/lib/emails/sendEmail';
import { storeFullOrder } from '../steel-embeds/order-status/route';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

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
    const body = await request.json();
    const { items, customerInfo, orderTotal, subtotal, shippingCost, shippingMethod, taxAmount, taxRate, isTaxExempt, paymentIntentId } = body;

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

    // Separate items by product type
    const steelEmbeds = items.filter(
      (item: CartItem) => item.productType === 'steel-plate-embeds'
    ) as CartItem[];
    
    const dumpsterGates = items.filter(
      (item: CartItem) => item.productType === 'dumpster-gate'
    ) as CartItem[];

    // Verify payment if paymentIntentId is provided
    if (paymentIntentId) {
      if (!stripe) {
        return NextResponse.json(
          { error: 'Stripe is not configured' },
          { status: 500 }
        );
      }

      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status !== 'succeeded') {
          return NextResponse.json(
            { error: 'Payment not completed' },
            { status: 400 }
          );
        }

        // Verify payment amount matches order total
        const paidAmount = paymentIntent.amount / 100; // Convert from cents
        if (Math.abs(paidAmount - orderTotal) > 0.01) {
          return NextResponse.json(
            { error: 'Payment amount mismatch' },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
          { error: 'Failed to verify payment' },
          { status: 500 }
        );
      }
    }

    // Generate unique job ID
    const jobId = `JOB-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Process steel embeds if any
    let embedSpecs: EmbedSpec[] = [];
    let pdfUrl: string | null = null;

    if (steelEmbeds.length > 0) {
      embedSpecs = steelEmbeds.map(item => item.configuration as EmbedSpec);
      
      // Store order for tracking
      storeOrder(jobId, embedSpecs, customerInfo);

      // Generate PDF shop packet for steel embeds
      try {
        pdfUrl = await generateShopPacket(jobId, embedSpecs);
      } catch (error) {
        console.error('PDF generation error:', error);
        // Continue even if PDF generation fails
      }
    }

    // Process dumpster gates if any
    const gateConfigs: DumpsterGateConfig[] = [];
    if (dumpsterGates.length > 0) {
      gateConfigs.push(...dumpsterGates.map(item => item.configuration as DumpsterGateConfig));
      
      // Store dumpster gate orders (you may want to create a separate store function for gates)
      // For now, we'll store them together
      if (steelEmbeds.length === 0) {
        // Only store if no steel embeds (to avoid duplicate storage)
        storeOrder(jobId, gateConfigs as any, customerInfo);
      }
    }

    // Prepare order data
    const orderData = {
      jobId,
      items: items as CartItem[],
      steelEmbeds: embedSpecs,
      dumpsterGates: gateConfigs,
      customerInfo: customerInfo as CustomerInfo,
      orderTotal,
      subtotal: subtotal || orderTotal,
      shippingCost: shippingCost || 0,
      shippingMethod: shippingMethod || null,
      taxAmount: taxAmount || 0,
      taxRate: taxRate || 0,
      isTaxExempt: isTaxExempt || false,
      paymentIntentId: paymentIntentId || null,
      paymentStatus: paymentIntentId ? 'paid' : 'pending',
      createdAt: new Date().toISOString(),
    };

    // Store full order for tracking
    storeFullOrder(orderData);

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
        orderTotal
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
          orderTotal
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
      orderData,
      pdfUrl, // Only for steel embeds currently
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

