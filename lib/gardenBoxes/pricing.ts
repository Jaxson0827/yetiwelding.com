import type { GardenBoxConfig, GardenBoxSize, GardenBoxFinish } from './types';
import { GARDEN_BOX_ADD_ON_IDS } from './types';

// Base price by size (at 18" height; adjusted by height multiplier)
const BASE_PRICE_BY_SIZE: Record<GardenBoxSize, number> = {
  '4x2': 249,
  '6x3': 349,
  '8x4': 449,
};

// Height multiplier (18" = 1.0)
const HEIGHT_MULTIPLIER: Record<number, number> = {
  12: 0.85,
  18: 1.0,
  24: 1.15,
  30: 1.3,
};

// Finish multiplier
const FINISH_MULTIPLIER: Record<GardenBoxFinish, number> = {
  raw: 1.0,
  'powder-black': 1.15,
  'powder-bronze': 1.2,
  corten: 1.25,
};

// Add-on flat fees (USD)
const ADD_ON_PRICES: Record<string, number> = {
  bottomPlate: 40,
  cornerCaps: 25,
  trellis: 35,
  drainHoles: 15,
  irrigationPassThrough: 20,
};

export interface GardenBoxPriceResult {
  unitPrice: number;
  totalPrice: number;
  breakdown?: {
    base: number;
    finish: number;
    addOns: number;
  };
}

/**
 * Compute garden box price.
 */
export function priceGardenBox(config: Partial<GardenBoxConfig>, quantity = 1): GardenBoxPriceResult {
  const size = (config.size ?? '4x2') as GardenBoxSize;
  const height = config.height ?? 18;
  const finish = (config.finish ?? 'raw') as GardenBoxFinish;
  const addOns = config.addOns ?? {};

  const baseBySize = BASE_PRICE_BY_SIZE[size];
  const heightMult = HEIGHT_MULTIPLIER[height] ?? 1.0;
  const finishMult = FINISH_MULTIPLIER[finish];

  const basePrice = Math.round(baseBySize * heightMult * finishMult);

  let addOnsTotal = 0;
  for (const id of GARDEN_BOX_ADD_ON_IDS) {
    if (addOns[id]) {
      addOnsTotal += ADD_ON_PRICES[id] ?? 0;
    }
  }

  const unitPrice = basePrice + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  return {
    unitPrice,
    totalPrice,
    breakdown: {
      base: basePrice,
      finish: 0, // baked into base
      addOns: addOnsTotal,
    },
  };
}

// Weight estimates by size and height (lb). Bolt-together flat-pack, 11ga steel.
const WEIGHT_BY_SIZE_HEIGHT: Record<string, Record<number, number>> = {
  '4x2': { 12: 35, 18: 45, 24: 55, 30: 65 },
  '6x3': { 12: 65, 18: 85, 24: 105, 30: 125 },
  '8x4': { 12: 95, 18: 120, 24: 145, 30: 170 },
};

/**
 * Estimate weight in pounds for a garden box config (for shipping).
 * Bolt-together flat-pack: 11ga steel panels.
 */
export function estimateGardenBoxWeightLb(config: GardenBoxConfig): number {
  const sizeTable = WEIGHT_BY_SIZE_HEIGHT[config.size] ?? WEIGHT_BY_SIZE_HEIGHT['4x2'];
  let base = sizeTable[config.height] ?? sizeTable[18];
  if (config.addOns?.bottomPlate) base += 8;
  if (config.addOns?.trellis) base += 12;
  return Math.ceil(base);
}
