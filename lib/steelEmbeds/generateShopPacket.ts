import PDFDocument from 'pdfkit';
import { EmbedSpec } from './types';
import { writeFile, mkdir } from 'fs/promises';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';

const PDF_OUTPUT_DIR = join(process.cwd(), 'public', 'uploads', 'shop-packets');

// Helper function to draw dimension line
function drawDimensionLine(
  doc: PDFKit.PDFDocument,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  label: string,
  offset: number = 10
) {
  // Draw dimension line
  doc.moveTo(x1, y1).lineTo(x2, y2).stroke();
  
  // Draw arrowheads (simplified as small lines)
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowLength = 5;
  const arrowAngle = Math.PI / 6;
  
  // Arrow at start
  doc
    .moveTo(x1, y1)
    .lineTo(x1 + arrowLength * Math.cos(angle + Math.PI - arrowAngle), y1 + arrowLength * Math.sin(angle + Math.PI - arrowAngle))
    .moveTo(x1, y1)
    .lineTo(x1 + arrowLength * Math.cos(angle + Math.PI + arrowAngle), y1 + arrowLength * Math.sin(angle + Math.PI + arrowAngle))
    .stroke();
  
  // Arrow at end
  doc
    .moveTo(x2, y2)
    .lineTo(x2 + arrowLength * Math.cos(angle - arrowAngle), y2 + arrowLength * Math.sin(angle - arrowAngle))
    .moveTo(x2, y2)
    .lineTo(x2 + arrowLength * Math.cos(angle + arrowAngle), y2 + arrowLength * Math.sin(angle + arrowAngle))
    .stroke();
  
  // Draw label
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const perpAngle = angle + Math.PI / 2;
  const labelX = midX + offset * Math.cos(perpAngle);
  const labelY = midY + offset * Math.sin(perpAngle);
  
  doc.fontSize(8).text(label, labelX - 15, labelY - 4, { width: 30, align: 'center' });
}

// Draw top view of embed
function drawTopView(doc: PDFKit.PDFDocument, spec: EmbedSpec, startY: number, pageWidth: number) {
  const margin = 50;
  const drawingWidth = pageWidth - 2 * margin;
  const scale = Math.min(drawingWidth / (spec.plate.length * 1.5), drawingWidth / (spec.plate.width * 1.5));
  
  const plateWidth = spec.plate.length * scale;
  const plateHeight = spec.plate.width * scale;
  const centerX = pageWidth / 2;
  const centerY = startY + 100;
  
  // Draw plate outline
  doc.rect(centerX - plateWidth / 2, centerY - plateHeight / 2, plateWidth, plateHeight).stroke();
  
  // Draw center lines
  doc
    .moveTo(centerX - plateWidth / 2 - 20, centerY)
    .lineTo(centerX + plateWidth / 2 + 20, centerY)
    .dash(3, { space: 3 })
    .stroke()
    .undash();
  
  doc
    .moveTo(centerX, centerY - plateHeight / 2 - 20)
    .lineTo(centerX, centerY + plateHeight / 2 + 20)
    .dash(3, { space: 3 })
    .stroke()
    .undash();
  
  // Draw studs
  if (spec.studs?.positions) {
    spec.studs.positions.forEach((stud, index) => {
      const studX = centerX + stud.x * scale;
      const studY = centerY - stud.y * scale; // Flip Y for PDF coordinates
      const studRadius = (stud.diameter / 2) * scale;
      
      // Draw stud circle
      doc.circle(studX, studY, studRadius).fillAndStroke('black', 'black');
      
      // Draw stud center mark
      doc.circle(studX, studY, 2).fill('black');
      
      // Label stud
      doc.fontSize(8).text(`${index + 1}`, studX + studRadius + 3, studY - 4);
    });
  }
  
  // Draw dimensions
  // Length dimension
  drawDimensionLine(
    doc,
    centerX - plateWidth / 2,
    centerY - plateHeight / 2 - 30,
    centerX + plateWidth / 2,
    centerY - plateHeight / 2 - 30,
    `${spec.plate.length}"`
  );
  
  // Width dimension
  drawDimensionLine(
    doc,
    centerX - plateWidth / 2 - 30,
    centerY - plateHeight / 2,
    centerX - plateWidth / 2 - 30,
    centerY + plateHeight / 2,
    `${spec.plate.width}"`
  );
  
  // Title
  doc.fontSize(12).text('TOP VIEW', centerX - 30, centerY - plateHeight / 2 - 50, { align: 'center' });
  
  return centerY + plateHeight / 2 + 50;
}

// Draw side view of embed
function drawSideView(doc: PDFKit.PDFDocument, spec: EmbedSpec, startY: number, pageWidth: number) {
  const margin = 50;
  const drawingWidth = pageWidth - 2 * margin;
  const scale = Math.min(drawingWidth / (spec.plate.length * 1.5), drawingWidth / (Math.max(spec.plate.thickness, spec.studs?.positions?.[0]?.length || 4) * 2));
  
  const plateWidth = spec.plate.length * scale;
  const plateThickness = spec.plate.thickness * scale;
  const centerX = pageWidth / 2;
  const centerY = startY + 80;
  
  // Draw plate (side view is a rectangle)
  doc.rect(centerX - plateWidth / 2, centerY - plateThickness / 2, plateWidth, plateThickness).fillAndStroke('gray', 'black');
  
  // Draw studs (side view)
  if (spec.studs?.positions) {
    spec.studs.positions.forEach((stud) => {
      const studX = centerX + stud.x * scale;
      const studBaseY = centerY - plateThickness / 2;
      const studLength = stud.length * scale;
      const studRadius = (stud.diameter / 2) * scale;
      
      // Draw stud as rectangle (simplified side view)
      doc.rect(studX - studRadius, studBaseY - studLength, studRadius * 2, studLength).fillAndStroke('darkgray', 'black');
    });
  }
  
  // Draw dimensions
  // Length dimension
  drawDimensionLine(
    doc,
    centerX - plateWidth / 2,
    centerY - plateThickness / 2 - 30,
    centerX + plateWidth / 2,
    centerY - plateThickness / 2 - 30,
    `${spec.plate.length}"`
  );
  
  // Thickness dimension
  drawDimensionLine(
    doc,
    centerX - plateWidth / 2 - 30,
    centerY - plateThickness / 2,
    centerX - plateWidth / 2 - 30,
    centerY + plateThickness / 2,
    `${spec.plate.thickness}"`
  );
  
  // Title
  doc.fontSize(12).text('SIDE VIEW', centerX - 30, centerY - plateThickness / 2 - 50, { align: 'center' });
  
  return centerY + plateThickness / 2 + 50;
}

export async function generateShopPacket(jobId: string, embedSpecs: EmbedSpec[]): Promise<string> {
  // Ensure output directory exists
  if (!existsSync(PDF_OUTPUT_DIR)) {
    await mkdir(PDF_OUTPUT_DIR, { recursive: true });
  }

  const pdfPath = join(PDF_OUTPUT_DIR, `${jobId}.pdf`);
  
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
    const stream = createWriteStream(pdfPath);
    doc.pipe(stream);

    const pageWidth = doc.page.width - 100; // Account for margins

    // Header
    doc.fontSize(20).text('SHOP PACKET', { align: 'center' });
    doc.fontSize(16).text(`Job ID: ${jobId}`, { align: 'center' });
    
    // Project information if available
    if (embedSpecs[0]?.projectName || embedSpecs[0]?.projectNumber) {
      doc.moveDown();
      doc.fontSize(12);
      if (embedSpecs[0].projectName) {
        doc.text(`Project: ${embedSpecs[0].projectName}`, { align: 'center' });
      }
      if (embedSpecs[0].projectNumber) {
        doc.text(`Project Number: ${embedSpecs[0].projectNumber}`, { align: 'center' });
      }
    }
    
    doc.moveDown(2);

    // Generate packet for each embed spec
    embedSpecs.forEach((spec, index) => {
      if (index > 0) {
        doc.addPage();
      }

      let currentY = 100;

      // Title
      doc.fontSize(18).text(`Embed Specification ${index + 1}`, { align: 'center', underline: true });
      currentY += 30;

      // Technical Drawings Section
      doc.fontSize(14).text('TECHNICAL DRAWINGS', { align: 'center', underline: true });
      currentY += 20;

      // Top View
      currentY = drawTopView(doc, spec, currentY, pageWidth);
      doc.moveDown(1);

      // Side View
      currentY = drawSideView(doc, spec, currentY, pageWidth);
      doc.moveDown(2);

      // Specifications Table
      doc.fontSize(14).text('SPECIFICATIONS', { underline: true });
      doc.moveDown(0.5);

      // Plate Information
      doc.fontSize(12).text('PLATE INFORMATION', { underline: true });
      doc.fontSize(10);
      doc.text(`Size: ${spec.plate.length}" × ${spec.plate.width}" × ${spec.plate.thickness}"`);
      doc.text(`Material: ${spec.plate.material}`);
      doc.text(`Weight: ${((spec.plate.length * spec.plate.width * spec.plate.thickness * 0.283).toFixed(2))} lbs`);
      doc.moveDown();

      // Stud Information
      if (spec.studs && spec.studs.positions && spec.studs.positions.length > 0) {
        doc.fontSize(12).text('STUDS', { underline: true });
        doc.fontSize(10);
        doc.text(`Count: ${spec.studs.positions.length}`);
        doc.moveDown(0.3);
        
        // Stud table header
        doc.fontSize(9);
        doc.text('Stud', 50, doc.y, { width: 40 });
        doc.text('X (")', 90, doc.y, { width: 50 });
        doc.text('Y (")', 140, doc.y, { width: 50 });
        doc.text('Dia (")', 190, doc.y, { width: 50 });
        doc.text('Length (")', 240, doc.y, { width: 60 });
        doc.text('Grade', 300, doc.y, { width: 50 });
        doc.moveDown(0.3);
        
        // Stud data rows
        spec.studs.positions.forEach((stud, idx) => {
          doc.text(`${idx + 1}`, 50, doc.y, { width: 40 });
          doc.text(stud.x.toFixed(2), 90, doc.y, { width: 50 });
          doc.text(stud.y.toFixed(2), 140, doc.y, { width: 50 });
          doc.text(stud.diameter.toFixed(2), 190, doc.y, { width: 50 });
          doc.text(stud.length.toFixed(2), 240, doc.y, { width: 60 });
          doc.text(stud.grade, 300, doc.y, { width: 50 });
          doc.moveDown(0.3);
        });
        doc.moveDown();
      }

      // Finish & Tolerance
      doc.fontSize(12).text('FINISH & TOLERANCE', { underline: true });
      doc.fontSize(10);
      doc.text(`Finish: ${spec.finish.toUpperCase()}`);
      doc.text(`Tolerance: ${spec.tolerance.toUpperCase()}`);
      doc.moveDown();

      // Quantity & Lead Time
      doc.fontSize(12).text('ORDER INFORMATION', { underline: true });
      doc.fontSize(10);
      doc.text(`Quantity: ${spec.quantity}`);
      doc.text(`Lead Time: ${spec.leadTime.toUpperCase()}`);
      doc.moveDown();

      // Project Information
      if (spec.projectName || spec.projectNumber || spec.deliveryAddress || spec.contactInfo) {
        doc.fontSize(12).text('PROJECT INFORMATION', { underline: true });
        doc.fontSize(10);
        if (spec.projectName) doc.text(`Project Name: ${spec.projectName}`);
        if (spec.projectNumber) doc.text(`Project Number: ${spec.projectNumber}`);
        if (spec.deliveryAddress) {
          const addr = spec.deliveryAddress;
          if (addr.street) doc.text(`Delivery: ${addr.street}`);
          if (addr.city || addr.state || addr.zip) {
            doc.text(`${addr.city || ''}${addr.city && addr.state ? ', ' : ''}${addr.state || ''} ${addr.zip || ''}`.trim());
          }
        }
        if (spec.contactInfo) {
          const contact = spec.contactInfo;
          if (contact.name) doc.text(`Contact: ${contact.name}`);
          if (contact.email) doc.text(`Email: ${contact.email}`);
          if (contact.phone) doc.text(`Phone: ${contact.phone}`);
        }
        doc.moveDown();
      }

      // Special Instructions
      if (spec.specialInstructions) {
        doc.fontSize(12).text('SPECIAL INSTRUCTIONS', { underline: true });
        doc.fontSize(10);
        doc.text(spec.specialInstructions, { width: pageWidth });
        doc.moveDown();
      }
    });

    doc.end();

    stream.on('finish', () => {
      // Return relative path for URL access
      resolve(`/uploads/shop-packets/${jobId}.pdf`);
    });

    stream.on('error', (error: Error) => {
      reject(error);
    });
  });
}

