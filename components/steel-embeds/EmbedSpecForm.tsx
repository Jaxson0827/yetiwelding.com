'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfigDropdown, { DropdownOption } from '../ConfigDropdown';
import PriceDisplay from './PriceDisplay';
import { EmbedSpec, VALIDATION_CONSTRAINTS } from '@/lib/steelEmbeds/types';
import { validateEmbedSpec, isEmbedSpecComplete } from '@/lib/steelEmbeds/validation';
import { priceEmbed } from '@/lib/steelEmbeds/pricing';
import {
  EDGE_WARN_RED_IN,
  EDGE_WARN_YELLOW_IN,
  closestEdgeRowFromStud,
  fourStudFromMargins,
  minEdgeDistance,
  studsFromEdgeRows,
  twoStudInlineFromMargins,
  type EdgeOffsetRow,
  type EdgeSideX,
  type EdgeSideY,
} from '@/lib/steelEmbeds/studPlacement';

interface EmbedSpecFormProps {
  onSpecChange: (spec: Partial<EmbedSpec>) => void;
  onAddToCart: (spec: EmbedSpec) => void;
}

type FormStep = 1 | 2 | 3 | 4;
type EmbedSpecDraft = Omit<Partial<EmbedSpec>, 'plate'> & {
  plate?: Partial<EmbedSpec['plate']>;
};

type StudPreset = 'fourSquare' | 'twoInline' | 'custom';
type StudInputStyle = 'plan' | 'offsets';

const STUD_PRESET_OPTIONS: DropdownOption[] = [
  { value: 'fourSquare', label: '4-stud square/rectangle' },
  { value: 'twoInline', label: '2-stud inline' },
  { value: 'custom', label: 'Custom' },
];

const STUD_INPUT_STYLE_OPTIONS: DropdownOption[] = [
  { value: 'plan', label: 'Plan style (margins + gauge)' },
  { value: 'offsets', label: 'Offsets table (from edges)' },
];

const MATERIAL_OPTIONS: DropdownOption[] = [
  { value: 'A36', label: 'A36' },
  { value: 'A572', label: 'A572' },
  { value: 'A588', label: 'A588' },
  { value: 'A992', label: 'A992' },
];

const FINISH_OPTIONS: DropdownOption[] = [
  { value: 'none', label: 'None' },
  { value: 'primer', label: 'Primer' },
  { value: 'galv', label: 'Galvanized' },
];

const STUD_GRADE_OPTIONS: DropdownOption[] = [
  { value: 'A307', label: 'A307' },
  { value: 'A325', label: 'A325' },
];

const DEFAULT_STUD: { diameter: number; length: number; grade: 'A307' | 'A325' } = { diameter: 0.5, length: 4, grade: 'A307' };

const DEFAULT_SPEC: Partial<EmbedSpec> = {
  plate: {
    length: undefined as any,
    width: undefined as any,
    thickness: undefined as any,
    material: 'A36',
  },
  finish: 'none',
  quantity: 1,
  // Lead time is not configurable in the UI; keep as standard for all embeds.
  leadTime: 'standard',
};

export default function EmbedSpecForm({
  onSpecChange,
  onAddToCart,
}: EmbedSpecFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [defaultStud, setDefaultStud] = useState(DEFAULT_STUD);
  const [expandedStudIndex, setExpandedStudIndex] = useState<number | null>(null);
  const [selectedStudIndexInternal, setSelectedStudIndexInternal] = useState<number | null>(null);
  const [studPreset, setStudPreset] = useState<StudPreset>('fourSquare');
  const [studInputStyle, setStudInputStyle] = useState<StudInputStyle>('plan');
  const [offsetRows, setOffsetRows] = useState<EdgeOffsetRow[]>([]);

  // 4-stud plan-style margins (inches)
  const [fourEqX, setFourEqX] = useState(true);
  const [fourLeft, setFourLeft] = useState<number>(2);
  const [fourRight, setFourRight] = useState<number>(2);
  const [fourEqY, setFourEqY] = useState(true);
  const [fourBottom, setFourBottom] = useState<number>(2);
  const [fourTop, setFourTop] = useState<number>(2);

  // 2-stud inline plan-style margins + row/col offset
  const [twoOrientation, setTwoOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [twoEqAxis, setTwoEqAxis] = useState(true);
  const [twoStart, setTwoStart] = useState<number>(2);
  const [twoEnd, setTwoEnd] = useState<number>(2);
  const [twoCrossMode, setTwoCrossMode] = useState<'centered' | 'offset'>('centered');
  const [twoCrossSide, setTwoCrossSide] = useState<EdgeSideY | EdgeSideX>('bottom');
  const [twoCrossOffset, setTwoCrossOffset] = useState<number>(2);
  const [studLayoutError, setStudLayoutError] = useState<string | null>(null);

  const [spec, setSpec] = useState<Partial<EmbedSpec>>(DEFAULT_SPEC);

  // Update parent when spec changes
  useEffect(() => {
    onSpecChange(spec);
  }, [spec, onSpecChange]);

  // Validate and calculate price
  const priceBreakdown = useMemo(() => {
    const specForValidation = spec as Partial<EmbedSpec>;
    if (isEmbedSpecComplete(specForValidation)) {
      const errors = validateEmbedSpec(specForValidation);
      if (errors.length === 0) {
        return priceEmbed(specForValidation as EmbedSpec);
      }
    }
    return null;
  }, [spec]);

  // Validation errors
  useEffect(() => {
    const errors = validateEmbedSpec(spec as Partial<EmbedSpec>);
    const errorMap: Record<string, string> = {};
    errors.forEach(err => {
      errorMap[err.field] = err.message;
    });
    setValidationErrors(errorMap);
  }, [spec]);

  const updateSpec = (updates: Partial<EmbedSpecDraft>) => {
    setSpec(prev => ({ ...prev, ...updates } as Partial<EmbedSpec>));
  };

  const updatePlate = (updates: Partial<EmbedSpec['plate']>) => {
    setSpec(prev => ({
      ...prev,
      plate: { ...prev.plate!, ...updates },
    }));
  };

  const canJumpToStep = (targetStep: FormStep): boolean => {
    // To jump to step N, all prior steps must be valid.
    for (let s: FormStep = 1; s < targetStep; s = (s + 1) as FormStep) {
      if (!canProceedToNextStep(s)) return false;
    }
    return true;
  };

  const clampToPlate = (x: number, y: number) => {
    const length = spec.plate?.length;
    const width = spec.plate?.width;
    if (!length || !width) return { x, y };
    const halfL = length / 2;
    const halfW = width / 2;
    return {
      x: roundToTwoDecimals(Math.max(-halfL, Math.min(halfL, x))) ?? x,
      y: roundToTwoDecimals(Math.max(-halfW, Math.min(halfW, y))) ?? y,
    };
  };

  const canProceedToNextStep = (step: FormStep): boolean => {
    switch (step) {
      case 1:
        return !!(
          spec.plate?.length &&
          spec.plate?.width &&
          spec.plate?.thickness &&
          spec.plate?.material &&
          !validationErrors['plate.length'] &&
          !validationErrors['plate.width'] &&
          !validationErrors['plate.thickness']
        );
      case 2:
        // Step 2 (Features) is optional, but if studs are specified, they must be valid
        if (spec.studs?.positions && spec.studs.positions.length > 0) {
          // Validate that all studs have required properties
          for (const stud of spec.studs.positions) {
            if (!stud.diameter || !stud.length || !stud.grade) {
              return false;
            }
          }
        }
        return true;
      case 3:
        return !!(
          spec.finish &&
          spec.quantity &&
          spec.quantity >= VALIDATION_CONSTRAINTS.quantity.min &&
          !validationErrors['quantity']
        );
      case 4:
        // Project info is optional
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep(currentStep) && currentStep < 4) {
      setCurrentStep((currentStep + 1) as FormStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as FormStep);
    }
  };

  const handleAddToCart = () => {
    const specForValidation = spec as Partial<EmbedSpec>;
    if (isEmbedSpecComplete(specForValidation) && validateEmbedSpec(specForValidation).length === 0) {
      onAddToCart(specForValidation as EmbedSpec);

      // Reset UI back to a clean Step 1 state for the next embed.
      setCurrentStep(1);
      setValidationErrors({});
      setDefaultStud(DEFAULT_STUD);
      setExpandedStudIndex(null);
      setSelectedStudIndexInternal(null);
      setStudPreset('fourSquare');
      setStudInputStyle('plan');
      setOffsetRows([]);
      setStudLayoutError(null);

      // Reset plan-style layout defaults
      setFourEqX(true);
      setFourLeft(2);
      setFourRight(2);
      setFourEqY(true);
      setFourBottom(2);
      setFourTop(2);

      setTwoOrientation('horizontal');
      setTwoEqAxis(true);
      setTwoStart(2);
      setTwoEnd(2);
      setTwoCrossMode('centered');
      setTwoCrossSide('bottom');
      setTwoCrossOffset(2);

      // Reset the spec last so effects propagate the clean state to the preview.
      setSpec(DEFAULT_SPEC);
    }
  };

  const parseNumber = (value: string): number | undefined => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  };

  const roundToTwoDecimals = (value: number | undefined): number | undefined => {
    if (value === undefined) return undefined;
    return Math.round(value * 100) / 100;
  };

  const selectedStudIndex = selectedStudIndexInternal;
  const setSelectedStudIndex = setSelectedStudIndexInternal;

  const normalizeStudIndexAfterRemoval = (removedIndex: number) => {
    // Expanded index adjustments (existing behavior)
    if (expandedStudIndex === removedIndex) setExpandedStudIndex(null);
    else if (expandedStudIndex !== null && expandedStudIndex > removedIndex) setExpandedStudIndex(expandedStudIndex - 1);

    // Selected index adjustments (new)
    let nextSelected = selectedStudIndex;
    if (selectedStudIndex === removedIndex) nextSelected = null;
    else if (selectedStudIndex !== null && selectedStudIndex > removedIndex) nextSelected = selectedStudIndex - 1;
    setSelectedStudIndex(nextSelected);
    return nextSelected;
  };

  const validateStudLayout = (): { ok: boolean; message?: string } => {
    const plateLength = spec.plate?.length;
    const plateWidth = spec.plate?.width;
    if (!plateLength || !plateWidth) return { ok: false, message: 'Enter plate length and width first.' };

    if (studInputStyle === 'offsets' || studPreset === 'custom') {
      if (offsetRows.length === 0) return { ok: true };
      for (let i = 0; i < offsetRows.length; i++) {
        const r = offsetRows[i]!;
        if (r.xOffset < 0 || r.xOffset > plateLength) return { ok: false, message: `Row ${i + 1}: X offset must be between 0 and ${plateLength}".` };
        if (r.yOffset < 0 || r.yOffset > plateWidth) return { ok: false, message: `Row ${i + 1}: Y offset must be between 0 and ${plateWidth}".` };
      }
      return { ok: true };
    }

    if (studPreset === 'fourSquare') {
      const left = fourLeft;
      const right = fourEqX ? fourLeft : fourRight;
      const bottom = fourBottom;
      const top = fourEqY ? fourBottom : fourTop;
      if ([left, right, bottom, top].some((v) => v < 0)) return { ok: false, message: 'Margins must be 0 or greater.' };
      const gx = plateLength - left - right;
      const gy = plateWidth - bottom - top;
      if (gx <= 0) return { ok: false, message: 'X margins are too large for this plate.' };
      if (gy <= 0) return { ok: false, message: 'Y margins are too large for this plate.' };
      return { ok: true };
    }

    // twoInline
    if (twoOrientation === 'horizontal') {
      const left = twoStart;
      const right = twoEqAxis ? twoStart : twoEnd;
      if ([left, right].some((v) => v < 0)) return { ok: false, message: 'Margins must be 0 or greater.' };
      if (plateLength - left - right <= 0) return { ok: false, message: 'End margins are too large for this plate length.' };
      if (twoCrossMode === 'offset') {
        const cross = twoCrossOffset;
        if (cross < 0 || cross > plateWidth) return { ok: false, message: `Row offset must be between 0 and ${plateWidth}".` };
      }
      return { ok: true };
    }

    const bottom = twoStart;
    const top = twoEqAxis ? twoStart : twoEnd;
    if ([bottom, top].some((v) => v < 0)) return { ok: false, message: 'Margins must be 0 or greater.' };
    if (plateWidth - bottom - top <= 0) return { ok: false, message: 'End margins are too large for this plate width.' };
    if (twoCrossMode === 'offset') {
      const cross = twoCrossOffset;
      if (cross < 0 || cross > plateLength) return { ok: false, message: `Column offset must be between 0 and ${plateLength}".` };
    }
    return { ok: true };
  };

  const applyStudPreset = () => {
    const validation = validateStudLayout();
    if (!validation.ok) {
      setStudLayoutError(validation.message ?? 'Invalid stud layout.');
      return;
    }
    setStudLayoutError(null);

    const plateLength = spec.plate?.length;
    const plateWidth = spec.plate?.width;
    if (!plateLength || !plateWidth) return;

    if (studInputStyle === 'offsets' || studPreset === 'custom') {
      const positions = studsFromEdgeRows(plateLength, plateWidth, offsetRows, defaultStud);
      updateSpec({ studs: positions.length > 0 ? { positions } : undefined });
      if (positions.length > 0) {
        setSelectedStudIndex(0);
      } else {
        setSelectedStudIndex(null);
      }
      return;
    }

    if (studPreset === 'fourSquare') {
      const left = fourLeft;
      const right = fourEqX ? fourLeft : fourRight;
      const bottom = fourBottom;
      const top = fourEqY ? fourBottom : fourTop;
      const positions = fourStudFromMargins(
        plateLength,
        plateWidth,
        { left, right, bottom, top },
        defaultStud
      );
      updateSpec({ studs: { positions } });
      setSelectedStudIndex(0);
      return;
    }

    // twoInline
    if (twoOrientation === 'horizontal') {
      const left = twoStart;
      const right = twoEqAxis ? twoStart : twoEnd;
      const rowY =
        twoCrossMode === 'centered'
          ? { mode: 'centered' as const }
          : { mode: 'offset' as const, side: (twoCrossSide as EdgeSideY) ?? 'bottom', offset: twoCrossOffset };
      const positions = twoStudInlineFromMargins(
        plateLength,
        plateWidth,
        { orientation: 'horizontal', left, right, rowY },
        defaultStud
      );
      updateSpec({ studs: { positions } });
      setSelectedStudIndex(0);
      return;
    }

    const bottom = twoStart;
    const top = twoEqAxis ? twoStart : twoEnd;
    const colX =
      twoCrossMode === 'centered'
        ? { mode: 'centered' as const }
        : { mode: 'offset' as const, side: (twoCrossSide as EdgeSideX) ?? 'left', offset: twoCrossOffset };
    const positions = twoStudInlineFromMargins(
      plateLength,
      plateWidth,
      { orientation: 'vertical', bottom, top, colX },
      defaultStud
    );
    updateSpec({ studs: { positions } });
    setSelectedStudIndex(0);
  };

  // Keep offset rows in sync when switching to offsets style
  useEffect(() => {
    const plateLength = spec.plate?.length;
    const plateWidth = spec.plate?.width;
    if (!plateLength || !plateWidth) return;

    if (studInputStyle !== 'offsets' && studPreset !== 'custom') return;

    const existing = spec.studs?.positions ?? [];
    if (existing.length === 0) {
      // Initialize rows by preset
      if (studPreset === 'fourSquare') {
        setOffsetRows([
          { xSide: 'left', xOffset: fourLeft, ySide: 'bottom', yOffset: fourBottom },
          { xSide: 'right', xOffset: fourEqX ? fourLeft : fourRight, ySide: 'bottom', yOffset: fourBottom },
          { xSide: 'left', xOffset: fourLeft, ySide: 'top', yOffset: fourEqY ? fourBottom : fourTop },
          { xSide: 'right', xOffset: fourEqX ? fourLeft : fourRight, ySide: 'top', yOffset: fourEqY ? fourBottom : fourTop },
        ]);
      } else if (studPreset === 'twoInline') {
        if (twoOrientation === 'horizontal') {
          setOffsetRows([
            { xSide: 'left', xOffset: twoStart, ySide: 'bottom', yOffset: twoCrossMode === 'centered' ? plateWidth / 2 : twoCrossOffset },
            { xSide: 'right', xOffset: twoEqAxis ? twoStart : twoEnd, ySide: 'bottom', yOffset: twoCrossMode === 'centered' ? plateWidth / 2 : twoCrossOffset },
          ]);
        } else {
          setOffsetRows([
            { xSide: 'left', xOffset: twoCrossMode === 'centered' ? plateLength / 2 : twoCrossOffset, ySide: 'bottom', yOffset: twoStart },
            { xSide: 'left', xOffset: twoCrossMode === 'centered' ? plateLength / 2 : twoCrossOffset, ySide: 'top', yOffset: twoEqAxis ? twoStart : twoEnd },
          ]);
        }
      }
      return;
    }

    setOffsetRows(existing.map((s) => closestEdgeRowFromStud(plateLength, plateWidth, s)));
  }, [
    studInputStyle,
    studPreset,
    spec.plate?.length,
    spec.plate?.width,
    spec.studs?.positions,
    fourLeft,
    fourRight,
    fourBottom,
    fourTop,
    fourEqX,
    fourEqY,
    twoOrientation,
    twoStart,
    twoEnd,
    twoEqAxis,
    twoCrossMode,
    twoCrossOffset,
  ]);

  // Clear layout error on input changes
  useEffect(() => {
    setStudLayoutError(null);
  }, [
    studPreset,
    studInputStyle,
    fourEqX,
    fourLeft,
    fourRight,
    fourEqY,
    fourBottom,
    fourTop,
    twoOrientation,
    twoEqAxis,
    twoStart,
    twoEnd,
    twoCrossMode,
    twoCrossSide,
    twoCrossOffset,
    offsetRows,
    spec.plate?.length,
    spec.plate?.width,
  ]);

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            {(() => {
              const targetStep = step as FormStep;
              const isReachable = canJumpToStep(targetStep);
              return (
            <button
              type="button"
              onClick={() => {
                if (!isReachable) return;
                setCurrentStep(targetStep);
              }}
              disabled={!isReachable}
              aria-disabled={!isReachable}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step === currentStep
                  ? 'bg-[#DC143C] text-white'
                  : step < currentStep
                  ? 'bg-white/20 text-white'
                  : isReachable
                  ? 'bg-white/5 text-white/40 hover:bg-white/10'
                  : 'bg-white/5 text-white/30 opacity-60 cursor-not-allowed'
              }`}
            >
              {step}
            </button>
              );
            })()}
            {step < 4 && (
              <div
                className={`flex-1 h-px mx-2 ${
                  step < currentStep ? 'bg-white/20' : 'bg-white/5'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Plate */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Plate Dimensions</h3>
            
            <div>
              <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
                Length (inches)
              </label>
              <input
                type="number"
                step="0.01"
                min={VALIDATION_CONSTRAINTS.plate.length.min}
                max={VALIDATION_CONSTRAINTS.plate.length.max}
                value={spec.plate?.length || ''}
                onChange={(e) =>
                  updatePlate({ length: roundToTwoDecimals(parseNumber(e.target.value)) })
                }
                placeholder='2" - 96"'
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
              />
              {validationErrors['plate.length'] && (
                <p className="mt-1 text-red-400 text-sm">{validationErrors['plate.length']}</p>
              )}
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
                Width (inches)
              </label>
              <input
                type="number"
                step="0.01"
                min={VALIDATION_CONSTRAINTS.plate.width.min}
                max={VALIDATION_CONSTRAINTS.plate.width.max}
                value={spec.plate?.width || ''}
                onChange={(e) =>
                  updatePlate({ width: roundToTwoDecimals(parseNumber(e.target.value)) })
                }
                placeholder='2" - 96"'
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
              />
              {validationErrors['plate.width'] && (
                <p className="mt-1 text-red-400 text-sm">{validationErrors['plate.width']}</p>
              )}
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
                Thickness (inches)
              </label>
              <input
                type="number"
                step="0.01"
                min={VALIDATION_CONSTRAINTS.plate.thickness.min}
                max={VALIDATION_CONSTRAINTS.plate.thickness.max}
                value={spec.plate?.thickness || ''}
                onChange={(e) =>
                  updatePlate({ thickness: roundToTwoDecimals(parseNumber(e.target.value)) })
                }
                placeholder='0.25" - 2.0"'
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
              />
              {validationErrors['plate.thickness'] && (
                <p className="mt-1 text-red-400 text-sm">{validationErrors['plate.thickness']}</p>
              )}
            </div>

            <ConfigDropdown
              label="Material"
              options={MATERIAL_OPTIONS}
              value={spec.plate?.material || 'A36'}
              onChange={(value) => updatePlate({ material: value as EmbedSpec['plate']['material'] })}
            />
          </motion.div>
        )}

        {/* Step 2: Studs — simplified, plan-style inputs + optional offsets table */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Studs</h3>

            {!spec.plate?.length || !spec.plate?.width ? (
              <div className="p-4 bg-white/5 rounded-lg border border-white/20">
                <p className="text-white/60 text-sm">Enter plate length and width in Step 1 to configure stud layout.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Preset + input style */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-3">
                  <div className="flex flex-wrap items-end gap-3 justify-between">
                    <div className="min-w-[220px]">
                      <ConfigDropdown
                        label="Layout"
                        options={STUD_PRESET_OPTIONS}
                        value={studPreset}
                        onChange={(value) => {
                          const next = value as StudPreset;
                          setStudPreset(next);
                          if (next === 'custom') setStudInputStyle('offsets');
                        }}
                      />
                    </div>

                    <div className="min-w-[220px]">
                      <ConfigDropdown
                        label="Input style"
                        options={STUD_INPUT_STYLE_OPTIONS}
                        value={studInputStyle}
                        onChange={(value) => setStudInputStyle(value as StudInputStyle)}
                        disabled={studPreset === 'custom'}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={applyStudPreset}
                      disabled={!validateStudLayout().ok}
                      className="px-4 py-2 bg-[#DC143C] text-white rounded-lg font-semibold hover:bg-[#B01030] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Apply layout
                    </button>
                  </div>

                  {studLayoutError && <p className="text-red-300 text-xs">{studLayoutError}</p>}

                  <p className="text-white/60 text-xs">
                    Match typical drawings: enter inches from plate edges and let the preview confirm placement.
                  </p>
                </div>

                {/* Default stud settings */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/20">
                  <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Default Stud Settings</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Diameter (in)</label>
                      <input
                        type="number"
                        step="0.01"
                        min={VALIDATION_CONSTRAINTS.studs.diameter.min}
                        max={VALIDATION_CONSTRAINTS.studs.diameter.max}
                        value={defaultStud.diameter}
                        onChange={(e) => setDefaultStud(prev => ({ ...prev, diameter: roundToTwoDecimals(parseNumber(e.target.value)) ?? prev.diameter }))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Length (in)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={defaultStud.length}
                        onChange={(e) => setDefaultStud(prev => ({ ...prev, length: roundToTwoDecimals(parseNumber(e.target.value)) ?? prev.length }))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C] transition-colors"
                      />
                    </div>
                    <div>
                      <ConfigDropdown
                        label="Grade"
                        options={STUD_GRADE_OPTIONS}
                        value={defaultStud.grade}
                        onChange={(value) => setDefaultStud(prev => ({ ...prev, grade: value as 'A307' | 'A325' }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Layout inputs */}
                {studInputStyle === 'plan' && studPreset !== 'custom' ? (
                  <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
                    {studPreset === 'fourSquare' ? (
                      <>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider">4-stud square/rectangle</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider">X margins (left/right)</label>
                              <label className="flex items-center gap-2 text-white/70 text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={fourEqX}
                                  onChange={(e) => setFourEqX(e.target.checked)}
                                  className="rounded border-white/20"
                                />
                                EQ
                              </label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-white/60 text-[11px] uppercase tracking-wider mb-1">Left</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={fourLeft}
                                  onChange={(e) => setFourLeft(parseNumber(e.target.value) ?? 0)}
                                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C]"
                                />
                              </div>
                              <div>
                                <label className="block text-white/60 text-[11px] uppercase tracking-wider mb-1">Right</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={fourEqX ? fourLeft : fourRight}
                                  onChange={(e) => setFourRight(parseNumber(e.target.value) ?? 0)}
                                  disabled={fourEqX}
                                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C] disabled:opacity-50"
                                />
                              </div>
                            </div>
                            <p className="text-white/50 text-xs">
                              Gauge X: {(spec.plate!.length - fourLeft - (fourEqX ? fourLeft : fourRight)).toFixed(2)}"
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider">Y margins (bottom/top)</label>
                              <label className="flex items-center gap-2 text-white/70 text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={fourEqY}
                                  onChange={(e) => setFourEqY(e.target.checked)}
                                  className="rounded border-white/20"
                                />
                                EQ
                              </label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-white/60 text-[11px] uppercase tracking-wider mb-1">Bottom</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={fourBottom}
                                  onChange={(e) => setFourBottom(parseNumber(e.target.value) ?? 0)}
                                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C]"
                                />
                              </div>
                              <div>
                                <label className="block text-white/60 text-[11px] uppercase tracking-wider mb-1">Top</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={fourEqY ? fourBottom : fourTop}
                                  onChange={(e) => setFourTop(parseNumber(e.target.value) ?? 0)}
                                  disabled={fourEqY}
                                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C] disabled:opacity-50"
                                />
                              </div>
                            </div>
                            <p className="text-white/50 text-xs">
                              Gauge Y: {(spec.plate!.width - fourBottom - (fourEqY ? fourBottom : fourTop)).toFixed(2)}"
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider">2-stud inline</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider">Orientation</label>
                            <select
                              value={twoOrientation}
                              onChange={(e) => {
                                const next = e.target.value as 'horizontal' | 'vertical';
                                setTwoOrientation(next);
                                setTwoCrossSide(next === 'horizontal' ? 'bottom' : 'left');
                              }}
                              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C]"
                            >
                              <option value="horizontal">Horizontal</option>
                              <option value="vertical">Vertical</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider">End margins</label>
                              <label className="flex items-center gap-2 text-white/70 text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={twoEqAxis}
                                  onChange={(e) => setTwoEqAxis(e.target.checked)}
                                  className="rounded border-white/20"
                                />
                                EQ
                              </label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-white/60 text-[11px] uppercase tracking-wider mb-1">Start</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={twoStart}
                                  onChange={(e) => setTwoStart(parseNumber(e.target.value) ?? 0)}
                                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C]"
                                />
                              </div>
                              <div>
                                <label className="block text-white/60 text-[11px] uppercase tracking-wider mb-1">End</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={twoEqAxis ? twoStart : twoEnd}
                                  onChange={(e) => setTwoEnd(parseNumber(e.target.value) ?? 0)}
                                  disabled={twoEqAxis}
                                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C] disabled:opacity-50"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider">Row/column position</label>
                            <div className="flex flex-wrap items-center gap-3">
                              <label className="flex items-center gap-2 text-white/70 text-xs cursor-pointer">
                                <input
                                  type="radio"
                                  name="twoCrossMode"
                                  checked={twoCrossMode === 'centered'}
                                  onChange={() => setTwoCrossMode('centered')}
                                />
                                Centered (EQ)
                              </label>
                              <label className="flex items-center gap-2 text-white/70 text-xs cursor-pointer">
                                <input
                                  type="radio"
                                  name="twoCrossMode"
                                  checked={twoCrossMode === 'offset'}
                                  onChange={() => setTwoCrossMode('offset')}
                                />
                                Offset from edge
                              </label>
                              {twoCrossMode === 'offset' && (
                                <>
                                  <select
                                    value={twoCrossSide}
                                    onChange={(e) => setTwoCrossSide(e.target.value as any)}
                                    className="px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C]"
                                  >
                                    {twoOrientation === 'horizontal' ? (
                                      <>
                                        <option value="bottom">Bottom</option>
                                        <option value="top">Top</option>
                                      </>
                                    ) : (
                                      <>
                                        <option value="left">Left</option>
                                        <option value="right">Right</option>
                                      </>
                                    )}
                                  </select>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={twoCrossOffset}
                                    onChange={(e) => setTwoCrossOffset(parseNumber(e.target.value) ?? 0)}
                                    className="w-32 px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C]"
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-3">
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Offsets table</h4>
                    <p className="text-white/60 text-xs">
                      Enter each stud as an offset from edges (closest-edge style). Use “Apply layout” to update the preview.
                    </p>
                    <div className="space-y-2">
                      {offsetRows.map((row, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-1 md:grid-cols-[90px_1fr_90px_1fr_auto] gap-2 items-end"
                        >
                          <div>
                            <label className="block text-white/60 text-[11px] uppercase tracking-wider mb-1">X side</label>
                            <select
                              value={row.xSide}
                              onChange={(e) => {
                                const xSide = e.target.value as EdgeSideX;
                                setOffsetRows((prev) => prev.map((r, i) => (i === idx ? { ...r, xSide } : r)));
                              }}
                              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C]"
                            >
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-white/60 text-[11px] uppercase tracking-wider mb-1">X offset (in)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={row.xOffset}
                              onChange={(e) => {
                                const xOffset = parseNumber(e.target.value) ?? 0;
                                setOffsetRows((prev) => prev.map((r, i) => (i === idx ? { ...r, xOffset } : r)));
                              }}
                              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C]"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 text-[11px] uppercase tracking-wider mb-1">Y side</label>
                            <select
                              value={row.ySide}
                              onChange={(e) => {
                                const ySide = e.target.value as EdgeSideY;
                                setOffsetRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ySide } : r)));
                              }}
                              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C]"
                            >
                              <option value="bottom">Bottom</option>
                              <option value="top">Top</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-white/60 text-[11px] uppercase tracking-wider mb-1">Y offset (in)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={row.yOffset}
                              onChange={(e) => {
                                const yOffset = parseNumber(e.target.value) ?? 0;
                                setOffsetRows((prev) => prev.map((r, i) => (i === idx ? { ...r, yOffset } : r)));
                              }}
                              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setOffsetRows((prev) => prev.filter((_, i) => i !== idx))}
                            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm rounded"
                            aria-label={`Remove stud row ${idx + 1}`}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (offsetRows.length >= VALIDATION_CONSTRAINTS.studs.maxCount) return;
                            setOffsetRows((prev) => [...prev, { xSide: 'left', xOffset: 2, ySide: 'bottom', yOffset: 2 }]);
                          }}
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition-colors"
                        >
                          Add stud
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current studs summary + safety warnings */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Current studs</h4>
                    <button
                      type="button"
                      onClick={() => {
                        updateSpec({ studs: undefined });
                        setSelectedStudIndex(null);
                      }}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  {spec.studs?.positions?.length ? (
                    <div className="space-y-2">
                      {spec.studs.positions.map((stud, index) => {
                        const fromLeft = (spec.plate!.length / 2 + stud.x).toFixed(1);
                        const fromBottom = (spec.plate!.width / 2 + stud.y).toFixed(1);
                        const edgeDist = minEdgeDistance(spec.plate!.length, spec.plate!.width, stud.x, stud.y);
                        const warn =
                          edgeDist < EDGE_WARN_RED_IN
                            ? { label: `Too close to edge (${edgeDist.toFixed(2)}")`, cls: 'text-red-300' }
                            : edgeDist < EDGE_WARN_YELLOW_IN
                            ? { label: `Near edge (${edgeDist.toFixed(2)}")`, cls: 'text-yellow-200' }
                            : null;
                        return (
                          <div
                            key={index}
                            className="flex items-start justify-between gap-3 p-3 rounded border border-white/10 bg-black/20"
                          >
                            <div className="min-w-0">
                              <div className="text-white text-sm font-medium">
                                Stud {index + 1} — {stud.diameter}" × {stud.length}" {stud.grade}
                              </div>
                              <div className="text-white/60 text-xs">
                                {fromLeft}" from left • {fromBottom}" from bottom
                              </div>
                              {warn && <div className={`text-xs mt-1 ${warn.cls}`}>{warn.label}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm">No studs yet. Choose a layout and click “Apply layout”.</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Finish & Quantity */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Finish &amp; Quantity</h3>

            <ConfigDropdown
              label="Finish"
              options={FINISH_OPTIONS}
              value={spec.finish || 'none'}
              onChange={(value) => updateSpec({ finish: value as EmbedSpec['finish'] })}
            />

            <div className="max-w-md mx-auto w-full">
              <div>
                <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-2 text-center">
                  Quantity
                </label>
                <input
                  type="number"
                  min={VALIDATION_CONSTRAINTS.quantity.min}
                  value={spec.quantity || 1}
                  onChange={(e) => updateSpec({ quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#DC143C] transition-colors text-center"
                />
                {validationErrors['quantity'] && (
                  <p className="mt-1 text-red-400 text-sm text-center">{validationErrors['quantity']}</p>
                )}
              </div>

              {/* Price Display */}
              <div className="pt-6 border-t border-white/20 mt-6">
                <PriceDisplay
                  priceBreakdown={priceBreakdown}
                  quantity={spec.quantity || 1}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Project Information + Final Review */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Project Information & Review</h3>

            {/* Final Review block — summary, thumbnail, PDF */}
            {isEmbedSpecComplete(spec) && validateEmbedSpec(spec).length === 0 && (
              <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Final review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-sm">
                    <p className="text-white font-medium">
                      Plate: {spec.plate!.length}{'"'} × {spec.plate!.width}{'"'} × {spec.plate!.thickness}{'"'}
                    </p>
                    <p className="text-white/80">
                      {spec.plate!.material} • {spec.studs?.positions?.length ?? 0} studs
                    </p>
                    {spec.studs?.positions && spec.studs.positions.length > 0 && (
                      <p className="text-white/70 text-xs">
                        Studs: {(() => {
                          const first = spec.studs.positions[0];
                          const allSame = spec.studs.positions.every(
                            s => s.diameter === first.diameter && s.length === first.length && s.grade === first.grade
                          );
                          return allSame
                            ? `${spec.studs.positions.length} × ${first.diameter}" × ${first.length}" ${first.grade}`
                            : `${spec.studs.positions.length} studs (mixed)`;
                        })()}
                      </p>
                    )}
                  </div>
                  {/* Mini 2D thumbnail */}
                  {spec.plate?.length && spec.plate?.width && (
                    <div className="flex items-center justify-center p-2 bg-black/30 rounded border border-white/20">
                      <svg
                        viewBox={`${-spec.plate.length / 2 - 1} ${-spec.plate.width / 2 - 1} ${spec.plate.length + 2} ${spec.plate.width + 2}`}
                        className="w-full max-w-[160px] h-24 text-white"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <rect
                          x={-spec.plate.length / 2}
                          y={-spec.plate.width / 2}
                          width={spec.plate.length}
                          height={spec.plate.width}
                          fill="rgba(128,128,128,0.3)"
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="0.2"
                        />
                        {spec.studs?.positions?.map((stud, i) => (
                          <circle
                            key={i}
                            cx={stud.x}
                            cy={stud.y}
                            r={Math.max(stud.diameter / 2, 0.15)}
                            fill="rgba(220,20,60,0.8)"
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="0.1"
                          />
                        ))}
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )}

            <p className="text-white/60 text-sm">
              Provide delivery and contact details for order processing (optional but recommended).
            </p>

            <div className="max-w-2xl mx-auto w-full">
              <div className="space-y-3 mt-6">
              <h4 className="text-white/80 font-semibold text-sm">Delivery Address</h4>
              <div>
                <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={spec.deliveryAddress?.street || ''}
                  onChange={(e) => updateSpec({
                    deliveryAddress: { ...spec.deliveryAddress, street: e.target.value }
                  })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={spec.deliveryAddress?.city || ''}
                    onChange={(e) => updateSpec({
                      deliveryAddress: { ...spec.deliveryAddress, city: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={spec.deliveryAddress?.state || ''}
                    onChange={(e) => updateSpec({
                      deliveryAddress: { ...spec.deliveryAddress, state: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={spec.deliveryAddress?.zip || ''}
                    onChange={(e) => updateSpec({
                      deliveryAddress: { ...spec.deliveryAddress, zip: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={spec.deliveryAddress?.country || 'USA'}
                    onChange={(e) => updateSpec({
                      deliveryAddress: { ...spec.deliveryAddress, country: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
                  />
                </div>
              </div>
            </div>

              <div className="space-y-3 mt-6">
              <h4 className="text-white/80 font-semibold text-sm">Contact Information</h4>
              <div>
                <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={spec.contactInfo?.name || ''}
                  onChange={(e) => updateSpec({
                    contactInfo: { ...spec.contactInfo, name: e.target.value }
                  })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={spec.contactInfo?.email || ''}
                    onChange={(e) => updateSpec({
                      contactInfo: { ...spec.contactInfo, email: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={spec.contactInfo?.phone || ''}
                    onChange={(e) => updateSpec({
                      contactInfo: { ...spec.contactInfo, phone: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={spec.contactInfo?.company || ''}
                    onChange={(e) => updateSpec({
                      contactInfo: { ...spec.contactInfo, company: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
                  />
                </div>
              </div>
            </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-white/20">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-6 py-3 bg-white/5 border border-white/20 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
        >
          Back
        </button>

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceedToNextStep(currentStep)}
            className="px-6 py-3 bg-[#DC143C] text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#B01030] transition-colors"
          >
            Next
          </button>
        ) : currentStep === 4 ? (
          <div className="flex flex-col items-stretch gap-2 min-w-[220px]">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isEmbedSpecComplete(spec as Partial<EmbedSpec>) || validateEmbedSpec(spec as Partial<EmbedSpec>).length > 0}
              className="px-6 py-3 bg-[#DC143C] text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#B01030] transition-colors"
            >
              Add to cart
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}


