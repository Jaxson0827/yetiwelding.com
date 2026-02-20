import type { CartItem } from '@/contexts/CartContext';
import type { EmbedSpec } from '@/lib/steelEmbeds/types';
import type { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import type { GardenBoxConfig } from '@/lib/gardenBoxes/types';
import { getDimensionsFt } from '@/lib/gardenBoxes/types';
import { estimateGardenBoxWeightLb } from '@/lib/gardenBoxes/pricing';

// Steel density: mild steel (A36) in lb/in³
const STEEL_DENSITY_LB_PER_IN3 = 0.283;

// Weight estimates (in pounds)
const WEIGHT_ESTIMATES = {
  'steel-plate-embeds': {
    baseWeight: 0.5, // per embed base weight (packaging, misc)
    plateWeightPerCubicInch: STEEL_DENSITY_LB_PER_IN3,
  },
  'dumpster-gate': {
    baseWeight: 150, // base weight per gate
    weightPerSqFt: 5, // additional weight per square foot
  },
  pergola: {
    baseWeight: 400, // base weight per pergola (frame, hardware)
    weightPerSqFt: 10, // steel frame + aluminum roof panels
  },
};

export function estimateTotalWeightLb(items: CartItem[]): number {
  let totalWeight = 0;

  for (const item of items) {
    if (item.productType === 'steel-plate-embeds') {
      const config = item.configuration as EmbedSpec;
      // Plate weight: length × width × thickness × 0.283 (lb/in³)
      const plateVolumeIn3 =
        config.plate.length * config.plate.width * config.plate.thickness;
      const plateWeight = plateVolumeIn3 * STEEL_DENSITY_LB_PER_IN3;
      const baseWeight = WEIGHT_ESTIMATES['steel-plate-embeds'].baseWeight;

      // Stud weight: volume-based (cylinder π × r² × length × 0.283)
      let studWeight = 0;
      if (config.studs?.positions?.length) {
        for (const stud of config.studs.positions) {
          const r = (stud.diameter || 0) / 2;
          const volumeIn3 = Math.PI * r * r * (stud.length || 0);
          studWeight += volumeIn3 * STEEL_DENSITY_LB_PER_IN3;
        }
      }

      totalWeight += (plateWeight + baseWeight + studWeight) * (config.quantity || 1);
    } else if (item.productType === 'dumpster-gate') {
      const config = item.configuration as DumpsterGateConfig;
      const area = (config.widthFt || 0) * (config.heightFt || 0);
      const gateWeight =
        WEIGHT_ESTIMATES['dumpster-gate'].baseWeight + area * WEIGHT_ESTIMATES['dumpster-gate'].weightPerSqFt;

      totalWeight += gateWeight * (config.quantity || 1);
    } else if (item.productType === 'pergola') {
      const config = item.configuration as { span?: number; depth?: number; quantity?: number };
      const area = (config.span || 12) * (config.depth || 12);
      const pergolaWeight =
        WEIGHT_ESTIMATES.pergola.baseWeight + area * WEIGHT_ESTIMATES.pergola.weightPerSqFt;
      totalWeight += pergolaWeight * (config.quantity || 1);
    } else if (item.productType === 'garden-box') {
      const config = item.configuration as GardenBoxConfig;
      const unitWeight = estimateGardenBoxWeightLb(config);
      totalWeight += unitWeight * (config.quantity ?? 1);
    }
  }

  return Math.ceil(totalWeight); // Round up to nearest pound
}

// Packaging buffer for embed plates (inches). Plates ship flat, studs up.
const EMBED_PACKAGING_BUFFER_IN = 3;

export function estimateTotalDimensionsIn(items: CartItem[]): { length: number; width: number; height: number } {
  // Gates are typically flat-packed; embeds are boxed (plates flat, studs up); pergolas on pallets.
  let maxLength = 0;
  let maxWidth = 0;
  let totalHeight = 0;

  // Embed-specific accumulators (plates ship flat, studs do NOT stack vertically)
  let embedMaxLength = 0;
  let embedMaxWidth = 0;
  let embedTallestStud = 0;
  let embedStackedThickness = 0;

  for (const item of items) {
    if (item.productType === 'dumpster-gate') {
      const config = item.configuration as DumpsterGateConfig;
      maxLength = Math.max(maxLength, (config.widthFt || 0) * 12);
      maxWidth = Math.max(maxWidth, (config.heightFt || 0) * 12);
      totalHeight += 2; // ~2 inches per gate when flat-packed
    } else if (item.productType === 'steel-plate-embeds') {
      const config = item.configuration as EmbedSpec;
      const qty = config.quantity || 1;
      embedMaxLength = Math.max(embedMaxLength, config.plate.length);
      embedMaxWidth = Math.max(embedMaxWidth, config.plate.width);
      embedStackedThickness += config.plate.thickness * qty;
      // Tallest stud height (studs don't stack; one box height is driven by tallest)
      const studs = config.studs?.positions;
      if (studs?.length) {
        for (const stud of studs) {
          embedTallestStud = Math.max(embedTallestStud, stud.length || 0);
        }
      }
    } else if (item.productType === 'pergola') {
      const config = item.configuration as { span?: number; depth?: number; quantity?: number };
      const area = (config.span || 12) * (config.depth || 12);
      const pallets = Math.max(1, Math.ceil(area / 120));
      maxLength = Math.max(maxLength, 48); // standard pallet
      maxWidth = Math.max(maxWidth, 40);
      totalHeight += 60 * pallets * (config.quantity || 1); // 60" per pallet
    } else if (item.productType === 'garden-box') {
      const config = item.configuration as GardenBoxConfig;
      const { lengthFt, widthFt } = getDimensionsFt(config.size);
      // Bolt-together flat-pack: longest panel drives dimensions
      const longestIn = Math.max(lengthFt * 12, widthFt * 12, config.height);
      maxLength = Math.max(maxLength, longestIn);
      maxWidth = Math.max(maxWidth, Math.min(lengthFt * 12, widthFt * 12));
      totalHeight += 6 * (config.quantity ?? 1); // ~6" stacked flat
    }
  }

  // Embed height: max(tallest stud, total stacked plate thickness) + buffer
  if (embedMaxLength > 0 || embedMaxWidth > 0) {
    const embedHeight =
      Math.max(embedTallestStud, embedStackedThickness) + EMBED_PACKAGING_BUFFER_IN;
    maxLength = Math.max(maxLength, embedMaxLength);
    maxWidth = Math.max(maxWidth, embedMaxWidth);
    totalHeight += embedHeight;
  }

  return {
    length: Math.max(maxLength, 12), // Minimum 12 inches
    width: Math.max(maxWidth, 12),
    height: Math.max(totalHeight, 6), // Minimum 6 inches
  };
}

/** Max weight per parcel box (lb). Orders heavier than this are split into multiple parcels. */
export const MAX_PARCEL_WEIGHT_LB = 70;

export interface ParcelSpec {
  length: number;
  width: number;
  height: number;
  weight: number;
}

/**
 * Split embed-only cart into parcels for Shippo (max 70 lb per box).
 * Returns one or more parcel specs. Use when cart is parcel-eligible (no freight).
 */
export function splitIntoParcels(items: CartItem[]): ParcelSpec[] {
  const totalWeight = estimateTotalWeightLb(items);
  const dims = estimateTotalDimensionsIn(items);

  // Single parcel if under limit
  if (totalWeight <= MAX_PARCEL_WEIGHT_LB) {
    return [
      {
        length: dims.length,
        width: dims.width,
        height: dims.height,
        weight: Math.max(1, Math.ceil(totalWeight)),
      },
    ];
  }

  // Split into multiple boxes (each ≤ 70 lb)
  const numBoxes = Math.ceil(totalWeight / MAX_PARCEL_WEIGHT_LB);
  const weightPerBox = totalWeight / numBoxes;
  const heightPerBox = Math.max(6, Math.ceil(dims.height / numBoxes));

  const parcels: ParcelSpec[] = [];
  let remainingWeight = totalWeight;
  for (let i = 0; i < numBoxes; i++) {
    const isLast = i === numBoxes - 1;
    const boxWeight = isLast
      ? remainingWeight
      : Math.min(MAX_PARCEL_WEIGHT_LB, Math.ceil(weightPerBox));
    remainingWeight -= boxWeight;
    parcels.push({
      length: dims.length,
      width: dims.width,
      height: heightPerBox,
      weight: Math.max(1, Math.ceil(boxWeight)),
    });
  }
  return parcels;
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

