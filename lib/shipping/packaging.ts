import type { CartItem } from '@/contexts/CartContext';
import type { EmbedSpec } from '@/lib/steelEmbeds/types';
import type { DumpsterGateConfig } from '@/lib/dumpsterGates/types';

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

export function estimateTotalWeightLb(items: CartItem[]): number {
  let totalWeight = 0;

  for (const item of items) {
    if (item.productType === 'steel-plate-embeds') {
      const config = item.configuration as EmbedSpec;
      const plateVolume =
        (config.plate.length * config.plate.width * config.plate.thickness) / 1728; // Convert to cubic feet
      const plateWeight =
        plateVolume *
        WEIGHT_ESTIMATES['steel-plate-embeds'].plateWeightPerCubicInch *
        12 *
        12 *
        12; // Convert to pounds
      const baseWeight = WEIGHT_ESTIMATES['steel-plate-embeds'].baseWeight;

      // Add weight for studs if present
      const studWeight = config.studs?.positions?.length ? config.studs.positions.length * 0.5 : 0;

      totalWeight += (plateWeight + baseWeight + studWeight) * (config.quantity || 1);
    } else if (item.productType === 'dumpster-gate') {
      const config = item.configuration as DumpsterGateConfig;
      const area = (config.widthFt || 0) * (config.heightFt || 0);
      const gateWeight =
        WEIGHT_ESTIMATES['dumpster-gate'].baseWeight + area * WEIGHT_ESTIMATES['dumpster-gate'].weightPerSqFt;

      totalWeight += gateWeight * (config.quantity || 1);
    }
  }

  return Math.ceil(totalWeight); // Round up to nearest pound
}

export function estimateTotalDimensionsIn(items: CartItem[]): { length: number; width: number; height: number } {
  // Simplified: assume items are packed efficiently.
  // Gates are typically flat-packed; embeds are boxed.
  let maxLength = 0;
  let maxWidth = 0;
  let totalHeight = 0;

  for (const item of items) {
    if (item.productType === 'dumpster-gate') {
      const config = item.configuration as DumpsterGateConfig;
      maxLength = Math.max(maxLength, (config.widthFt || 0) * 12);
      maxWidth = Math.max(maxWidth, (config.heightFt || 0) * 12);
      totalHeight += 2; // ~2 inches per gate when flat-packed
    } else if (item.productType === 'steel-plate-embeds') {
      const qty = (item.configuration as EmbedSpec).quantity || 1;
      totalHeight += 2 * qty;
    }
  }

  return {
    length: Math.max(maxLength, 12), // Minimum 12 inches
    width: Math.max(maxWidth, 12),
    height: Math.max(totalHeight, 6), // Minimum 6 inches
  };
}

export function requiresFreight(weightLb: number, dimensionsIn: { length: number; width: number; height: number }): boolean {
  // Require freight if:
  // - Weight > 500 lbs, OR
  // - Any dimension > 96 inches (8 feet), OR
  // - Total volume > 50 cubic feet
  const volumeFt3 = (dimensionsIn.length * dimensionsIn.width * dimensionsIn.height) / 1728;
  return (
    weightLb > 500 ||
    dimensionsIn.length > 96 ||
    dimensionsIn.width > 96 ||
    dimensionsIn.height > 96 ||
    volumeFt3 > 50
  );
}

