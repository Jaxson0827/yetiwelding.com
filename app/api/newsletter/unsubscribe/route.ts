import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/db/prisma';
import { setNewsletterContactUnsubscribed } from '@/lib/newsletter/resendAudience';
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
      where: { unsubscribeToken: token },
    });

    if (!sub) {
      return redirectBlog('?newsletter=invalid');
    }

    if (sub.unsubscribedAt) {
      return redirectBlog('?newsletter=unsubscribed');
    }

    const now = new Date();
    await prisma.newsletterSubscription.update({
      where: { id: sub.id },
      data: { unsubscribedAt: now },
    });

    const resendInstance = getResend();
    if (resendInstance && sub.confirmedAt) {
      const unsubResult = await setNewsletterContactUnsubscribed(resendInstance, sub.email);
      if (!unsubResult.ok) {
        console.error('Resend unsubscribe update error:', unsubResult.error);
      }
    }

    return redirectBlog('?newsletter=unsubscribed');
  } catch (e) {
    console.error('Newsletter unsubscribe error:', e);
    return redirectBlog('?newsletter=error');
  }
}

export const runtime = 'nodejs';
