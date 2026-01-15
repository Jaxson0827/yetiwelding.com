export interface EmbedSpec {
  plate: {
    length: number;      // inches, validated: 2" - 96"
    width: number;       // inches, validated: 2" - 96"
    thickness: number;   // inches, validated: 0.25" - 2.0"
    material: 'A36' | 'A572' | 'A588' | 'A992';
  };
  studs?: {
    positions: Array<{
      x: number;         // inches, X coordinate from plate center
      y: number;         // inches, Y coordinate from plate center
      diameter: number;  // inches, validated: 0.25" - 2.0"
      length: number;   // inches
      grade: 'A307' | 'A325';
    }>;
  };
  finish: 'none' | 'primer' | 'galv';
  tolerance: 'standard' | 'tight';
  quantity: number;      // validated: >= 1
  leadTime: 'standard' | 'rush';
  // Project information
  projectName?: string;
  projectNumber?: string;
  deliveryAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  contactInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  specialInstructions?: string;
}

// Validation constraints (explicit limits)
export const VALIDATION_CONSTRAINTS = {
  plate: {
    length: { min: 2, max: 96 },      // inches
    width: { min: 2, max: 96 },       // inches
    thickness: { min: 0.25, max: 2.0 }, // inches
  },
  studs: {
    maxCount: 40,
    diameter: { min: 0.25, max: 2.0 }, // inches
  },
  quantity: { min: 1 },
} as const;

export interface ValidationError {
  field: string;
  message: string;
}

export interface PriceBreakdown {
  unitPrice: number;
  lineItems: PriceLineItem[];
  confidence: 'high' | 'review';
}

export interface PriceLineItem {
  label: string;
  amount: number;
  quantity?: number;
}

export interface OrderPriceBreakdown {
  totalPrice: number;
  setupFee: number;
  embedPrices: PriceBreakdown[];
  lineItems: PriceLineItem[];
  confidence: 'high' | 'review';
}


