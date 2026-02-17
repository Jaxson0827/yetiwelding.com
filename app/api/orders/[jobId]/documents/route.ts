import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generateShopPacketBuffer } from '@/lib/steelEmbeds/generateShopPacket';
import type { EmbedSpec } from '@/lib/steelEmbeds/types';

/**
 * Get order documents (PDFs)
 * GET /api/orders/[jobId]/documents?type=shop-packet
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const documentType = searchParams.get('type') || 'shop-packet';
    const token = searchParams.get('token');
    const { jobId } = await context.params;

    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId is required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { jobId },
      include: { items: true },
    });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!token || token !== order.trackingToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate on-demand and stream PDF after token validation.
    const embedSpecs: EmbedSpec[] = order.items
      .filter((it: any) => it.productType === 'steel-plate-embeds')
      .map((it: any) => it.configuration as unknown as EmbedSpec);

    if (embedSpecs.length === 0) {
      return NextResponse.json({ error: 'No steel embed specs available for documents' }, { status: 404 });
    }

    let pdfBuffer: Buffer;
    let filename: string;
    if (documentType === 'shop-packet') {
      pdfBuffer = await generateShopPacketBuffer(jobId, embedSpecs);
      filename = `${jobId}-shop-packet.pdf`;
    } else {
      return NextResponse.json({ error: 'Unsupported document type' }, { status: 400 });
    }

    // NextResponse expects web BodyInit types; use Uint8Array (Buffer isn't typed as BodyInit)
    const body = new Uint8Array(pdfBuffer);
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'private, no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Document fetch error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching document' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';