import { NextRequest, NextResponse } from 'next/server';
import { calculateShippingLive, getPickupOnlyCalculation } from '@/lib/shipping/calculator';
import { CartItem } from '@/contexts/CartContext';
import { ShippingAddress, ShippingMethod } from '@/lib/shipping/calculator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, address, preferredMethod, freight } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    // When address is missing or incomplete, return pickup-only options
    const hasAddressForRates = address?.zip && address?.state && String(address.zip).length >= 5;
    if (!hasAddressForRates) {
      const pickupOnly = getPickupOnlyCalculation(preferredMethod as ShippingMethod | undefined);
      return NextResponse.json({
        success: true,
        ...pickupOnly,
      });
    }

    const shippingCalculation = await calculateShippingLive(
      items as CartItem[],
      address as ShippingAddress,
      preferredMethod as ShippingMethod | undefined,
      freight
    );

    return NextResponse.json({
      success: true,
      ...shippingCalculation,
    });
  } catch (error) {
    console.error('Shipping calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shipping' },
      { status: 500 }
    );
  }
}





