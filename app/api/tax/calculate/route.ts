import { NextRequest, NextResponse } from 'next/server';
import { calculateTax } from '@/lib/tax/calculator';
import { TaxAddress } from '@/lib/tax/calculator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subtotal, address, isTaxExempt, isCustomFabrication } = body;

    if (subtotal === undefined || subtotal < 0) {
      return NextResponse.json(
        { error: 'Valid subtotal is required' },
        { status: 400 }
      );
    }

    if (!address || !address.state) {
      return NextResponse.json(
        { error: 'State is required for tax calculation' },
        { status: 400 }
      );
    }

    const taxCalculation = calculateTax(
      subtotal,
      address as TaxAddress,
      isTaxExempt || false,
      isCustomFabrication || false
    );

    return NextResponse.json({
      success: true,
      ...taxCalculation,
    });
  } catch (error) {
    console.error('Tax calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate tax' },
      { status: 500 }
    );
  }
}





