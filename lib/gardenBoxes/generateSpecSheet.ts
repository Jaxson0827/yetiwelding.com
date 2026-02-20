import PDFDocument from 'pdfkit';
import type { GardenBoxConfig } from './types';
import { GARDEN_BOX_SIZES, GARDEN_BOX_FINISHES, GARDEN_BOX_ADD_ON_LABELS } from './types';
import { getDimensionsFt } from './types';
import { priceGardenBox } from './pricing';

/**
 * Generate a garden box spec sheet PDF buffer.
 */
export async function generateGardenBoxSpecSheetBuffer(config: GardenBoxConfig): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageWidth = doc.page.width - 100;
    const margin = 50;

    // Header
    doc.fontSize(20).text('GARDEN BOX SPECIFICATION', { align: 'center' });
    doc.fontSize(12).text('Yeti Welding · Custom Steel Raised Beds', { align: 'center' });
    doc.moveDown(2);

    // Configuration summary
    doc.fontSize(14).text('Configuration', { underline: true });
    doc.moveDown(0.5);

    const sizeLabel = GARDEN_BOX_SIZES.find((s) => s.id === config.size)?.label ?? config.size;
    const finishLabel = GARDEN_BOX_FINISHES.find((f) => f.id === config.finish)?.label ?? config.finish;

    doc.fontSize(10);
    doc.text(`Size: ${sizeLabel}`);
    doc.text(`Height: ${config.height}"`);
    doc.text(`Finish: ${finishLabel}`);
    doc.text(`Quantity: ${config.quantity ?? 1}`);
    doc.moveDown(1);

    // Add-ons
    const addOnIds = Object.entries(config.addOns ?? {}).filter(([, v]) => v);
    if (addOnIds.length > 0) {
      doc.fontSize(12).text('Add-ons', { underline: true });
      doc.fontSize(10);
      addOnIds.forEach(([id]) => {
        doc.text(`• ${GARDEN_BOX_ADD_ON_LABELS[id as keyof typeof GARDEN_BOX_ADD_ON_LABELS] ?? id}`);
      });
      doc.moveDown(1);
    }

    // Pricing
    const priceResult = priceGardenBox(config, config.quantity ?? 1);
    doc.fontSize(12).text('Pricing', { underline: true });
    doc.fontSize(10);
    doc.text(`Unit price: $${priceResult.unitPrice.toLocaleString()}`);
    doc.text(`Total (${config.quantity ?? 1} × unit): $${priceResult.totalPrice.toLocaleString()}`);
    doc.moveDown(1);

    // Panel dimensions
    const { lengthFt, widthFt } = getDimensionsFt(config.size);
    const lengthIn = Math.round(lengthFt * 12);
    const widthIn = Math.round(widthFt * 12);

    doc.fontSize(12).text('Panel Dimensions', { underline: true });
    doc.fontSize(10);
    doc.text(`Long side panels: ${lengthIn}" × ${config.height}" (2 required)`);
    doc.text(`Short side panels: ${widthIn}" × ${config.height}" (2 required)`);
    doc.moveDown(1);

    // Trust badges
    doc.fontSize(12).text('Specifications', { underline: true });
    doc.fontSize(10);
    doc.text('• Heavy-duty 11 gauge steel panels');
    doc.text('• Bolt-together with pre-drilled flanges');
    doc.text('• Stainless steel hardware included');
    doc.text('• Ships flat-pack · Typically arrives in 2–3 weeks');
    doc.text('• Made in Utah');
    doc.moveDown(2);

    // Footer
    doc.fontSize(9).fillColor('#666666');
    doc.text('This is a specification sheet. Final price may vary. Shipping calculated at checkout.', {
      align: 'center',
      width: pageWidth,
    });
    doc.text('yetiwelding.com', { align: 'center' });

    doc.end();
  });
}
