import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/db/prisma';
import { isAdminRequest } from '@/lib/admin/auth';
import { getNewsletterSiteUrl } from '@/lib/newsletter/siteUrl';
import { buildBroadcastEmailHtml, buildBroadcastEmailText } from '@/lib/newsletter/sendEmails';

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

/** GET /api/admin/newsletter — returns active subscriber count. */
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const count = await prisma.newsletterSubscription.count({
      where: { confirmedAt: { not: null }, unsubscribedAt: null },
    });
    return NextResponse.json({ count });
  } catch (e) {
    console.error('Newsletter admin GET error:', e);
    return NextResponse.json({ error: 'Failed to fetch subscriber count.' }, { status: 500 });
  }
}

/** POST /api/admin/newsletter — creates and immediately sends a Resend broadcast. */
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const audienceId = process.env.RESEND_NEWSLETTER_AUDIENCE_ID?.trim();
  if (!audienceId) {
    return NextResponse.json(
      { error: 'RESEND_NEWSLETTER_AUDIENCE_ID is not configured.' },
      { status: 500 }
    );
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    return NextResponse.json({ error: 'RESEND_FROM_EMAIL is not configured.' }, { status: 500 });
  }

  const resendInstance = getResend();
  if (!resendInstance) {
    return NextResponse.json({ error: 'RESEND_API_KEY is not configured.' }, { status: 500 });
  }

  let subject: string;
  let body: string;
  try {
    const raw = (await request.json()) as { subject?: string; body?: string };
    subject = (raw.subject || '').trim();
    body = (raw.body || '').trim();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!subject) return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
  if (!body) return NextResponse.json({ error: 'Body is required.' }, { status: 400 });

  const site = getNewsletterSiteUrl();
  const blogUrl = `${site}/blog`;
  const broadcastName = `${subject} — ${new Date().toISOString()}`;

  const html = buildBroadcastEmailHtml({ subject, body, blogUrl });
  const text = buildBroadcastEmailText({ body, blogUrl });

  const { data: created, error: createError } = await resendInstance.broadcasts.create({
    name: broadcastName,
    audienceId,
    from: fromEmail,
    subject,
    html,
    text,
  });

  if (createError || !created?.id) {
    console.error('Resend broadcast create error:', createError);
    return NextResponse.json(
      { error: 'Failed to create broadcast. Check Resend configuration.' },
      { status: 500 }
    );
  }

  const { error: sendError } = await resendInstance.broadcasts.send(created.id);

  if (sendError) {
    console.error('Resend broadcast send error:', sendError);
    return NextResponse.json(
      { error: 'Broadcast was created but failed to send. Check Resend dashboard.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, broadcastId: created.id });
}

export const runtime = 'nodejs';
