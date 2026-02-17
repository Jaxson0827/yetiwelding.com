import type { ShippingAddress, ShippingMethod, ShippingOption } from '@/lib/shipping/calculator';
import type { CartItem } from '@/contexts/CartContext';
import { estimateTotalDimensionsIn, estimateTotalWeightLb } from '@/lib/shipping/packaging';

type ShippoRate = {
  object_id: string;
  amount: string;
  currency: string;
  provider: string;
  servicelevel?: { name?: string; token?: string };
  estimated_days?: number | null;
  duration_terms?: string | null;
};

function pickCheapest(rates: ShippoRate[]): ShippoRate | null {
  const sorted = [...rates].sort((a, b) => Number(a.amount) - Number(b.amount));
  return sorted[0] || null;
}

function isExpedited(r: ShippoRate): boolean {
  const name = `${r.servicelevel?.name || ''} ${r.servicelevel?.token || ''}`.toLowerCase();
  if (typeof r.estimated_days === 'number' && r.estimated_days > 0 && r.estimated_days <= 3) return true;
  return (
    name.includes('express') ||
    name.includes('2day') ||
    name.includes('2-day') ||
    name.includes('overnight') ||
    name.includes('priority mail express')
  );
}

function isStandard(r: ShippoRate): boolean {
  const name = `${r.servicelevel?.name || ''} ${r.servicelevel?.token || ''}`.toLowerCase();
  return name.includes('ground') || name.includes('standard') || name.includes('priority mail') || name.includes('select');
}

function formatEstimatedDays(r: ShippoRate): string {
  if (typeof r.estimated_days === 'number' && r.estimated_days > 0) {
    return `${r.estimated_days}-${Math.max(r.estimated_days + 2, r.estimated_days)} business days`;
  }
  return 'Estimated at checkout';
}

function buildShipFromAddress(): any {
  const required = [
    'SHIP_FROM_NAME',
    'SHIP_FROM_STREET1',
    'SHIP_FROM_CITY',
    'SHIP_FROM_STATE',
    'SHIP_FROM_ZIP',
    'SHIP_FROM_COUNTRY',
  ];
  for (const k of required) {
    if (!process.env[k]) {
      throw new Error(`Missing env var ${k} (required for live shipping rates)`);
    }
  }
  return {
    name: process.env.SHIP_FROM_NAME,
    street1: process.env.SHIP_FROM_STREET1,
    street2: process.env.SHIP_FROM_STREET2 || undefined,
    city: process.env.SHIP_FROM_CITY,
    state: process.env.SHIP_FROM_STATE,
    zip: process.env.SHIP_FROM_ZIP,
    country: process.env.SHIP_FROM_COUNTRY,
    phone: process.env.SHIP_FROM_PHONE || undefined,
    email: process.env.SHIP_FROM_EMAIL || undefined,
  };
}

export async function getShippoShippingOptions(params: {
  items: CartItem[];
  address: ShippingAddress;
  preferredMethod?: ShippingMethod;
}): Promise<{
  options: ShippingOption[];
  selectedMethod: ShippingMethod;
  totalWeight: number;
  totalDimensions: { length: number; width: number; height: number };
}> {
  if (!process.env.SHIPPO_API_TOKEN) {
    throw new Error('SHIPPO_API_TOKEN not configured');
  }

  const totalWeight = estimateTotalWeightLb(params.items);
  const totalDimensions = estimateTotalDimensionsIn(params.items);

  const addressTo = {
    name: 'Customer',
    street1: params.address.street,
    city: params.address.city,
    state: params.address.state,
    zip: params.address.zip,
    country: params.address.country || 'US',
  };

  const shipmentBody = {
    async: false,
    address_from: buildShipFromAddress(),
    address_to: addressTo,
    parcels: [
      {
        length: String(Math.max(1, Math.round(totalDimensions.length))),
        width: String(Math.max(1, Math.round(totalDimensions.width))),
        height: String(Math.max(1, Math.round(totalDimensions.height))),
        distance_unit: 'in',
        weight: String(Math.max(1, Math.round(totalWeight))),
        mass_unit: 'lb',
      },
    ],
  };

  const resp = await fetch('https://api.goshippo.com/shipments/', {
    method: 'POST',
    headers: {
      Authorization: `ShippoToken ${process.env.SHIPPO_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shipmentBody),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Shippo rate request failed: ${resp.status} ${text}`);
  }

  const data = (await resp.json()) as any;
  const rates: ShippoRate[] = Array.isArray(data?.rates) ? data.rates : [];
  if (rates.length === 0) {
    throw new Error('No Shippo rates returned');
  }

  // Pick representative "standard" + "expedited" options.
  const standard = pickCheapest(rates.filter(isStandard)) || pickCheapest(rates);
  const expedited = pickCheapest(rates.filter(isExpedited)) || null;

  const options: ShippingOption[] = [];

  if (standard) {
    options.push({
      method: 'standard',
      name: `${standard.provider} ${standard.servicelevel?.name || 'Standard'}`,
      description: standard.duration_terms || 'Carrier shipping rate',
      cost: Math.max(0, Number(standard.amount)),
      estimatedDays: formatEstimatedDays(standard),
      provider: 'shippo',
      providerRateId: standard.object_id,
      carrier: standard.provider,
      service: standard.servicelevel?.name || null,
      estimatedDaysMin: typeof standard.estimated_days === 'number' ? standard.estimated_days : null,
      estimatedDaysMax: typeof standard.estimated_days === 'number' ? Math.max(standard.estimated_days + 2, standard.estimated_days) : null,
    } as any);
  }

  if (expedited) {
    options.push({
      method: 'expedited',
      name: `${expedited.provider} ${expedited.servicelevel?.name || 'Expedited'}`,
      description: expedited.duration_terms || 'Faster carrier shipping rate',
      cost: Math.max(0, Number(expedited.amount)),
      estimatedDays: formatEstimatedDays(expedited),
      provider: 'shippo',
      providerRateId: expedited.object_id,
      carrier: expedited.provider,
      service: expedited.servicelevel?.name || null,
      estimatedDaysMin: typeof expedited.estimated_days === 'number' ? expedited.estimated_days : null,
      estimatedDaysMax: typeof expedited.estimated_days === 'number' ? Math.max(expedited.estimated_days + 2, expedited.estimated_days) : null,
    } as any);
  }

  // Prefer requested method if available.
  let selectedMethod: ShippingMethod = params.preferredMethod || 'standard';
  if (!options.find((o) => o.method === selectedMethod)) {
    selectedMethod = options[0]?.method || 'standard';
  }

  return { options, selectedMethod, totalWeight, totalDimensions };
}

