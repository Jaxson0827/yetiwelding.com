import { NextRequest, NextResponse } from 'next/server';

/**
 * @deprecated PaymentIntent flow is deprecated. Use Stripe Checkout Sessions instead.
 * The checkout flow now uses POST /api/checkout/session to create a Checkout Session
 * and redirects to Stripe-hosted checkout. See CHECKOUT.md and STRIPE_SETUP.md.
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Deprecated. Use Stripe Checkout Sessions instead.' },
    { status: 410 }
  );
}





