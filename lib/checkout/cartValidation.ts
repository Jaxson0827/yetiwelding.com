import type { EmbedSpec } from '@/lib/steelEmbeds/types';
import type { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import { validateEmbedSpec, isEmbedSpecComplete } from '@/lib/steelEmbeds/validation';
import { validateDumpsterGateConfig } from '@/lib/dumpsterGates/validation';

export type CartProductType = 'steel-plate-embeds' | 'dumpster-gate';

export type CartItem = {
  id: string;
  productType: CartProductType;
  configuration: EmbedSpec | DumpsterGateConfig;
  price?: number; // client-controlled; ignored server-side
  isCustomFabrication?: boolean;
};

export type CartValidationError = { itemId?: string; field: string; message: string };

function clampInt(n: unknown, min: number, max: number): number {
  const parsed = typeof n === 'number' ? n : Number(n);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}

export function normalizeAndValidateCartItems(items: unknown): {
  ok: boolean;
  normalizedItems: CartItem[];
  errors: CartValidationError[];
} {
  const errors: CartValidationError[] = [];
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, normalizedItems: [], errors: [{ field: 'items', message: 'Cart items are required' }] };
  }

  const normalizedItems: CartItem[] = items.map((raw: any) => {
    const productType = raw?.productType as CartProductType;
    if (productType === 'steel-plate-embeds') {
      const cfg = { ...(raw?.configuration as EmbedSpec) };
      cfg.quantity = clampInt(cfg.quantity, 1, 999);
      return { ...raw, productType, configuration: cfg } as CartItem;
    }
    if (productType === 'dumpster-gate') {
      const cfg = { ...(raw?.configuration as DumpsterGateConfig) };
      cfg.quantity = clampInt(cfg.quantity, 1, 999);
      return { ...raw, productType, configuration: cfg } as CartItem;
    }
    return raw as CartItem;
  });

  for (const item of normalizedItems) {
    if (!item?.id || typeof item.id !== 'string') {
      errors.push({ field: 'id', message: 'Cart item id is required' });
      continue;
    }
    if (item.productType === 'steel-plate-embeds') {
      const cfg = item.configuration as Partial<EmbedSpec>;
      const specErrors = validateEmbedSpec(cfg);
      for (const e of specErrors) {
        errors.push({ itemId: item.id, field: e.field, message: e.message });
      }
      if (!isEmbedSpecComplete(cfg)) {
        errors.push({ itemId: item.id, field: 'spec', message: 'Embed specification is incomplete' });
      }
    } else if (item.productType === 'dumpster-gate') {
      const gateErrors = validateDumpsterGateConfig(item.configuration as any);
      for (const e of gateErrors) {
        errors.push({ itemId: item.id, field: e.field, message: e.message });
      }
    } else {
      errors.push({ itemId: item.id, field: 'productType', message: 'Invalid product type' });
    }
  }

  return { ok: errors.length === 0, normalizedItems, errors };
}

