import PDFDocument from 'pdfkit';
import { EmbedSpec, PriceBreakdown } from './types';
import { priceEmbed } from './pricing';
import { writeFile, mkdir } from 'fs/promises';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';

const QUOTE_OUTPUT_DIR = join(process.cwd(), 'public', 'uploads', 'quotes');

export async function generateQuotePDF(
  quoteId: string,
  embedSpecs: EmbedSpec[],
  expiresAt?: Date
): Promise<string> {
  // Ensure output directory exists
  if (!existsSync(QUOTE_OUTPUT_DIR)) {
    await mkdir(QUOTE_OUTPUT_DIR, { recursive: true });
  }

  const pdfPath = join(QUOTE_OUTPUT_DIR, `${quoteId}.pdf`);
  
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
    const stream = createWriteStream(pdfPath);
    doc.pipe(stream);

    const pageWidth = doc.page.width - 100;

    // Header
    doc.fontSize(24).text('QUOTE', { align: 'center' });
    doc.fontSize(14).text(`Quote ID: ${quoteId}`, { align: 'center' });
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
    if (expiresAt) {
      doc.fontSize(10).text(`Valid Until: ${expiresAt.toLocaleDateString()}`, { align: 'center' });
    }
    doc.moveDown(2);

    // Project Information
    if (embedSpecs[0]?.projectName || embedSpecs[0]?.projectNumber) {
      doc.fontSize(14).text('PROJECT INFORMATION', { underline: true });
      doc.fontSize(12);
      if (embedSpecs[0].projectName) {
        doc.text(`Project: ${embedSpecs[0].projectName}`);
      }
      if (embedSpecs[0].projectNumber) {
        doc.text(`Project Number: ${embedSpecs[0].projectNumber}`);
      }
      if (embedSpecs[0].contactInfo) {
        const contact = embedSpecs[0].contactInfo;
        if (contact.name) doc.text(`Contact: ${contact.name}`);
        if (contact.company) doc.text(`Company: ${contact.company}`);
        if (contact.email) doc.text(`Email: ${contact.email}`);
        if (contact.phone) doc.text(`Phone: ${contact.phone}`);
      }
      doc.moveDown(2);
    }

    // Pricing Table
    doc.fontSize(16).text('PRICING BREAKDOWN', { underline: true });
    doc.moveDown(0.5);

    let totalPrice = 0;
    const setupFee = 150.00; // From pricing.ts

    embedSpecs.forEach((spec, index) => {
      if (index > 0) {
        doc.moveDown(1);
      }

      const priceBreakdown = priceEmbed(spec);
      const embedTotal = priceBreakdown.unitPrice * spec.quantity;
      totalPrice += embedTotal;

      doc.fontSize(14).text(`Embed ${index + 1}`, { underline: true });
      doc.fontSize(10);
      doc.text(`Plate: ${spec.plate.length}" × ${spec.plate.width}" × ${spec.plate.thickness}" (${spec.plate.material})`);
      doc.text(`Quantity: ${spec.quantity}`);
      doc.text(`Unit Price: $${priceBreakdown.unitPrice.toFixed(2)}`);
      doc.text(`Subtotal: $${embedTotal.toFixed(2)}`);
      doc.moveDown(0.3);

      // Line items
      doc.fontSize(9);
      priceBreakdown.lineItems.forEach(item => {
        doc.text(`  • ${item.label}: $${item.amount.toFixed(2)}`, { indent: 20 });
      });
    });

    doc.moveDown(1);
    doc.fontSize(12);
    doc.text(`Setup Fee: $${setupFee.toFixed(2)}`);
    doc.moveDown(0.5);
    doc.fontSize(14).text(`TOTAL: $${(totalPrice + setupFee).toFixed(2)}`, { align: 'right' });

    // Notes
    doc.moveDown(2);
    doc.fontSize(10);
    doc.text('NOTES:', { underline: true });
    doc.text('• Prices are estimates and subject to change based on final specifications.');
    doc.text('• Lead time may vary based on current production schedule.');
    doc.text('• This quote is valid for 30 days from the date of issue.');
    if (embedSpecs.some(spec => priceEmbed(spec).confidence === 'review')) {
      doc.text('• Some items require engineering review and may have additional charges.');
    }

    // Special Instructions
    if (embedSpecs[0]?.specialInstructions) {
      doc.moveDown(1);
      doc.fontSize(10);
      doc.text('SPECIAL INSTRUCTIONS:', { underline: true });
      doc.text(embedSpecs[0].specialInstructions, { width: pageWidth });
    }

    doc.end();

    stream.on('finish', () => {
      resolve(`/uploads/quotes/${quoteId}.pdf`);
    });

    stream.on('error', (error: Error) => {
      reject(error);
    });
  });
}






