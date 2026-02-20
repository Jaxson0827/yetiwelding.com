export type FreightZone = 'Zone1_local' | 'Zone2_west' | 'Zone3_central' | 'Zone4_east';

export type FreightDeliveryType = 'commercial' | 'residential';

export type GateFreightTier = 'GateTierA' | 'GateTierB' | 'GateTierC' | 'GateTierD';
export type PergolaFreightTier = 'PergolaTierA' | 'PergolaTierB' | 'PergolaTierC' | 'PergolaTierD';
export type EmbedFreightTier =
  | 'EmbedFreightTier1'
  | 'EmbedFreightTier2'
  | 'EmbedFreightTier3'
  | 'EmbedFreightTier4';

export type FreightKind = 'gate' | 'embeds' | 'pergola' | 'mixed';

export type FreightInputs = {
  deliveryType?: FreightDeliveryType;
  liftgateRequired?: boolean;
};

export const FREIGHT_ORIGIN_ZIP = '84663';

export const FREIGHT_ADDONS_USD = {
  residentialFeeUsd: 95,
  liftgateFeeUsd: 85,
} as const;

export const FREIGHT_RATE_TABLE_USD: Readonly<
  Record<
    FreightZone,
    {
      gate: Record<GateFreightTier, number>;
      pergola: Record<PergolaFreightTier, number>;
      embeds: Record<EmbedFreightTier, number>;
    }
  >
> = {
  Zone1_local: {
    gate: { GateTierA: 220, GateTierB: 260, GateTierC: 320, GateTierD: 390 },
    pergola: { PergolaTierA: 800, PergolaTierB: 950, PergolaTierC: 1100, PergolaTierD: 1300 },
    embeds: {
      EmbedFreightTier1: 180,
      EmbedFreightTier2: 240,
      EmbedFreightTier3: 310,
      EmbedFreightTier4: 380,
    },
  },
  Zone2_west: {
    gate: { GateTierA: 280, GateTierB: 330, GateTierC: 400, GateTierD: 490 },
    pergola: { PergolaTierA: 1000, PergolaTierB: 1200, PergolaTierC: 1400, PergolaTierD: 1650 },
    embeds: {
      EmbedFreightTier1: 230,
      EmbedFreightTier2: 300,
      EmbedFreightTier3: 380,
      EmbedFreightTier4: 470,
    },
  },
  Zone3_central: {
    gate: { GateTierA: 320, GateTierB: 380, GateTierC: 460, GateTierD: 560 },
    pergola: { PergolaTierA: 1150, PergolaTierB: 1380, PergolaTierC: 1600, PergolaTierD: 1900 },
    embeds: {
      EmbedFreightTier1: 260,
      EmbedFreightTier2: 340,
      EmbedFreightTier3: 430,
      EmbedFreightTier4: 540,
    },
  },
  Zone4_east: {
    gate: { GateTierA: 390, GateTierB: 460, GateTierC: 560, GateTierD: 690 },
    pergola: { PergolaTierA: 1400, PergolaTierB: 1680, PergolaTierC: 1950, PergolaTierD: 2300 },
    embeds: {
      EmbedFreightTier1: 310,
      EmbedFreightTier2: 410,
      EmbedFreightTier3: 520,
      EmbedFreightTier4: 650,
    },
  },
} as const;

const ZONE1_LOCAL_STATES = new Set(['UT', 'ID', 'WY', 'CO', 'NV', 'AZ', 'NM']);
const ZONE2_WEST_STATES = new Set(['CA', 'OR', 'WA']);
const ZONE4_EAST_STATES = new Set([
  'ME',
  'NH',
  'VT',
  'MA',
  'RI',
  'CT',
  'NY',
  'NJ',
  'PA',
  'DE',
  'MD',
  'DC',
  'VA',
  'WV',
  'NC',
  'SC',
  'GA',
  'FL',
]);

export function normalizeStateCode(state: string | undefined | null): string {
  return String(state || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 2);
}

export function getFreightZoneFromState(state: string | undefined | null): FreightZone {
  const code = normalizeStateCode(state);
  if (ZONE1_LOCAL_STATES.has(code)) return 'Zone1_local';
  if (ZONE2_WEST_STATES.has(code)) return 'Zone2_west';
  if (ZONE4_EAST_STATES.has(code)) return 'Zone4_east';
  return 'Zone3_central';
}

export function getGateFreightTierFromWidthFt(widthFt: number): GateFreightTier {
  const w = Number.isFinite(widthFt) ? widthFt : 0;
  if (w <= 4) return 'GateTierA';
  if (w <= 6) return 'GateTierB';
  if (w <= 8) return 'GateTierC';
  return 'GateTierD';
}

/**
 * Pergola tiers by max dimension (span or depth in feet).
 * 12×12, 12×16, 12×20 map to A/B/C; custom larger to D.
 */
export function getPergolaFreightTierFromMaxDimensionFt(maxFt: number): PergolaFreightTier {
  const w = Number.isFinite(maxFt) ? maxFt : 0;
  if (w <= 12) return 'PergolaTierA';
  if (w <= 16) return 'PergolaTierB';
  if (w <= 20) return 'PergolaTierC';
  return 'PergolaTierD';
}

export function getEmbedFreightTierFromWeightLb(weightLb: number): EmbedFreightTier {
  const w = Number.isFinite(weightLb) ? weightLb : 0;
  if (w <= 300) return 'EmbedFreightTier1';
  if (w <= 600) return 'EmbedFreightTier2';
  if (w <= 1000) return 'EmbedFreightTier3';
  return 'EmbedFreightTier4';
}

export function calculateFreightUsd(params: {
  zone: FreightZone;
  kind: FreightKind;
  tier: GateFreightTier | EmbedFreightTier | PergolaFreightTier;
  freight?: FreightInputs;
}): {
  baseUsd: number;
  addons: { residentialFeeUsd: number; liftgateFeeUsd: number };
  addonsUsd: number;
  totalUsd: number;
} {
  const zoneTable = FREIGHT_RATE_TABLE_USD[params.zone];
  let baseUsd: number;
  if (params.kind === 'gate') {
    baseUsd = zoneTable.gate[params.tier as GateFreightTier];
  } else if (params.kind === 'pergola') {
    baseUsd = zoneTable.pergola[params.tier as PergolaFreightTier];
  } else {
    baseUsd = zoneTable.embeds[params.tier as EmbedFreightTier];
  }

  const deliveryType = params.freight?.deliveryType;
  const liftgateRequired = !!params.freight?.liftgateRequired;

  const addons = {
    residentialFeeUsd: deliveryType === 'residential' ? FREIGHT_ADDONS_USD.residentialFeeUsd : 0,
    liftgateFeeUsd: liftgateRequired ? FREIGHT_ADDONS_USD.liftgateFeeUsd : 0,
  };

  const addonsUsd = addons.residentialFeeUsd + addons.liftgateFeeUsd;
  const totalUsd = Math.max(0, baseUsd + addonsUsd);

  return { baseUsd, addons, addonsUsd, totalUsd };
}

