import type { DumpsterGateConfig, Finish, MountingOption, PowderCoatColor } from './types';
import { MAX_HEIGHT_FT, MIN_HEIGHT_FT } from './types';
import { formatDimension, getSlopeDiffIn, isSlopeWithinTolerance } from './validation';

export const FINISH_LABELS: Record<Finish, string> = {
  'raw-steel': 'Raw steel',
  'prime-painted': 'Primed',
  'powder-coat-black': 'Powder coat',
  galvanized: 'Galvanized',
};

export const POWDER_COAT_LABELS: Record<PowderCoatColor, string> = {
  black: 'Black',
  white: 'White',
  gray: 'Gray',
  red: 'Red',
  blue: 'Blue',
  green: 'Green',
  bronze: 'Bronze',
};

export const MOUNTING_LABELS: Record<MountingOption, string> = {
  'with-posts': 'Steel posts included',
  'gate-only': 'Gate only',
};

/** "Powder coat, black" / "Primed" */
export function getFinishLabel(config: Pick<DumpsterGateConfig, 'finish' | 'powderCoatColor'>): string {
  if (config.finish === 'powder-coat-black') {
    const color = POWDER_COAT_LABELS[config.powderCoatColor || 'black'];
    return `Powder coat, ${color.toLowerCase()}`;
  }
  return FINISH_LABELS[config.finish];
}

export function getMaxWallHeightFt(config: Pick<DumpsterGateConfig, 'leftHeightFt' | 'rightHeightFt'>): number {
  return Math.max(config.leftHeightFt, config.rightHeightFt);
}

/** Gate height = tallest wall minus the bottom gap. */
export function getGateHeightFt(
  config: Pick<DumpsterGateConfig, 'leftHeightFt' | 'rightHeightFt' | 'bottomGapIn'>
): number {
  return Math.max(0, getMaxWallHeightFt(config) - config.bottomGapIn / 12);
}

/** One-line summary used in cart, checkout, Stripe and emails. */
export function getGateSummaryLine(config: DumpsterGateConfig): string {
  const parts = [
    `${formatDimension(config.enclosureLengthFt)} enclosure`,
    `${formatDimension(getGateHeightFt(config))} tall gate`,
    'double swing',
    getFinishLabel(config).toLowerCase(),
    config.mounting === 'with-posts' ? 'with posts' : 'gate only',
  ];
  return parts.join(', ');
}

/** Why a configuration has to go to a quote instead of checkout. Empty array = can be bought online. */
export function getGateQuoteReasons(
  config: Pick<DumpsterGateConfig, 'finish' | 'powderCoatColor' | 'leftHeightFt' | 'rightHeightFt' | 'bottomGapIn'>
): string[] {
  const reasons: string[] = [];
  const gateHeightFt = getGateHeightFt(config);
  if (gateHeightFt > MAX_HEIGHT_FT + 1e-6) {
    reasons.push(`Gates taller than ${MAX_HEIGHT_FT}' are quoted. This one would be ${formatDimension(gateHeightFt)}.`);
  } else if (gateHeightFt < MIN_HEIGHT_FT - 1e-6) {
    reasons.push(`Gates shorter than ${MIN_HEIGHT_FT}' are quoted. This one would be ${formatDimension(gateHeightFt)}.`);
  }
  if (config.finish === 'powder-coat-black' && (config.powderCoatColor || 'black') !== 'black') {
    reasons.push('Powder coat colors other than black are quoted.');
  }
  if (!isSlopeWithinTolerance(config.leftHeightFt, config.rightHeightFt, 3)) {
    const diff = Math.round(getSlopeDiffIn(config.leftHeightFt, config.rightHeightFt));
    reasons.push(`Your wall heights differ by ${diff}". We quote anything over 3" so we can plan for the slope.`);
  }
  return reasons;
}
