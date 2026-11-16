import { SHOP_ADDRESS_ONE_LINE } from '@/lib/delivery/zone';
import { escapeNewsletterHtml as escapeHtml } from '@/lib/newsletter/escapeHtml';

/**
 * Pickup / local delivery block for order emails. Returns null for orders without a
 * `fulfillment` field (carrier-shipped products), so callers keep their existing address block.
 */
type FulfillmentCustomerInfo = {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  fulfillment?: 'pickup' | 'local_delivery' | string;
  siteNotes?: string;
  shippingAddress?: { street?: string; city?: string; state?: string; zip?: string };
};

function row(label: string, valueHtml: string) {
  return `<div class="info-row"><span class="info-label">${label}:</span> ${valueHtml}</div>`;
}

export function renderFulfillmentHtml(ci: FulfillmentCustomerInfo, audience: 'customer' | 'internal'): string | null {
  if (ci?.fulfillment !== 'pickup' && ci?.fulfillment !== 'local_delivery') return null;
  const contact = [
    row('Name', escapeHtml(ci.name || '')),
    ci.company ? row('Company', escapeHtml(ci.company)) : '',
    row('Phone', escapeHtml(ci.phone || '')),
    row('Email', escapeHtml(ci.email || '')),
  ].join('');

  if (ci.fulfillment === 'pickup') {
    const note =
      audience === 'customer'
        ? `Free pickup at our shop: ${escapeHtml(SHOP_ADDRESS_ONE_LINE)}. We'll call when your gate is ready.`
        : `<strong>PICKUP</strong> at the shop. Call the customer when it's ready.`;
    return `<div class="section"><div class="section-title">Pickup</div><p style="margin:0 0 12px">${note}</p>${contact}</div>`;
  }

  const a = ci.shippingAddress || {};
  const address = `${escapeHtml(a.street || '')}<br>${escapeHtml(a.city || '')}, ${escapeHtml(a.state || '')} ${escapeHtml(a.zip || '')}`;
  const note =
    audience === 'customer'
      ? "Free delivery. We'll call you to schedule a delivery day."
      : '<strong>FREE LOCAL DELIVERY</strong>. Call the customer to schedule.';
  return `<div class="section"><div class="section-title">Delivery</div><p style="margin:0 0 12px">${note}</p>${row(
    'Deliver to',
    address
  )}${ci.siteNotes ? row('Site notes', escapeHtml(ci.siteNotes)) : ''}${contact}</div>`;
}

export function renderFulfillmentText(ci: FulfillmentCustomerInfo, audience: 'customer' | 'internal'): string | null {
  if (ci?.fulfillment !== 'pickup' && ci?.fulfillment !== 'local_delivery') return null;
  const contact = `${ci.name || ''}${ci.company ? `\n${ci.company}` : ''}\nPhone: ${ci.phone || ''}\nEmail: ${ci.email || ''}`;
  if (ci.fulfillment === 'pickup') {
    return audience === 'customer'
      ? `PICKUP:\nFree pickup at our shop: ${SHOP_ADDRESS_ONE_LINE}. We'll call when your gate is ready.\n\n${contact}`
      : `PICKUP at the shop. Call the customer when it's ready.\n\n${contact}`;
  }
  const a = ci.shippingAddress || {};
  return `${audience === 'customer' ? "DELIVERY (free, we'll call to schedule):" : 'FREE LOCAL DELIVERY (call to schedule):'}\n${a.street || ''}\n${a.city || ''}, ${a.state || ''} ${a.zip || ''}${
    ci.siteNotes ? `\nSite notes: ${ci.siteNotes}` : ''
  }\n\n${contact}`;
}
