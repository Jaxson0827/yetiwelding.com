import { DumpsterGateConfig, PriceBreakdown, PriceLineItem, GATE_DIMENSIONS, GateSize } from './types';

// Base prices per size (gate only, raw steel)
const BASE_PRICES: Record<Exclude<GateSize, 'custom'>, number> = {
  '10x6': 1200,
  '12x6': 1400,
  '14x6': 1600,
  '16x6': 1800,
  '18x6': 2000,
};

// Custom size pricing constants
const BASE_RATE_PER_FOOT = 145; // Base rate per foot of width for custom sizes
const CUSTOM_FABRICATION_SURCHARGE = 150; // Flat surcharge for custom fabrication

// Finish adders
const FINISH_ADDERS: Record<DumpsterGateConfig['finish'], number> = {
  'raw-steel': 0,
  'prime-painted': 150,
  'powder-coat-black': 300,
  'galvanized': 500,
};

// Post adders
const POST_COST = 400; // Additional cost if posts are included

/**
 * Calculate lead time based on finish
 */
function getLeadTime(finish: DumpsterGateConfig['finish']): string {
  switch (finish) {
    case 'raw-steel':
    case 'prime-painted':
      return '2-3 weeks';
    case 'powder-coat-black':
      return '2-3 weeks + 3-5 business days';
    case 'galvanized':
      return 'Extended lead time';
    default:
      return '2-3 weeks';
  }
}

/**
 * Price a dumpster gate configuration
 */
export function priceGate(config: DumpsterGateConfig): PriceBreakdown {
  const lineItems: PriceLineItem[] = [];
  
  let basePrice: number;
  
  if (config.isCustom) {
    // Custom size pricing: formula-based
    basePrice = BASE_RATE_PER_FOOT * config.widthFt;
    lineItems.push({
      label: `Base (${config.widthFt.toFixed(1)} ft @ $${BASE_RATE_PER_FOOT}/ft)`,
      amount: Math.round(basePrice * 100) / 100,
    });
    
    // Add custom fabrication surcharge
    lineItems.push({
      label: 'Custom Fabrication Surcharge',
      amount: CUSTOM_FABRICATION_SURCHARGE,
    });
    
    basePrice += CUSTOM_FABRICATION_SURCHARGE;
  } else {
    // Preset size pricing: lookup table
    const presetSize = config.size as Exclude<GateSize, 'custom'>;
    basePrice = BASE_PRICES[presetSize];
    lineItems.push({
      label: `Base gate (${GATE_DIMENSIONS[presetSize].widthFt}' × ${GATE_DIMENSIONS[presetSize].heightFt}')`,
      amount: basePrice,
    });
  }

  // Finish adder
  const finishAdder = FINISH_ADDERS[config.finish];
  if (finishAdder > 0) {
    const finishLabel = config.finish === 'powder-coat-black' 
      ? 'Powder coat (black)' 
      : config.finish === 'prime-painted'
      ? 'Prime painted'
      : config.finish === 'galvanized'
      ? 'Galvanized'
      : 'Raw steel';
    lineItems.push({
      label: finishLabel,
      amount: finishAdder,
    });
  }

  // Post adder
  if (config.mounting === 'with-posts') {
    lineItems.push({
      label: 'Steel posts included',
      amount: POST_COST,
    });
  }

  // Calculate unit price
  const unitPrice = basePrice + finishAdder + (config.mounting === 'with-posts' ? POST_COST : 0);
  
  // Calculate total price (unit price * quantity)
  const totalPrice = unitPrice * config.quantity;

  // Get lead time
  const leadTime = getLeadTime(config.finish);

  return {
    unitPrice: Math.round(unitPrice * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100,
    lineItems,
    leadTime,
  };
}

