import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { isAdminRequest } from '@/lib/admin/auth';

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const take = Math.min(100, Math.max(1, Number(searchParams.get('take') || 50)));

    const where =
      q.length === 0
        ? {}
        : {
            OR: [
              { jobId: { contains: q, mode: 'insensitive' as const } },
              { customerEmail: { contains: q, mode: 'insensitive' as const } },
              { paymentIntentId: { contains: q, mode: 'insensitive' as const } },
              { stripeSessionId: { contains: q, mode: 'insensitive' as const } },
            ],
          };

    const orders = await prisma.order.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
      take,
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      orders: orders.map((o) => ({
        id: o.id,
        jobId: o.jobId,
        status: o.status,
        paymentStatus: o.paymentStatus,
        customerEmail: o.customerEmail,
        subtotal: typeof o.subtotalCents === 'number' ? o.subtotalCents / 100 : null,
        shipping: typeof o.shippingCents === 'number' ? o.shippingCents / 100 : null,
        tax: typeof o.taxCents === 'number' ? o.taxCents / 100 : null,
        total: typeof o.totalCents === 'number' ? o.totalCents / 100 : null,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        shippingMethod: o.shippingMethod,
        shippingCarrier: o.shippingCarrier,
        shippingService: o.shippingService,
        shippingQuoteId: o.shippingQuoteId,
        trackingNumber: o.trackingNumber,
        itemsCount: o.items?.length || 0,
      })),
    });
  } catch (e) {
    console.error('admin orders list error:', e);
    return NextResponse.json({ error: 'Failed to list orders' }, { status: 500 });
  }
}

export const runtime = 'nodejs';

