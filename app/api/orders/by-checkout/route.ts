import { NextRequest, NextResponse } from 'next/server';
import { kvGetJson, kvGetString, KvNotConfiguredError } from '@/lib/storage/kv';
import { KV_KEYS } from '@/lib/storage/keys';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutId = searchParams.get('checkoutId');
    if (!checkoutId) {
      return NextResponse.json({ error: 'checkoutId is required' }, { status: 400 });
    }

    const sessionId = await kvGetString(KV_KEYS.draftByUser(checkoutId));
    if (!sessionId) {
      return NextResponse.json({ success: true, status: 'not_found' });
    }

    const orderId = await kvGetString(KV_KEYS.orderBySession(sessionId));
    if (!orderId) {
      return NextResponse.json({ success: true, status: 'pending', sessionId });
    }

    const order = await kvGetJson<any>(KV_KEYS.order(orderId));
    if (!order) {
      return NextResponse.json({ success: true, status: 'pending', sessionId });
    }

    return NextResponse.json({
      success: true,
      status: 'ready',
      order: {
        orderId: order.orderId,
        jobId: order.jobId,
        paymentStatus: order.paymentStatus,
        orderTotal: order.orderTotal,
        trackingToken: order.trackingToken,
      },
    });
  } catch (e) {
    if (e instanceof KvNotConfiguredError) {
      return NextResponse.json({ error: 'Order tracking is not configured' }, { status: 500 });
    }
    console.error('by-checkout error:', e);
    return NextResponse.json({ error: 'Failed to fetch order status' }, { status: 500 });
  }
}

