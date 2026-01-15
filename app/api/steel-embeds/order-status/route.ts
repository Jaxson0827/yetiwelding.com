import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for orders (in production, use a database)
export const orders = new Map<string, {
  jobId: string;
  status: 'pending' | 'in_review' | 'in_production' | 'ready' | 'shipped' | 'delivered';
  createdAt: string;
  updatedAt: string;
  embedSpecs?: any[];
  projectInfo?: any;
  // Full order data from checkout
  items?: any[];
  steelEmbeds?: any[];
  dumpsterGates?: any[];
  customerInfo?: any;
  orderTotal?: number;
  subtotal?: number;
  shippingCost?: number;
  shippingMethod?: string;
  taxAmount?: number;
  taxRate?: number;
  isTaxExempt?: boolean;
  paymentIntentId?: string;
  paymentStatus?: string;
  estimatedDeliveryDate?: string;
  trackingNumber?: string;
  notes?: string[];
}>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

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
        // Include full order details
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
    console.error('Order status error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching order status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, status } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId is required' },
        { status: 400 }
      );
    }

    if (!status || !['pending', 'in_review', 'in_production', 'ready', 'shipped', 'delivered'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
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

    order.status = status;
    order.updatedAt = new Date().toISOString();
    orders.set(jobId, order);

    return NextResponse.json({
      success: true,
      order: {
        jobId: order.jobId,
        status: order.status,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error('Order status update error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating order status' },
      { status: 500 }
    );
  }
}

// Helper function to store order (called from process-order route)
export function storeOrder(jobId: string, embedSpecs: any[], projectInfo?: any) {
  const existing = orders.get(jobId);
  orders.set(jobId, {
    jobId,
    status: existing?.status || 'pending',
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    embedSpecs,
    projectInfo,
    // Preserve existing full order data
    items: existing?.items,
    steelEmbeds: existing?.steelEmbeds,
    dumpsterGates: existing?.dumpsterGates,
    customerInfo: existing?.customerInfo,
    orderTotal: existing?.orderTotal,
    subtotal: existing?.subtotal,
    shippingCost: existing?.shippingCost,
    shippingMethod: existing?.shippingMethod,
    taxAmount: existing?.taxAmount,
    taxRate: existing?.taxRate,
    isTaxExempt: existing?.isTaxExempt,
    paymentIntentId: existing?.paymentIntentId,
    paymentStatus: existing?.paymentStatus,
    estimatedDeliveryDate: existing?.estimatedDeliveryDate,
    trackingNumber: existing?.trackingNumber,
    notes: existing?.notes,
  });
}

// Helper function to store full order from checkout
export function storeFullOrder(orderData: any) {
  const jobId = orderData.jobId;
  const existing = orders.get(jobId);
  
  // Calculate estimated delivery date (2-3 weeks from order date)
  const orderDate = new Date(orderData.createdAt || new Date());
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 21); // 3 weeks default
  
  orders.set(jobId, {
    jobId,
    status: existing?.status || 'pending',
    createdAt: orderData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: orderData.items,
    steelEmbeds: orderData.steelEmbeds,
    dumpsterGates: orderData.dumpsterGates,
    customerInfo: orderData.customerInfo,
    orderTotal: orderData.orderTotal,
    subtotal: orderData.subtotal,
    shippingCost: orderData.shippingCost,
    shippingMethod: orderData.shippingMethod,
    taxAmount: orderData.taxAmount,
    taxRate: orderData.taxRate,
    isTaxExempt: orderData.isTaxExempt,
    paymentIntentId: orderData.paymentIntentId,
    paymentStatus: orderData.paymentStatus,
    estimatedDeliveryDate: existing?.estimatedDeliveryDate || estimatedDelivery.toISOString(),
    trackingNumber: existing?.trackingNumber,
    notes: existing?.notes || [],
    // Preserve legacy fields
    embedSpecs: orderData.steelEmbeds || existing?.embedSpecs,
    projectInfo: existing?.projectInfo,
  });
}


