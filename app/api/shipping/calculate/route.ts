import { NextRequest, NextResponse } from 'next/server';
import { calculateShipping } from '@/lib/shipping/calculator';
import { CartItem } from '@/contexts/CartContext';
import { ShippingAddress, ShippingMethod } from '@/lib/shipping/calculator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, address, preferredMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Validate address fields
    if (!address.zip || !address.state) {
      return NextResponse.json(
        { error: 'ZIP code and state are required for shipping calculation' },
        { status: 400 }
      );
    }

    const shippingCalculation = calculateShipping(
      items as CartItem[],
      address as ShippingAddress,
      preferredMethod as ShippingMethod | undefined
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





