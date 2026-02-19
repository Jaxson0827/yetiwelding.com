# Stripe checkout setup (Checkout Sessions + webhook)

This repo uses **Stripe Checkout Sessions** for payment collection, with a **webhook-driven** backend that creates/updates orders in Postgres.

The canonical operational doc is `CHECKOUT.md`. This file focuses on the Stripe-specific pieces.

---

## Required environment variables

Set these in Vercel (and locally in `.env.local` if needed):

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://yetiwelding.com
```

---

## How payment works (high level)

### Client
- The checkout page posts to `POST /api/checkout/session`.
- The server returns a `session.url`.
- The browser redirects to Stripe-hosted Checkout.

### Server
- `POST /api/checkout/session` recomputes item pricing, computes shipping options, and creates a Stripe Checkout Session.
- `POST /api/stripe/webhook` receives Stripe events and creates/updates the `Order` row.

Key routes:
- `app/api/checkout/session/route.ts`
- `app/api/stripe/webhook/route.ts`

---

## Stripe webhook configuration (Dashboard)

Create a webhook endpoint pointing to:
- `https://<your-domain>/api/stripe/webhook`

Enable at least these events (matching `CHECKOUT.md`):
- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`
- `payment_intent.succeeded` (optional; best-effort handler exists)
- `payment_intent.payment_failed`
- `charge.refunded`

Copy the signing secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`.

---

## Testing (Stripe test mode)

Use Stripe test keys and Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3DS: `4000 0025 0000 3155`

---

## Note on deprecated PaymentIntent flow

This repo previously had a PaymentIntent + PaymentElement flow. It is deprecated and not used for checkout.
