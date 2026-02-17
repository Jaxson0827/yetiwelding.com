import type { EmbedSpec } from './types';

/**
 * Deterministic SKU-like key for an embed configuration.
 * This is NOT a public SKU; it is used internally for reporting/ops.
 */
export function getEmbedCartKey(spec: EmbedSpec): string {
  const studsCount = spec.studs?.positions?.length || 0;
  // Round dimensions to reasonable precision to keep keys stable.
  const plate = spec.plate;
  const length = Number(plate.length.toFixed(3));
  const width = Number(plate.width.toFixed(3));
  const thickness = Number(plate.thickness.toFixed(4));
  const finish = spec.finish || 'none';
  const leadTime = spec.leadTime || 'standard';

  return [
    'steel-plate-embed',
    `L${length}`,
    `W${width}`,
    `T${thickness}`,
    `MAT${plate.material}`,
    `FIN${finish}`,
    `STUDS${studsCount}`,
    `LT${leadTime}`,
  ].join('-');
}

