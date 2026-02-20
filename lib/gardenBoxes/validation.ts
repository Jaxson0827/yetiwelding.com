import type { GardenBoxConfig } from './types';
import { GARDEN_BOX_SIZES, GARDEN_BOX_HEIGHTS, GARDEN_BOX_FINISHES } from './types';

export interface ValidationError {
  field: string;
  message: string;
}

const VALID_SIZE_IDS = new Set(GARDEN_BOX_SIZES.map((s) => s.id));
const VALID_HEIGHTS = new Set(GARDEN_BOX_HEIGHTS);
const VALID_FINISH_IDS = new Set(GARDEN_BOX_FINISHES.map((f) => f.id));

export function validateGardenBoxConfig(config: Partial<GardenBoxConfig> | null): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!config) {
    errors.push({ field: 'config', message: 'Configuration is required' });
    return errors;
  }

  if (!config.size || !VALID_SIZE_IDS.has(config.size)) {
    errors.push({ field: 'size', message: 'Size is required and must be 4×2, 6×3, or 8×4' });
  }

  if (config.height === undefined || config.height === null || !VALID_HEIGHTS.has(config.height)) {
    errors.push({ field: 'height', message: 'Height must be 12", 18", 24", or 30"' });
  }

  if (!config.finish || !VALID_FINISH_IDS.has(config.finish)) {
    errors.push({ field: 'finish', message: 'Finish is required' });
  }

  const qty = config.quantity ?? 1;
  if (qty < 1 || qty > 99) {
    errors.push({ field: 'quantity', message: 'Quantity must be between 1 and 99' });
  }

  return errors;
}

export function isGardenBoxConfigComplete(config: Partial<GardenBoxConfig> | null): boolean {
  if (!config) return false;
  const errors = validateGardenBoxConfig(config);
  return errors.length === 0;
}
