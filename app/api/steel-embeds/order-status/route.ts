import { NextRequest, NextResponse } from 'next/server';

// Legacy endpoint (previous in-memory implementation).
// IMPORTANT: This is intentionally disabled for public use in production to avoid
// serverless reliability issues and unauthenticated status updates.
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
  return NextResponse.json(
    { error: 'Legacy endpoint disabled. Use /api/orders/[jobId] instead.' },
    { status: 410 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Legacy endpoint disabled. Use admin endpoint instead.' },
    { status: 410 }
  );
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


