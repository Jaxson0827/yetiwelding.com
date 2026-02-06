export const DUMPSTER_GATE_PRINT_VIEWBOX = {
  w: 2200,
  h: 1700,
} as const;

export type DumpsterGateDimPlacement = {
  // Main dimension line endpoints (tick-to-tick)
  x1: number;
  y1: number;
  x2: number;
  y2: number;

  // Label position (center)
  lx: number;
  ly: number;

  // Optional witness/extension anchors on the drawing.
  // When present, we draw plain witness lines from these anchors to (x1,y1) and (x2,y2).
  a1x?: number;
  a1y?: number;
  a2x?: number;
  a2y?: number;
};

/**
 * Coordinate placements for the dumpster gate dimension overlay.
 *
 * Units are in the SVG viewBox coordinate system (matches the source image pixels).
 *
 * These are intentionally "starter" coordinates; use calibration mode
 * (`?calibrateDims=1`) to click endpoints/label centers, then replace these
 * values with the logged coordinates.
 */
export const DUMPSTER_GATE_DIM_PLACEMENTS = {
  enclOverall: {
    x1: 425,
    y1: 96,
    x2: 1790,
    y2: 96,
    lx: 1137,
    ly: 48,
    a1x: 425,
    a1y: 234,
    a2x: 1790,
    a2y: 234,
  },
  enclCTOC: {
    x1: 461,
    y1: 172,
    x2: 1742,
    y2: 172,
    lx: 1087,
    ly: 137,
    a1x: 461,
    a1y: 234,
    a2x: 1742,
    a2y: 234,
  },
  lGap: { x1: 511, y1: 888, x2: 487, y2: 888, lx: 550, ly: 923 },
  cGap: { x1: 1096, y1: 887, x2: 1119, y2: 887, lx: 1158, ly: 918 },
  rGap: { x1: 1704, y1: 881, x2: 1725, y2: 881, lx: 1639, ly: 923 },

  gateHeight: { x1: 879, y1: 232, x2: 879, y2: 885, lx: 734, ly: 570 },
  gateWidth: { x1: 1113, y1: 425, x2: 1704, y2: 425, lx: 1404, ly: 487 },

  blockWidth: { x1: 425, y1: 552, x2: 505, y2: 552, lx: 244, ly: 561 },
  blockHeight: {
    x1: 1878,
    y1: 238,
    x2: 1878,
    y2: 953,
    lx: 2036,
    ly: 671,
    a1x: 1789,
    a1y: 238,
    a2x: 1789,
    a2y: 953,
  },

  bottomGap: { x1: 1268, y1: 953, x2: 1268, y2: 888, lx: 1401, ly: 923 },
  postDepth: {
    x1: 1870,
    y1: 953,
    x2: 1870,
    y2: 1318,
    lx: 1998,
    ly: 1193,
    a1x: 1783,
    a1y: 953,
    a2x: 1783,
    a2y: 1318,
  },
} as const satisfies Record<string, DumpsterGateDimPlacement>;

