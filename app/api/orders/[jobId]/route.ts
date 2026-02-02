import { NextRequest, NextResponse } from 'next/server';
import { kvGetJson, kvGetString, KvNotConfiguredError } from '@/lib/storage/kv';
import { KV_KEYS } from '@/lib/storage/keys';

/**
 * Unified order API endpoint
 * GET /api/orders/[jobId] - Get order details
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId is required' },
        { status: 400 }
      );
    }

    const orderId = await kvGetString(KV_KEYS.orderByJob(jobId));
    if (!orderId) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = await kvGetJson<any>(KV_KEYS.order(orderId));
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const tokenOk = Boolean(token && order.trackingToken && token === order.trackingToken);

    return NextResponse.json({
      success: true,
      order: {
        jobId: order.jobId,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: tokenOk ? order.items : undefined,
        customerInfo: tokenOk ? order.customerInfo : undefined,
        orderTotal: order.orderTotal,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        shippingMethod: order.shippingMethod,
        taxAmount: order.taxAmount,
        paymentIntentId: tokenOk ? order.paymentIntentId : undefined,
        paymentStatus: order.paymentStatus,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        trackingNumber: tokenOk ? order.trackingNumber : undefined,
        notes: tokenOk ? order.notes : undefined,
      },
    });
  } catch (error) {
    if (error instanceof KvNotConfiguredError) {
      return NextResponse.json({ error: 'Order tracking is not configured' }, { status: 500 });
    }
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching order' },
      { status: 500 }
    );
  }
}

