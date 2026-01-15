import { NextRequest, NextResponse } from 'next/server';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { exportToDxf, exportToStep } from '@/lib/steelEmbeds/cadExport';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spec, format, filename } = body;

    if (!spec) {
      return NextResponse.json(
        { error: 'EmbedSpec is required' },
        { status: 400 }
      );
    }

    if (!format || (format !== 'dxf' && format !== 'step' && format !== 'stp')) {
      return NextResponse.json(
        { error: 'Format must be "dxf" or "step"/"stp"' },
        { status: 400 }
      );
    }

    const fileId = filename || `embed-${Date.now()}`;
    let fileUrl: string;

    if (format === 'dxf') {
      fileUrl = await exportToDxf(spec as EmbedSpec, fileId);
    } else {
      fileUrl = await exportToStep(spec as EmbedSpec, fileId);
    }

    return NextResponse.json({
      success: true,
      fileUrl,
      format,
    });
  } catch (error) {
    console.error('CAD export error:', error);
    return NextResponse.json(
      { error: 'An error occurred while exporting CAD file' },
      { status: 500 }
    );
  }
}






