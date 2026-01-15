import { EmbedSpec, PriceBreakdown, OrderPriceBreakdown, PriceLineItem } from './types';

// Pricing constants (these should be configurable in production)
const STEEL_DENSITY_LB_PER_CUBIC_INCH = 0.283; // lbs/in³ for steel
const MATERIAL_COST_PER_LB: Record<string, number> = {
  A36: 0.50,
  A572: 0.60,
  A588: 0.70,
  A992: 0.65,
};
const CUTTING_RATE_PER_INCH = 0.15; // $/inch of perimeter
const STUD_WELDING_RATE = 5.00; // $ per stud
const SETUP_COST = 150.00; // $ per job (order-level)
const FINISH_RATE: Record<string, number> = {
  none: 0,
  primer: 0.25, // $/sq in
  galv: 0.75, // $/sq in
};
const FINISH_MIN_CHARGE: Record<string, number> = {
  none: 0,
  primer: 25.00,
  galv: 50.00,
};
const RUSH_MULTIPLIER = 1.5;
const MARGIN_BUFFER = 1.15; // 15% margin

/**
 * Calculate weight of steel plate in pounds
 */
function calculateWeight(length: number, width: number, thickness: number): number {
  const volumeCubicInches = length * width * thickness;
  return volumeCubicInches * STEEL_DENSITY_LB_PER_CUBIC_INCH;
}

/**
 * Calculate perimeter in inches
 */
function calculatePerimeter(length: number, width: number): number {
  return 2 * (length + width);
}

/**
 * Calculate material area in square inches
 */
function calculateArea(length: number, width: number): number {
  return length * width;
}

/**
 * Price a single embed (part-level only, NO setup fee)
 */
export function priceEmbed(spec: EmbedSpec): PriceBreakdown {
  const lineItems: PriceLineItem[] = [];
  const { plate, studs, finish, leadTime } = spec;

  // Material cost
  const weight = calculateWeight(plate.length, plate.width, plate.thickness);
  const materialCost = weight * (MATERIAL_COST_PER_LB[plate.material] || MATERIAL_COST_PER_LB.A36);
  lineItems.push({
    label: `Material (${plate.material}, ${weight.toFixed(2)} lbs)`,
    amount: materialCost,
  });

  // Cutting cost
  const perimeter = calculatePerimeter(plate.length, plate.width);
  const cuttingCost = perimeter * CUTTING_RATE_PER_INCH;
  lineItems.push({
    label: `Cutting (${perimeter.toFixed(1)}" perimeter)`,
    amount: cuttingCost,
  });

  // Stud welding cost
  if (studs && studs.positions && studs.positions.length > 0) {
    const studCount = studs.positions.length;
    const studCost = studCount * STUD_WELDING_RATE;
    // Use the grade from the first stud (assuming all studs have the same grade)
    const grade = studs.positions[0]?.grade || 'A307';
    lineItems.push({
      label: `Stud welding (${studCount} studs, ${grade})`,
      amount: studCost,
      quantity: studCount,
    });
  }

  // Finish cost
  if (finish !== 'none') {
    const area = calculateArea(plate.length, plate.width);
    const finishCost = Math.max(
      area * FINISH_RATE[finish],
      FINISH_MIN_CHARGE[finish]
    );
    lineItems.push({
      label: `Finish (${finish})`,
      amount: finishCost,
    });
  }

  // Calculate base unit price (before rush/margin)
  let unitPrice = lineItems.reduce((sum, item) => sum + item.amount, 0);

  // Apply rush multiplier if needed
  if (leadTime === 'rush') {
    const rushSurcharge = unitPrice * (RUSH_MULTIPLIER - 1);
    unitPrice = unitPrice * RUSH_MULTIPLIER;
    lineItems.push({
      label: 'Rush surcharge (50%)',
      amount: rushSurcharge,
    });
  }

  // Apply margin buffer
  const marginAmount = unitPrice * (MARGIN_BUFFER - 1);
  unitPrice = unitPrice * MARGIN_BUFFER;
  lineItems.push({
    label: 'Margin',
    amount: marginAmount,
  });

  // Determine confidence
  const confidence = calculateConfidence(spec);

  return {
    unitPrice: Math.round(unitPrice * 100) / 100, // Round to 2 decimals
    lineItems,
    confidence,
  };
}

/**
 * Price an entire order (job-level setup applied once)
 */
export function priceOrder(embedSpecs: EmbedSpec[]): OrderPriceBreakdown {
  const embedPrices = embedSpecs.map(spec => priceEmbed(spec));
  const embedTotal = embedPrices.reduce((sum, price) => sum + (price.unitPrice * embedSpecs[embedPrices.indexOf(price)].quantity), 0);
  
  // Setup cost applied ONCE per order
  const setupFee = SETUP_COST;
  const totalPrice = embedTotal + setupFee;

  // Aggregate line items
  const lineItems: PriceLineItem[] = [
    ...embedPrices.flatMap(p => p.lineItems),
    {
      label: 'Setup fee (per order)',
      amount: setupFee,
    },
  ];

  // Overall confidence is 'review' if any embed requires review
  const confidence = embedPrices.some(p => p.confidence === 'review') ? 'review' : 'high';

  return {
    totalPrice: Math.round(totalPrice * 100) / 100,
    setupFee,
    embedPrices,
    lineItems,
    confidence,
  };
}

/**
 * Calculate confidence level for pricing
 */
function calculateConfidence(spec: EmbedSpec): 'high' | 'review' {
  const { plate, studs, finish, tolerance } = spec;

  // High confidence conditions
  const isRectangular = plate.length / plate.width >= 0.5 && plate.length / plate.width <= 2.0;
  const isStandardThickness = plate.thickness >= 0.25 && plate.thickness <= 2.0;
  const isLowStudCount = !studs || !studs.positions || studs.positions.length < 20;
  const isStandardFinish = finish === 'none' || finish === 'primer';
  const isStandardTolerance = tolerance === 'standard';

  // All conditions must be true for high confidence
  if (isRectangular && isStandardThickness && isLowStudCount && isStandardFinish && isStandardTolerance) {
    return 'high';
  }

  return 'review';
}


