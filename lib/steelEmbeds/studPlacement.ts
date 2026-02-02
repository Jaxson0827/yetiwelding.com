import { EmbedSpec } from './types';

export type EdgeSideX = 'left' | 'right';
export type EdgeSideY = 'bottom' | 'top';
export type StudPosition = NonNullable<EmbedSpec['studs']>['positions'][number];

export interface StudDefaults {
  diameter: number;
  length: number;
  grade: 'A307' | 'A325';
}

export interface EdgeOffsetRow {
  xSide: EdgeSideX;
  xOffset: number; // inches from chosen X edge to stud center
  ySide: EdgeSideY;
  yOffset: number; // inches from chosen Y edge to stud center
  diameter?: number;
  length?: number;
  grade?: 'A307' | 'A325';
}

export interface EdgeDistances {
  fromLeft: number;
  fromRight: number;
  fromBottom: number;
  fromTop: number;
}

export const EDGE_WARN_YELLOW_IN = 1; // inches
export const EDGE_WARN_RED_IN = 0.5; // inches

export function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function edgeOffsetToCenterX(plateLength: number, side: EdgeSideX, offset: number): number {
  const half = plateLength / 2;
  return side === 'left' ? -half + offset : half - offset;
}

export function edgeOffsetToCenterY(plateWidth: number, side: EdgeSideY, offset: number): number {
  const half = plateWidth / 2;
  return side === 'bottom' ? -half + offset : half - offset;
}

export function centerToEdgeDistances(plateLength: number, plateWidth: number, x: number, y: number): EdgeDistances {
  const halfL = plateLength / 2;
  const halfW = plateWidth / 2;
  return {
    fromLeft: x + halfL,
    fromRight: halfL - x,
    fromBottom: y + halfW,
    fromTop: halfW - y,
  };
}

export function minEdgeDistance(plateLength: number, plateWidth: number, x: number, y: number): number {
  const d = centerToEdgeDistances(plateLength, plateWidth, x, y);
  return Math.min(d.fromLeft, d.fromRight, d.fromBottom, d.fromTop);
}

export function closestEdgeRowFromStud(
  plateLength: number,
  plateWidth: number,
  stud: StudPosition
): EdgeOffsetRow {
  const d = centerToEdgeDistances(plateLength, plateWidth, stud.x, stud.y);
  const xSide: EdgeSideX = d.fromLeft <= d.fromRight ? 'left' : 'right';
  const ySide: EdgeSideY = d.fromBottom <= d.fromTop ? 'bottom' : 'top';
  const xOffset = xSide === 'left' ? d.fromLeft : d.fromRight;
  const yOffset = ySide === 'bottom' ? d.fromBottom : d.fromTop;
  return {
    xSide,
    xOffset: roundToTwoDecimals(xOffset),
    ySide,
    yOffset: roundToTwoDecimals(yOffset),
    diameter: stud.diameter,
    length: stud.length,
    grade: stud.grade,
  };
}

export function studsFromEdgeRows(
  plateLength: number,
  plateWidth: number,
  rows: EdgeOffsetRow[],
  defaults: StudDefaults
): NonNullable<EmbedSpec['studs']>['positions'] {
  return rows.map((row) => ({
    x: roundToTwoDecimals(edgeOffsetToCenterX(plateLength, row.xSide, row.xOffset)),
    y: roundToTwoDecimals(edgeOffsetToCenterY(plateWidth, row.ySide, row.yOffset)),
    diameter: row.diameter ?? defaults.diameter,
    length: row.length ?? defaults.length,
    grade: row.grade ?? defaults.grade,
  }));
}

export function fourStudFromMargins(
  plateLength: number,
  plateWidth: number,
  margins: { left: number; right: number; bottom: number; top: number },
  defaults: StudDefaults
): NonNullable<EmbedSpec['studs']>['positions'] {
  const xs: Array<{ side: EdgeSideX; offset: number }> = [
    { side: 'left', offset: margins.left },
    { side: 'right', offset: margins.right },
  ];
  const ys: Array<{ side: EdgeSideY; offset: number }> = [
    { side: 'bottom', offset: margins.bottom },
    { side: 'top', offset: margins.top },
  ];

  const rows: EdgeOffsetRow[] = [];
  for (const x of xs) {
    for (const y of ys) {
      rows.push({ xSide: x.side, xOffset: x.offset, ySide: y.side, yOffset: y.offset });
    }
  }
  return studsFromEdgeRows(plateLength, plateWidth, rows, defaults);
}

export function twoStudInlineFromMargins(
  plateLength: number,
  plateWidth: number,
  params:
    | {
        orientation: 'horizontal';
        left: number;
        right: number;
        rowY: { mode: 'centered' } | { mode: 'offset'; side: EdgeSideY; offset: number };
      }
    | {
        orientation: 'vertical';
        bottom: number;
        top: number;
        colX: { mode: 'centered' } | { mode: 'offset'; side: EdgeSideX; offset: number };
      },
  defaults: StudDefaults
): NonNullable<EmbedSpec['studs']>['positions'] {
  if (params.orientation === 'horizontal') {
    const y =
      params.rowY.mode === 'centered'
        ? 0
        : roundToTwoDecimals(edgeOffsetToCenterY(plateWidth, params.rowY.side, params.rowY.offset));
    return [
      {
        x: roundToTwoDecimals(edgeOffsetToCenterX(plateLength, 'left', params.left)),
        y,
        diameter: defaults.diameter,
        length: defaults.length,
        grade: defaults.grade,
      },
      {
        x: roundToTwoDecimals(edgeOffsetToCenterX(plateLength, 'right', params.right)),
        y,
        diameter: defaults.diameter,
        length: defaults.length,
        grade: defaults.grade,
      },
    ];
  }

  const x =
    params.colX.mode === 'centered'
      ? 0
      : roundToTwoDecimals(edgeOffsetToCenterX(plateLength, params.colX.side, params.colX.offset));
  return [
    {
      x,
      y: roundToTwoDecimals(edgeOffsetToCenterY(plateWidth, 'bottom', params.bottom)),
      diameter: defaults.diameter,
      length: defaults.length,
      grade: defaults.grade,
    },
    {
      x,
      y: roundToTwoDecimals(edgeOffsetToCenterY(plateWidth, 'top', params.top)),
      diameter: defaults.diameter,
      length: defaults.length,
      grade: defaults.grade,
    },
  ];
}

