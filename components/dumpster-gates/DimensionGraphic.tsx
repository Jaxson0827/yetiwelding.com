'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { GateStyle } from '@/lib/dumpsterGates/types';

import basePrint from './dumpster_print_base.png';
import {
  DUMPSTER_GATE_DIM_PLACEMENTS,
  DUMPSTER_GATE_PRINT_VIEWBOX,
  type DumpsterGateDimPlacement,
} from './dumpsterGatePrintPlacements';

export interface DumpsterGatePrintValues {
  enclOverall?: string;
  enclCTOC?: string;
  lGap?: string;
  cGap?: string;
  rGap?: string;
  gateHeight?: string;
  gateWidth?: string;
  blockWidth?: string;
  blockHeight?: string;
  bottomGap?: string;
  postDepth?: string;
}

interface DimensionGraphicProps {
  values: DumpsterGatePrintValues;
  style: GateStyle;
}

const VIEWBOX_W = DUMPSTER_GATE_PRINT_VIEWBOX.w;
const VIEWBOX_H = DUMPSTER_GATE_PRINT_VIEWBOX.h;

// Dimension overlay colors
const DIM_COLOR = '#ef4444'; // red
const DIM_HIGHLIGHT_COLOR = '#b91c1c'; // darker red for calibration highlight

// Styling to match a "construction plan" look
const MAIN_DIM_STROKE = 2.5;
const MAIN_DIM_STROKE_SMALL = 2;
const MAIN_DIM_STROKE_HIGHLIGHT = 3.5;
const MAIN_DIM_STROKE_SMALL_HIGHLIGHT = 3;

type Point = { x: number; y: number };

function formatLabel(name: string, value?: string) {
  const trimmed = value?.trim();
  return trimmed ? `${name} ${trimmed}` : name;
}

type PlacementKey = keyof typeof DUMPSTER_GATE_DIM_PLACEMENTS;
type Placement = DumpsterGateDimPlacement;
type PlacementMap = Record<PlacementKey, DumpsterGateDimPlacement>;

function clonePlacements() {
  // Simple numeric object deep-clone; avoids structuredClone compatibility issues.
  return JSON.parse(JSON.stringify(DUMPSTER_GATE_DIM_PLACEMENTS)) as PlacementMap;
}

function DimLabel({
  x,
  y,
  text,
  color,
  fontSize,
  fontFamily,
  textAnchor = 'middle',
  dominantBaseline = 'middle',
  transform,
}: {
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  textAnchor?: 'start' | 'middle' | 'end';
  dominantBaseline?:
    | 'auto'
    | 'middle'
    | 'hanging'
    | 'central'
    | 'text-before-edge'
    | 'text-after-edge'
    | 'ideographic'
    | 'alphabetic'
    | 'mathematical'
    | 'inherit';
  transform?: string;
}) {
  const textRef = useRef<SVGTextElement>(null);
  const [bbox, setBbox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const id = requestAnimationFrame(() => {
      try {
        const b = el.getBBox();
        const next = {
          x: Math.round(b.x),
          y: Math.round(b.y),
          width: Math.round(b.width),
          height: Math.round(b.height),
        };

        setBbox((prev) => {
          if (
            prev &&
            prev.x === next.x &&
            prev.y === next.y &&
            prev.width === next.width &&
            prev.height === next.height
          ) {
            return prev;
          }
          return next;
        });
      } catch {
        // getBBox can throw if the element isn't fully rendered yet.
      }
    });

    return () => cancelAnimationFrame(id);
  }, [text, x, y, fontSize, fontFamily, textAnchor, dominantBaseline, transform]);

  const padX = 10;
  const padY = 6;
  const rx = 6;

  return (
    <g pointerEvents="none" transform={transform}>
      {bbox && (
        <rect
          x={bbox.x - padX}
          y={bbox.y - padY}
          width={bbox.width + padX * 2}
          height={bbox.height + padY * 2}
          fill="#ffffff"
          stroke="#d1d5db"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          rx={rx}
          ry={rx}
        />
      )}
      <text
        ref={textRef}
        x={x}
        y={y}
        fill={color}
        fontSize={fontSize}
        fontFamily={fontFamily}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
      >
        {text}
      </text>
    </g>
  );
}

function Dim({
  x1,
  y1,
  x2,
  y2,
  a1x,
  a1y,
  a2x,
  a2y,
  label,
  labelX,
  labelY,
  labelRotate,
  strokeWidth = 4,
  color = DIM_COLOR,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  a1x?: number;
  a1y?: number;
  a2x?: number;
  a2y?: number;
  label: string;
  labelX: number;
  labelY: number;
  labelRotate?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const labelTransform = labelRotate ? `rotate(${labelRotate} ${labelX} ${labelY})` : undefined;

  const hasWitness =
    typeof a1x === 'number' &&
    typeof a1y === 'number' &&
    typeof a2x === 'number' &&
    typeof a2y === 'number';

  // Witness/extension lines should be slightly thinner than the main dim line,
  // and follow it when we change the overall style.
  const witnessStrokeWidth = Math.max(1.2, strokeWidth * 0.8);

  return (
    <g>
      {hasWitness && (
        <>
          <line
            x1={a1x}
            y1={a1y}
            x2={x1}
            y2={y1}
            stroke={color}
            strokeWidth={witnessStrokeWidth}
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={a2x}
            y1={a2y}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={witnessStrokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        markerStart="url(#dimTick)"
        markerEnd="url(#dimTick)"
      />
      <DimLabel
        x={labelX}
        y={labelY}
        text={label}
        color={color}
        fontSize={34}
        fontFamily="Arial, Helvetica, sans-serif"
        textAnchor="middle"
        dominantBaseline="middle"
        transform={labelTransform}
      />
    </g>
  );
}

export default function DimensionGraphic({
  values,
  style,
}: DimensionGraphicProps) {
  const isDoubleSwing = style === 'double-swing';
  const isSingleSwingLeft = style === 'single-swing-left';
  const isSingleSwingRight = style === 'single-swing-right';

  // NOTE: We avoid `useSearchParams()` here because it requires Suspense boundaries
  // during prerender/build. Calibration is a debug-only feature, so reading from
  // `window.location.search` after mount is sufficient.
  const [calibrate, setCalibrate] = useState(false);
  useEffect(() => {
    try {
      const v = new URLSearchParams(window.location.search).get('calibrateDims') === '1';
      setCalibrate(v);
    } catch {
      setCalibrate(false);
    }
  }, []);

  const [lastClick, setLastClick] = useState<Point | null>(null);
  const [draftPlacements, setDraftPlacements] = useState<PlacementMap>(() => clonePlacements());
  const placementKeys = useMemo(() => Object.keys(DUMPSTER_GATE_DIM_PLACEMENTS) as PlacementKey[], []);
  const [activeKey, setActiveKey] = useState<PlacementKey>('enclOverall');
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [calPanelMinimized, setCalPanelMinimized] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    dragging: boolean;
    pointerId: number | null;
    offsetX: number;
    offsetY: number;
  }>({ dragging: false, pointerId: null, offsetX: 0, offsetY: 0 });
  const [panelPos, setPanelPos] = useState<{ x: number; y: number }>({ x: 12, y: 12 });

  const activeHasWitness = useMemo(() => {
    const p = draftPlacements[activeKey];
    return (
      typeof p.a1x === 'number' &&
      typeof p.a1y === 'number' &&
      typeof p.a2x === 'number' &&
      typeof p.a2y === 'number'
    );
  }, [activeKey, draftPlacements]);

  const stepLabel = useMemo(() => {
    if (!activeHasWitness) {
      return activeStep === 0
        ? 'Click 1: dim start (x1,y1)'
        : activeStep === 1
          ? 'Click 2: dim end (x2,y2)'
          : 'Click 3: label center (lx,ly)';
    }

    return activeStep === 0
      ? 'Click 1: witness anchor 1 (a1x,a1y)'
      : activeStep === 1
        ? 'Click 2: witness anchor 2 (a2x,a2y)'
        : activeStep === 2
          ? 'Click 3: dim start (x1,y1)'
          : activeStep === 3
            ? 'Click 4: dim end (x2,y2)'
            : 'Click 5: label center (lx,ly)';
  }, [activeHasWitness, activeStep]);

  const resetActive = useCallback(() => {
    setDraftPlacements((prev) => ({
      ...prev,
      [activeKey]: DUMPSTER_GATE_DIM_PLACEMENTS[activeKey],
    }));
    setActiveStep(0);
  }, [activeKey]);

  const resetAll = useCallback(() => {
    setDraftPlacements(clonePlacements());
    setActiveStep(0);
  }, []);

  const copyActiveEntry = useCallback(async () => {
    const p = draftPlacements[activeKey];
    const witness =
      typeof p.a1x === 'number' &&
      typeof p.a1y === 'number' &&
      typeof p.a2x === 'number' &&
      typeof p.a2y === 'number'
        ? `, a1x: ${p.a1x}, a1y: ${p.a1y}, a2x: ${p.a2x}, a2y: ${p.a2y}`
        : '';
    const snippet = `${activeKey}: { x1: ${p.x1}, y1: ${p.y1}, x2: ${p.x2}, y2: ${p.y2}, lx: ${p.lx}, ly: ${p.ly}${witness} },`;
    try {
      await navigator.clipboard.writeText(snippet);
      // eslint-disable-next-line no-console
      console.log('[dumpster-gate-dims] copied', snippet);
    } catch {
      // eslint-disable-next-line no-console
      console.log('[dumpster-gate-dims] copy_failed', snippet);
    }
  }, [activeKey, draftPlacements]);

  const toggleWitnessForActive = useCallback(
    (enabled: boolean) => {
      setDraftPlacements((prev) => {
        const current = prev[activeKey];

        if (enabled) {
          // Seed anchors near the current endpoints so the user can refine with clicks.
          const seeded: Placement = {
            ...current,
            a1x: typeof current.a1x === 'number' ? current.a1x : current.x1,
            a1y: typeof current.a1y === 'number' ? current.a1y : current.y1,
            a2x: typeof current.a2x === 'number' ? current.a2x : current.x2,
            a2y: typeof current.a2y === 'number' ? current.a2y : current.y2,
          };
          return { ...prev, [activeKey]: seeded };
        }

        // Disable witness lines by removing anchors.
        const { a1x, a1y, a2x, a2y, ...rest } = current as Placement & {
          a1x?: number;
          a1y?: number;
          a2x?: number;
          a2y?: number;
        };
        return { ...prev, [activeKey]: rest as Placement };
      });

      setActiveStep(0);
    },
    [activeKey]
  );

  const handleSvgClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!calibrate) return;

      const svg = e.currentTarget;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;

      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const p = pt.matrixTransform(ctm.inverse());

      const rounded = { x: Math.round(p.x), y: Math.round(p.y) };
      setLastClick(rounded);

      setDraftPlacements((prev) => {
        const current = prev[activeKey] as Placement;
        const hasWitness =
          typeof current.a1x === 'number' &&
          typeof current.a1y === 'number' &&
          typeof current.a2x === 'number' &&
          typeof current.a2y === 'number';

        let next: Placement = current;
        let label: string;

        if (!hasWitness) {
          label = activeStep === 0 ? 'x1y1' : activeStep === 1 ? 'x2y2' : 'lxly';
          next =
            activeStep === 0
              ? { ...current, x1: rounded.x, y1: rounded.y }
              : activeStep === 1
                ? { ...current, x2: rounded.x, y2: rounded.y }
                : { ...current, lx: rounded.x, ly: rounded.y };
        } else {
          label =
            activeStep === 0
              ? 'a1'
              : activeStep === 1
                ? 'a2'
                : activeStep === 2
                  ? 'x1y1'
                  : activeStep === 3
                    ? 'x2y2'
                    : 'lxly';

          next =
            activeStep === 0
              ? { ...current, a1x: rounded.x, a1y: rounded.y }
              : activeStep === 1
                ? { ...current, a2x: rounded.x, a2y: rounded.y }
                : activeStep === 2
                  ? { ...current, x1: rounded.x, y1: rounded.y }
                  : activeStep === 3
                    ? { ...current, x2: rounded.x, y2: rounded.y }
                    : { ...current, lx: rounded.x, ly: rounded.y };
        }

        // eslint-disable-next-line no-console
        console.log('[dumpster-gate-dims]', activeKey, label, rounded.x, rounded.y);

        const isFinalClick = !hasWitness ? activeStep === 2 : activeStep === 4;
        if (isFinalClick) {
          const witness =
            typeof next.a1x === 'number' &&
            typeof next.a1y === 'number' &&
            typeof next.a2x === 'number' &&
            typeof next.a2y === 'number'
              ? `, a1x: ${next.a1x}, a1y: ${next.a1y}, a2x: ${next.a2x}, a2y: ${next.a2y}`
              : '';
          const snippet = `${activeKey}: { x1: ${next.x1}, y1: ${next.y1}, x2: ${next.x2}, y2: ${next.y2}, lx: ${next.lx}, ly: ${next.ly}${witness} },`;
          // eslint-disable-next-line no-console
          console.log('[dumpster-gate-dims]', 'paste:', snippet);
        }

        return { ...prev, [activeKey]: next };
      });

      setActiveStep((s) => {
        const p = draftPlacements[activeKey];
        const hasWitness =
          typeof p.a1x === 'number' &&
          typeof p.a1y === 'number' &&
          typeof p.a2x === 'number' &&
          typeof p.a2y === 'number';
        const max = hasWitness ? 4 : 2;
        return (s === max ? 0 : (s + 1)) as 0 | 1 | 2 | 3 | 4;
      });
    },
    [activeKey, activeStep, calibrate, draftPlacements]
  );

  const clampPanelPos = useCallback((x: number, y: number) => {
    const wrapper = wrapperRef.current;
    const panel = panelRef.current;
    if (!wrapper || !panel) return { x, y };

    const padding = 6;
    const w = wrapper.clientWidth;
    const h = wrapper.clientHeight;
    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;

    const maxX = Math.max(padding, w - pw - padding);
    const maxY = Math.max(padding, h - ph - padding);

    return {
      x: Math.min(Math.max(x, padding), maxX),
      y: Math.min(Math.max(y, padding), maxY),
    };
  }, []);

  const handlePanelPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!calibrate) return;
    if (e.button !== 0) return; // left-click only

    const wrapper = wrapperRef.current;
    const panel = panelRef.current;
    if (!wrapper || !panel) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();

    dragRef.current.dragging = true;
    dragRef.current.pointerId = e.pointerId;
    dragRef.current.offsetX = e.clientX - panelRect.left;
    dragRef.current.offsetY = e.clientY - panelRect.top;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Prevent text selection / accidental clicks while starting drag
    e.preventDefault();
    e.stopPropagation();

    // Ensure the panel is clamped on drag start (in case resize happened)
    const startX = panelRect.left - wrapperRect.left;
    const startY = panelRect.top - wrapperRect.top;
    setPanelPos(clampPanelPos(startX, startY));
  }, [calibrate, clampPanelPos]);

  const handlePanelPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging) return;
    if (dragRef.current.pointerId !== e.pointerId) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const rawX = e.clientX - wrapperRect.left - dragRef.current.offsetX;
    const rawY = e.clientY - wrapperRect.top - dragRef.current.offsetY;
    setPanelPos(clampPanelPos(rawX, rawY));

    e.preventDefault();
  }, [clampPanelPos]);

  const handlePanelPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) return;
    dragRef.current.dragging = false;
    dragRef.current.pointerId = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    e.preventDefault();
  }, []);

  // NOTE: These are starter coordinates. Use `?calibrateDims=1` and click
  // endpoints/label centers to refine and lock them in.
  const placements: PlacementMap = calibrate
    ? draftPlacements
    : (DUMPSTER_GATE_DIM_PLACEMENTS as unknown as PlacementMap);

  return (
    <div className="w-full">
      <div
        className="relative w-full max-w-3xl mx-auto bg-white rounded-lg overflow-hidden border border-gray-300"
        style={{ aspectRatio: `${VIEWBOX_W} / ${VIEWBOX_H}` }}
        ref={wrapperRef}
      >
        <Image
          src={basePrint}
          alt="Dumpster gate base print"
          fill
          className="object-contain"
          priority
        />

        {calibrate && (
          <div
            className="absolute z-10"
            style={{ left: panelPos.x, top: panelPos.y }}
            ref={panelRef}
          >
            <div
              className={`rounded-md border border-gray-300 bg-white/95 shadow-sm ${
                calPanelMinimized ? 'p-1' : 'p-3'
              }`}
              style={{ maxWidth: calPanelMinimized ? undefined : 420 }}
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className="flex items-center gap-2 select-none"
                  onPointerDown={handlePanelPointerDown}
                  onPointerMove={handlePanelPointerMove}
                  onPointerUp={handlePanelPointerUp}
                  onPointerCancel={handlePanelPointerUp}
                  style={{ touchAction: 'none', cursor: 'grab' }}
                  title="Drag to move"
                >
                  <div className="text-xs font-semibold text-gray-800">
                    Calibration
                  </div>
                  <div className="text-[11px] text-gray-600">(drag)</div>
                </div>
                <button
                  type="button"
                  className="rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                  onClick={() => setCalPanelMinimized((v) => !v)}
                  title={calPanelMinimized ? 'Expand panel' : 'Minimize panel'}
                >
                  {calPanelMinimized ? 'Expand' : 'Minimize'}
                </button>
              </div>

              {!calPanelMinimized && (
                <>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="text-xs font-semibold text-gray-800">Placing</div>
                    <select
                      className="min-w-[160px] rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                      value={activeKey}
                      onChange={(e) => {
                        setActiveKey(e.target.value as PlacementKey);
                        setActiveStep(0);
                      }}
                    >
                      {placementKeys.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-2 rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-800">
                      <input
                        type="checkbox"
                        checked={activeHasWitness}
                        onChange={(e) => toggleWitnessForActive(e.target.checked)}
                      />
                      Witness lines
                    </label>
                    <button
                      type="button"
                      className="rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={resetActive}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={resetAll}
                    >
                      Reset all
                    </button>
                    <button
                      type="button"
                      className="rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={copyActiveEntry}
                    >
                      Copy entry
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-gray-700">{stepLabel}</div>
                  <div className="mt-1 text-[11px] text-gray-600">
                    Last click: {lastClick ? `${lastClick.x}, ${lastClick.y}` : '—'}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          preserveAspectRatio="xMidYMid meet"
          onClick={handleSvgClick}
        >
          <defs>
            <marker
              id="dimTick"
              viewBox="0 0 12 12"
              refX="6"
              refY="6"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              {/* Construction-plan style "tick" mark.
                  Uses `context-stroke` so it inherits the line color (blue/red). */}
              <path
                d="M 2 10 L 10 2"
                fill="none"
                stroke="context-stroke"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </marker>
          </defs>

          <g pointerEvents={calibrate ? 'auto' : 'none'}>
            <Dim
              x1={placements.enclOverall.x1}
              y1={placements.enclOverall.y1}
              x2={placements.enclOverall.x2}
              y2={placements.enclOverall.y2}
              a1x={placements.enclOverall.a1x}
              a1y={placements.enclOverall.a1y}
              a2x={placements.enclOverall.a2x}
              a2y={placements.enclOverall.a2y}
              label={formatLabel('ENCL. OVERALL', values.enclOverall)}
              labelX={placements.enclOverall.lx}
              labelY={placements.enclOverall.ly}
              color={calibrate && activeKey === 'enclOverall' ? DIM_HIGHLIGHT_COLOR : DIM_COLOR}
              strokeWidth={calibrate && activeKey === 'enclOverall' ? MAIN_DIM_STROKE_HIGHLIGHT : MAIN_DIM_STROKE}
            />

            <Dim
              x1={placements.enclCTOC.x1}
              y1={placements.enclCTOC.y1}
              x2={placements.enclCTOC.x2}
              y2={placements.enclCTOC.y2}
              a1x={placements.enclCTOC.a1x}
              a1y={placements.enclCTOC.a1y}
              a2x={placements.enclCTOC.a2x}
              a2y={placements.enclCTOC.a2y}
              label={formatLabel('ENCL. C TO C', values.enclCTOC)}
              labelX={placements.enclCTOC.lx}
              labelY={placements.enclCTOC.ly}
              color={calibrate && activeKey === 'enclCTOC' ? DIM_HIGHLIGHT_COLOR : DIM_COLOR}
              strokeWidth={calibrate && activeKey === 'enclCTOC' ? MAIN_DIM_STROKE_HIGHLIGHT : MAIN_DIM_STROKE}
            />

            <Dim
              x1={placements.lGap.x1}
              y1={placements.lGap.y1}
              x2={placements.lGap.x2}
              y2={placements.lGap.y2}
              a1x={placements.lGap.a1x}
              a1y={placements.lGap.a1y}
              a2x={placements.lGap.a2x}
              a2y={placements.lGap.a2y}
              label={formatLabel('L_GAP', values.lGap)}
              labelX={placements.lGap.lx}
              labelY={placements.lGap.ly}
              strokeWidth={calibrate && activeKey === 'lGap' ? MAIN_DIM_STROKE_SMALL_HIGHLIGHT : MAIN_DIM_STROKE_SMALL}
              color={calibrate && activeKey === 'lGap' ? DIM_HIGHLIGHT_COLOR : DIM_COLOR}
            />

            {isDoubleSwing && (
              <Dim
                x1={placements.cGap.x1}
                y1={placements.cGap.y1}
                x2={placements.cGap.x2}
                y2={placements.cGap.y2}
                a1x={placements.cGap.a1x}
                a1y={placements.cGap.a1y}
                a2x={placements.cGap.a2x}
                a2y={placements.cGap.a2y}
                label={formatLabel('C_GAP', values.cGap)}
                labelX={placements.cGap.lx}
                labelY={placements.cGap.ly}
                strokeWidth={calibrate && activeKey === 'cGap' ? MAIN_DIM_STROKE_SMALL_HIGHLIGHT : MAIN_DIM_STROKE_SMALL}
                color={calibrate && activeKey === 'cGap' ? DIM_HIGHLIGHT_COLOR : DIM_COLOR}
              />
            )}

            <Dim
              x1={placements.rGap.x1}
              y1={placements.rGap.y1}
              x2={placements.rGap.x2}
              y2={placements.rGap.y2}
              a1x={placements.rGap.a1x}
              a1y={placements.rGap.a1y}
              a2x={placements.rGap.a2x}
              a2y={placements.rGap.a2y}
              label={formatLabel('R_GAP', values.rGap)}
              labelX={placements.rGap.lx}
              labelY={placements.rGap.ly}
              strokeWidth={calibrate && activeKey === 'rGap' ? MAIN_DIM_STROKE_SMALL_HIGHLIGHT : MAIN_DIM_STROKE_SMALL}
              color={calibrate && activeKey === 'rGap' ? DIM_HIGHLIGHT_COLOR : DIM_COLOR}
            />

            {/* Gate dimensions */}
            {(isDoubleSwing || isSingleSwingLeft) && (
              <Dim
                x1={placements.gateHeight.x1}
                y1={placements.gateHeight.y1}
                x2={placements.gateHeight.x2}
                y2={placements.gateHeight.y2}
                a1x={placements.gateHeight.a1x}
                a1y={placements.gateHeight.a1y}
                a2x={placements.gateHeight.a2x}
                a2y={placements.gateHeight.a2y}
                label={formatLabel('GATE HEIGHT', values.gateHeight)}
                labelX={placements.gateHeight.lx}
                labelY={placements.gateHeight.ly}
                color={calibrate && activeKey === 'gateHeight' ? DIM_HIGHLIGHT_COLOR : DIM_COLOR}
                strokeWidth={calibrate && activeKey === 'gateHeight' ? MAIN_DIM_STROKE_HIGHLIGHT : MAIN_DIM_STROKE}
              />
            )}

            {(isDoubleSwing || isSingleSwingRight) && (
              <Dim
                x1={placements.gateWidth.x1}
                y1={placements.gateWidth.y1}
                x2={placements.gateWidth.x2}
                y2={placements.gateWidth.y2}
                a1x={placements.gateWidth.a1x}
                a1y={placements.gateWidth.a1y}
                a2x={placements.gateWidth.a2x}
                a2y={placements.gateWidth.a2y}
                label={formatLabel('GATE WIDTH', values.gateWidth)}
                labelX={placements.gateWidth.lx}
                labelY={placements.gateWidth.ly}
                color={calibrate && activeKey === 'gateWidth' ? DIM_HIGHLIGHT_COLOR : DIM_COLOR}
                strokeWidth={calibrate && activeKey === 'gateWidth' ? MAIN_DIM_STROKE_HIGHLIGHT : MAIN_DIM_STROKE}
              />
            )}

            {/* Block / enclosure */}
            <Dim
              x1={placements.blockWidth.x1}
              y1={placements.blockWidth.y1}
              x2={placements.blockWidth.x2}
              y2={placements.blockWidth.y2}
              a1x={placements.blockWidth.a1x}
              a1y={placements.blockWidth.a1y}
              a2x={placements.blockWidth.a2x}
              a2y={placements.blockWidth.a2y}
              label={formatLabel('BLOCK WIDTH', values.blockWidth)}
              labelX={placements.blockWidth.lx}
              labelY={placements.blockWidth.ly}
              strokeWidth={calibrate && activeKey === 'blockWidth' ? MAIN_DIM_STROKE_SMALL_HIGHLIGHT : MAIN_DIM_STROKE_SMALL}
              color={calibrate && activeKey === 'blockWidth' ? DIM_HIGHLIGHT_COLOR : DIM_COLOR}
            />

            <Dim
              x1={placements.blockHeight.x1}
              y1={placements.blockHeight.y1}
              x2={placements.blockHeight.x2}
              y2={placements.blockHeight.y2}
              a1x={placements.blockHeight.a1x}
              a1y={placements.blockHeight.a1y}
              a2x={placements.blockHeight.a2x}
              a2y={placements.blockHeight.a2y}
              label={formatLabel('BLOCK HEIGHT', values.blockHeight)}
              labelX={placements.blockHeight.lx}
              labelY={placements.blockHeight.ly}
              strokeWidth={calibrate && activeKey === 'blockHeight' ? MAIN_DIM_STROKE_SMALL_HIGHLIGHT : MAIN_DIM_STROKE_SMALL}
              color={calibrate && activeKey === 'blockHeight' ? DIM_HIGHLIGHT_COLOR : DIM_COLOR}
            />

            {/* Bottom gap and post depth */}
            <Dim
              x1={placements.bottomGap.x1}
              y1={placements.bottomGap.y1}
              x2={placements.bottomGap.x2}
              y2={placements.bottomGap.y2}
              a1x={placements.bottomGap.a1x}
              a1y={placements.bottomGap.a1y}
              a2x={placements.bottomGap.a2x}
              a2y={placements.bottomGap.a2y}
              label={formatLabel('BOTTOM GAP', values.bottomGap)}
              labelX={placements.bottomGap.lx}
              labelY={placements.bottomGap.ly}
              strokeWidth={calibrate && activeKey === 'bottomGap' ? MAIN_DIM_STROKE_SMALL_HIGHLIGHT : MAIN_DIM_STROKE_SMALL}
              color={calibrate && activeKey === 'bottomGap' ? DIM_HIGHLIGHT_COLOR : DIM_COLOR}
            />

            <Dim
              x1={placements.postDepth.x1}
              y1={placements.postDepth.y1}
              x2={placements.postDepth.x2}
              y2={placements.postDepth.y2}
              a1x={placements.postDepth.a1x}
              a1y={placements.postDepth.a1y}
              a2x={placements.postDepth.a2x}
              a2y={placements.postDepth.a2y}
              label={formatLabel('POST DEPTH', values.postDepth)}
              labelX={placements.postDepth.lx}
              labelY={placements.postDepth.ly}
              strokeWidth={calibrate && activeKey === 'postDepth' ? MAIN_DIM_STROKE_SMALL_HIGHLIGHT : MAIN_DIM_STROKE_SMALL}
              color={calibrate && activeKey === 'postDepth' ? DIM_HIGHLIGHT_COLOR : DIM_COLOR}
            />

            {calibrate && (
              <>
                {lastClick && (
                  <g>
                    <line
                      x1={lastClick.x - 25}
                      y1={lastClick.y}
                      x2={lastClick.x + 25}
                      y2={lastClick.y}
                      stroke="#ef4444"
                      strokeWidth={3}
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={lastClick.x}
                      y1={lastClick.y - 25}
                      x2={lastClick.x}
                      y2={lastClick.y + 25}
                      stroke="#ef4444"
                      strokeWidth={3}
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                )}
              </>
            )}
          </g>
        </svg>
      </div>
      
      {/* Caption */}
      <p className="text-white/60 text-sm text-center mt-4">
        Illustration for reference. Dimensions shown reflect selected configuration.
      </p>
    </div>
  );
}

