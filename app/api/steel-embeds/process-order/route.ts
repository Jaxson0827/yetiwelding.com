import { NextRequest, NextResponse } from 'next/server';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { generateShopPacket } from '@/lib/steelEmbeds/generateShopPacket';
import { storeOrder } from '../order-status/route';

/**
 * Process order after successful checkout
 * Generates job ID, stores EmbedSpec, and creates shop packet PDF
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { embedSpecs, customerInfo, orderTotal } = body;

    if (!embedSpecs || !Array.isArray(embedSpecs) || embedSpecs.length === 0) {
      return NextResponse.json(
        { error: 'embedSpecs array is required' },
        { status: 400 }
      );
    }

    // Generate unique job ID
    const jobId = `JOB-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Store order information
    const orderData = {
      jobId,
      embedSpecs: embedSpecs as EmbedSpec[],
      customerInfo,
      orderTotal,
      createdAt: new Date().toISOString(),
    };

    // Store order for tracking
    storeOrder(jobId, embedSpecs as EmbedSpec[], customerInfo);

    // Generate PDF shop packet
    let pdfUrl: string | null = null;
    try {
      pdfUrl = await generateShopPacket(jobId, embedSpecs as EmbedSpec[]);
    } catch (error) {
      console.error('PDF generation error:', error);
      // Continue even if PDF generation fails - we'll handle it gracefully
    }

    // TODO: In production, implement:
    // 1. Save orderData to database
    // 2. Send internal notification (email/slack/etc)
    // 3. Flag for review if confidence = 'review'
    // 4. Store PDF in persistent storage

    return NextResponse.json({
      success: true,
      jobId,
      orderData,
      pdfUrl,
    });
  } catch (error) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the order' },
      { status: 500 }
    );
  }
}


