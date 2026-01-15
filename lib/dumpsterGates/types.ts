export type GateSize = '10x6' | '12x6' | '14x6' | '16x6' | '18x6' | 'custom';
export type GateStyle = 'double-swing' | 'single-swing-left' | 'single-swing-right';
export type Finish = 'raw-steel' | 'prime-painted' | 'powder-coat-black' | 'galvanized';
export type MountingOption = 'with-posts' | 'gate-only';

// Validation constants
export const MIN_WIDTH_FT = 8;
export const MAX_WIDTH_FT = 20;
export const MIN_HEIGHT_FT = 5;
export const MAX_HEIGHT_FT = 8;
export const MAX_SINGLE_SWING_WIDTH_FT = 14;

// Structured dimension map to prevent string parsing and math bugs
export const GATE_DIMENSIONS = {
  '10x6': { widthFt: 10, heightFt: 6 },
  '12x6': { widthFt: 12, heightFt: 6 },
  '14x6': { widthFt: 14, heightFt: 6 },
  '16x6': { widthFt: 16, heightFt: 6 },
  '18x6': { widthFt: 18, heightFt: 6 },
} as const;

export interface DumpsterGateConfig {
  size: GateSize;
  style: GateStyle;
  finish: Finish;
  mounting: MountingOption;
  quantity: number;
  isCustom: boolean;
  widthFt: number;  // Numeric width in feet (for all sizes, not just custom)
  heightFt: number; // Numeric height in feet (for all sizes, not just custom)
}

export interface DimensionDisplay {
  overallWidth: string;  // e.g., "14'"
  overallHeight: string; // e.g., "6'"
  leafWidth: string;     // e.g., "7'" (or "14'" for single swing)
  groundClearance: string; // Fixed: "2\""
}

// Helper to generate deterministic cart key
export function getCartKey(config: DumpsterGateConfig): string {
  if (config.isCustom) {
    // Include dimensions in key for custom sizes
    return `dumpster-gate-custom-${config.widthFt.toFixed(2)}-${config.heightFt.toFixed(2)}-${config.style}-${config.finish}-${config.mounting}`;
  }
  return `dumpster-gate-${config.size}-${config.style}-${config.finish}-${config.mounting}`;
}

export interface PriceBreakdown {
  unitPrice: number;
  totalPrice: number; // unitPrice * quantity
  lineItems: PriceLineItem[];
  leadTime: string;
}

export interface PriceLineItem {
  label: string;
  amount: number;
}

