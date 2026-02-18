## Yeti Welding — Checkout operations (day-1 SOP)

This is the simple, minimum day-to-day process to run checkout safely.

### 1) Internal order email inbox

- **Internal notifications go to**: `office@yetiwelding.com`
- **Vercel Production env var**: `BUSINESS_EMAIL=office@yetiwelding.com`

If `BUSINESS_EMAIL` is not set, internal notifications will be skipped.

### 2) What to monitor daily

Use **two signals**:

- **Inbox**: `office@yetiwelding.com` receives new order notifications and alerts
- **Admin page**: `/admin/orders` for status + tracking updates

Minimum cadence:

- Check `/admin/orders` **at least 1–2x/day**
- Address any items marked:
  - `needs_review` (totals/shipping mismatch or manual review needed)
  - `pending_payment` (payment still processing or failed)
  - `cancelled` or `refunded` (FYI / customer support follow-up)

### 3) Handling “needs_review”

When an order is `needs_review`:

- Open `/admin/orders`
- Find the jobId from the email subject/body
- Confirm:
  - items and totals look correct
  - shipping selection looks correct
  - customer contact/shipping details look correct
- If everything is fine:
  - update status to `pending` (or `in_review` if you prefer an explicit review stage)
- If anything is unclear:
  - contact the customer using their email/phone in the order

### 4) Handling failed / pending payments

- `paymentStatus=failed`: contact the customer to retry payment; you can send them back to checkout to place a new order.
- `pending_payment`: wait briefly (some payment methods are async). If it stays pending, contact customer.

### 5) Shipping + tracking workflow

When you ship:

1. Open `/admin/orders`
2. Search by `jobId` or customer email
3. Set:
   - `status` → `shipped`
   - `trackingNumber` → paste carrier tracking number

For local pickup:

- Set `status` → `ready`

### 6) Admin access key (security)

- Create a strong secret `ADMIN_API_KEY`
- Add it to Vercel env vars for **Production + Preview**
- Share it only with staff who need admin access

