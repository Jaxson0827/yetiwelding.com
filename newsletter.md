# Blog newsletter — setup and behavior

This document describes the **blog sidebar newsletter** on Yeti Welding: single opt-in, Resend Audiences, Postgres storage, welcome email, and how each piece fits together.

## What it is (and is not)

**It is:**

- A signup form on the **blog listing page** (`/blog`), in the right-hand sidebar below **Featured articles** (see `components/blog/BlogNewsletterSignup.tsx`, embedded from `components/blog/BlogSidebar.tsx`).
- **Single opt-in**: after Turnstile and validation, the subscriber is saved as **confirmed** immediately, added to your **Resend Audience** (when `RESEND_NEWSLETTER_AUDIENCE_ID` is set), receives a **welcome email** from `RESEND_FROM_EMAIL`, and the shop gets an **internal “new subscriber”** email.
- **Postgres-backed** rows in `NewsletterSubscription` (tokens, `confirmedAt`, `unsubscribedAt`) for auditability and unsubscribe.
- **One-click unsubscribe** via `GET /api/newsletter/unsubscribe?token=…`, which sets `unsubscribedAt` and marks the contact **unsubscribed** in Resend when they had been subscribed.
- **Protected** by **Cloudflare Turnstile** and a **hidden honeypot** field.
- **Rate limited** per IP using Postgres (`rl:newsletter`).

**It is not:**

- Double opt-in — no confirmation click is required for new signups (a **legacy** `GET /api/newsletter/confirm` route remains for old confirmation links only).
- Google reCAPTCHA — the widget is **Turnstile**.

---

## Where it lives in the codebase

| Piece | Path |
|--------|------|
| Signup UI | `components/blog/BlogNewsletterSignup.tsx` |
| Blog flash messages (legacy confirm / unsub / errors) | `app/blog/BlogPageClient.tsx` (`?newsletter=` query) |
| Sidebar | `components/blog/BlogSidebar.tsx` |
| Blog page shell | `app/blog/page.tsx` |
| Signup API | `app/api/newsletter/route.ts` |
| Legacy confirm link handler | `app/api/newsletter/confirm/route.ts` |
| Unsubscribe handler | `app/api/newsletter/unsubscribe/route.ts` |
| Resend audience helpers | `lib/newsletter/resendAudience.ts` |
| Transactional copy / sends | `lib/newsletter/sendEmails.ts` |
| Prisma model | `NewsletterSubscription` in `prisma/schema.prisma` |
| Turnstile | `lib/turnstile.ts` |
| Rate limit | `lib/rateLimit.ts` |

---

## End-to-end flow

1. Visitor submits email on `/blog` with Turnstile.
2. `POST /api/newsletter` validates, rate-limits, upserts `NewsletterSubscription` with **`confirmedAt` set immediately**, syncs to the Resend audience (if configured), sends the **welcome email** to the subscriber, and emails **`BUSINESS_EMAIL`** (internal new subscriber).
3. **Legacy:** `GET /api/newsletter/confirm?token=…` still completes any old **pending** rows (from before single opt-in), then syncs audience + optional internal email, and redirects to `/blog?newsletter=confirmed`.
4. **Unsubscribe** → `GET /api/newsletter/unsubscribe?token=…` → sets `unsubscribedAt`; if they were confirmed, **`contacts.update`** with `unsubscribed: true`. Redirects to `/blog?newsletter=unsubscribed`.

If **`RESEND_NEWSLETTER_AUDIENCE_ID`** is unset, contact creation is **skipped** (warning in logs); the welcome email and DB row still succeed.

---

## Environment variables

Set in **local** (e.g. `.env.local`) and **production**. Restart dev server or redeploy after changes.

| Variable | Role |
|----------|------|
| `NEXT_PUBLIC_SITE_URL` | **Public** site origin for links in emails (no trailing slash). Example: `https://yetiwelding.com`. Fallback in code is the same default. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key for the sidebar widget. |
| `TURNSTILE_SECRET_KEY` | Server-side Turnstile verification. |
| `RESEND_API_KEY` | Resend API key. |
| `RESEND_FROM_EMAIL` | Verified **From** for **welcome** emails to subscribers (required for signup to succeed). |
| `BUSINESS_EMAIL` | Inbox for **“new subscriber”** internal notifications. If unset, falls back to `RESEND_FROM_EMAIL`. |
| `RESEND_NEWSLETTER_AUDIENCE_ID` | Resend **Audience ID** for blog subscribers. If unset, audience sync is skipped. |
| `DATABASE_URL` | Postgres for Prisma (subscriptions + rate limits). |

---

## Resend dashboard checklist

1. **Domain** verified; `RESEND_FROM_EMAIL` uses that domain.
2. Create an **Audience** (e.g. “Blog newsletter”) → copy **Audience ID** → `RESEND_NEWSLETTER_AUDIENCE_ID`.
3. API key with permission to send email and manage contacts/audiences.

---

## Database and migrations

Apply migrations wherever the app runs (e.g. `npx prisma migrate deploy` in production). The migration that adds `NewsletterSubscription` lives under `prisma/migrations/`.

---

## Security and abuse

| Control | Behavior |
|---------|-----------|
| Turnstile | Required on `POST /api/newsletter` or **400** / **500** if misconfigured. |
| Honeypot `website` | Non-empty → **200** fake success, no DB/email. |
| Rate limit | **429** — 5 attempts per IP per 10 minutes (`rl:newsletter`). |
| Confirm / unsubscribe tokens | Opaque random strings; **GET** endpoints only redirect (no JSON secrets). |

---

## API reference

### `POST /api/newsletter`

JSON body: `email`, `turnstileToken`, `website` (empty for humans).

- **200** `success`: welcome email sent (or already subscribed and not unsubscribed).
- **400** / **429** / **500** as documented above.

### `GET /api/newsletter/confirm?token=…` (legacy)

Redirects to `/blog?newsletter=confirmed|invalid|unsubscribed|error`.

### `GET /api/newsletter/unsubscribe?token=…`

Redirects to `/blog?newsletter=unsubscribed|invalid|error`.

---

## Privacy and compliance

- Describe in your **privacy policy** that you store email in Postgres, sync to Resend for mailings, send a welcome message, and honor unsubscribe.
- The **welcome email** includes an unsubscribe link. For **broadcasts** from Resend, add unsubscribe per your ESP workflow.

---

## Summary

Configure Turnstile, **verified** `RESEND_FROM_EMAIL`, **`RESEND_NEWSLETTER_AUDIENCE_ID`**, `BUSINESS_EMAIL`, Postgres + migrations, and `NEXT_PUBLIC_SITE_URL` for correct links in the welcome email. New subscribers are **confirmed immediately**, synced to Resend when configured, and receive a **welcome email** from the shop.
