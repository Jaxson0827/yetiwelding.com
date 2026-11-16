import 'server-only';
import type Stripe from 'stripe';
import crypto from 'crypto';
import { prisma } from '@/lib/db/prisma';
import { priceGate } from '@/lib/dumpsterGates/pricing';
import type { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import { getGateQuoteReasons, getGateSummaryLine } from '@/lib/dumpsterGates/display';
import { GATE_TERMS_VERSION } from '@/lib/dumpsterGates/terms';
import { isZipInDeliveryZone, normalizeZip, SHOP_ADDRESS } from '@/lib/delivery/zone';
import { buildGateDeliveryOption, buildGatePickupOption } from '@/lib/shipping/calculator';
import type { CartItem } from '@/lib/checkout/cartValidation';

/**
 * Stripe Checkout for dumpster-gate-only carts.
 *
 * Fulfillment is chosen on our checkout page before Stripe:
 * - pickup: no shipping address collected. The Stripe Customer's shipping address is set to the
 *   shop, so Stripe Tax uses the shop location (where the customer takes the gate).
 * - local_delivery: delivery address is prefilled from our form; Stripe collects/confirms it and
 *   taxes at that address. The webhook re-checks the final ZIP against the delivery zone.
 */

export type GateFulfillment = 'pickup' | 'local_delivery';

type GateCustomerInput = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  shippingAddress?: { street?: string; city?: string; state?: string; zip?: string };
  siteNotes?: string;
};

type Result =
  | { ok: true; url: string; sessionId: string }
  | { ok: false; status: number; error: string };

function toCents(amountUsd: number): number {
  return Math.max(0, Math.round(amountUsd * 100));
}

function clean(s: unknown, max = 200): string {
  return typeof s === 'string' ? s.trim().slice(0, max) : '';
}

export async function createGateCheckoutSession(opts: {
  stripe: Stripe;
  checkoutId: string;
  items: CartItem[];
  customerInfo: GateCustomerInput | undefined;
  fulfillment: unknown;
  termsAccepted: unknown;
  termsVersion: unknown;
  baseUrl: string;
  clientIp?: string;
}): Promise<Result> {
  const { stripe, checkoutId, items, baseUrl } = opts;

  // Terms of sale for custom gates must be accepted on our checkout page.
  if (opts.termsAccepted !== true || opts.termsVersion !== GATE_TERMS_VERSION) {
    return { ok: false, status: 400, error: 'Please accept the terms of sale for custom gates.' };
  }

  // Anything that needs a quote can't be bought online, even if a stale cart says otherwise.
  for (const item of items) {
    const reasons = getGateQuoteReasons(item.configuration as DumpsterGateConfig);
    if (reasons.length > 0) {
      return { ok: false, status: 400, error: `One of your gates needs a quote: ${reasons[0]}` };
    }
  }

  const fulfillment: GateFulfillment | null =
    opts.fulfillment === 'pickup' || opts.fulfillment === 'local_delivery' ? opts.fulfillment : null;
  if (!fulfillment) {
    return { ok: false, status: 400, error: 'Choose pickup or delivery.' };
  }

  const ci = opts.customerInfo || {};
  const name = clean(ci.name, 120);
  const email = clean(ci.email, 200);
  const phone = clean(ci.phone, 40);
  const company = clean(ci.company, 120);
  const siteNotes = clean(ci.siteNotes, 1000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.replace(/\D/g, '').length < 10) {
    return { ok: false, status: 400, error: 'Name, email and a 10-digit phone number are required.' };
  }

  let deliveryAddress: { street: string; city: string; state: string; zip: string } | null = null;
  if (fulfillment === 'local_delivery') {
    const a = ci.shippingAddress || {};
    const zip = normalizeZip(a.zip);
    deliveryAddress = {
      street: clean(a.street),
      city: clean(a.city, 80),
      state: clean(a.state, 40),
      zip: zip || '',
    };
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !zip) {
      return { ok: false, status: 400, error: 'Enter the full delivery address.' };
    }
    if (!isZipInDeliveryZone(zip)) {
      return {
        ok: false,
        status: 400,
        error: `We don't deliver to ${zip}. Choose pickup, or call us about delivery.`,
      };
    }
  }

  // Line items from server pricing (client prices are ignored).
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
    const cfg = item.configuration as DumpsterGateConfig;
    const breakdown = priceGate(cfg);
    return {
      quantity: cfg.quantity,
      price_data: {
        currency: 'usd',
        tax_behavior: 'exclusive',
        unit_amount: toCents(breakdown.unitPrice),
        product_data: {
          name: 'Custom steel dumpster gate',
          description: getGateSummaryLine(cfg),
          metadata: { productType: 'dumpster-gate', cartItemId: item.id },
        },
      },
    };
  });

  const deliveryOption = buildGateDeliveryOption();
  const pickupOption = buildGatePickupOption();
  const chosenOption = fulfillment === 'pickup' ? pickupOption : deliveryOption;

  // A Stripe Customer lets us control the tax location for pickup (see header comment)
  // and prefill the delivery address on Stripe's page.
  const customer = await stripe.customers.create({
    email,
    name,
    phone,
    ...(company ? { metadata: { checkoutId, fulfillment, company } } : { metadata: { checkoutId, fulfillment } }),
    shipping:
      fulfillment === 'pickup'
        ? {
            name: `${name} (pickup)`,
            phone,
            address: {
              line1: SHOP_ADDRESS.street,
              city: SHOP_ADDRESS.city,
              state: SHOP_ADDRESS.state,
              postal_code: SHOP_ADDRESS.zip,
              country: SHOP_ADDRESS.country,
            },
          }
        : {
            name,
            phone,
            address: {
              line1: deliveryAddress!.street,
              city: deliveryAddress!.city,
              state: deliveryAddress!.state,
              postal_code: deliveryAddress!.zip,
              country: 'US',
            },
          },
  });

  const submitMessage =
    "Your gate is built to the dimensions you entered. We'll email you a drawing to approve before we start fabrication.";

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customer.id,
    customer_update:
      fulfillment === 'local_delivery'
        ? { name: 'auto', address: 'auto', shipping: 'auto' }
        : { name: 'auto', address: 'auto' },
    client_reference_id: checkoutId,
    line_items,
    ...(fulfillment === 'local_delivery'
      ? {
          shipping_address_collection: { allowed_countries: ['US'] },
          shipping_options: [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { currency: 'usd', amount: 0 },
                tax_behavior: 'exclusive',
                display_name: deliveryOption.name,
                metadata: { method: 'local_delivery', provider: 'yeti_delivery' },
              },
            },
          ],
        }
      : {}),
    billing_address_collection: 'required',
    automatic_tax: { enabled: true },
    tax_id_collection: { enabled: true },
    custom_text: {
      submit: { message: submitMessage },
      ...(fulfillment === 'local_delivery'
        ? {
            shipping_address: {
              message: "Free delivery covers about a 3-hour drive from our shop in Springville, UT. We'll call to schedule.",
            },
          }
        : {}),
    },
    payment_intent_data: {
      description: `Dumpster gate order (${fulfillment === 'pickup' ? 'pickup' : 'delivery'})`,
      metadata: { checkoutId, fulfillment },
    },
    success_url: `${baseUrl}/checkout/confirmation?checkoutId=${encodeURIComponent(checkoutId)}`,
    cancel_url: `${baseUrl}/checkout?checkoutId=${encodeURIComponent(checkoutId)}`,
    metadata: { checkoutId, fulfillment, termsVersion: GATE_TERMS_VERSION },
  });

  if (!session.url) {
    return { ok: false, status: 500, error: 'Failed to create Stripe Checkout session' };
  }

  const customerInfo = {
    name,
    email,
    phone,
    company: company || undefined,
    fulfillment,
    shippingAddress: deliveryAddress
      ? { ...deliveryAddress, country: 'United States' }
      : { street: '', city: '', state: '', zip: '', country: '' },
    siteNotes: siteNotes || undefined,
    specialInstructions: siteNotes || undefined,
    termsAcceptance: {
      version: GATE_TERMS_VERSION,
      acceptedAt: new Date().toISOString(),
      ip: opts.clientIp || null,
    },
  };

  const expectedSubtotalCents = line_items.reduce((sum, li) => {
    const unit = (li.price_data?.unit_amount as number) || 0;
    return sum + unit * (li.quantity || 0);
  }, 0);

  const draftData = {
    stripeSessionId: session.id,
    paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
    trackingToken: crypto.randomBytes(32).toString('hex'),
    items: items as any,
    customerInfo: customerInfo as any,
    selectedShippingMethod: fulfillment as any,
    shippingOptions: [chosenOption] as any,
    expectedCurrency: 'usd',
    expectedSubtotalCents,
    expectedShippingCents: 0,
    allowedShippingCents: [0],
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  };

  await prisma.checkoutDraft.upsert({
    where: { checkoutId },
    create: { checkoutId, ...draftData },
    update: draftData,
  });

  return { ok: true, url: session.url, sessionId: session.id };
}
