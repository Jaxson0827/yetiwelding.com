import { CartItem } from '@/contexts/CartContext';
import { getShippoShippingOptions } from '@/lib/shipping/providers/shippo';
import { estimateTotalDimensionsIn, estimateTotalWeightLb } from '@/lib/shipping/packaging';
import type { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import {
  calculateFreightUsd,
  type FreightInputs,
  type FreightKind,
  getEmbedFreightTierFromWeightLb,
  getFreightZoneFromState,
  getGateFreightTierFromWidthFt,
} from '@/lib/shipping/freightPricing';

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type ShippingMethod = 'standard' | 'expedited' | 'freight';

export interface ShippingOption {
  method: ShippingMethod;
  name: string;
  description: string;
  cost: number;
  estimatedDays: string;
  // Optional provider metadata (used for Stripe metadata + ops).
  provider?: string;
  providerRateId?: string;
  carrier?: string;
  service?: string | null;
  estimatedDaysMin?: number | null;
  estimatedDaysMax?: number | null;
  // Freight-only metadata (used for Stripe metadata + ops).
  freightZone?: string;
  freightKind?: FreightKind;
  freightTier?: string;
  freightBaseUsd?: number;
  freightAddonsUsd?: number;
  freightDeliveryType?: string;
  freightLiftgateRequired?: boolean;
}

export interface ShippingCalculation {
  options: ShippingOption[];
  selectedMethod?: ShippingMethod;
  totalWeight: number; // in pounds
  totalDimensions: {
    length: number; // inches
    width: number;
    height: number;
  };
}

// Shipping zones (based on ZIP code prefixes)
const SHIPPING_ZONES: Record<string, number> = {
  // Zone 1: Local/Regional (UT, ID, WY, CO, NV, AZ, NM)
  '84': 1, // Utah
  '82': 1, // Utah
  '80': 1, // Colorado
  '81': 1, // Colorado
  '89': 1, // Nevada
  '85': 1, // Arizona
  '87': 1, // New Mexico
  '83': 1, // Idaho
  // Zone 2: West Coast (CA, OR, WA)
  '90': 2,
  '91': 2,
  '92': 2,
  '93': 2,
  '94': 2,
  '95': 2,
  '96': 2,
  '97': 2,
  '98': 2,
  '99': 2,
  // Zone 3: Midwest (default)
  // Zone 4: East Coast
  // Zone 5: Remote/Alaska/Hawaii
};

// Base shipping rates by zone and method (per 100 lbs)
const BASE_RATES: Record<number, Record<ShippingMethod, number>> = {
  1: {
    standard: 0.50, // $0.50 per lb
    expedited: 0.75, // $0.75 per lb
    freight: 0.40, // $0.40 per lb (for large/heavy items)
  },
  2: {
    standard: 0.65,
    expedited: 0.90,
    freight: 0.55,
  },
  3: {
    standard: 0.80,
    expedited: 1.10,
    freight: 0.70,
  },
  4: {
    standard: 0.95,
    expedited: 1.30,
    freight: 0.85,
  },
  5: {
    standard: 1.50,
    expedited: 2.00,
    freight: 1.20,
  },
};

// Minimum shipping costs
const MINIMUM_SHIPPING: Record<ShippingMethod, number> = {
  standard: 25.00,
  expedited: 45.00,
  freight: 50.00,
};

// Estimated delivery days by method
const DELIVERY_DAYS: Record<ShippingMethod, string> = {
  standard: '7-14 business days',
  expedited: '3-5 business days',
  freight: '5-10 business days',
};

/**
 * Estimate shipment weight for business decisions (parcel vs freight).
 *
 * This intentionally includes a small packaging buffer so we don't under-route
 * a borderline-heavy embed order into parcel.
 */
function estimateShipmentWeightForDecisionLb(items: CartItem[]): number {
  const productWeight = estimateTotalWeightLb(items);
  // Small buffer for packaging variance (especially embeds).
  const bufferLb = Math.ceil(productWeight * 0.05 + 5);
  return Math.max(1, Math.ceil(productWeight + bufferLb));
}

/**
 * Calculate total dimensions (for freight calculation)
 */
function calculateTotalDimensions(items: CartItem[]): { length: number; width: number; height: number } {
  return estimateTotalDimensionsIn(items);
}

/**
 * Determine shipping zone from ZIP code
 */
function getShippingZone(zip: string): number {
  const zipPrefix = zip.substring(0, 2);
  return SHIPPING_ZONES[zipPrefix] || 3; // Default to zone 3 (Midwest)
}

/**
 * Business rule: when do we force freight?
 */
function requiresFreightBusiness(items: CartItem[], decisionWeightLb: number): boolean {
  const hasGate = items.some((it) => it.productType === 'dumpster-gate');
  if (hasGate) return true;
  return decisionWeightLb > 150;
}

function getFreightKind(items: CartItem[]): FreightKind {
  return items.some((it) => it.productType === 'dumpster-gate') ? 'gate' : 'embeds';
}

function getMaxGateWidthFt(items: CartItem[]): number {
  let max = 0;
  for (const it of items) {
    if (it.productType !== 'dumpster-gate') continue;
    const cfg = it.configuration as DumpsterGateConfig;
    const w = Number(cfg.widthFt || 0);
    if (Number.isFinite(w)) max = Math.max(max, w);
  }
  return max;
}

function buildFreightOption(params: {
  items: CartItem[];
  address: ShippingAddress;
  freight?: FreightInputs;
  totalWeightLb: number;
  totalDimensions: { length: number; width: number; height: number };
}): ShippingOption {
  const zone = getFreightZoneFromState(params.address.state);
  const kind = getFreightKind(params.items);
  const tier =
    kind === 'gate'
      ? getGateFreightTierFromWidthFt(getMaxGateWidthFt(params.items))
      : getEmbedFreightTierFromWeightLb(params.totalWeightLb);

  const priced = calculateFreightUsd({
    zone,
    kind,
    tier,
    freight: params.freight,
  });

  return {
    method: 'freight',
    name: 'Freight Shipping',
    description: 'LTL freight delivery. Carrier will call to schedule. Curbside delivery.',
    cost: Math.round(priced.totalUsd * 100) / 100,
    estimatedDays: DELIVERY_DAYS.freight,
    provider: 'freight_tiers',
    providerRateId: '',
    carrier: '',
    service: null,
    freightZone: zone,
    freightKind: kind,
    freightTier: tier,
    freightBaseUsd: priced.baseUsd,
    freightAddonsUsd: priced.addonsUsd,
    freightDeliveryType: params.freight?.deliveryType || 'commercial',
    freightLiftgateRequired: !!params.freight?.liftgateRequired,
  };
}

/**
 * Calculate shipping costs for cart items
 */
export function calculateShipping(
  items: CartItem[],
  address: ShippingAddress,
  preferredMethod?: ShippingMethod,
  freight?: FreightInputs
): ShippingCalculation {
  if (items.length === 0) {
    return {
      options: [],
      totalWeight: 0,
      totalDimensions: { length: 0, width: 0, height: 0 },
    };
  }

  const totalWeight = estimateShipmentWeightForDecisionLb(items);
  const totalDimensions = calculateTotalDimensions(items);
  const zone = getShippingZone(address.zip);
  const needsFreight = requiresFreightBusiness(items, totalWeight);

  const options: ShippingOption[] = [];

  if (needsFreight) {
    options.push(buildFreightOption({ items, address, freight, totalWeightLb: totalWeight, totalDimensions }));
  } else {
    // Heuristic fallback for parcel pricing (only used if Shippo is unavailable/fails).
    const standardRate = BASE_RATES[zone]?.standard || BASE_RATES[3].standard;
    const standardCost = Math.max(totalWeight * standardRate, MINIMUM_SHIPPING.standard);
    options.push({
      method: 'standard',
      name: 'Standard Shipping',
      description: 'Ground shipping via standard carrier',
      cost: Math.round(standardCost * 100) / 100,
      estimatedDays: DELIVERY_DAYS.standard,
      provider: 'heuristic',
    });

    if (totalWeight < 200) {
      const expeditedRate = BASE_RATES[zone]?.expedited || BASE_RATES[3].expedited;
      const expeditedCost = Math.max(totalWeight * expeditedRate, MINIMUM_SHIPPING.expedited);
      options.push({
        method: 'expedited',
        name: 'Expedited Shipping',
        description: 'Faster delivery for urgent orders',
        cost: Math.round(expeditedCost * 100) / 100,
        estimatedDays: DELIVERY_DAYS.expedited,
        provider: 'heuristic',
      });
    }
  }

  // Select default method
  let selectedMethod: ShippingMethod = preferredMethod || 'standard';
  if (needsFreight && selectedMethod !== 'freight') {
    selectedMethod = 'freight'; // Auto-select freight if required
  }

  // If preferred method not available, use first option
  if (!options.find(opt => opt.method === selectedMethod)) {
    selectedMethod = options[0].method;
  }

  return {
    options,
    selectedMethod,
    totalWeight,
    totalDimensions,
  };
}

/**
 * Live shipping calculation (carrier rates) with heuristic fallback.
 *
 * - Uses Shippo when configured and when package can be treated as parcel.
 * - Falls back to heuristic rates if Shippo is unavailable or if the package requires freight.
 */
export async function calculateShippingLive(
  items: CartItem[],
  address: ShippingAddress,
  preferredMethod?: ShippingMethod,
  freight?: FreightInputs
): Promise<ShippingCalculation> {
  // Guard: basic address presence required for carrier rates.
  const hasFullAddress =
    !!address?.street && !!address?.city && !!address?.state && !!address?.zip && !!address?.country;

  const totalWeight = estimateShipmentWeightForDecisionLb(items);
  const totalDimensions = calculateTotalDimensions(items);
  const needsFreight = requiresFreightBusiness(items, totalWeight);

  if (process.env.SHIPPO_API_TOKEN && hasFullAddress && !needsFreight) {
    try {
      const shippo = await getShippoShippingOptions({ items, address, preferredMethod });
      return {
        options: shippo.options,
        selectedMethod: shippo.selectedMethod,
        totalWeight: shippo.totalWeight,
        totalDimensions: shippo.totalDimensions,
      };
    } catch (e) {
      // Fall back to heuristic below.
      console.warn('Live carrier rates failed; falling back to heuristic shipping.', e);
    }
  }

  return calculateShipping(items, address, preferredMethod, freight);
}





