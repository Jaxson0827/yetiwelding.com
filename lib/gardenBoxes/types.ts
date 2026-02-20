/**
 * Garden box configuration for the bolt-together steel raised bed builder.
 */
export type GardenBoxSize = '4x2' | '6x3' | '8x4';
export type GardenBoxHeight = 12 | 18 | 24 | 30; // inches
export type GardenBoxFinish = 'raw' | 'powder-black' | 'powder-bronze' | 'corten';

export interface GardenBoxAddOns {
  bottomPlate?: boolean;
  cornerCaps?: boolean;
  trellis?: boolean;
  drainHoles?: boolean;
  irrigationPassThrough?: boolean;
}

export interface GardenBoxConfig {
  size: GardenBoxSize;
  height: GardenBoxHeight;
  finish: GardenBoxFinish;
  addOns: GardenBoxAddOns;
  quantity?: number;
}

export const GARDEN_BOX_SIZES: { id: GardenBoxSize; label: string; lengthFt: number; widthFt: number }[] = [
  { id: '4x2', label: "4' × 2'", lengthFt: 4, widthFt: 2 },
  { id: '6x3', label: "6' × 3'", lengthFt: 6, widthFt: 3 },
  { id: '8x4', label: "8' × 4'", lengthFt: 8, widthFt: 4 },
];

export const GARDEN_BOX_HEIGHTS: GardenBoxHeight[] = [12, 18, 24, 30];

export const GARDEN_BOX_FINISHES: { id: GardenBoxFinish; label: string; hex?: string }[] = [
  { id: 'raw', label: 'Raw steel', hex: '#6b7280' },
  { id: 'powder-black', label: 'Powder coated black', hex: '#1f2937' },
  { id: 'powder-bronze', label: 'Powder coated bronze', hex: '#92400e' },
  { id: 'corten', label: 'Weathering steel (Corten)', hex: '#b45309' },
];

export const GARDEN_BOX_ADD_ON_IDS = [
  'bottomPlate',
  'cornerCaps',
  'trellis',
  'drainHoles',
  'irrigationPassThrough',
] as const;

export type GardenBoxAddOnId = (typeof GARDEN_BOX_ADD_ON_IDS)[number];

export const GARDEN_BOX_ADD_ON_LABELS: Record<GardenBoxAddOnId, string> = {
  bottomPlate: 'Bottom plate (for patios)',
  cornerCaps: 'Corner caps',
  trellis: 'Integrated trellis',
  drainHoles: 'Drain holes',
  irrigationPassThrough: 'Irrigation pass-through',
};

/**
 * Get dimensions in feet for a size.
 */
export function getDimensionsFt(size: GardenBoxSize): { lengthFt: number; widthFt: number } {
  const s = GARDEN_BOX_SIZES.find((x) => x.id === size);
  return s ? { lengthFt: s.lengthFt, widthFt: s.widthFt } : { lengthFt: 4, widthFt: 2 };
}

/**
 * Generate a deterministic cart key for a garden box config.
 */
export function getCartKey(config: GardenBoxConfig): string {
  const qty = config.quantity ?? 1;
  const addOnStr = GARDEN_BOX_ADD_ON_IDS.map((id) => (config.addOns?.[id] ? '1' : '0')).join('');
  return `garden-box-${config.size}-${config.height}-${config.finish}-${addOnStr}-${qty}`;
}
