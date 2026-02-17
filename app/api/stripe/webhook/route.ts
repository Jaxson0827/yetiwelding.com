import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db/prisma';
import { generateOrderConfirmationEmail } from '@/lib/emails/orderConfirmation';
import { generateInternalNotificationEmail } from '@/lib/emails/internalNotification';
import { sendEmail } from '@/lib/emails/sendEmail';
import { priceEmbed } from '@/lib/steelEmbeds/pricing';
import { priceGate } from '@/lib/dumpsterGates/pricing';
import type { EmbedSpec } from '@/lib/steelEmbeds/types';
import type { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import { getCartKey as getGateCartKey } from '@/lib/dumpsterGates/types';
import { getEmbedCartKey } from '@/lib/steelEmbeds/key';
import crypto from 'crypto';

let stripe: Stripe | null = null;

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    });
  }
  return stripe;
}

export async function POST(request: NextRequest) {
  const stripeInstance = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeInstance || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    );
  }
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripeInstance.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Postgres-only idempotency:
  // - Store each Stripe event by eventId (unique).
  // - If an earlier attempt crashed after inserting the event row but before marking processedAt,
  //   we allow reprocessing until processedAt is set.
  try {
    await prisma.stripeWebhookEvent.create({
      data: {
        eventId: event.id,
        type: event.type,
        stripeSessionId:
          event.type.startsWith('checkout.session.') ? (event.data.object as any)?.id : null,
        paymentIntentId:
          event.type.startsWith('payment_intent.') ? (event.data.object as any)?.id : (event.data.object as any)?.payment_intent || null,
        raw: event as any,
      },
    });
  } catch (e) {
    // If the row already exists, continue and check processedAt below.
    if ((e as any)?.code !== 'P2002') {
      console.error('Failed to record webhook event:', e);
      return NextResponse.json({ error: 'Failed to record webhook event' }, { status: 500 });
    }
  }

  const existingEvent = await prisma.stripeWebhookEvent.findUnique({
    where: { eventId: event.id },
    select: { processedAt: true },
  });
  if (existingEvent?.processedAt) {
    return NextResponse.json({ received: true, deduped: true });
  }

  async function maybeSendEmails(opts: { jobId: string; trackingToken: string; items: any[]; customerInfo: any; orderTotalUsd: number }) {
    // Best-effort; do not fail webhook.
    try {
      const businessEmail = process.env.BUSINESS_EMAIL || process.env.RESEND_FROM_EMAIL;
      const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://yetiwelding.com').replace(/\/+$/, '');
      const trackingUrl = `${site}/order/track/${encodeURIComponent(opts.jobId)}?token=${encodeURIComponent(opts.trackingToken)}`;

      const confirmationEmail = generateOrderConfirmationEmail(opts.jobId, opts.items, opts.customerInfo, opts.orderTotalUsd, { trackingUrl });
      await sendEmail({
        to: opts.customerInfo?.email,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html,
        text: confirmationEmail.text,
        replyTo: businessEmail || undefined,
      });

      if (businessEmail) {
        const internalEmail = generateInternalNotificationEmail(opts.jobId, opts.items, opts.customerInfo, opts.orderTotalUsd, { trackingUrl });
        await sendEmail({
          to: businessEmail,
          subject: internalEmail.subject,
          html: internalEmail.html,
          text: internalEmail.text,
          replyTo: opts.customerInfo?.email,
        });
      }
    } catch (emailErr) {
      console.error('Webhook email error:', emailErr);
    }
  }

  function clampInt(n: unknown, min: number, max: number): number {
    const parsed = typeof n === 'number' ? n : Number(n);
    if (!Number.isFinite(parsed)) return min;
    return Math.min(max, Math.max(min, Math.floor(parsed)));
  }

  function stripeAddressToShippingAddress(addr: Stripe.Address | null | undefined) {
    if (!addr) return null;
    const street = [addr.line1, addr.line2].filter(Boolean).join(' ').trim();
    return {
      street: street || '',
      city: addr.city || '',
      state: addr.state || '',
      zip: addr.postal_code || '',
      country: addr.country || '',
    };
  }

  async function createOrUpdateOrderFromSession(opts: { session: Stripe.Checkout.Session; forceMarkPaid?: boolean; reasonEventType: string }) {
    const session = opts.session;
    const checkoutId = session.client_reference_id || session.metadata?.checkoutId || null;
    const sessionId = session.id;
    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;

    if (!checkoutId) {
      console.error('Webhook missing checkoutId for session:', sessionId);
      return { ok: false as const };
    }

    const draft =
      (await prisma.checkoutDraft.findUnique({ where: { stripeSessionId: sessionId } })) ||
      (await prisma.checkoutDraft.findUnique({ where: { checkoutId } }));
    if (!draft) {
      console.error('Draft not found for session/checkout:', { sessionId, checkoutId });
      return { ok: false as const };
    }

    // Validate totals vs expected draft totals.
    const mismatches: string[] = [];
    const currency = (session.currency || 'usd').toLowerCase();
    const expectedCurrency = (draft.expectedCurrency || 'usd').toLowerCase();
    if (currency !== expectedCurrency) {
      mismatches.push(`currency_mismatch stripe=${currency} expected=${expectedCurrency}`);
    }

    const stripeSubtotal = typeof session.amount_subtotal === 'number' ? session.amount_subtotal : null;
    if (typeof draft.expectedSubtotalCents === 'number' && stripeSubtotal !== null && stripeSubtotal !== draft.expectedSubtotalCents) {
      mismatches.push(`subtotal_mismatch stripe=${stripeSubtotal} expected=${draft.expectedSubtotalCents}`);
    }

    const stripeShipping = typeof session.total_details?.amount_shipping === 'number' ? session.total_details.amount_shipping : null;
    if (Array.isArray(draft.allowedShippingCents) && draft.allowedShippingCents.length > 0 && stripeShipping !== null) {
      if (!draft.allowedShippingCents.includes(stripeShipping)) {
        mismatches.push(`shipping_mismatch stripe=${stripeShipping} expected_in=[${draft.allowedShippingCents.join(',')}]`);
      }
    } else if (typeof draft.expectedShippingCents === 'number' && stripeShipping !== null && stripeShipping !== draft.expectedShippingCents) {
      mismatches.push(`shipping_mismatch stripe=${stripeShipping} expected=${draft.expectedShippingCents}`);
    }

    const needsReview = mismatches.length > 0;

    const paymentStatus = opts.forceMarkPaid || session.payment_status === 'paid' ? ('paid' as const) : ('pending' as const);
    const status = needsReview ? ('needs_review' as const) : paymentStatus === 'paid' ? ('pending' as const) : ('pending_payment' as const);

    // Merge Stripe-collected final details back into stored customerInfo snapshot.
    const mergedCustomerInfo = (() => {
      const base = (draft.customerInfo ?? {}) as any;
      const next = JSON.parse(JSON.stringify(base));
      const email = session.customer_details?.email || next.email;
      if (email) next.email = email;
      const phone = session.customer_details?.phone || next.phone;
      if (phone) next.phone = phone;

      const stripeShip = stripeAddressToShippingAddress((session as any).shipping_details?.address);
      if (stripeShip) {
        next.shippingAddress = {
          ...(next.shippingAddress || {}),
          ...stripeShip,
        };
      }
      const stripeName = (session as any).shipping_details?.name || session.customer_details?.name;
      if (stripeName) next.name = stripeName;
      return next;
    })();

    const customerEmail = (mergedCustomerInfo?.email || session.customer_details?.email || 'unknown@example.com') as string;

    // Upsert order by unique Stripe identifiers.
    const existing = await prisma.order.findFirst({
      where: {
        OR: [
          { stripeSessionId: sessionId },
          ...(paymentIntentId ? [{ paymentIntentId }] : []),
          { checkoutId },
        ],
      },
      include: { items: true },
    });

    const subtotalCents = stripeSubtotal ?? null;
    const shippingCents = stripeShipping ?? null;
    const taxCents = typeof session.total_details?.amount_tax === 'number' ? session.total_details.amount_tax : null;
    const totalCents = typeof session.amount_total === 'number' ? session.amount_total : null;

    // Resolve chosen shipping rate metadata (provider/carrier/service) from Stripe.
    const stripeShippingRateId =
      typeof (session as any)?.shipping_cost?.shipping_rate === 'string'
        ? ((session as any).shipping_cost.shipping_rate as string)
        : null;

    let shippingMethod: string | null = (draft.selectedShippingMethod || null) as any;
    let shippingProvider: string | null = null;
    let shippingCarrier: string | null = null;
    let shippingService: string | null = null;
    let shippingQuoteId: string | null = null;

    if (stripeShippingRateId) {
      try {
        const sr = await stripeInstance!.shippingRates.retrieve(stripeShippingRateId);
        const md: any = (sr as any)?.metadata || {};
        if (md.method) shippingMethod = String(md.method);
        if (md.provider) shippingProvider = String(md.provider);
        if (md.carrier) shippingCarrier = String(md.carrier);
        if (md.service) shippingService = String(md.service);
        if (md.providerRateId) shippingQuoteId = String(md.providerRateId);
      } catch (e) {
        console.warn('Failed to retrieve Stripe shipping rate metadata', e);
      }
    }

    const notes: string[] = [];
    const flags = needsReview ? { totalsMismatch: true, mismatches } : null;
    if (needsReview) notes.push(`needs_review: ${mismatches.join(' | ')}`);

    const draftItems = Array.isArray(draft.items) ? (draft.items as any[]) : [];

    const orderItemsCreate = draftItems.map((it) => {
      const productType = String(it.productType || '');
      if (productType === 'steel-plate-embeds') {
        const cfg = { ...(it.configuration as EmbedSpec) };
        cfg.quantity = clampInt(cfg.quantity, 1, 999);
        const bd = priceEmbed(cfg);
        const qty = cfg.quantity || 1;
        const unitCents = Math.max(0, Math.round(bd.unitPrice * 100));
        return {
          productType,
          sku: getEmbedCartKey(cfg),
          quantity: qty,
          unitPriceCents: unitCents,
          totalPriceCents: unitCents * qty,
          configuration: cfg as any,
          name: 'Steel Plate Embed',
          description: `${cfg.plate.length}" × ${cfg.plate.width}" × ${cfg.plate.thickness}" • ${cfg.plate.material}`,
        };
      }
      const cfg = { ...(it.configuration as DumpsterGateConfig) };
      cfg.quantity = clampInt(cfg.quantity, 1, 999);
      const bd = priceGate(cfg);
      const qty = cfg.quantity || 1;
      const unitCents = Math.max(0, Math.round(bd.unitPrice * 100));
      const sizeDisplay = cfg.isCustom ? `${cfg.widthFt}' × ${cfg.heightFt}'` : cfg.size;
      return {
        productType,
        sku: getGateCartKey(cfg),
        quantity: qty,
        unitPriceCents: unitCents,
        totalPriceCents: unitCents * qty,
        configuration: cfg as any,
        name: 'Dumpster Gate',
        description: `Size: ${sizeDisplay} • Style: ${cfg.style.replace('-', ' ')}`,
      };
    });

    const result = await prisma.$transaction(async (tx: any) => {
      if (existing) {
        const wasPaid = existing.paymentStatus === 'paid';
        const nextPaymentStatus = existing.paymentStatus === 'paid' ? 'paid' : paymentStatus;
        const nextStatus =
          existing.status === 'needs_review'
            ? 'needs_review'
            : needsReview
              ? 'needs_review'
              : nextPaymentStatus === 'paid'
                ? 'pending'
                : 'pending_payment';

        const updateData: any = {
          checkoutId,
          stripeSessionId: sessionId,
          paymentIntentId,
          paymentStatus: nextPaymentStatus,
          status: nextStatus,
          currency,
          subtotalCents,
          shippingCents,
          taxCents,
          totalCents,
          customerEmail,
          customerInfo: mergedCustomerInfo as any,
          shippingMethod: shippingMethod as any,
          shippingProvider: shippingProvider as any,
          shippingCarrier: shippingCarrier as any,
          shippingService: shippingService as any,
          shippingQuoteId: shippingQuoteId as any,
          stripeShippingRateId: stripeShippingRateId as any,
          // Only append notes if newly needs review.
          notes: needsReview ? Array.from(new Set([...(existing.notes || []), ...notes])) : existing.notes,
        };
        if (needsReview && flags) {
          updateData.flags = flags as any;
        }

        const updated = await tx.order.update({
          where: { id: existing.id },
          data: updateData,
        });

        // If this order was created earlier without items, populate them once.
        if ((existing.items?.length || 0) === 0 && orderItemsCreate.length > 0) {
          await tx.orderItem.createMany({
            data: orderItemsCreate.map((oi) => ({ ...oi, orderId: updated.id })),
          });
        }

        return { order: updated, shouldEmail: !wasPaid && nextPaymentStatus === 'paid' && nextStatus !== 'needs_review' };
      }

      const created = await tx.order.create({
        data: {
          jobId: `JOB-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          checkoutId,
          stripeSessionId: sessionId,
          paymentIntentId,
          trackingToken: draft.trackingToken,
          status,
          paymentStatus,
          currency,
          subtotalCents,
          shippingCents,
          taxCents,
          totalCents,
          customerEmail,
          customerInfo: mergedCustomerInfo as any,
          shippingMethod: shippingMethod as any,
          shippingProvider: shippingProvider as any,
          shippingCarrier: shippingCarrier as any,
          shippingService: shippingService as any,
          shippingQuoteId: shippingQuoteId as any,
          stripeShippingRateId: stripeShippingRateId as any,
          notes,
          ...(flags ? { flags: flags as any } : {}),
          items: {
            create: orderItemsCreate as any,
          },
        },
      });
      return { order: created, shouldEmail: paymentStatus === 'paid' && status !== 'needs_review' };
    });

    if (result.shouldEmail) {
      await maybeSendEmails({
        jobId: result.order.jobId,
        trackingToken: result.order.trackingToken,
        items: draftItems,
        customerInfo: mergedCustomerInfo,
        orderTotalUsd: typeof totalCents === 'number' ? totalCents / 100 : 0,
      });
    }

    return { ok: true as const, created: !existing, needsReview, paymentStatus };
  }

  try {
    const appendNote = (existingNotes: string[] | null | undefined, note: string): string[] => {
      const base = Array.isArray(existingNotes) ? existingNotes : [];
      return Array.from(new Set([...base, note]));
    };

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const res = await createOrUpdateOrderFromSession({ session, forceMarkPaid: false, reasonEventType: event.type });
      if (!res.ok) return NextResponse.json({ error: 'Failed to handle event' }, { status: 500 });
    } else if (event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session;
      const res = await createOrUpdateOrderFromSession({ session, forceMarkPaid: true, reasonEventType: event.type });
      if (!res.ok) return NextResponse.json({ error: 'Failed to handle event' }, { status: 500 });
    } else if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const res = await createOrUpdateOrderFromSession({ session, forceMarkPaid: false, reasonEventType: event.type });
      if (!res.ok) return NextResponse.json({ error: 'Failed to handle event' }, { status: 500 });

      const sessionId = typeof session.id === 'string' ? session.id : null;
      if (sessionId) {
        const existing = await prisma.order.findFirst({ where: { stripeSessionId: sessionId } });
        if (existing && existing.paymentStatus !== 'paid' && existing.paymentStatus !== 'refunded') {
          await prisma.order.update({
            where: { id: existing.id },
            data: {
              paymentStatus: 'failed',
              status: existing.status === 'needs_review' ? 'needs_review' : 'pending_payment',
              notes: appendNote(existing.notes, `payment_failed: ${event.type}`),
            },
          });
        }
      }
    } else if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent;
      const paymentIntentId = typeof pi.id === 'string' ? pi.id : null;
      if (paymentIntentId) {
        // Best-effort: if we already created the order but payment status is still pending, mark it paid.
        const existing = await prisma.order.findFirst({ where: { paymentIntentId } });
        if (existing && existing.paymentStatus !== 'paid') {
          const updated = await prisma.order.update({
            where: { id: existing.id },
            data: {
              paymentStatus: 'paid',
              status: existing.status === 'needs_review' ? 'needs_review' : 'pending',
            },
          });
          if (updated.status !== 'needs_review') {
            await maybeSendEmails({
              jobId: updated.jobId,
              trackingToken: updated.trackingToken,
              items: [],
              customerInfo: updated.customerInfo,
              orderTotalUsd: typeof updated.totalCents === 'number' ? updated.totalCents / 100 : 0,
            });
          }
        }
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object as Stripe.PaymentIntent;
      const paymentIntentId = typeof pi.id === 'string' ? pi.id : null;
      if (paymentIntentId) {
        const existing = await prisma.order.findFirst({ where: { paymentIntentId } });
        if (existing && existing.paymentStatus !== 'paid' && existing.paymentStatus !== 'refunded') {
          await prisma.order.update({
            where: { id: existing.id },
            data: {
              paymentStatus: 'failed',
              status: existing.status === 'needs_review' ? 'needs_review' : 'pending_payment',
              notes: appendNote(existing.notes, `payment_failed: ${event.type}`),
            },
          });
        }
      }
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const res = await createOrUpdateOrderFromSession({ session, forceMarkPaid: false, reasonEventType: event.type });
      if (!res.ok) return NextResponse.json({ error: 'Failed to handle event' }, { status: 500 });

      const sessionId = typeof session.id === 'string' ? session.id : null;
      if (sessionId) {
        const existing = await prisma.order.findFirst({ where: { stripeSessionId: sessionId } });
        if (existing && existing.paymentStatus !== 'paid' && existing.paymentStatus !== 'refunded') {
          await prisma.order.update({
            where: { id: existing.id },
            data: {
              paymentStatus: 'failed',
              status: existing.status === 'needs_review' ? 'needs_review' : 'cancelled',
              notes: appendNote(existing.notes, `checkout_expired: ${event.type}`),
            },
          });
        }
      }
    } else if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId = typeof (charge as any)?.payment_intent === 'string' ? ((charge as any).payment_intent as string) : null;
      if (paymentIntentId) {
        const existing = await prisma.order.findFirst({ where: { paymentIntentId } });
        if (existing) {
          // Don't override "shipped/delivered" statuses; refunds can happen post-ship.
          const keepStatus = existing.status === 'shipped' || existing.status === 'delivered';
          await prisma.order.update({
            where: { id: existing.id },
            data: {
              paymentStatus: 'refunded',
              status: keepStatus ? existing.status : existing.status === 'needs_review' ? 'needs_review' : 'cancelled',
              notes: appendNote(existing.notes, `refunded: ${event.type}`),
            },
          });
        }
      }
    } else {
      // Keep logs minimal in production; other event types can be handled later.
    }

    await prisma.stripeWebhookEvent.update({
      where: { eventId: event.id },
      data: { processedAt: new Date() },
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    // Return a non-2xx so Stripe retries (transient failures should not lose orders).
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

// Disable body parsing for webhook route
export const runtime = 'nodejs';





