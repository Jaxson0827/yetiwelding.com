export interface TaxAddress {
  state: string;
  zip?: string;
  country?: string;
}

export interface TaxCalculation {
  taxRate: number; // As decimal (e.g., 0.0625 for 6.25%)
  taxAmount: number;
  taxableAmount: number;
  isTaxExempt: boolean;
}

// State sales tax rates (as of 2024)
// These are general state rates - local taxes may apply
const STATE_TAX_RATES: Record<string, number> = {
  // States with no sales tax
  'AK': 0, // Alaska (local taxes may apply)
  'DE': 0, // Delaware
  'MT': 0, // Montana
  'NH': 0, // New Hampshire
  'OR': 0, // Oregon
  
  // States with sales tax
  'AL': 0.04, // Alabama (4% state + local)
  'AR': 0.065, // Arkansas (6.5% state + local)
  'AZ': 0.056, // Arizona (5.6% state + local)
  'CA': 0.0725, // California (7.25% base, varies by location)
  'CO': 0.029, // Colorado (2.9% state + local)
  'CT': 0.0635, // Connecticut (6.35%)
  'FL': 0.06, // Florida (6% state + local)
  'GA': 0.04, // Georgia (4% state + local)
  'HI': 0.04, // Hawaii (4% state + local)
  'IA': 0.06, // Iowa (6% state + local)
  'ID': 0.06, // Idaho (6% state + local)
  'IL': 0.0625, // Illinois (6.25% state + local)
  'IN': 0.07, // Indiana (7% state)
  'KS': 0.065, // Kansas (6.5% state + local)
  'KY': 0.06, // Kentucky (6% state)
  'LA': 0.0445, // Louisiana (4.45% state + local)
  'MA': 0.0625, // Massachusetts (6.25%)
  'MD': 0.06, // Maryland (6% state)
  'ME': 0.055, // Maine (5.5%)
  'MI': 0.06, // Michigan (6% state)
  'MN': 0.06875, // Minnesota (6.875% state + local)
  'MO': 0.04225, // Missouri (4.225% state + local)
  'MS': 0.07, // Mississippi (7% state + local)
  'NC': 0.0475, // North Carolina (4.75% state + local)
  'ND': 0.05, // North Dakota (5% state + local)
  'NE': 0.055, // Nebraska (5.5% state + local)
  'NJ': 0.06625, // New Jersey (6.625% state)
  'NM': 0.05125, // New Mexico (5.125% state + local)
  'NV': 0.0685, // Nevada (6.85% state + local)
  'NY': 0.04, // New York (4% state + local)
  'OH': 0.0575, // Ohio (5.75% state + local)
  'OK': 0.045, // Oklahoma (4.5% state + local)
  'PA': 0.06, // Pennsylvania (6% state + local)
  'RI': 0.07, // Rhode Island (7%)
  'SC': 0.06, // South Carolina (6% state + local)
  'SD': 0.045, // South Dakota (4.5% state + local)
  'TN': 0.07, // Tennessee (7% state + local)
  'TX': 0.0625, // Texas (6.25% state + local)
  'UT': 0.061, // Utah (6.1% state + local)
  'VA': 0.053, // Virginia (5.3% state + local)
  'VT': 0.06, // Vermont (6% state + local)
  'WA': 0.065, // Washington (6.5% state + local)
  'WI': 0.05, // Wisconsin (5% state + local)
  'WV': 0.06, // West Virginia (6% state + local)
  'WY': 0.04, // Wyoming (4% state + local)
  'DC': 0.06, // District of Columbia (6%)
};

// States where manufacturing/custom fabrication may be tax-exempt
// This is a simplified check - actual tax exemption requires proper documentation
const POTENTIALLY_TAX_EXEMPT_STATES = [
  'UT', // Utah - manufacturing equipment may be exempt
  'TX', // Texas - manufacturing equipment may be exempt
  'CA', // California - manufacturing equipment may be exempt
];

// Items that may be tax-exempt (custom fabrication/manufacturing)
const TAX_EXEMPT_PRODUCT_TYPES = [
  'steel-plate-embeds', // Custom fabrication
  'dumpster-gate', // Custom fabrication
];

/**
 * Calculate sales tax for an order
 */
export function calculateTax(
  subtotal: number,
  address: TaxAddress,
  isTaxExempt: boolean = false,
  isCustomFabrication: boolean = false
): TaxCalculation {
  // If customer is tax-exempt, return zero tax
  if (isTaxExempt) {
    return {
      taxRate: 0,
      taxAmount: 0,
      taxableAmount: subtotal,
      isTaxExempt: true,
    };
  }

  // Get state tax rate
  const state = address.state?.toUpperCase();
  let taxRate = STATE_TAX_RATES[state || ''] || 0;

  // For custom fabrication in certain states, may be tax-exempt
  // This is a simplified check - in production, you'd want proper tax exemption certificates
  if (isCustomFabrication && POTENTIALLY_TAX_EXEMPT_STATES.includes(state || '')) {
    // For now, we'll still charge tax but note it may be exempt
    // In production, you'd check for valid tax exemption certificate
    // taxRate = 0; // Uncomment if you have proper exemption handling
  }

  // Calculate tax amount
  const taxAmount = Math.round(subtotal * taxRate * 100) / 100; // Round to 2 decimal places

  return {
    taxRate,
    taxAmount,
    taxableAmount: subtotal,
    isTaxExempt: false,
  };
}

/**
 * Get tax rate for a state (for display purposes)
 */
export function getTaxRateForState(state: string): number {
  return STATE_TAX_RATES[state?.toUpperCase() || ''] || 0;
}

/**
 * Check if a state has sales tax
 */
export function stateHasSalesTax(state: string): boolean {
  const rate = STATE_TAX_RATES[state?.toUpperCase() || ''];
  return rate !== undefined && rate > 0;
}





