import type { PergolaConfig } from './types';

export interface StandardKit {
  slug: string;
  name: string;
  config: PergolaConfig;
  leadWeeks: [number, number];
}

export const STANDARD_KITS: StandardKit[] = [
  {
    slug: 'patio-pro-12x12',
    name: 'Patio Pro 12×12',
    config: { span: 12, depth: 12, height: 10, colorId: 'black', roofDesignId: 'palmleaf' },
    leadWeeks: [3, 5],
  },
  {
    slug: 'patio-pro-12x16',
    name: 'Patio Pro 12×16',
    config: { span: 12, depth: 16, height: 10, colorId: 'black', roofDesignId: 'palmleaf' },
    leadWeeks: [3, 5],
  },
  {
    slug: 'patio-pro-12x20',
    name: 'Patio Pro 12×20',
    config: { span: 12, depth: 20, height: 10, colorId: 'black', roofDesignId: 'palmleaf' },
    leadWeeks: [3, 5],
  },
];

export function getKitBySlug(slug: string): StandardKit | undefined {
  return STANDARD_KITS.find((k) => k.slug === slug);
}

function isClose(a: number | undefined, b: number | undefined): boolean {
  return Math.abs((a ?? 0) - (b ?? 0)) < 1e-3;
}

export function isConfigEqual(a: Partial<PergolaConfig> | null, b: Partial<PergolaConfig> | null): boolean {
  if (!a || !b) return false;
  return (
    isClose(a.span, b.span) &&
    isClose(a.depth, b.depth) &&
    isClose(a.height, b.height) &&
    String(a.colorId ?? '') === String(b.colorId ?? '') &&
    String(a.roofDesignId ?? '') === String(b.roofDesignId ?? '')
  );
}

export function buyEligibleForConfig(cfg: PergolaConfig): { eligible: boolean; kit: StandardKit | null } {
  const match = STANDARD_KITS.find(
    (k) =>
      Number(k.config.span) === Number(cfg.span) &&
      Number(k.config.depth) === Number(cfg.depth) &&
      Number(k.config.height) === Number(cfg.height)
  );
  return match ? { eligible: true, kit: match } : { eligible: false, kit: null };
}

export function configFromSlug(slug: string): PergolaConfig | null {
  const k = getKitBySlug(slug);
  return k ? k.config : null;
}

export function leadWeeksForSlug(slug: string): [number, number] {
  const k = getKitBySlug(slug);
  return k?.leadWeeks ?? [3, 5];
}

export function kitName(slug: string): string {
  const k = getKitBySlug(slug);
  return k?.name ?? 'Shade Kit';
}
