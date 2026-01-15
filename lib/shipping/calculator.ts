import { CartItem } from '@/contexts/CartContext';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { DumpsterGateConfig } from '@/lib/dumpsterGates/types';

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

// Weight estimates (in pounds)
const WEIGHT_ESTIMATES = {
  'steel-plate-embeds': {
    baseWeight: 0.5, // per embed base weight
    plateWeightPerCubicInch: 0.283, // A36 steel density
  },
  'dumpster-gate': {
    baseWeight: 150, // base weight per gate
    weightPerSqFt: 5, // additional weight per square foot
  },
};

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
 * Calculate total weight of cart items
 */
function calculateTotalWeight(items: CartItem[]): number {
  let totalWeight = 0;

  for (const item of items) {
    if (item.productType === 'steel-plate-embeds') {
      const config = item.configuration as EmbedSpec;
      const plateVolume = 
        (config.plate.length * config.plate.width * config.plate.thickness) / 1728; // Convert to cubic feet
      const plateWeight = plateVolume * WEIGHT_ESTIMATES['steel-plate-embeds'].plateWeightPerCubicInch * 12 * 12 * 12; // Convert to pounds
      const baseWeight = WEIGHT_ESTIMATES['steel-plate-embeds'].baseWeight;
      
      // Add weight for studs if present
      const studWeight = config.studs?.positions?.length 
        ? config.studs.positions.length * 0.5 // ~0.5 lbs per stud
        : 0;
      
      totalWeight += (plateWeight + baseWeight + studWeight) * config.quantity;
    } else if (item.productType === 'dumpster-gate') {
      const config = item.configuration as DumpsterGateConfig;
      const area = config.widthFt * config.heightFt;
      const gateWeight = 
        WEIGHT_ESTIMATES['dumpster-gate'].baseWeight + 
        (area * WEIGHT_ESTIMATES['dumpster-gate'].weightPerSqFt);
      
      totalWeight += gateWeight * config.quantity;
    }
  }

  return Math.ceil(totalWeight); // Round up to nearest pound
}

/**
 * Calculate total dimensions (for freight calculation)
 */
function calculateTotalDimensions(items: CartItem[]): { length: number; width: number; height: number } {
  // Simplified: assume items are packed efficiently
  // For dumpster gates, they're typically flat-packed
  // For steel embeds, they're small
  
  let maxLength = 0;
  let maxWidth = 0;
  let totalHeight = 0;

  for (const item of items) {
    if (item.productType === 'dumpster-gate') {
      const config = item.configuration as DumpsterGateConfig;
      // Gates are typically flat-packed, so length/width are the gate dimensions
      maxLength = Math.max(maxLength, config.widthFt * 12); // Convert to inches
      maxWidth = Math.max(maxWidth, config.heightFt * 12);
      totalHeight += 2; // ~2 inches per gate when flat-packed
    } else {
      // Steel embeds are small, assume 12x12x2 inch box per embed
      totalHeight += 2 * (item.configuration as EmbedSpec).quantity;
    }
  }

  return {
    length: Math.max(maxLength, 12), // Minimum 12 inches
    width: Math.max(maxWidth, 12),
    height: Math.max(totalHeight, 6), // Minimum 6 inches
  };
}

/**
 * Determine shipping zone from ZIP code
 */
function getShippingZone(zip: string): number {
  const zipPrefix = zip.substring(0, 2);
  return SHIPPING_ZONES[zipPrefix] || 3; // Default to zone 3 (Midwest)
}

/**
 * Check if order requires freight shipping
 */
function requiresFreight(weight: number, dimensions: { length: number; width: number; height: number }): boolean {
  // Require freight if:
  // - Weight > 500 lbs, OR
  // - Any dimension > 96 inches (8 feet), OR
  // - Total volume > 50 cubic feet
  const volume = (dimensions.length * dimensions.width * dimensions.height) / 1728; // Convert to cubic feet
  
  return weight > 500 || 
         dimensions.length > 96 || 
         dimensions.width > 96 || 
         dimensions.height > 96 ||
         volume > 50;
}

/**
 * Calculate shipping costs for cart items
 */
export function calculateShipping(
  items: CartItem[],
  address: ShippingAddress,
  preferredMethod?: ShippingMethod
): ShippingCalculation {
  if (items.length === 0) {
    return {
      options: [],
      totalWeight: 0,
      totalDimensions: { length: 0, width: 0, height: 0 },
    };
  }

  const totalWeight = calculateTotalWeight(items);
  const totalDimensions = calculateTotalDimensions(items);
  const zone = getShippingZone(address.zip);
  const needsFreight = requiresFreight(totalWeight, totalDimensions);

  const options: ShippingOption[] = [];

  // Always offer standard shipping
  const standardRate = BASE_RATES[zone]?.standard || BASE_RATES[3].standard;
  const standardCost = Math.max(
    totalWeight * standardRate,
    MINIMUM_SHIPPING.standard
  );
  
  options.push({
    method: 'standard',
    name: 'Standard Shipping',
    description: 'Ground shipping via standard carrier',
    cost: Math.round(standardCost * 100) / 100,
    estimatedDays: DELIVERY_DAYS.standard,
  });

  // Offer expedited if weight < 200 lbs
  if (totalWeight < 200 && !needsFreight) {
    const expeditedRate = BASE_RATES[zone]?.expedited || BASE_RATES[3].expedited;
    const expeditedCost = Math.max(
      totalWeight * expeditedRate,
      MINIMUM_SHIPPING.expedited
    );
    
    options.push({
      method: 'expedited',
      name: 'Expedited Shipping',
      description: 'Faster delivery for urgent orders',
      cost: Math.round(expeditedCost * 100) / 100,
      estimatedDays: DELIVERY_DAYS.expedited,
    });
  }

  // Offer freight for large/heavy items
  if (needsFreight || totalWeight > 300) {
    const freightRate = BASE_RATES[zone]?.freight || BASE_RATES[3].freight;
    const freightCost = Math.max(
      totalWeight * freightRate,
      MINIMUM_SHIPPING.freight
    );
    
    options.push({
      method: 'freight',
      name: 'Freight Shipping',
      description: 'LTL freight for large/heavy items',
      cost: Math.round(freightCost * 100) / 100,
      estimatedDays: DELIVERY_DAYS.freight,
    });
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





