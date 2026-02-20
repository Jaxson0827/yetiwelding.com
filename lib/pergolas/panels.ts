/**
 * Roof panel catalog for pergola 3D viewer.
 * SVG paths point to /patterns/pergola/ (copied from legacy).
 */
export interface RoofDesign {
  id: string;
  name: string;
  svg: string;
  swatch: string;
  plateWidthIn: number;
  plateLengthIn: number;
  thicknessIn: number;
  seamIn: number;
  mirrorEveryOther: boolean;
  screw: { edgeInsetIn: number; spacingIn: number };
}

export const ROOF_DESIGNS: RoofDesign[] = [
  {
    id: 'palmleaf',
    name: 'Palm Leaf',
    svg: '/patterns/pergola/palmleaf.svg',
    swatch: '/swatches/pergola/palmleaf_swatch.webp',
    plateWidthIn: 60,
    plateLengthIn: 120,
    thicknessIn: 0.125,
    seamIn: 0.25,
    mirrorEveryOther: true,
    screw: { edgeInsetIn: 1.0, spacingIn: 18.0 },
  },
  {
    id: 'geocell',
    name: 'GeoCell',
    svg: '/patterns/pergola/geocell.svg',
    swatch: '/swatches/pergola/geocell_swatch.webp',
    plateWidthIn: 60,
    plateLengthIn: 120,
    thicknessIn: 0.125,
    seamIn: 0.25,
    mirrorEveryOther: false,
    screw: { edgeInsetIn: 1.0, spacingIn: 18.0 },
  },
  {
    id: 'geostar',
    name: 'GeoStar',
    svg: '/patterns/pergola/geostar.svg',
    swatch: '/swatches/pergola/geostar_swatch.webp',
    plateWidthIn: 60,
    plateLengthIn: 120,
    thicknessIn: 0.125,
    seamIn: 0.25,
    mirrorEveryOther: false,
    screw: { edgeInsetIn: 1.0, spacingIn: 18.0 },
  },
];

export const ROOF_SWATCHES = ROOF_DESIGNS.map(({ id, name, swatch }) => ({ id, name, swatch }));

export function getDesign(id: string): RoofDesign {
  return ROOF_DESIGNS.find((d) => d.id === id) ?? ROOF_DESIGNS[0];
}
