import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getClientIp, pgFixedWindowRateLimit } from '@/lib/rateLimit';
import { verifyTurnstileToken, isTurnstileVerificationConfigured } from '@/lib/turnstile';

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

    const email = (body.email || '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (email.length > 254) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const businessEmail = process.env.BUSINESS_EMAIL || process.env.RESEND_FROM_EMAIL;
    if (!businessEmail) {
      console.error('BUSINESS_EMAIL is not set');
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

    const safe = escapeHtml(email);
    const { error } = await resendInstance.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Yeti Welding <onboarding@resend.dev>',
      to: [businessEmail],
      replyTo: email,
      subject: 'Blog newsletter signup',
      html: `
        <!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.6">
        <p><strong>Blog newsletter request</strong></p>
        <p>Email: <a href="mailto:${safe}">${safe}</a></p>
        <p style="color:#666;font-size:12px">Submitted from yetiwelding.com/blog</p>
        </body></html>`,
      text: `Blog newsletter signup\n\nEmail: ${email}\n`,
    });

    if (error) {
      console.error('Resend newsletter error:', error);
      return NextResponse.json({ error: 'Failed to subscribe. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thanks — you're on the list. We'll be in touch from the shop.",
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Newsletter route error:', e);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
