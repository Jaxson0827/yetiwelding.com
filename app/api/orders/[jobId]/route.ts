import { NextRequest, NextResponse } from 'next/server';
import { orders } from '../../steel-embeds/order-status/route';

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

    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId is required' },
        { status: 400 }
      );
    }

    const order = orders.get(jobId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        jobId: order.jobId,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items,
        steelEmbeds: order.steelEmbeds,
        dumpsterGates: order.dumpsterGates,
        customerInfo: order.customerInfo,
        orderTotal: order.orderTotal,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        shippingMethod: order.shippingMethod,
        taxAmount: order.taxAmount,
        taxRate: order.taxRate,
        isTaxExempt: order.isTaxExempt,
        paymentIntentId: order.paymentIntentId,
        paymentStatus: order.paymentStatus,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        trackingNumber: order.trackingNumber,
        notes: order.notes,
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

