import { EmbedSpec } from './types';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const CAD_OUTPUT_DIR = join(process.cwd(), 'public', 'uploads', 'cad-files');

// Generate DXF file content
function generateDxf(spec: EmbedSpec): string {
  const lines: string[] = [];
  
  // DXF header
  lines.push('0');
  lines.push('SECTION');
  lines.push('2');
  lines.push('HEADER');
  lines.push('0');
  lines.push('ENDSEC');
  
  // DXF entities section
  lines.push('0');
  lines.push('SECTION');
  lines.push('2');
  lines.push('ENTITIES');
  
  // Plate rectangle (as polyline)
  const halfLength = spec.plate.length / 2;
  const halfWidth = spec.plate.width / 2;
  
  // Plate outline as LWPOLYLINE
  lines.push('0');
  lines.push('LWPOLYLINE');
  lines.push('5');
  lines.push('10'); // Handle (simplified)
  lines.push('100');
  lines.push('AcDbEntity');
  lines.push('8');
  lines.push('0'); // Layer
  lines.push('100');
  lines.push('AcDbPolyline');
  lines.push('90');
  lines.push('4'); // Number of vertices
  lines.push('70');
  lines.push('1'); // Closed polyline
  lines.push('10');
  lines.push((-halfLength).toString());
  lines.push('20');
  lines.push((-halfWidth).toString());
  lines.push('10');
  lines.push(halfLength.toString());
  lines.push('20');
  lines.push((-halfWidth).toString());
  lines.push('10');
  lines.push(halfLength.toString());
  lines.push('20');
  lines.push(halfWidth.toString());
  lines.push('10');
  lines.push((-halfLength).toString());
  lines.push('20');
  lines.push(halfWidth.toString());
  
  // Studs as circles
  if (spec.studs?.positions) {
    spec.studs.positions.forEach((stud, index) => {
      lines.push('0');
      lines.push('CIRCLE');
      lines.push('5');
      lines.push(`${100 + index}`); // Handle
      lines.push('100');
      lines.push('AcDbEntity');
      lines.push('8');
      lines.push('STUDS'); // Layer
      lines.push('100');
      lines.push('AcDbCircle');
      lines.push('10');
      lines.push(stud.x.toString()); // Center X
      lines.push('20');
      lines.push(stud.y.toString()); // Center Y
      lines.push('30');
      lines.push('0'); // Z coordinate
      lines.push('40');
      lines.push((stud.diameter / 2).toString()); // Radius
    });
  }
  
  // End entities section
  lines.push('0');
  lines.push('ENDSEC');
  
  // End of file
  lines.push('0');
  lines.push('EOF');
  
  return lines.join('\n');
}

// Generate STEP file content (simplified)
function generateStep(spec: EmbedSpec): string {
  const lines: string[] = [];
  
  // STEP header
  lines.push('ISO-10303-21;');
  lines.push('HEADER;');
  lines.push('FILE_DESCRIPTION(("STEP AP214"),"1");');
  lines.push('FILE_NAME("embed_plate.stp","2024-01-01T00:00:00",(""),(""),"","","");');
  lines.push('FILE_SCHEMA(("AUTOMOTIVE_DESIGN"));');
  lines.push('ENDSEC;');
  
  lines.push('DATA;');
  
  // Plate as a box
  const plateId = '#1';
  lines.push(`${plateId} = CARTESIAN_POINT('Plate Origin',(0.0,0.0,0.0));`);
  lines.push(`#2 = DIRECTION('X Axis',(1.0,0.0,0.0));`);
  lines.push(`#3 = DIRECTION('Y Axis',(0.0,1.0,0.0));`);
  lines.push(`#4 = DIRECTION('Z Axis',(0.0,0.0,1.0));`);
  lines.push(`#5 = AXIS2_PLACEMENT_3D('Plate Placement',${plateId},#4,#2);`);
  lines.push(`#6 = BOX('Plate',#5,${spec.plate.length},${spec.plate.width},${spec.plate.thickness});`);
  
  // Studs as cylinders
  if (spec.studs?.positions) {
    spec.studs.positions.forEach((stud, index) => {
      const baseId = index * 10 + 10;
      lines.push(`#${baseId} = CARTESIAN_POINT('Stud ${index + 1} Origin',(${stud.x},${stud.y},${spec.plate.thickness / 2}));`);
      lines.push(`#${baseId + 1} = DIRECTION('Stud ${index + 1} Axis',(0.0,0.0,1.0));`);
      lines.push(`#${baseId + 2} = AXIS2_PLACEMENT_3D('Stud ${index + 1} Placement',#${baseId},#${baseId + 1},#2);`);
      lines.push(`#${baseId + 3} = CYLINDRICAL_SURFACE('Stud ${index + 1}',#${baseId + 2},${stud.diameter / 2});`);
      lines.push(`#${baseId + 4} = CYLINDRICAL_SOLID('Stud ${index + 1} Solid',#${baseId + 2},${stud.diameter / 2},${stud.length});`);
    });
  }
  
  lines.push('ENDSEC;');
  lines.push('END-ISO-10303-21;');
  
  return lines.join('\n');
}

export async function exportToDxf(spec: EmbedSpec, filename: string): Promise<string> {
  // Ensure output directory exists
  if (!existsSync(CAD_OUTPUT_DIR)) {
    await mkdir(CAD_OUTPUT_DIR, { recursive: true });
  }

  const dxfContent = generateDxf(spec);
  const filePath = join(CAD_OUTPUT_DIR, `${filename}.dxf`);
  await writeFile(filePath, dxfContent, 'utf-8');
  
  return `/uploads/cad-files/${filename}.dxf`;
}

export async function exportToStep(spec: EmbedSpec, filename: string): Promise<string> {
  // Ensure output directory exists
  if (!existsSync(CAD_OUTPUT_DIR)) {
    await mkdir(CAD_OUTPUT_DIR, { recursive: true });
  }

  const stepContent = generateStep(spec);
  const filePath = join(CAD_OUTPUT_DIR, `${filename}.stp`);
  await writeFile(filePath, stepContent, 'utf-8');
  
  return `/uploads/cad-files/${filename}.stp`;
}






