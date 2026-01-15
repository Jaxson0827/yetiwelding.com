# Stripe Payment Integration Setup Guide

## Overview
This application uses Stripe for secure payment processing. Follow these steps to configure Stripe payments.

## Prerequisites
1. A Stripe account (sign up at https://stripe.com)
2. Access to your Stripe Dashboard

## Setup Steps

### 1. Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_`)
4. Copy your **Secret key** (starts with `sk_`)

**Important:** 
- Use **Test keys** for development/testing
- Use **Live keys** for production

### 2. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_... for production)
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
STRIPE_WEBHOOK_SECRET=whsec_... (for webhook verification)
```

### 3. Set Up Webhook (Production)

For production, you need to set up a webhook endpoint:

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **Signing secret** (starts with `whsec_`) and add it to your `.env.local`

### 4. Test the Integration

#### Test Cards (Test Mode Only)
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any ZIP code.

## Features

### Payment Flow
1. Customer fills out checkout form
2. Payment form appears with Stripe Elements
3. Customer enters payment information
4. Payment is processed securely
5. Order is confirmed after successful payment

### Payment Methods
- **Online Payment:** Secure payment via Stripe (credit/debit cards)
- **Request Quote:** For custom fabrication items (no payment required)

### Security
- All payment data is handled by Stripe (PCI compliant)
- No sensitive card data touches your server
- Payment verification before order processing
- Webhook support for payment status updates

## API Routes

### `/api/stripe/create-payment-intent`
Creates a Stripe PaymentIntent for the order amount.

**Request:**
```json
{
  "amount": 1500.00,
  "currency": "usd",
  "metadata": {}
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### `/api/stripe/webhook`
Handles Stripe webhook events for payment status updates.

## Troubleshooting

### Payment Form Not Loading
- Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- Verify the key starts with `pk_test_` or `pk_live_`
- Check browser console for errors

### Payment Fails
- Verify `STRIPE_SECRET_KEY` is set correctly
- Check Stripe Dashboard for error logs
- Ensure you're using test keys in development

### Webhook Not Working
- Verify webhook URL is accessible
- Check `STRIPE_WEBHOOK_SECRET` matches your webhook endpoint
- Test webhook in Stripe Dashboard → Webhooks → Send test webhook

## Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)





