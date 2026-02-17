import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

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

    const order = await prisma.order.findUnique({
      where: { jobId },
      include: { items: true },
    });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const tokenOk = Boolean(token && order.trackingToken && token === order.trackingToken);

    const items = order.items.map((it: any) => ({
      id: it.id,
      productType: it.productType,
      configuration: it.configuration,
      price: it.totalPriceCents / 100,
    }));

    return NextResponse.json({
      success: true,
      order: {
        jobId: order.jobId,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: tokenOk ? (items as any) : undefined,
        customerInfo: tokenOk ? (order.customerInfo as any) : undefined,
        orderTotal: typeof order.totalCents === 'number' ? order.totalCents / 100 : null,
        subtotal: typeof order.subtotalCents === 'number' ? order.subtotalCents / 100 : null,
        shippingCost: typeof order.shippingCents === 'number' ? order.shippingCents / 100 : null,
        shippingMethod: order.shippingMethod,
        taxAmount: typeof order.taxCents === 'number' ? order.taxCents / 100 : null,
        paymentIntentId: tokenOk ? order.paymentIntentId : undefined,
        paymentStatus: order.paymentStatus,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        trackingNumber: tokenOk ? order.trackingNumber : undefined,
        notes: tokenOk ? order.notes : undefined,
      },
    });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching order' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';