export const KV_KEYS = {
  draftByUser: (checkoutId: string) => `draft_by_user:${checkoutId}`,
  draftBySession: (sessionId: string) => `draft_by_session:${sessionId}`,
  draftByPi: (paymentIntentId: string) => `draft_by_pi:${paymentIntentId}`,
  orderByJob: (jobId: string) => `order_by_job:${jobId}`,
  orderBySession: (sessionId: string) => `order_by_session:${sessionId}`,
  orderByPi: (paymentIntentId: string) => `order_by_pi:${paymentIntentId}`,
  order: (orderId: string) => `order:${orderId}`,
  event: (eventId: string) => `event:${eventId}`,
};

