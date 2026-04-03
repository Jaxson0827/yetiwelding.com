import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/db/prisma';
import { addNewsletterAudienceContact } from '@/lib/newsletter/resendAudience';
import { sendNewsletterInternalConfirmedEmail } from '@/lib/newsletter/sendEmails';
import { getNewsletterSiteUrl } from '@/lib/newsletter/siteUrl';

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

function redirectBlog(query: string) {
  const site = getNewsletterSiteUrl();
  return NextResponse.redirect(`${site}/blog${query}`, 302);
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')?.trim();
  if (!token) {
    return redirectBlog('?newsletter=invalid');
  }

  try {
    const sub = await prisma.newsletterSubscription.findUnique({
      where: { confirmToken: token },
    });

    if (!sub) {
      return redirectBlog('?newsletter=invalid');
    }

    if (sub.unsubscribedAt) {
      return redirectBlog('?newsletter=unsubscribed');
    }

    if (sub.confirmedAt) {
      return redirectBlog('?newsletter=confirmed');
    }

    const resendInstance = getResend();
    if (!resendInstance) {
      console.error('RESEND_API_KEY missing during newsletter confirm');
      return redirectBlog('?newsletter=error');
    }

    const now = new Date();
    await prisma.newsletterSubscription.update({
      where: { id: sub.id },
      data: { confirmedAt: now },
    });

    const audienceResult = await addNewsletterAudienceContact(resendInstance, sub.email);
    if (!audienceResult.ok) {
      console.error('Resend audience contact error after confirm:', audienceResult.error);
      await prisma.newsletterSubscription.update({
        where: { id: sub.id },
        data: { confirmedAt: null },
      });
      return redirectBlog('?newsletter=error');
    }

    const businessEmail = process.env.BUSINESS_EMAIL || process.env.RESEND_FROM_EMAIL;
    if (businessEmail) {
      const { error } = await sendNewsletterInternalConfirmedEmail(resendInstance, {
        businessEmail,
        subscriberEmail: sub.email,
      });
      if (error) {
        console.error('Internal newsletter confirmed email error:', error);
      }
    } else {
      console.warn('BUSINESS_EMAIL not set; skipping internal newsletter confirmation notification');
    }

    return redirectBlog('?newsletter=confirmed');
  } catch (e) {
    console.error('Newsletter confirm error:', e);
    return redirectBlog('?newsletter=error');
  }
}

export const runtime = 'nodejs';
