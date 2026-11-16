// In-memory store for the legacy steel-embeds endpoints (moved out of the route file:
// Next.js 16 only allows HTTP handlers and route config to be exported from route.ts).

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


