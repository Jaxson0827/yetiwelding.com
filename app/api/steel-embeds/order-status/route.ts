import { NextRequest, NextResponse } from 'next/server';

// Legacy endpoint (previous in-memory implementation). Disabled; see lib/steelEmbeds/legacyOrderStore.ts.
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Legacy endpoint disabled. Use /api/orders/[jobId] instead.' },
    { status: 410 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Legacy endpoint disabled. Use admin endpoint instead.' },
    { status: 410 }
  );
}
