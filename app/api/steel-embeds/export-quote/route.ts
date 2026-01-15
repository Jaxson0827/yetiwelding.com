import { NextRequest, NextResponse } from 'next/server';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { generateQuotePDF } from '@/lib/steelEmbeds/quoteExport';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { embedSpecs, email, expiresInDays } = body;

    if (!embedSpecs || !Array.isArray(embedSpecs) || embedSpecs.length === 0) {
      return NextResponse.json(
        { error: 'embedSpecs array is required' },
        { status: 400 }
      );
    }

    const quoteId = `QUOTE-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const expiresAt = expiresInDays 
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

    const pdfUrl = await generateQuotePDF(quoteId, embedSpecs as EmbedSpec[], expiresAt);

    // TODO: If email is provided, send email with quote PDF attachment
    // This would require an email service (e.g., SendGrid, AWS SES, etc.)
    if (email) {
      // Placeholder for email functionality
      console.log(`Would send quote to ${email}`);
    }

    return NextResponse.json({
      success: true,
      quoteId,
      pdfUrl,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Quote export error:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating quote' },
      { status: 500 }
    );
  }
}






