# Blog newsletter — setup and behavior

This document describes the **blog sidebar newsletter** on Yeti Welding: what it does, how to configure it, and how each piece fits together.

## What it is (and is not)

**It is:**

- A signup form on the **blog listing page** (`/blog`), in the right-hand sidebar below **Featured articles** (see `components/blog/BlogNewsletterSignup.tsx`, embedded from `components/blog/BlogSidebar.tsx`).
- A **notification pipeline**: when someone submits a valid signup, the app sends **one transactional email** to your business inbox via **Resend**, with the subscriber’s address as **Reply-To** so you can respond or add them to a list manually.
- **Protected** by **Cloudflare Turnstile** (same family of protection as the contact form) and a **hidden honeypot** field to reduce simple bot posts.
- **Rate limited** per IP using your **Postgres** database (same mechanism as the contact form).

**It is not:**

- A full marketing-automation platform. It does **not** create contacts in Mailchimp, ConvertKit, Resend Audiences, or similar unless you add that yourself.
- Double opt-in: there is **no** confirmation email sent to the subscriber today; only the **internal** notification to `BUSINESS_EMAIL` (or fallback — see below).
- Google reCAPTCHA — the widget is **Turnstile**, not reCAPTCHA.

If you need a public mailing list with automated campaigns, plan either to **import** addresses from these notifications or **extend** `app/api/newsletter/route.ts` to call another provider’s API.

---

## Where it lives in the codebase

| Piece | Path |
|--------|------|
| Signup UI | `components/blog/BlogNewsletterSignup.tsx` |
| Sidebar (featured + newsletter block) | `components/blog/BlogSidebar.tsx` |
| Blog page that renders the sidebar | `app/blog/page.tsx` |
| API route | `app/api/newsletter/route.ts` |
| Turnstile verification helper | `lib/turnstile.ts` |
| Turnstile site key (client) | `lib/turnstileClient.ts` |
| IP + Postgres rate limit | `lib/rateLimit.ts` |

---

## End-to-end flow

1. A visitor opens **`/blog`** and scrolls to the sidebar newsletter section.
2. They enter an email and complete the **Turnstile** challenge; the browser receives a short-lived **turnstile token**.
3. On **Sign me up**, the client sends `POST /api/newsletter` with JSON: `email`, `turnstileToken`, and `website` (honeypot — should always be empty for real users).
4. The server:
   - **Discards** requests where the honeypot `website` field is non-empty (responds with a benign success so bots are not “trained”).
   - Verifies the token with Cloudflare (uses **`TURNSTILE_SECRET_KEY`** in production; in **`next dev`** only, a [dummy test secret](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) is used if the env var is unset — see `lib/turnstile.ts`).
   - Applies **rate limiting**: **5 requests per 10 minutes** per client IP, keyed as `rl:newsletter` (see `pgFixedWindowRateLimit` in `lib/rateLimit.ts`).
   - Validates **email** format and length (max 254 characters).
   - Sends email through **Resend** to **`BUSINESS_EMAIL`**, or if that is unset, to **`RESEND_FROM_EMAIL`** (see caveats below).
5. The user sees either a **success** message or an **error**; on errors, Turnstile is **reset** so they can try again.

---

## Local development (`next dev`)

Use the same real keys as production: **`NEXT_PUBLIC_TURNSTILE_SITE_KEY`** and **`TURNSTILE_SECRET_KEY`** in `.env.local`. Cloudflare may **verify automatically** (no checkbox) for many visitors — that is normal for Turnstile’s managed challenge.

**Optional — dummy keys (not your production widget):** If you need to run the UI without Cloudflare keys, set **`NEXT_PUBLIC_TURNSTILE_USE_DUMMY=true`** in `.env.local` for **development only**. That uses Cloudflare’s [test site key / secret](https://developers.cloudflare.com/turnstile/troubleshooting/testing/), which **always succeeds** and shows a “testing only” banner. Remove this flag when testing with real keys.

**Production** must use real keys; the dummy is ignored when `NEXT_PUBLIC_TURNSTILE_USE_DUMMY` is not `true`.

---

## Environment variables

Set these in **local** (e.g. `.env.local`) and in **production** (e.g. Vercel project settings). Restart the dev server or redeploy after changes.

### Required for production behavior

| Variable | Role |
|----------|------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | **Public** site key; baked into the client bundle. Powers the Turnstile widget in `BlogNewsletterSignup`. If missing, the form shows a warning and the submit button stays **disabled**. |
| `TURNSTILE_SECRET_KEY` | **Secret**; server-only. Used in `verifyTurnstileToken` inside `app/api/newsletter/route.ts`. If missing, the API returns **500** with a verification error message. |
| `RESEND_API_KEY` | Resend API key. Without it, the API returns **500** (“Email service is not configured”). |
| `BUSINESS_EMAIL` | **Primary inbox** that receives “Blog newsletter signup” messages. **Strongly recommended.** |
| `RESEND_FROM_EMAIL` | Verified **From** address in Resend (e.g. `Yeti Welding <news@yourdomain.com>`). Used as the `from` field when sending the internal notification. |
| `DATABASE_URL` | Postgres connection string for **Prisma**. The newsletter route uses `pgFixedWindowRateLimit`, which reads/writes `rateLimitBucket` rows. If the DB is unreachable, rate limiting (and thus the route) may fail — align with how you run the contact form in the same environment. |

### Fallback behavior worth knowing

- **Recipient (`to`)**: The route sets `to: [businessEmail]` where `businessEmail = process.env.BUSINESS_EMAIL || process.env.RESEND_FROM_EMAIL`. If you **only** set `RESEND_FROM_EMAIL` and not `BUSINESS_EMAIL`, the notification may be sent **to the same address you send from**, which is often wrong. Prefer **`BUSINESS_EMAIL=office@yetiwelding.com`** (or your real intake address).
- **From address**: If `RESEND_FROM_EMAIL` is missing, the code falls back to Resend’s onboarding sender; that is only useful for early testing until your domain is verified in Resend.

---

## Cloudflare Turnstile — setup steps

1. In the **Cloudflare dashboard**, open **Turnstile** and create a widget (or reuse the one used for the contact page).
2. Add your **site’s hostnames** (localhost is supported for Turnstile in development when configured in Cloudflare).
3. Copy the **site key** into `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
4. Copy the **secret key** into `TURNSTILE_SECRET_KEY` (server env only — never commit it or prefix it with `NEXT_PUBLIC_`).
5. Docs: [Cloudflare Turnstile — server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

Using **one Turnstile site** for both contact and blog is fine; you can share the same key pair.

---

## Resend — setup steps

1. Create a **Resend** account and generate an **API key** → `RESEND_API_KEY`.
2. **Verify your domain** and configure a sender such as `news@yetiwelding.com` → `RESEND_FROM_EMAIL`.
3. Set **`BUSINESS_EMAIL`** to the mailbox where staff should read newsletter signup notifications.
4. Send a test signup from `/blog` and confirm:
   - The message **subject** is `Blog newsletter signup`.
   - The **body** includes the subscriber email and note that it came from the blog.
   - **Reply-To** is the subscriber’s address so you can reply directly.

---

## Database and rate limiting

Rate limits are enforced with **Prisma** and **`pgFixedWindowRateLimit`**:

- **Key prefix**: `rl:newsletter`
- **Limit**: **5** successful attempts to pass rate check per IP per **10-minute** window (the counter increments when the limiter allows the request through).

Ensure **migrations** for `RateLimitBucket` have been applied wherever this API runs (e.g. `prisma migrate deploy` in CI/production). The same database powers contact form rate limits under a different key prefix.

---

## Security and abuse controls

| Control | Behavior |
|---------|-----------|
| **Turnstile** | Must pass server verification or the API returns **400**. |
| **Honeypot** | Hidden `website` field; if filled, API returns **200** with a generic success **without** sending email or revealing failure. |
| **Rate limit** | **429** if the IP exceeds **5** allowed newsletter attempts per **10 minutes**. |
| **Email validation** | Simple regex + max length; not a guarantee the inbox exists. |

---

## API reference (for debugging)

- **Method / URL**: `POST /api/newsletter`
- **Content-Type**: `application/json`
- **Body fields**:
  - `email` (string, required for real signups)
  - `turnstileToken` (string, required — token from Turnstile)
  - `website` (string, must be empty for humans — bot trap)

**Successful response** (example): `200` with JSON `{ "success": true, "message": "Thanks — you're on the list. …" }`.

**Error responses** (examples): `400` (Turnstile or validation), `429` (rate limit), `500` (missing env, Resend error, or server error).

---

## Troubleshooting

| Symptom | Things to check |
|---------|------------------|
| Widget missing / “verification is not configured” | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set and app rebuilt/restarted. |
| “Verification failed” or 400 from Turnstile | `TURNSTILE_SECRET_KEY` matches the site key’s widget; domain allowed in Cloudflare; token not expired (user should resubmit after reset). |
| 500 verification / not configured | `TURNSTILE_SECRET_KEY` present in **server** env (not only client). |
| 500 email errors | `RESEND_API_KEY`, verified `RESEND_FROM_EMAIL`, and `BUSINESS_EMAIL` (or sensible fallback). Check Resend dashboard logs. |
| 429 too many requests | Expected after repeated attempts from the same IP; wait for the window to reset or test from another network. |
| Rate limit / DB errors | `DATABASE_URL`, Prisma migrate, DB reachable from the serverless/runtime environment. |

---

## Privacy and compliance (operational checklist)

- You should describe in your **privacy policy** that email addresses from this form are used for **updates/news** (and any other use case you actually follow).
- If you store addresses in a spreadsheet or CRM, secure that data and honor **unsubscribe** requests if you start bulk mailing.
- This implementation does **not** log subscriber emails to a dedicated “newsletter” table; only Resend’s send + your mail server history — adjust if you need audit trails.

---

## Extending the system

Common next steps (each requires code changes):

- **Resend Audiences / Contacts API**: create or update a contact when `POST /api/newsletter` succeeds.
- **Mailchimp / other ESP**: server-side subscribe call with API key stored in env.
- **Double opt-in**: send the user a confirmation link from a second Resend template before marking them confirmed.
- **Store signups in Postgres**: insert into a new `NewsletterSubscription` model in the same route after validation.

---

## Summary

Configure **Turnstile** (public + secret), **Resend** (API key, verified `from`, and a clear **`BUSINESS_EMAIL`** for `to`), and a working **Postgres** + Prisma setup for **rate limiting**. The form on `/blog` will then notify your inbox for each signup; turning that into a managed mailing list is a separate product or code step beyond this baseline.
