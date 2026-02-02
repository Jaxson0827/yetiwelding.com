import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { priceEmbed } from '@/lib/steelEmbeds/pricing';
import { priceGate } from '@/lib/dumpsterGates/pricing';
import { calculateShipping, ShippingMethod } from '@/lib/shipping/calculator';
import type { EmbedSpec } from '@/lib/steelEmbeds/types';
import type { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import { kvRateLimitFixedWindow, kvSetJson, kvSetString, KvNotConfiguredError } from '@/lib/storage/kv';
import { KV_KEYS } from '@/lib/storage/keys';
import crypto from 'crypto';

type CartItem = {
  id: string;
  productType: 'steel-plate-embeds' | 'dumpster-gate';
  configuration: EmbedSpec | DumpsterGateConfig;
  price?: number; // ignored (client-controlled)
  isCustomFabrication?: boolean;
};

type CustomerInfo = {
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
  specialInstructions?: string;
};

let stripe: Stripe | null = null;

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    });
  }
  return stripe;
}

function toCents(amountUsd: number): number {
  return Math.max(0, Math.round(amountUsd * 100));
}

function clampInt(n: unknown, min: number, max: number): number {
  const parsed = typeof n === 'number' ? n : Number(n);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const stripeInstance = getStripe();
    if (!stripeInstance) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    // Rate limit (best effort in dev; required in production)
    try {
      const ip = getClientIp(request);
      const ok = await kvRateLimitFixedWindow(`rl:checkout_session:${ip}`, 20, 10 * 60); // 20 requests / 10 minutes
      if (!ok) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
      }
    } catch (e) {
      if (!(e instanceof KvNotConfiguredError)) throw e;
    }

    const body = await request.json();
    const { checkoutId, items, customerInfo, selectedShippingMethod } = body as {
      checkoutId?: string;
      items?: CartItem[];
      customerInfo?: CustomerInfo;
      selectedShippingMethod?: ShippingMethod;
    };

    if (!checkoutId || typeof checkoutId !== 'string' || checkoutId.length < 10) {
      return NextResponse.json({ error: 'checkoutId is required' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
    }

    if (!customerInfo?.email || !customerInfo?.shippingAddress?.zip || !customerInfo?.shippingAddress?.state) {
      return NextResponse.json({ error: 'Customer email and shipping address (state + zip) are required' }, { status: 400 });
    }

    // Normalize quantities server-side (never trust client values)
    const normalizedItems: CartItem[] = items.map((item) => {
      if (!item || (item.productType !== 'steel-plate-embeds' && item.productType !== 'dumpster-gate')) return item;
      if (item.productType === 'steel-plate-embeds') {
        const cfg = { ...(item.configuration as EmbedSpec) };
        cfg.quantity = clampInt(cfg.quantity, 1, 999);
        return { ...item, configuration: cfg };
      }
      const cfg = { ...(item.configuration as DumpsterGateConfig) };
      cfg.quantity = clampInt(cfg.quantity, 1, 999);
      return { ...item, configuration: cfg };
    });

    // Build Stripe line items from server pricing
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = normalizedItems.map((item) => {
      if (item.productType === 'steel-plate-embeds') {
        const cfg = item.configuration as EmbedSpec;
        const breakdown = priceEmbed(cfg);
        const unitAmount = toCents(breakdown.unitPrice);
        return {
          quantity: cfg.quantity,
          price_data: {
            currency: 'usd',
            tax_behavior: 'exclusive',
            unit_amount: unitAmount,
            product_data: {
              name: 'Steel Plate Embed',
              description: `${cfg.plate.length}" × ${cfg.plate.width}" × ${cfg.plate.thickness}" • ${cfg.plate.material}`,
              metadata: {
                productType: 'steel-plate-embeds',
                cartItemId: item.id,
              },
            },
          },
        };
      }

      const cfg = item.configuration as DumpsterGateConfig;
      const breakdown = priceGate(cfg);
      const unitAmount = toCents(breakdown.unitPrice);
      const sizeDisplay = cfg.isCustom ? `${cfg.widthFt}' × ${cfg.heightFt}'` : cfg.size;
      return {
        quantity: cfg.quantity,
        price_data: {
          currency: 'usd',
          tax_behavior: 'exclusive',
          unit_amount: unitAmount,
          product_data: {
            name: 'Dumpster Gate',
            description: `Size: ${sizeDisplay} • Style: ${cfg.style.replace('-', ' ')}`,
            metadata: {
              productType: 'dumpster-gate',
              cartItemId: item.id,
            },
          },
        },
      };
    });

    // Shipping options (server computed)
    const shippingCalc = calculateShipping(
      normalizedItems as any,
      customerInfo.shippingAddress as any,
      selectedShippingMethod
    );

    const shipping_options: Stripe.Checkout.SessionCreateParams.ShippingOption[] = (shippingCalc.options || []).map((opt) => ({
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { currency: 'usd', amount: toCents(opt.cost) },
        display_name: opt.name,
        delivery_estimate: {
          minimum: { unit: 'business_day', value: 3 },
          maximum: { unit: 'business_day', value: 14 },
        },
        metadata: {
          method: opt.method,
        },
      },
    }));

    const baseUrlRaw = process.env.NEXT_PUBLIC_SITE_URL || 'https://yetiwelding.com';
    const baseUrl = (() => {
      const trimmed = baseUrlRaw.trim().replace(/\/+$/, '');
      if (/^https?:\/\//i.test(trimmed)) return trimmed;
      return `https://${trimmed}`;
    })();

    const session = await stripeInstance.checkout.sessions.create({
      mode: 'payment',
      client_reference_id: checkoutId,
      customer_email: customerInfo.email,
      line_items,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options,
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      success_url: `${baseUrl}/checkout/confirmation?checkoutId=${encodeURIComponent(checkoutId)}`,
      cancel_url: `${baseUrl}/checkout?checkoutId=${encodeURIComponent(checkoutId)}`,
      metadata: {
        checkoutId,
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create Stripe Checkout session' }, { status: 500 });
    }

    // Persist draft indices (best-effort in development; required in production).
    // Draft TTL: 48 hours
    const draftTtlSeconds = 48 * 60 * 60;
    const trackingToken = crypto.randomBytes(32).toString('hex');

    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;

    const expectedCurrency = 'usd';
    const expectedSubtotalCents = line_items.reduce((sum, li) => {
      const qty = typeof li.quantity === 'number' ? li.quantity : 0;
      const unit = (li as any)?.price_data?.unit_amount as number | undefined;
      return sum + (Number.isFinite(unit) ? unit! * qty : 0);
    }, 0);

    const allowedShippingCents = (shippingCalc.options || []).map((o) => toCents(o.cost));
    const chosenShipping =
      (shippingCalc.options || []).find((o: any) => o.method === (selectedShippingMethod || shippingCalc.selectedMethod)) ||
      (shippingCalc.options || [])[0] ||
      null;
    const expectedShippingCents = chosenShipping ? toCents(chosenShipping.cost) : 0;

    const draft = {
      checkoutId,
      sessionId: session.id,
      paymentIntentId,
      createdAt: new Date().toISOString(),
      trackingToken,
      items: normalizedItems,
      customerInfo,
      selectedShippingMethod: selectedShippingMethod || null,
      shippingOptions: shippingCalc.options || [],
      expectedCurrency,
      expectedSubtotalCents,
      expectedShippingCents,
      allowedShippingCents,
    };

    try {
      await kvSetString(KV_KEYS.draftByUser(checkoutId), session.id, draftTtlSeconds);
      await kvSetJson(KV_KEYS.draftBySession(session.id), draft, draftTtlSeconds);
      if (paymentIntentId) {
        await kvSetString(KV_KEYS.draftByPi(paymentIntentId), session.id, draftTtlSeconds);
      }
    } catch (e) {
      // In local dev KV may not be configured; for production this should be configured.
      if (!(e instanceof KvNotConfiguredError)) {
        throw e;
      }
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

