/**
 * Quote draft storage and formatting for quote-only mode.
 * Stores product configuration in sessionStorage and formats it for the contact form message.
 */

export const QUOTE_DRAFT_KEY = 'yeti-welding-quote-draft';

export type QuoteProductType = 'steel-plate-embeds' | 'dumpster-gate' | 'pergola' | 'garden-box';

export interface QuoteDraft {
  productType: QuoteProductType;
  configuration: unknown;
  priceSummary: {
    totalPrice?: number;
    unitPrice?: number;
    leadTime?: string;
  };
}

export function saveQuoteDraft(
  productType: QuoteProductType,
  configuration: unknown,
  priceSummary: QuoteDraft['priceSummary']
): void {
  if (typeof window === 'undefined') return;
  const draft: QuoteDraft = { productType, configuration, priceSummary };
  sessionStorage.setItem(QUOTE_DRAFT_KEY, JSON.stringify(draft));
}

export function loadQuoteDraft(): QuoteDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(QUOTE_DRAFT_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as QuoteDraft;
  } catch {
    return null;
  }
}

export function clearQuoteDraft(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(QUOTE_DRAFT_KEY);
}

/**
 * Format a quote draft into human-readable text for the contact form message.
 */
export function formatQuoteDraftForMessage(draft: QuoteDraft): string {
  const lines: string[] = [];
  lines.push(`--- Quote Request: ${getProductLabel(draft.productType)} ---`);
  lines.push('');

  switch (draft.productType) {
    case 'dumpster-gate':
      lines.push(formatDumpsterGate(draft.configuration));
      break;
    case 'steel-plate-embeds':
      lines.push(formatSteelEmbed(draft.configuration));
      break;
    case 'pergola':
      lines.push(formatPergola(draft.configuration));
      break;
    case 'garden-box':
      lines.push(formatGardenBox(draft.configuration));
      break;
    default:
      lines.push(JSON.stringify(draft.configuration, null, 2));
  }

  const includeEstimatedTotal =
    draft.productType !== 'dumpster-gate' && draft.priceSummary.totalPrice != null;

  if (includeEstimatedTotal || draft.priceSummary.leadTime) {
    lines.push('');
  }
  if (includeEstimatedTotal) {
    lines.push(`Estimated total: $${draft.priceSummary.totalPrice!.toFixed(2)}`);
  }
  if (draft.priceSummary.leadTime) {
    lines.push(`Lead time: ${draft.priceSummary.leadTime}`);
  }

  lines.push('');
  lines.push('---');
  return lines.join('\n');
}

function getProductLabel(productType: QuoteProductType): string {
  const labels: Record<QuoteProductType, string> = {
    'steel-plate-embeds': 'Steel Plate Embeds',
    'dumpster-gate': 'Dumpster Gate',
    pergola: 'Pergola',
    'garden-box': 'Garden Box',
  };
  return labels[productType] ?? productType;
}

function formatDumpsterGate(config: unknown): string {
  const c = config as {
    enclosureLengthFt?: number;
    leftHeightFt?: number;
    rightHeightFt?: number;
    style?: string;
    finish?: string;
    powderCoatColor?: string;
    mounting?: string;
    quantity?: number;
  };
  const parts: string[] = [];
  if (c.enclosureLengthFt != null) {
    parts.push(`Enclosure: ${c.enclosureLengthFt}'`);
  }
  if (c.leftHeightFt != null && c.rightHeightFt != null) {
    parts.push(`Block heights: ${c.leftHeightFt}' left, ${c.rightHeightFt}' right`);
  }
  if (c.style) {
    const styleLabel =
      c.style === 'double-swing'
        ? 'Double Swing'
        : c.style === 'single-swing-left'
          ? 'Single Swing (Left)'
          : c.style === 'single-swing-right'
            ? 'Single Swing (Right)'
            : c.style;
    parts.push(`Style: ${styleLabel}`);
  }
  if (c.finish) {
    const finishLabel =
      c.finish === 'prime-painted'
        ? 'Prime Painted'
        : c.finish === 'powder-coat-black'
          ? `Powder Coat${c.powderCoatColor ? ` (${c.powderCoatColor})` : ''}`
          : c.finish === 'galvanized'
            ? 'Galvanized'
            : c.finish === 'raw-steel'
              ? 'Raw Steel'
              : c.finish;
    parts.push(`Finish: ${finishLabel}`);
  }
  if (c.mounting) {
    parts.push(`Mounting: ${c.mounting === 'with-posts' ? 'Includes Posts' : 'Gate Only'}`);
  }
  if (c.quantity && c.quantity > 1) {
    parts.push(`Quantity: ${c.quantity}`);
  }
  return parts.join('\n') || 'Dumpster gate configuration';
}

function formatSteelEmbed(config: unknown): string {
  const c = config as {
    plate?: { length?: number; width?: number; thickness?: number; material?: string };
    studs?: { positions?: unknown[] };
    finish?: string;
    quantity?: number;
  };
  const parts: string[] = [];
  if (c.plate) {
    const p = c.plate;
    parts.push(
      `Plate: ${p.length ?? 0}" × ${p.width ?? 0}" × ${p.thickness ?? 0}" (${p.material ?? 'A36'})`
    );
  }
  if (c.studs?.positions?.length) {
    parts.push(`Studs: ${c.studs.positions.length} positions`);
  }
  if (c.finish) {
    const f =
      c.finish === 'none' ? 'None' : c.finish === 'primer' ? 'Primer' : c.finish === 'galv' ? 'Galvanized' : c.finish;
    parts.push(`Finish: ${f}`);
  }
  if (c.quantity && c.quantity > 1) {
    parts.push(`Quantity: ${c.quantity}`);
  }
  return parts.join('\n') || 'Steel embed configuration';
}

function formatPergola(config: unknown): string {
  const c = config as {
    span?: number;
    depth?: number;
    height?: number;
    colorId?: string;
    roofDesignId?: string;
    quantity?: number;
  };
  const parts: string[] = [];
  if (c.span != null && c.depth != null) {
    parts.push(`Size: ${c.span}' × ${c.depth}'`);
  }
  if (c.height != null) {
    parts.push(`Height: ${c.height}'`);
  }
  if (c.colorId) {
    parts.push(`Color: ${c.colorId}`);
  }
  if (c.roofDesignId) {
    const roof =
      c.roofDesignId === 'palmleaf'
        ? 'Palm Leaf'
        : c.roofDesignId === 'geocell'
          ? 'Geocell'
          : c.roofDesignId === 'geostar'
            ? 'Geostar'
            : c.roofDesignId;
    parts.push(`Roof: ${roof}`);
  }
  if (c.quantity && c.quantity > 1) {
    parts.push(`Quantity: ${c.quantity}`);
  }
  return parts.join('\n') || 'Pergola configuration';
}

function formatGardenBox(config: unknown): string {
  const c = config as {
    size?: string;
    height?: number;
    finish?: string;
    addOns?: Record<string, boolean>;
    quantity?: number;
  };
  const parts: string[] = [];
  if (c.size) {
    parts.push(`Size: ${c.size}`);
  }
  if (c.height != null) {
    parts.push(`Height: ${c.height}"`);
  }
  if (c.finish) {
    const f =
      c.finish === 'raw'
        ? 'Raw steel'
        : c.finish === 'powder-black'
          ? 'Powder coated black'
          : c.finish === 'powder-bronze'
            ? 'Powder coated bronze'
            : c.finish === 'corten'
              ? 'Weathering steel (Corten)'
              : c.finish;
    parts.push(`Finish: ${f}`);
  }
  if (c.addOns) {
    const addOns = Object.entries(c.addOns)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (addOns.length > 0) {
      parts.push(`Add-ons: ${addOns.join(', ')}`);
    }
  }
  if (c.quantity && c.quantity > 1) {
    parts.push(`Quantity: ${c.quantity}`);
  }
  return parts.join('\n') || 'Garden box configuration';
}
