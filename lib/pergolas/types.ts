/**
 * Pergola configuration for the builder/configurator.
 */
export interface PergolaConfig {
  span: number; // ft
  depth: number; // ft
  height: number; // ft (8, 10, or 12)
  colorId: string; // black | white | bronze | charcoal | sand | hdg
  roofDesignId: string; // palmleaf | geocell | geostar
  quantity?: number; // default 1
}

export const VALID_HEIGHTS = [8, 10, 12] as const;
export const VALID_COLOR_IDS = ['black', 'white', 'bronze', 'charcoal', 'sand', 'hdg'] as const;
export const VALID_ROOF_DESIGN_IDS = ['palmleaf', 'geocell', 'geostar'] as const;

/**
 * Generate a deterministic cart key for a pergola config.
 */
export function getCartKey(config: PergolaConfig): string {
  const qty = config.quantity ?? 1;
  return `pergola-${config.span}-${config.depth}-${config.height}-${config.colorId}-${config.roofDesignId}-${qty}`;
}
