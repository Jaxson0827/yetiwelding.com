import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Deprecated. Use Stripe Checkout Sessions instead.' },
    { status: 410 }
  );
}





