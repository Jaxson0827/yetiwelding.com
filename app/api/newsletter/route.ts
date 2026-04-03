import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/db/prisma';
import { getClientIp, pgFixedWindowRateLimit } from '@/lib/rateLimit';
import { verifyTurnstileToken, isTurnstileVerificationConfigured } from '@/lib/turnstile';
import { getNewsletterSiteUrl } from '@/lib/newsletter/siteUrl';
import { newNewsletterToken, normalizeNewsletterEmail } from '@/lib/newsletter/tokens';
import { sendNewsletterWelcomeEmail, sendNewsletterInternalSignupEmail } from '@/lib/newsletter/sendEmails';
import { addNewsletterAudienceContact } from '@/lib/newsletter/resendAudience';

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      turnstileToken?: string;
      website?: string;
    };

    if (body.website && String(body.website).trim().length > 0) {
      return NextResponse.json({ success: true, message: "You're signed up." }, { status: 200 });
    }

    if (!isTurnstileVerificationConfigured()) {
      console.error('Turnstile is not configured (set TURNSTILE_SECRET_KEY in production)');
      return NextResponse.json(
        { error: 'Verification is not configured. Please try again later.' },
        { status: 500 }
      );
    }

    const ip = getClientIp(request);
    const turnstileOk = await verifyTurnstileToken(body.turnstileToken, ip);
    if (!turnstileOk) {
      return NextResponse.json(
        { error: 'Verification failed. Please refresh and try again.' },
        { status: 400 }
      );
    }

    const rateOk = await pgFixedWindowRateLimit({
      keyPrefix: 'rl:newsletter',
      identity: ip,
      limit: 5,
      windowSeconds: 10 * 60,
    });
    if (!rateOk) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const rawEmail = (body.email || '').trim();
    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (rawEmail.length > 254) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const email = normalizeNewsletterEmail(rawEmail);

    if (!process.env.RESEND_FROM_EMAIL) {
      console.error('RESEND_FROM_EMAIL is not set (required for welcome emails)');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const resendInstance = getResend();
    if (!resendInstance) {
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing?.confirmedAt && !existing.unsubscribedAt) {
      return NextResponse.json(
        {
          success: true,
          message: "You're already on the list. We'll be in touch from the shop.",
        },
        { status: 200 }
      );
    }

    const now = new Date();
    const confirmToken = newNewsletterToken();
    let unsubscribeToken: string;

    if (existing) {
      if (existing.unsubscribedAt) {
        unsubscribeToken = newNewsletterToken();
        await prisma.newsletterSubscription.update({
          where: { email },
          data: {
            confirmedAt: now,
            unsubscribedAt: null,
            confirmToken,
            unsubscribeToken,
          },
        });
      } else {
        unsubscribeToken = existing.unsubscribeToken;
        await prisma.newsletterSubscription.update({
          where: { email },
          data: {
            confirmedAt: now,
            confirmToken,
          },
        });
      }
    } else {
      unsubscribeToken = newNewsletterToken();
      await prisma.newsletterSubscription.create({
        data: {
          email,
          source: 'blog',
          confirmToken,
          unsubscribeToken,
          confirmedAt: now,
        },
      });
    }

    const audienceResult = await addNewsletterAudienceContact(resendInstance, email);
    if (!audienceResult.ok) {
      console.error('Resend audience contact error on signup:', audienceResult.error);
    }

    const site = getNewsletterSiteUrl();
    const blogUrl = `${site}/blog`;
    const unsubscribeUrl = `${site}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;

    const welcome = await sendNewsletterWelcomeEmail(resendInstance, {
      to: email,
      blogUrl,
      unsubscribeUrl,
    });
    if (welcome.error) {
      console.error('Newsletter welcome email error:', welcome.error);
      return NextResponse.json({ error: 'Failed to send welcome email. Please try again later.' }, { status: 500 });
    }

    const businessEmail = process.env.BUSINESS_EMAIL || process.env.RESEND_FROM_EMAIL;
    if (businessEmail) {
      const internal = await sendNewsletterInternalSignupEmail(resendInstance, {
        businessEmail,
        subscriberEmail: email,
      });
      if (internal.error) {
        console.error('Internal newsletter signup email error:', internal.error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "You're on the list — check your inbox for a welcome note from the shop.",
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Newsletter route error:', e);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
