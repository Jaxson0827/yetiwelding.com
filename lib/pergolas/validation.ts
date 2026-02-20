import type { PergolaConfig } from './types';
import { VALID_HEIGHTS } from './types';
import { COLORS } from './colors';
import { ROOF_DESIGNS } from './panels';

export interface ValidationError {
  field: string;
  message: string;
}

const MIN_SPAN = 8;
const MAX_SPAN = 24;
const MIN_DEPTH = 8;
const MAX_DEPTH = 30;

export function validatePergolaConfig(config: Partial<PergolaConfig> | null): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!config) {
    errors.push({ field: 'config', message: 'Configuration is required' });
    return errors;
  }

  const span = Number(config.span);
  const depth = Number(config.depth);
  const height = Number(config.height);

  if (span === undefined || isNaN(span)) {
    errors.push({ field: 'span', message: 'Span is required' });
  } else if (span < MIN_SPAN || span > MAX_SPAN) {
    errors.push({ field: 'span', message: `Span must be between ${MIN_SPAN} and ${MAX_SPAN} ft` });
  }

  if (depth === undefined || isNaN(depth)) {
    errors.push({ field: 'depth', message: 'Depth is required' });
  } else if (depth < MIN_DEPTH || depth > MAX_DEPTH) {
    errors.push({ field: 'depth', message: `Depth must be between ${MIN_DEPTH} and ${MAX_DEPTH} ft` });
  }

  if (height === undefined || isNaN(height)) {
    errors.push({ field: 'height', message: 'Height is required' });
  } else if (!VALID_HEIGHTS.includes(height as 8 | 10 | 12)) {
    errors.push({ field: 'height', message: `Height must be 8, 10, or 12 ft` });
  }

  const colorId = config.colorId;
  if (!colorId) {
    errors.push({ field: 'colorId', message: 'Color is required' });
  } else if (!COLORS.some((c) => c.id === colorId)) {
    const valid = COLORS.map((c) => c.id).join(', ');
    errors.push({ field: 'colorId', message: `Color must be one of: ${valid}` });
  }

  const roofDesignId = config.roofDesignId;
  if (!roofDesignId) {
    errors.push({ field: 'roofDesignId', message: 'Roof design is required' });
  } else if (!ROOF_DESIGNS.some((d) => d.id === roofDesignId)) {
    const valid = ROOF_DESIGNS.map((d) => d.id).join(', ');
    errors.push({ field: 'roofDesignId', message: `Roof design must be one of: ${valid}` });
  }

  const qty = config.quantity ?? 1;
  if (qty < 1 || qty > 999) {
    errors.push({ field: 'quantity', message: 'Quantity must be between 1 and 999' });
  }

  return errors;
}

export function isPergolaConfigComplete(config: Partial<PergolaConfig> | null): boolean {
  if (!config) return false;
  const errors = validatePergolaConfig(config);
  return errors.length === 0;
}
