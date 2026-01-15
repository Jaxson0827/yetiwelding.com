import { NextRequest, NextResponse } from 'next/server';
import { orders } from '../../steel-embeds/order-status/route';
import { generateShopPacket } from '@/lib/steelEmbeds/generateShopPacket';
import { generateQuotePDF } from '@/lib/steelEmbeds/quoteExport';
import { EmbedSpec } from '@/lib/steelEmbeds/types';

/**
 * Get order documents (PDFs)
 * GET /api/orders/[jobId]/documents?type=shop-packet|quote
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const documentType = searchParams.get('type') || 'shop-packet';
    const jobId = params.jobId;

    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId is required' },
        { status: 400 }
      );
    }

    const order = orders.get(jobId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    let pdfUrl: string | null = null;

    if (documentType === 'shop-packet' && order.steelEmbeds && order.steelEmbeds.length > 0) {
      try {
        pdfUrl = await generateShopPacket(jobId, order.steelEmbeds);
      } catch (error) {
        console.error('Shop packet generation error:', error);
        return NextResponse.json(
          { error: 'Failed to generate shop packet' },
          { status: 500 }
        );
      }
    } else if (documentType === 'quote') {
      const embedSpecs = order.steelEmbeds || order.embedSpecs || [];
      if (embedSpecs.length > 0) {
        try {
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
          pdfUrl = await generateQuotePDF(jobId, embedSpecs, expiresAt);
        } catch (error) {
          console.error('Quote generation error:', error);
          return NextResponse.json(
            { error: 'Failed to generate quote' },
            { status: 500 }
          );
        }
      }
    }

    if (!pdfUrl) {
      return NextResponse.json(
        { error: 'Document not available for this order type' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pdfUrl,
      documentType,
    });
  } catch (error) {
    console.error('Document fetch error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching document' },
      { status: 500 }
    );
  }
}

