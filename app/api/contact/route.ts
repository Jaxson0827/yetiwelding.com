import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/db/prisma';
let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

async function pgFixedWindowRateLimit(opts: {
  keyPrefix: string;
  identity: string;
  limit: number;
  windowSeconds: number;
}): Promise<boolean> {
  const now = Date.now();
  const windowMs = opts.windowSeconds * 1000;
  const windowStartMs = Math.floor(now / windowMs) * windowMs;
  const bucketKey = `${opts.keyPrefix}:${opts.identity}:${Math.floor(windowStartMs / 1000)}`;
  const expiresAt = new Date(windowStartMs + windowMs);

  // Opportunistic cleanup; safe to ignore failures.
  try {
    await prisma.rateLimitBucket.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  } catch {
    // ignore
  }

  const bucket = await prisma.rateLimitBucket.upsert({
    where: { key: bucketKey },
    create: {
      key: bucketKey,
      count: 1,
      expiresAt,
    },
    update: {
      count: { increment: 1 },
      expiresAt,
    },
  });

  return bucket.count <= opts.limit;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit (Postgres-backed fixed window): 5 requests / 10 minutes.
    const ip = getClientIp(request);
    const ok = await pgFixedWindowRateLimit({
      keyPrefix: 'rl:contact',
      identity: ip,
      limit: 5,
      windowSeconds: 10 * 60,
    });
    if (!ok) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const formData = await request.formData();

    // Extract form fields
    const honeypot = (formData.get('companyWebsite') as string) || '';
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const preferredContact = formData.get('preferredContact') as string;
    const file = formData.get('file') as File | null;
    const quoteDraftRaw = formData.get('quoteDraft') as string | null;

    // Honeypot triggered: pretend success to avoid tipping off bots
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json(
        { success: true, message: "Your message has been received. We'll get back to you within 24 hours." },
        { status: 200 }
      );
    }

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (name.length > 100 || email.length > 254 || message.length > 2000) {
      return NextResponse.json({ error: 'Invalid form input' }, { status: 400 });
    }

    // Very basic email format check (server-side)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Validate Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const preferredContactLabels: Record<string, string> = {
      phone: 'Phone',
      email: 'Email',
      text: 'Text Message',
    };

    // Prepare attachments if file is present
    let attachments: { filename: string; content: Buffer }[] | undefined;
    if (file) {
      const maxBytes = 10 * 1024 * 1024;
      if (file.size > maxBytes) {
        return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
      }
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120);
      attachments = [
        {
          filename: safeName,
          content: Buffer.from(await file.arrayBuffer()),
        },
      ];
    }

    const quoteDraftSection =
      quoteDraftRaw && quoteDraftRaw.length > 0 && quoteDraftRaw.length < 50000
        ? `\n\n--- Quote Request (raw JSON) ---\n${quoteDraftRaw}`
        : '';

    const safe = {
      name: escapeHtml(name.trim()),
      email: escapeHtml(email.trim()),
      phone: phone ? escapeHtml(phone.trim()) : '',
      preferredContact: escapeHtml(preferredContact || ''),
      messageHtml: escapeHtml(message).replace(/\n/g, '<br>'),
      messageText: message.trim() + quoteDraftSection,
      fileName: file ? escapeHtml(file.name) : '',
    };

    // Send email to business email
    const businessEmail = process.env.BUSINESS_EMAIL || process.env.RESEND_FROM_EMAIL;
    
    if (!businessEmail) {
      console.error('BUSINESS_EMAIL is not set in environment variables');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const resendInstance = getResend();
    if (!resendInstance) {
      console.error('RESEND_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const isQuoteRequest = Boolean(quoteDraftRaw && quoteDraftRaw.length > 0);
    const subject = isQuoteRequest ? `Quote Request: ${name}` : `New Contact Form: ${name}`;

    const { data, error } = await resendInstance.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Yeti Welding Contact <onboarding@resend.dev>',
      to: [businessEmail],
      replyTo: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #DC143C; color: white; padding: 20px; text-align: center; }
              .content { background-color: #f9f9f9; padding: 20px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #DC143C; }
              .value { margin-top: 5px; }
              .message-box { background-color: white; padding: 15px; border-left: 4px solid #DC143C; margin-top: 10px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Contact Form Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${safe.name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${safe.email}">${safe.email}</a></div>
                </div>
                ${phone ? `
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value"><a href="tel:${safe.phone}">${safe.phone}</a></div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">Preferred Contact Method:</div>
                  <div class="value">${escapeHtml(preferredContactLabels[preferredContact] || preferredContact)}</div>
                </div>
                ${file ? `
                <div class="field">
                  <div class="label">Attachment:</div>
                  <div class="value">${safe.fileName} (${(file.size / 1024).toFixed(2)} KB)</div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="message-box">${safe.messageHtml}</div>
                </div>
              </div>
              <div class="footer">
                <p>This email was sent from the Yeti Welding contact form.</p>
                <p>You can reply directly to this email to respond to ${safe.name}.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission from Yeti Welding Website

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Preferred Contact: ${preferredContactLabels[preferredContact] || preferredContact}
${file ? `Attachment: ${file.name} (${(file.size / 1024).toFixed(2)} KB)` : ''}

Message:
${safe.messageText}
      `.trim(),
      attachments,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        {
          error: 'Failed to send email. Please try again later.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received. We\'ll get back to you within 24 hours.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while processing your request. Please try again later.',
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';







