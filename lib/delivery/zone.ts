import { DELIVERY_ZONE_ZIPS } from './zoneZips';

/** Shop address used for pickup orders (and as the tax location for pickup). */
export const SHOP_ADDRESS = {
  name: 'Yeti Welding',
  street: '1680 W 1600 S',
  city: 'Springville',
  state: 'UT',
  zip: '84663',
  country: 'US',
} as const;

export const SHOP_ADDRESS_ONE_LINE = `${SHOP_ADDRESS.street}, ${SHOP_ADDRESS.city}, ${SHOP_ADDRESS.state} ${SHOP_ADDRESS.zip}`;

/** Free delivery radius, in drive time from the shop. */
export const DELIVERY_ZONE_MAX_HOURS = 3;

const ZONE = new Set(DELIVERY_ZONE_ZIPS);

/** Normalizes "84663-1234" / " 84663 " to "84663". Returns null when it isn't a US ZIP. */
export function normalizeZip(raw: unknown): string | null {
  if (typeof raw !== 'string' && typeof raw !== 'number') return null;
  const m = String(raw).trim().match(/^(\d{5})(?:-\d{4})?$/);
  return m ? m[1] : null;
}

/** True when the ZIP is inside the free-delivery area. */
export function isZipInDeliveryZone(raw: unknown): boolean {
  const zip = normalizeZip(raw);
  return zip !== null && ZONE.has(zip);
}
