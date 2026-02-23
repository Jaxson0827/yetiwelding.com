'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfigDropdown, { DropdownOption } from '../ConfigDropdown';
import PriceDisplay from './PriceDisplay';
import { EmbedSpec, VALIDATION_CONSTRAINTS } from '@/lib/steelEmbeds/types';
import { validateEmbedSpec, isEmbedSpecComplete } from '@/lib/steelEmbeds/validation';
import { priceEmbed } from '@/lib/steelEmbeds/pricing';
import { QUOTE_ONLY_MODE } from '@/lib/quoteOnlyMode';
import {
  EDGE_WARN_RED_IN,
  EDGE_WARN_YELLOW_IN,
  fourStudFromMargins,
  minEdgeDistance,
  twoStudInlineFromMargins,
} from '@/lib/steelEmbeds/studPlacement';

interface EmbedSpecFormProps {
  onSpecChange: (spec: Partial<EmbedSpec>) => void;
  onAddToCart: (spec: EmbedSpec) => void;
  onGetQuote?: (spec: EmbedSpec) => void;
}

type FormStep = 1 | 2 | 3;
type EmbedSpecDraft = Omit<Partial<EmbedSpec>, 'plate'> & {
  plate?: Partial<EmbedSpec['plate']>;
};

type StudLayout = '4-stud' | '2-stud-horizontal' | '2-stud-vertical';

const STUD_LAYOUT_OPTIONS: DropdownOption[] = [
  { value: '4-stud', label: '4-stud' },
  { value: '2-stud-horizontal', label: '2-stud horizontal' },
  { value: '2-stud-vertical', label: '2-stud vertical' },
];

const MATERIAL_OPTIONS: DropdownOption[] = [
  { value: 'A36', label: 'A36' },
  { value: 'A572', label: 'A572' },
  { value: 'A588', label: 'A588' },
  { value: 'A992', label: 'A992' },
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
  // Finish is not configurable in the UI; default to raw steel.
  finish: 'none',
  quantity: 1,
  // Lead time is not configurable in the UI; keep as standard for all embeds.
  leadTime: 'standard',
};

export default function EmbedSpecForm({
  onSpecChange,
  onAddToCart,
  onGetQuote,
}: EmbedSpecFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [defaultStud, setDefaultStud] = useState(DEFAULT_STUD);
  const [dimensionA, setDimensionA] = useState<number>(2);
  const [dimensionB, setDimensionB] = useState<number>(2);
  const [studLayout, setStudLayout] = useState<StudLayout>('4-stud');

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

  // Validation errors (spec + Step 2 dimension A/B)
  useEffect(() => {
    const errors = validateEmbedSpec(spec as Partial<EmbedSpec>);
    const errorMap: Record<string, string> = {};
    errors.forEach(err => {
      errorMap[err.field] = err.message;
    });
    // Step 2 dimension validation
    const plateLength = spec.plate?.length;
    const plateWidth = spec.plate?.width;
    if (plateLength && plateWidth) {
      if (dimensionA < 0) errorMap['dimensionA'] = 'Dimension A must be 0 or greater.';
      else if (studLayout === '4-stud' && 2 * dimensionA >= plateLength) errorMap['dimensionA'] = 'Dimension A must leave space for studs.';
      else if (studLayout === '2-stud-horizontal' && 2 * dimensionA >= plateLength) errorMap['dimensionA'] = 'Dimension A must leave space for studs.';
      else if (studLayout === '2-stud-vertical' && dimensionA >= plateLength) errorMap['dimensionA'] = 'Dimension A must be less than plate length.';

      if (dimensionB < 0) errorMap['dimensionB'] = 'Dimension B must be 0 or greater.';
      else if (studLayout === '4-stud' && 2 * dimensionB >= plateWidth) errorMap['dimensionB'] = 'Dimension B must leave space for studs.';
      else if (studLayout === '2-stud-horizontal' && dimensionB >= plateWidth) errorMap['dimensionB'] = 'Dimension B must be less than plate width.';
      else if (studLayout === '2-stud-vertical' && 2 * dimensionB >= plateWidth) errorMap['dimensionB'] = 'Dimension B must leave space for studs.';
    }
    setValidationErrors(errorMap);
  }, [spec, dimensionA, dimensionB, studLayout]);

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
        // Step 2 requires studs (auto-applied from A/B when valid)
        if (!spec.studs?.positions || spec.studs.positions.length === 0) return false;
        for (const stud of spec.studs.positions) {
          if (!stud.diameter || !stud.length || !stud.grade) return false;
        }
        return !validationErrors['dimensionA'] && !validationErrors['dimensionB'];
      case 3:
        return !!(
          spec.quantity &&
          spec.quantity >= VALIDATION_CONSTRAINTS.quantity.min &&
          !validationErrors['quantity']
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep(currentStep) && currentStep < 3) {
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
      setDimensionA(2);
      setDimensionB(2);
      setStudLayout('4-stud');

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

  // Auto-apply stud positions when A, B, plate, layout, or defaultStud change
  useEffect(() => {
    const plateLength = spec.plate?.length;
    const plateWidth = spec.plate?.width;
    if (!plateLength || !plateWidth) return;

    const a = dimensionA;
    const b = dimensionB;
    const invalid =
      a < 0 || b < 0 ||
      (studLayout === '4-stud' && (2 * a >= plateLength || 2 * b >= plateWidth)) ||
      (studLayout === '2-stud-horizontal' && (2 * a >= plateLength || b >= plateWidth)) ||
      (studLayout === '2-stud-vertical' && (a >= plateLength || 2 * b >= plateWidth));

    if (invalid) {
      updateSpec({ studs: undefined });
      return;
    }

    let positions;
    if (studLayout === '4-stud') {
      positions = fourStudFromMargins(plateLength, plateWidth, { left: a, right: a, bottom: b, top: b }, defaultStud);
    } else if (studLayout === '2-stud-horizontal') {
      positions = twoStudInlineFromMargins(
        plateLength,
        plateWidth,
        { orientation: 'horizontal', left: a, right: a, rowY: { mode: 'offset', side: 'bottom', offset: b } },
        defaultStud
      );
    } else {
      positions = twoStudInlineFromMargins(
        plateLength,
        plateWidth,
        { orientation: 'vertical', bottom: b, top: b, colX: { mode: 'offset', side: 'left', offset: a } },
        defaultStud
      );
    }
    updateSpec({ studs: { positions } });
  }, [spec.plate?.length, spec.plate?.width, dimensionA, dimensionB, studLayout, defaultStud]);

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((step) => (
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
            {step < 3 && (
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

        {/* Step 2: Studs — simplified A/B + layout + stud settings */}
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
                {/* Dimension A/B */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-3">
                  <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Placement (insets from edges)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Dimension A (horizontal inset, in)</label>
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        value={dimensionA}
                        onChange={(e) => setDimensionA(parseNumber(e.target.value) ?? 0)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C] transition-colors"
                      />
                      {validationErrors['dimensionA'] && (
                        <p className="mt-1 text-red-400 text-xs">{validationErrors['dimensionA']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Dimension B (vertical inset, in)</label>
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        value={dimensionB}
                        onChange={(e) => setDimensionB(parseNumber(e.target.value) ?? 0)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-[#DC143C] transition-colors"
                      />
                      {validationErrors['dimensionB'] && (
                        <p className="mt-1 text-red-400 text-xs">{validationErrors['dimensionB']}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-white/60 text-xs">
                    A and B are mirrored for symmetric placement. Studs are placed automatically.
                  </p>
                </div>

                {/* Layout */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/20">
                  <ConfigDropdown
                    label="Layout"
                    options={STUD_LAYOUT_OPTIONS}
                    value={studLayout}
                    onChange={(value) => setStudLayout(value as StudLayout)}
                  />
                </div>

                {/* Stud settings */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/20">
                  <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Stud Settings</h4>
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

                {/* Current studs summary */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/20">
                  <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">Current studs</h4>
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
                    <p className="text-white/40 text-sm">Enter valid Dimension A and B to place studs.</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Quantity</h3>

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

            {/* Final Review block — summary, thumbnail */}
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
                        Studs:{' '}
                        {(() => {
                          const first = spec.studs!.positions[0];
                          const allSame = spec.studs!.positions.every(
                            (s) => s.diameter === first.diameter && s.length === first.length && s.grade === first.grade
                          );
                          return allSame
                            ? `${spec.studs!.positions.length} × ${first.diameter}" × ${first.length}" ${first.grade}`
                            : `${spec.studs!.positions.length} studs (mixed)`;
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

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceedToNextStep(currentStep)}
            className="px-6 py-3 bg-[#DC143C] text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#B01030] transition-colors"
          >
            Next
          </button>
        ) : currentStep === 3 ? (
          <div className="flex flex-col items-stretch gap-2 min-w-[220px]">
            {QUOTE_ONLY_MODE && onGetQuote ? (
              <button
                type="button"
                onClick={() => {
                  const specForValidation = spec as Partial<EmbedSpec>;
                  if (isEmbedSpecComplete(specForValidation) && validateEmbedSpec(specForValidation).length === 0) {
                    onGetQuote(specForValidation as EmbedSpec);
                  }
                }}
                disabled={!isEmbedSpecComplete(spec as Partial<EmbedSpec>) || validateEmbedSpec(spec as Partial<EmbedSpec>).length > 0}
                className="px-6 py-3 bg-[#DC143C] text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#B01030] transition-colors"
              >
                Get a Quote
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isEmbedSpecComplete(spec as Partial<EmbedSpec>) || validateEmbedSpec(spec as Partial<EmbedSpec>).length > 0}
                className="px-6 py-3 bg-[#DC143C] text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#B01030] transition-colors"
              >
                Add to cart
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}


