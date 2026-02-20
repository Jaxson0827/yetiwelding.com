import { NextRequest, NextResponse } from 'next/server';
import type { GardenBoxConfig } from '@/lib/gardenBoxes/types';
import { validateGardenBoxConfig } from '@/lib/gardenBoxes/validation';
import { generateGardenBoxSpecSheetBuffer } from '@/lib/gardenBoxes/generateSpecSheet';

/**
 * POST /api/garden-boxes/spec-sheet
 * Generate and download a garden box spec sheet PDF.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config = body.config as Partial<GardenBoxConfig>;

    const errors = validateGardenBoxConfig(config);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Invalid configuration', details: errors },
        { status: 400 }
      );
    }

    const fullConfig: GardenBoxConfig = {
      size: config.size!,
      height: config.height!,
      finish: config.finish!,
      addOns: config.addOns ?? {},
      quantity: config.quantity ?? 1,
    };

    const pdfBuffer = await generateGardenBoxSpecSheetBuffer(fullConfig);
    const bodyBytes = new Uint8Array(pdfBuffer);

    return new NextResponse(bodyBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="garden-box-spec.pdf"',
        'Cache-Control': 'private, no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Garden box spec sheet error:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the spec sheet' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
