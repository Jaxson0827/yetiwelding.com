import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { isAdminRequest } from '@/lib/admin/auth';

const ALLOWED_STATUSES = [
  'pending',
  'pending_payment',
  'needs_review',
  'in_review',
  'in_production',
  'ready',
  'shipped',
  'delivered',
  'cancelled',
] as const;

function isAllowedStatus(s: any): s is (typeof ALLOWED_STATUSES)[number] {
  return typeof s === 'string' && (ALLOWED_STATUSES as readonly string[]).includes(s);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await context.params;
    const body = (await request.json().catch(() => ({}))) as any;

    const data: any = {};
    if (body.status !== undefined) {
      if (!isAllowedStatus(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      data.status = body.status;
    }
    if (body.trackingNumber !== undefined) {
      const tn = String(body.trackingNumber || '').trim();
      data.trackingNumber = tn.length ? tn : null;
    }
    if (body.estimatedDeliveryDate !== undefined) {
      const v = body.estimatedDeliveryDate ? new Date(String(body.estimatedDeliveryDate)) : null;
      data.estimatedDeliveryDate = v && !isNaN(v.getTime()) ? v : null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (e) {
    console.error('admin order update error:', e);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export const runtime = 'nodejs';

