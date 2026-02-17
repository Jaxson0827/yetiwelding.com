import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutId = searchParams.get('checkoutId');
    if (!checkoutId) {
      return NextResponse.json({ error: 'checkoutId is required' }, { status: 400 });
    }
    
    const order = await prisma.order.findFirst({
      where: { checkoutId },
      select: {
        id: true,
        jobId: true,
        paymentStatus: true,
        totalCents: true,
        trackingToken: true,
      },
    });
    if (order) {
      return NextResponse.json({
        success: true,
        status: 'ready',
        order: {
          orderId: order.id,
          jobId: order.jobId,
          paymentStatus: order.paymentStatus,
          orderTotal: typeof order.totalCents === 'number' ? order.totalCents / 100 : null,
          trackingToken: order.trackingToken,
        },
      });
    }

    const draft = await prisma.checkoutDraft.findUnique({
      where: { checkoutId },
      select: { stripeSessionId: true, expiresAt: true },
    });
    if (!draft || (draft.expiresAt && draft.expiresAt.getTime() < Date.now())) {
      return NextResponse.json({ success: true, status: 'not_found' });
    }

    return NextResponse.json({ success: true, status: 'pending', sessionId: draft.stripeSessionId });
  } catch (e) {
    console.error('by-checkout error:', e);
    return NextResponse.json({ error: 'Failed to fetch order status' }, { status: 500 });
  }
}

export const runtime = 'nodejs';

