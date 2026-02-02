import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { kvGetJson, kvGetString, kvSetJson, kvSetString, kvSetStringIfNotExists, KvNotConfiguredError } from '@/lib/storage/kv';
import { KV_KEYS } from '@/lib/storage/keys';
import { generateOrderConfirmationEmail } from '@/lib/emails/orderConfirmation';
import { generateInternalNotificationEmail } from '@/lib/emails/internalNotification';
import { sendEmail } from '@/lib/emails/sendEmail';
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

  const EVENT_TTL_SECONDS = 30 * 24 * 60 * 60;
  const LOCK_TTL_SECONDS = 5 * 60;
  const lockKey = `event_lock:${event.id}`;

  try {
    // Idempotency: if already processed, return early.
    const already = await kvGetString(KV_KEYS.event(event.id));
    if (already) {
      return NextResponse.json({ received: true, deduped: true });
    }

    // Concurrency guard: avoid double-processing the same event in parallel.
    const gotLock = await kvSetStringIfNotExists(lockKey, '1', LOCK_TTL_SECONDS);
    if (!gotLock) {
      return NextResponse.json({ received: true, deduped: true, locked: true });
    }
  } catch (e) {
    if (!(e instanceof KvNotConfiguredError)) throw e;
  }

  type Draft = {
    checkoutId: string;
    sessionId: string;
    paymentIntentId: string | null;
    createdAt: string;
    trackingToken: string;
    items: any[];
    customerInfo: any;
    selectedShippingMethod: string | null;
    shippingOptions: any[];
    expectedCurrency?: string;
    expectedSubtotalCents?: number;
    expectedShippingCents?: number;
    allowedShippingCents?: number[];
  };

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

  async function findExistingOrderId(opts: { sessionId?: string | null; paymentIntentId?: string | null }): Promise<string | null> {
    const { sessionId, paymentIntentId } = opts;
    if (sessionId) {
      const bySession = await kvGetString(KV_KEYS.orderBySession(sessionId));
      if (bySession) return bySession;
    }
    if (paymentIntentId) {
      const byPi = await kvGetString(KV_KEYS.orderByPi(paymentIntentId));
      if (byPi) return byPi;
    }
    return null;
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

    // Idempotency: do not create duplicates for the same session/PI.
    const existingOrderId = await findExistingOrderId({ sessionId, paymentIntentId });
    if (existingOrderId) {
      // If we got a late paid event, we still may need to mark paid.
      if (opts.forceMarkPaid) {
        const existing = await kvGetJson<any>(KV_KEYS.order(existingOrderId));
        if (existing && existing.paymentStatus !== 'paid') {
          existing.paymentStatus = 'paid';
          existing.updatedAt = new Date().toISOString();
          await kvSetJson(KV_KEYS.order(existingOrderId), existing);
          // If it was pending payment and not flagged, send emails now.
          if (existing.status !== 'needs_review') {
            await maybeSendEmails({
              jobId: existing.jobId,
              trackingToken: existing.trackingToken,
              items: existing.items,
              customerInfo: existing.customerInfo,
              orderTotalUsd: typeof existing.orderTotal === 'number' ? existing.orderTotal : 0,
            });
          }
        }
      }
      return { ok: true as const, deduped: true as const };
    }

    const draft = await kvGetJson<Draft>(KV_KEYS.draftBySession(sessionId));
    if (!draft) {
      console.error('Draft not found for session:', sessionId);
      // Don't mark event processed: Stripe will retry and draft might exist later.
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

    const paymentStatus =
      opts.forceMarkPaid || session.payment_status === 'paid' ? ('paid' as const) : ('pending' as const);

    const orderId = crypto.randomUUID();
    const jobId = `JOB-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const now = new Date().toISOString();
    const orderRecord: any = {
      orderId,
      jobId,
      status: needsReview ? ('needs_review' as const) : paymentStatus === 'paid' ? ('pending' as const) : ('pending_payment' as const),
      createdAt: now,
      updatedAt: now,
      paymentStatus,
      paymentIntentId,
      checkoutSessionId: sessionId,
      checkoutId,
      trackingToken: draft.trackingToken,
      items: draft.items,
      customerInfo: draft.customerInfo,
      shippingMethod: draft.selectedShippingMethod,
      subtotal: stripeSubtotal !== null ? stripeSubtotal / 100 : null,
      orderTotal: typeof session.amount_total === 'number' ? session.amount_total / 100 : null,
      taxAmount: typeof session.total_details?.amount_tax === 'number' ? session.total_details.amount_tax / 100 : null,
      shippingCost: stripeShipping !== null ? stripeShipping / 100 : null,
      currency,
      notes: [] as string[],
      flags: needsReview ? { totalsMismatch: true, mismatches } : undefined,
    };

    if (needsReview) {
      orderRecord.notes.push(`needs_review: ${mismatches.join(' | ')}`);
    }

    await kvSetJson(KV_KEYS.order(orderId), orderRecord);
    await kvSetString(KV_KEYS.orderByJob(jobId), orderId, 365 * 24 * 60 * 60);
    await kvSetString(KV_KEYS.orderBySession(sessionId), orderId, 365 * 24 * 60 * 60);
    if (paymentIntentId) {
      await kvSetString(KV_KEYS.orderByPi(paymentIntentId), orderId, 365 * 24 * 60 * 60);
    }

    // Only send emails when paid and not flagged for review.
    if (!needsReview && paymentStatus === 'paid') {
      await maybeSendEmails({
        jobId,
        trackingToken: orderRecord.trackingToken,
        items: draft.items,
        customerInfo: draft.customerInfo,
        orderTotalUsd: typeof orderRecord.orderTotal === 'number' ? orderRecord.orderTotal : 0,
      });
    }

    return { ok: true as const, created: true as const, needsReview, paymentStatus };
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await createOrUpdateOrderFromSession({ session, forceMarkPaid: false, reasonEventType: event.type });
    } else if (event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session;
      await createOrUpdateOrderFromSession({ session, forceMarkPaid: true, reasonEventType: event.type });
    } else if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent;
      const paymentIntentId = typeof pi.id === 'string' ? pi.id : null;
      if (paymentIntentId) {
        const existingOrderId = await findExistingOrderId({ paymentIntentId, sessionId: null });
        if (existingOrderId) {
          const existing = await kvGetJson<any>(KV_KEYS.order(existingOrderId));
          if (existing && existing.paymentStatus !== 'paid') {
            existing.paymentStatus = 'paid';
            existing.updatedAt = new Date().toISOString();
            await kvSetJson(KV_KEYS.order(existingOrderId), existing);
            if (existing.status !== 'needs_review') {
              await maybeSendEmails({
                jobId: existing.jobId,
                trackingToken: existing.trackingToken,
                items: existing.items,
                customerInfo: existing.customerInfo,
                orderTotalUsd: typeof existing.orderTotal === 'number' ? existing.orderTotal : 0,
              });
            }
          }
        } else {
          // If we have a draft indexed by PI, try to locate the session and create the order now.
          const sessionId = await kvGetString(KV_KEYS.draftByPi(paymentIntentId));
          if (sessionId) {
            const draft = await kvGetJson<Draft>(KV_KEYS.draftBySession(sessionId));
            if (draft) {
              // Fetch session from Stripe to validate totals + payment_status.
              const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
              await createOrUpdateOrderFromSession({ session, forceMarkPaid: true, reasonEventType: event.type });
            }
          }
        }
      }
    } else {
      // Keep logs minimal in production; other event types can be handled later.
    }

    // Mark event processed only after successful handling.
    try {
      await kvSetString(KV_KEYS.event(event.id), '1', EVENT_TTL_SECONDS);
    } catch (e) {
      if (!(e instanceof KvNotConfiguredError)) throw e;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    // Do NOT mark event processed; Stripe can retry.
    return NextResponse.json({ received: true });
  }
}

// Disable body parsing for webhook route
export const runtime = 'nodejs';





