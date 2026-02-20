import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { priceEmbed } from '@/lib/steelEmbeds/pricing';
import { priceGate } from '@/lib/dumpsterGates/pricing';
import { pricePergola } from '@/lib/pergolas/pricing';
import { priceGardenBox } from '@/lib/gardenBoxes/pricing';
import type { GardenBoxConfig } from '@/lib/gardenBoxes/types';
import { calculateShippingLive, ShippingMethod } from '@/lib/shipping/calculator';
import { normalizeAndValidateCartItems } from '@/lib/checkout/cartValidation';
import { getDumpsterGateSizeDisplay } from '@/lib/dumpsterGates/validation';
import { prisma } from '@/lib/db/prisma';
import { getClientIp, pgFixedWindowRateLimit } from '@/lib/rateLimit';
import crypto from 'crypto';

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
  freight?: {
    deliveryType?: 'commercial' | 'residential';
    liftgateRequired?: boolean;
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

export async function POST(request: NextRequest) {
  try {
    const stripeInstance = getStripe();
    if (!stripeInstance) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    // Rate limit: 10 session creation attempts per 10 minutes per IP
    const ip = getClientIp(request);
    const rateLimitOk = await pgFixedWindowRateLimit({
      keyPrefix: 'rl:checkout-session',
      identity: ip,
      limit: 10,
      windowSeconds: 10 * 60,
    });
    if (!rateLimitOk) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { checkoutId, items, customerInfo, selectedShippingMethod } = body as {
      checkoutId?: string;
      items?: unknown;
      customerInfo?: CustomerInfo;
      selectedShippingMethod?: ShippingMethod;
    };

    if (!checkoutId || typeof checkoutId !== 'string' || checkoutId.length < 10) {
      return NextResponse.json({ error: 'checkoutId is required' }, { status: 400 });
    }

    const validated = normalizeAndValidateCartItems(items);
    if (!validated.ok) {
      return NextResponse.json({ error: 'Invalid cart items', details: validated.errors }, { status: 400 });
    }

    if (!customerInfo?.email || !customerInfo?.shippingAddress?.zip || !customerInfo?.shippingAddress?.state) {
      return NextResponse.json({ error: 'Customer email and shipping address (state + zip) are required' }, { status: 400 });
    }

    const normalizedItems = validated.normalizedItems;

    // Build Stripe line items from server pricing
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = normalizedItems.map((item) => {
      if (item.productType === 'steel-plate-embeds') {
        const cfg = item.configuration as any;
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

      if (item.productType === 'pergola') {
        const cfg = item.configuration as any;
        const breakdown = pricePergola(cfg, cfg.quantity ?? 1);
        const unitAmount = toCents(breakdown.unitPrice);
        const qty = cfg.quantity ?? 1;
        return {
          quantity: qty,
          price_data: {
            currency: 'usd',
            tax_behavior: 'exclusive',
            unit_amount: unitAmount,
            product_data: {
              name: 'Custom Pergola',
              description: `${cfg.span}×${cfg.depth}×${cfg.height} ft • ${cfg.colorId} • ${cfg.roofDesignId}`,
              metadata: {
                productType: 'pergola',
                cartItemId: item.id,
              },
            },
          },
        };
      }

      if (item.productType === 'garden-box') {
        const cfg = item.configuration as GardenBoxConfig;
        const breakdown = priceGardenBox(cfg, cfg.quantity ?? 1);
        const unitAmount = toCents(breakdown.unitPrice);
        const qty = cfg.quantity ?? 1;
        const sizeLabel = { '4x2': "4'×2'", '6x3': "6'×3'", '8x4': "8'×4'" }[cfg.size] ?? cfg.size;
        return {
          quantity: qty,
          price_data: {
            currency: 'usd',
            tax_behavior: 'exclusive',
            unit_amount: unitAmount,
            product_data: {
              name: 'Steel Garden Box',
              description: `${sizeLabel} × ${cfg.height}" • ${cfg.finish}`,
              metadata: {
                productType: 'garden-box',
                cartItemId: item.id,
              },
            },
          },
        };
      }

      const cfg = item.configuration as any;
      const breakdown = priceGate(cfg);
      const unitAmount = toCents(breakdown.unitPrice);
      const sizeDisplay = getDumpsterGateSizeDisplay(cfg);
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
    const shippingCalc = await calculateShippingLive(
      normalizedItems as any,
      customerInfo.shippingAddress as any,
      selectedShippingMethod,
      customerInfo.freight as any
    );

    const shipping_options: Stripe.Checkout.SessionCreateParams.ShippingOption[] = (shippingCalc.options || []).map(
      (opt) => ({
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { currency: 'usd', amount: toCents(opt.cost) },
          tax_behavior: 'exclusive',
          display_name: opt.name,
          delivery_estimate: {
            minimum: { unit: 'business_day', value: (opt as any).estimatedDaysMin || 3 },
            maximum: { unit: 'business_day', value: (opt as any).estimatedDaysMax || 14 },
          },
          metadata: {
            method: opt.method,
            provider: (opt as any).provider || 'heuristic',
            providerRateId: (opt as any).providerRateId || '',
            carrier: (opt as any).carrier || '',
            service: (opt as any).service || '',
            // Freight tier metadata (persisted to Order via webhook for ops).
            freightZone: (opt as any).freightZone || '',
            freightKind: (opt as any).freightKind || '',
            freightTier: (opt as any).freightTier || '',
            freightBaseUsd: Number.isFinite((opt as any).freightBaseUsd) ? String((opt as any).freightBaseUsd) : '',
            freightAddonsUsd: Number.isFinite((opt as any).freightAddonsUsd) ? String((opt as any).freightAddonsUsd) : '',
            freightDeliveryType: (opt as any).freightDeliveryType || '',
            freightLiftgateRequired:
              typeof (opt as any).freightLiftgateRequired === 'boolean'
                ? String((opt as any).freightLiftgateRequired)
                : '',
          },
        },
      })
    );

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

    // Persist draft in Postgres (required for confirmation polling + webhook reconciliation).
    // Draft TTL: 48 hours
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

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    // Upsert by checkoutId so refresh/retry keeps a single draft per checkoutId.
    await prisma.checkoutDraft.upsert({
      where: { checkoutId },
      create: {
        checkoutId,
        stripeSessionId: session.id,
        paymentIntentId,
        trackingToken,
        items: normalizedItems as any,
        customerInfo: customerInfo as any,
        selectedShippingMethod: (selectedShippingMethod || null) as any,
        shippingOptions: (shippingCalc.options || []) as any,
        expectedCurrency,
        expectedSubtotalCents,
        expectedShippingCents,
        allowedShippingCents,
        expiresAt,
      },
      update: {
        stripeSessionId: session.id,
        paymentIntentId,
        trackingToken,
        items: normalizedItems as any,
        customerInfo: customerInfo as any,
        selectedShippingMethod: (selectedShippingMethod || null) as any,
        shippingOptions: (shippingCalc.options || []) as any,
        expectedCurrency,
        expectedSubtotalCents,
        expectedShippingCents,
        allowedShippingCents,
        expiresAt,
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

export const runtime = 'nodejs';

