# Checkout (Living Document)

This file is the canonical, **up-to-date** description of how checkout works in this repo today, what is standard vs unusual, what’s required to make it operational, and what gaps/risks exist. Update this file as checkout evolves.

---

## Quick summary

There are **two distinct checkout flows**:

1. **Stripe “Pay Online” flow (real payment)**  
   - Creates a **Stripe Checkout Session** server-side.
   - The **Stripe webhook** is the source of truth for payment and is responsible for creating the order record.
   - The confirmation page polls an internal endpoint until the order exists.

2. **“Request Quote” / manual flow (no payment)**  
   - Creates an order record immediately (paymentStatus = `quote_requested`).
   - Sends confirmation + internal notification emails.

This split is reasonable for fabrication/custom work where some orders are pay-now and some require quoting.

---

## Files and primary entry points

### Client pages/components

- **Checkout page**: `app/checkout/page.tsx`
  - Collects customer info (`components/checkout/CheckoutForm.tsx`)
  - Calculates shipping via `POST /api/shipping/calculate`
  - Starts Stripe Checkout via `POST /api/checkout/session`
  - For quote flow, submits `POST /api/checkout`
  - Generates/persists a `checkoutId` in sessionStorage (`yeti-checkout-id`) and also accepts `?checkoutId=` in URL.

- **Confirmation page**: `app/checkout/confirmation/page.tsx`
  - Two paths:
    - **Legacy**: if `jobId` exists in query params, shows it directly.
    - **Stripe Checkout path**: if `checkoutId` exists, it **polls** `GET /api/orders/by-checkout?checkoutId=...` until the order is created by the webhook.

- **Order tracking UI**: `app/order/track/[jobId]/page.tsx`
  - Fetches `GET /api/orders/[jobId]` (optionally with `?token=...`) and displays order data/status.

### API routes (server)

- **Quote/manual checkout**: `app/api/checkout/route.ts` (`POST /api/checkout`)
  - Recomputes pricing server-side (ignores client pricing).
  - Computes shipping (best effort; can be 0 if zip is missing).
  - Writes order + order items to Postgres (via Prisma).
  - Sends customer + internal emails (best effort).

- **Stripe session creation**: `app/api/checkout/session/route.ts` (`POST /api/checkout/session`)
  - Recomputes pricing server-side.
  - Computes shipping options server-side and passes them to Stripe.
  - Creates a Stripe Checkout Session and returns `session.url`.
  - Stores a **draft** record in Postgres keyed by `checkoutId`, `stripeSessionId`, and optionally `paymentIntentId`.

- **Stripe webhook**: `app/api/stripe/webhook/route.ts` (`POST /api/stripe/webhook`)
  - Verifies signature using `STRIPE_WEBHOOK_SECRET`.
  - Uses a Postgres `StripeWebhookEvent` table for idempotency (eventId unique).
  - Retrieves the Postgres draft and creates/updates an order record in Postgres.
  - Sends emails when paid and not flagged for review.

- **Order lookup by checkoutId**: `app/api/orders/by-checkout/route.ts`
  - Used by confirmation page polling to find order after Stripe redirect.

- **Order API (tracking)**: `app/api/orders/[jobId]/route.ts`
  - Returns limited information unless the caller provides a matching `token`.

- **Shipping calculation**: `app/api/shipping/calculate/route.ts` and `lib/shipping/calculator.ts`
  - Returns shipping options based on estimated weight/zone rules (not a carrier integration).

- **Tax calculation**: `app/api/tax/calculate/route.ts` and `lib/tax/calculator.ts`
  - Exists, but Stripe flow uses `automatic_tax` in Checkout Sessions.

### Deprecated / confusing remnants

- **PaymentIntent route is deprecated**: `app/api/stripe/create-payment-intent/route.ts` returns HTTP 410.
- **PaymentElement client component exists**: `components/checkout/PaymentForm.tsx` calls the deprecated endpoint and will not work as-is.
- `STRIPE_SETUP.md` currently documents a PaymentIntent flow that is no longer active; it should be updated to reflect the Checkout Session + webhook flow.

---

## Data model and storage

### Postgres is the source of truth (current state)

Checkout now uses **Postgres** via **Prisma**:
- Prisma schema: `prisma/schema.prisma`
- Prisma client helper: `lib/db/prisma.ts`

High-level tables/models:

- **`CheckoutDraft`**
  - One row per `checkoutId`
  - Stores `stripeSessionId`, optional `paymentIntentId`, `trackingToken`
  - Stores item + customer snapshots and expected totals for mismatch detection
  - Has `expiresAt` (48 hours)

- **`Order`** (+ **`OrderItem`**)
  - One row per order (with unique `jobId`)
  - Optional unique Stripe identifiers (`stripeSessionId`, `paymentIntentId`)
  - Stores money as **cents** (`subtotalCents`, `shippingCents`, `taxCents`, `totalCents`)
  - Stores `customerInfo` snapshot (JSON) + `customerEmail`

- **`StripeWebhookEvent`**
  - One row per Stripe event id (`eventId` unique)
  - `processedAt` is only set after successful processing

### Quote/manual order record shape (high-level)

`/api/checkout` writes an order record including:
- `paymentStatus: "quote_requested"`
- `status: "pending"`
- `trackingToken` (used to authorize access to sensitive fields in `/api/orders/[jobId]`)

### Stripe order record shape (high-level)

Webhook creates an order record including:
- `paymentStatus: "paid"` or `"pending"`
- `status` can be:
  - `"pending_payment"` (if not paid yet)
  - `"pending"` (if paid)
  - `"needs_review"` (if totals mismatch validation triggered)

---

## End-to-end flows

### A) Stripe “Pay Online” flow (Checkout Session)

1. User visits `/checkout` (`app/checkout/page.tsx`), fills `CheckoutForm`.
2. Client calculates shipping options using `POST /api/shipping/calculate` (debounced).
3. Client starts Stripe by calling `POST /api/checkout/session` with:
   - `checkoutId`
   - cart `items`
   - `customerInfo`
   - `selectedShippingMethod`
4. Server:
   - clamps/normalizes quantities server-side
   - recomputes line_items from server pricing (`priceEmbed`, `priceGate`)
   - computes shipping_options (`calculateShipping`)
   - creates Stripe Checkout Session (mode=payment, `automatic_tax: { enabled: true }`)
   - stores a Postgres draft with expected totals (subtotal/shipping cents) to validate webhook totals later
5. Client redirects to Stripe-hosted Checkout page.
6. Stripe redirects back to `/checkout/confirmation?checkoutId=...`.
7. Confirmation page polls `GET /api/orders/by-checkout?checkoutId=...` until the webhook creates the order.
8. Stripe sends webhooks to `/api/stripe/webhook`, which:
   - verifies signature
   - loads draft by sessionId
   - validates amounts (currency/subtotal/shipping) vs draft expectations
   - writes the order to Postgres
   - sends emails if paid and not flagged

### B) Quote/manual flow (no payment)

1. User chooses quote mode and submits customer info.
2. Client calls `POST /api/checkout`.
3. Server:
   - recomputes totals server-side
   - writes order record to Postgres
   - sends customer + internal emails (best effort)
4. Client clears cart and redirects to `/checkout/confirmation?jobId=...&token=...`.

---

## What is industry-standard here?

### Standard / good practices present

- **Stripe Checkout Sessions + webhook fulfillment** is a standard pattern.
- **Server-side repricing** (never trust client price) is correct.
- **Webhook signature verification** is required and present.
- **Idempotency/concurrency guard** in the webhook is directionally correct.
- **Tracking token** used to gate access to sensitive order fields is a reasonable lightweight approach for a public tracking page.

### Unusual / needs cleanup

- The presence of a deprecated PaymentIntent-based flow (client component + docs) alongside the Checkout Session flow is confusing.
- KV as the only order store can work, but most production commerce systems use a database for:
  - queries/reporting
  - admin workflows
  - durability, migrations, backups
  - complex state transitions and audit trails

---

## Critical holes / risks

### 1) Webhook reliability can lose paid orders (CRITICAL)

Webhook processing must be reliable and retryable. The current implementation stores webhook events in Postgres (`StripeWebhookEvent`) and returns **non-2xx** on failures so Stripe retries.

Why this matters:
- If draft lookup fails (KV delay/misconfig/TTL issue) or order creation fails transiently, but the webhook returns 2xx and/or marks the event as processed, Stripe may not retry and you can permanently lose the order record.

**Operational expectation (industry standard):**
- Only return 2xx when the event was handled successfully.
- Do not mark `event:${eventId}` processed unless the business action completed.
- Return non-2xx on transient failures to trigger Stripe retries.

### 2) “Final” shipping/customer info may not match what’s stored

In the Stripe flow, you store `customerInfo` from the pre-checkout form in the KV draft, but Stripe Checkout can collect/alter shipping details. The webhook currently persists draft customer/shipping info rather than reconciling with Stripe’s final session details. This can lead to fulfillment to an incorrect address.

### 3) Quote/manual endpoint allows incomplete addresses (can create bad orders)

`POST /api/checkout` does not strongly validate shipping fields. If `customerInfo.shippingAddress.zip` is missing, shipping becomes 0 and the order still gets created.

### 4) Custom fabrication “default to quote” logic is inconsistent

In `app/checkout/page.tsx`, the code only submits the quote/manual flow if `paymentMethod === "quote"`. Custom fabrication items can still go through Stripe if the user leaves payment method on online.

### 5) Cart is not cleared after Stripe checkout

The cart is cleared in the quote/manual flow, but the Stripe Checkout flow redirects away and returns; the cart remains in localStorage unless cleared on confirmation. This is UX confusing and increases accidental re-order risk.

### 6) Order status mismatch can break the tracking UI

Statuses like `pending_payment` and `needs_review` are emitted by the backend and must be supported by the UI.

### 7) Rate limiting is not implemented (Postgres-only mode)

KV-based rate limiting was removed as part of the Postgres-only migration. If you need rate limiting again, implement a Postgres-backed approach or use a dedicated rate limiting service.

---

## What’s needed to make checkout operational (today)

### Environment variables

Stripe:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Database (Postgres):
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED` (optional; useful for migrations or tools)

Email (Resend):
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `BUSINESS_EMAIL` (optional but recommended for internal notifications)

Site URL (links in emails + Stripe redirect URLs):
- `NEXT_PUBLIC_SITE_URL` (should be fully qualified, e.g. `https://yetiwelding.com`)

### Stripe Dashboard configuration

- Create a webhook endpoint pointing to:
  - `https://<your-domain>/api/stripe/webhook`
- Ensure it sends at least the event types you handle in code:
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `payment_intent.succeeded` (optional; currently partially handled)

### Prisma / Postgres setup (developer steps)

After creating Postgres on Vercel/Neon and setting `DATABASE_URL`:

- Generate Prisma client after schema changes:
  - `npx prisma generate`
- Create/apply migrations locally (recommended):
  - `npx prisma migrate dev --name init`
- Apply migrations in production (Vercel build/deploy step):
  - `npx prisma migrate deploy`

### Minimum code changes for production-grade reliability

- Webhook must:
  - **not** mark events processed unless order create/update succeeded
  - **not** return 2xx when it failed to handle the event (so Stripe retries)
  - treat “draft missing” as retryable unless you have an alternative source of truth

- Webhook order creation should use Stripe’s final session details for shipping/customer info (or reconcile).

- Quote/manual endpoint should validate required fields (shipping zip/state at minimum) or explicitly treat it as “quote request without shipping computed”.

- Update/remove deprecated PaymentIntent artifacts:
  - `components/checkout/PaymentForm.tsx` (or rework to be functional)
  - `STRIPE_SETUP.md` sections describing PaymentIntent flow

- Normalize/expand order status enums:
  - UI should render `needs_review` and `pending_payment` states
  - or server should map them to known UI states

---

## Non-goals / “not implemented yet” (current repo state)

- No admin UI for order management.
- Shipping calculator is heuristic (no carrier quotes, no address validation).
- Tax is handled by Stripe automatic tax for Stripe flow; local tax calculator exists but is not fully integrated into the display/quote flow.
- Some legacy steel-embeds endpoints exist but are disabled (410) and should not be relied on for operational checkout.

---

## Living checklist (update as items are completed)

### Reliability & correctness

- [x] Webhook only acknowledges success when work succeeded (and retries on failures)
- [x] Event “processed” marker is only set after successful order creation/update
- [ ] Draft-not-found cases are handled safely (retry, backoff, or Stripe session lookup fallback)
- [x] Persist Stripe final shipping/customer details (merge Stripe session details into stored customerInfo)
- [x] Align order status enum across API + UI

### UX

- [ ] Clear cart after successful Stripe checkout (on confirmation)
- [ ] Show clear messaging when order is `needs_review` or `pending_payment`

### Cleanup

- [ ] Remove or fix deprecated PaymentIntent flow + update `STRIPE_SETUP.md`
- [ ] Decide whether `/api/checkout` is “quote request” only vs “manual order”; validate inputs accordingly

---

## Notes

- Stripe API version is pinned in code via `new Stripe(..., { apiVersion: '2025-12-15.clover' })` in:
  - `app/api/checkout/session/route.ts`
  - `app/api/stripe/webhook/route.ts`

Keep this document updated when changing Stripe modes, event handling, order record schema, storage, or the checkout UI.

