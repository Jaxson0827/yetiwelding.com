import type { PergolaConfig } from './types';
import { buyEligibleForConfig } from './standardKits';

function toKey(str: string): string {
  return String(str).toLowerCase().replace(/[^a-z]/g, '');
}

function finishMultiplier(finish: string): number {
  const k = toKey(finish);
  if (k === 'hdg') return 1.22;
  if (k.includes('bronze')) return 1.04;
  return 1.0;
}

function finishFromColor(colorId: string): string {
  switch (colorId) {
    case 'black':
    case 'charcoal':
      return 'Black';
    case 'white':
      return 'White';
    case 'bronze':
    case 'sand':
      return 'Bronze';
    case 'hdg':
      return 'HDG';
    default:
      return 'Black';
  }
}

function estimatePosts(span: number, depth: number): number {
  let posts = 4;
  if (span > 18) posts += 2;
  if (depth > 18) posts += 2;
  return posts;
}

export interface PergolaPriceResult {
  unitPrice: number;
  totalPrice: number;
  budgetLow: number;
  budgetHigh: number;
  confidence: 'instant' | 'review';
  freightLow?: number;
  freightHigh?: number;
  breakdown?: {
    frame: number;
    infill: number;
    anchoring: number;
    posts: number;
  };
}

const FRAME_RATE_LOW = 22;
const FRAME_RATE_HIGH = 28;

/**
 * Compute pergola price. Uses Mono style, no infill, slab anchor.
 * Standard kits (12×12, 12×16, 12×20) get confidence 'instant'.
 * Custom configs get confidence 'review' (isCustomFabrication).
 */
export function pricePergola(config: Partial<PergolaConfig>, quantity = 1): PergolaPriceResult {
  const span = Number(config.span ?? 12);
  const depth = Number(config.depth ?? 12);
  const height = Number(config.height ?? 10);
  const finish = finishFromColor(config.colorId ?? 'black');

  const area = Math.max(1, span * depth);
  const posts = estimatePosts(span, depth);
  const mFinish = finishMultiplier(finish);

  const frameLow = area * FRAME_RATE_LOW * mFinish;
  const frameHigh = area * FRAME_RATE_HIGH * mFinish;
  const budgetLow = Math.round(frameLow);
  const budgetHigh = Math.round(frameHigh);

  const pallets = Math.max(1, Math.ceil(area / 120));
  const freightLow = Math.round(650 + pallets * 75);
  const freightHigh = Math.round(950 + pallets * 110);

  const unitPrice = Math.round((budgetLow + budgetHigh) / 2);
  const totalPrice = unitPrice * quantity;

  const { eligible } = buyEligibleForConfig({
    span,
    depth,
    height,
    colorId: config.colorId ?? 'black',
    roofDesignId: config.roofDesignId ?? 'palmleaf',
  });

  return {
    unitPrice,
    totalPrice,
    budgetLow,
    budgetHigh,
    confidence: eligible ? 'instant' : 'review',
    freightLow,
    freightHigh,
    breakdown: {
      frame: Math.round((frameLow + frameHigh) / 2),
      infill: 0,
      anchoring: 0,
      posts,
    },
  };
}

export function usd(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.round(n || 0));
}
