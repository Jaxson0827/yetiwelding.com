'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfigDropdown, { DropdownOption } from '../ConfigDropdown';
import PriceDisplay from './PriceDisplay';
import CoordinateEditor from './CoordinateEditor';
import { EmbedSpec, VALIDATION_CONSTRAINTS } from '@/lib/steelEmbeds/types';
import { validateEmbedSpec, isEmbedSpecComplete } from '@/lib/steelEmbeds/validation';
import { priceEmbed } from '@/lib/steelEmbeds/pricing';

interface EmbedSpecFormProps {
  onSpecChange: (spec: Partial<EmbedSpec>) => void;
  onAddToCart: (spec: EmbedSpec) => void;
  onExportQuote?: (spec: EmbedSpec) => void;
  currentEmbedIndex?: number | null;
  initialSpec?: Partial<EmbedSpec>;
  resetKey?: string;
}

type FormStep = 1 | 2 | 3 | 4 | 5;
type EmbedSpecDraft = Omit<Partial<EmbedSpec>, 'plate'> & {
  plate?: Partial<EmbedSpec['plate']>;
};

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

const TOLERANCE_OPTIONS: DropdownOption[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'tight', label: 'Tight' },
];

const LEADTIME_OPTIONS: DropdownOption[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'rush', label: 'Rush' },
];

const STUD_GRADE_OPTIONS: DropdownOption[] = [
  { value: 'A307', label: 'A307' },
  { value: 'A325', label: 'A325' },
];

export default function EmbedSpecForm({
  onSpecChange,
  onAddToCart,
  onExportQuote,
  currentEmbedIndex,
  initialSpec,
  resetKey,
}: EmbedSpecFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridStep, setGridStep] = useState(1);
  
  const getDefaultSpec = (): EmbedSpecDraft => ({
    plate: {
      material: 'A36',
    },
    finish: 'none',
    tolerance: 'standard',
    quantity: 1,
    leadTime: 'standard',
  });

  const mergeWithDefaults = (incoming?: Partial<EmbedSpec>): EmbedSpecDraft => {
    const defaults = getDefaultSpec();
    const merged: Partial<EmbedSpec> = {
      ...defaults,
      ...incoming,
      plate: undefined as any, // overwritten below
      deliveryAddress: {
        ...(incoming?.deliveryAddress ?? {}),
      },
      contactInfo: {
        ...(incoming?.contactInfo ?? {}),
      },
    };

    const mergedDraft: EmbedSpecDraft = merged as any;
    mergedDraft.plate = {
      ...(defaults.plate ?? {}),
      ...(incoming?.plate ?? {}),
      material: (incoming?.plate?.material ?? defaults.plate?.material ?? 'A36') as EmbedSpec['plate']['material'],
    };

    // Preserve studs exactly if provided
    if (incoming?.studs) {
      mergedDraft.studs = incoming.studs;
    }

    return mergedDraft;
  };

  const [spec, setSpec] = useState<EmbedSpecDraft>(() => getDefaultSpec());

  // Re-initialize the form when parent requests a reset (e.g., switching New <-> Edit)
  useEffect(() => {
    setSpec(mergeWithDefaults(initialSpec));
    setCurrentStep(1);
  }, [resetKey]); // intentional: treat resetKey as the reset trigger

  // Update parent when spec changes
  useEffect(() => {
    onSpecChange(spec as Partial<EmbedSpec>);
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
    setSpec(prev => ({ ...prev, ...updates }));
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

  const snapValue = (value: number) => {
    if (!snapToGrid) return roundToTwoDecimals(value) ?? value;
    const step = gridStep > 0 ? gridStep : 1;
    return roundToTwoDecimals(Math.round(value / step) * step) ?? value;
  };

  const addStuds = (positions: Array<{ x: number; y: number }>) => {
    const currentPositions = spec.studs?.positions || [];
    if (currentPositions.length + positions.length > VALIDATION_CONSTRAINTS.studs.maxCount) {
      alert(`Maximum ${VALIDATION_CONSTRAINTS.studs.maxCount} studs allowed`);
      return;
    }

    const newStuds = positions.map(({ x, y }) => {
      const clamped = clampToPlate(x, y);
      return {
        x: snapValue(clamped.x),
        y: snapValue(clamped.y),
        diameter: 0.5,
        length: 4,
        grade: 'A307' as const,
      };
    });

    updateSpec({
      studs: {
        positions: [...currentPositions, ...newStuds],
      },
    });
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
        return !!spec.finish && !!spec.tolerance && !!spec.leadTime;
      case 4:
        return !!spec.quantity && spec.quantity >= VALIDATION_CONSTRAINTS.quantity.min && !validationErrors['quantity'];
      case 5:
        // Project info is optional
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep(currentStep) && currentStep < 5) {
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

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
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
            {step < 5 && (
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
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

        {/* Step 2: Features */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Studs</h3>

            {/* Stud tools */}
            {spec.plate?.length && spec.plate?.width && (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSnapToGrid((v) => !v)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        snapToGrid
                          ? 'bg-[#DC143C]/20 border-[#DC143C]/50 text-white'
                          : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      Snap to grid: {snapToGrid ? 'On' : 'Off'}
                    </button>

                    <div className="flex items-center gap-2">
                      <label className="text-white/70 text-xs uppercase tracking-wider font-semibold">
                        Grid (in)
                      </label>
                      <input
                        type="number"
                        min={0.25}
                        step={0.25}
                        value={gridStep}
                        onChange={(e) => setGridStep(parseFloat(e.target.value) || 1)}
                        className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#DC143C] transition-colors"
                        disabled={!snapToGrid}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const length = spec.plate?.length;
                        const width = spec.plate?.width;
                        if (!length || !width) return;
                        const inset = Math.min(1, Math.max(0.25, Math.min(length, width) / 10));
                        const halfL = length / 2;
                        const halfW = width / 2;
                        addStuds([
                          { x: -halfL + inset, y: -halfW + inset },
                          { x: halfL - inset, y: -halfW + inset },
                          { x: halfL - inset, y: halfW - inset },
                          { x: -halfL + inset, y: halfW - inset },
                        ]);
                      }}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-lg transition-colors"
                    >
                      + 4 corners
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const length = spec.plate?.length;
                        if (!length) return;
                        const inset = Math.min(1, Math.max(0.25, length / 10));
                        const halfL = length / 2;
                        addStuds([
                          { x: -halfL + inset, y: 0 },
                          { x: halfL - inset, y: 0 },
                        ]);
                      }}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-lg transition-colors"
                    >
                      + centered pair
                    </button>
                  </div>
                </div>
                <p className="text-white/50 text-xs">
                  Tip: snapping helps keep layouts consistent. You can still fine-tune coordinates below.
                </p>
              </div>
            )}

            {/* Coordinate Editor */}
            {spec.plate?.length && spec.plate?.width && (
              <div className="mb-6">
                <CoordinateEditor
                  plateLength={spec.plate.length}
                  plateWidth={spec.plate.width}
                  studs={spec.studs?.positions || []}
                  snapToGrid={snapToGrid}
                  gridStep={gridStep}
                  onStudUpdate={(index, stud) => {
                    const newPositions = [...(spec.studs?.positions || [])];
                    newPositions[index] = stud;
                    updateSpec({ studs: { positions: newPositions } });
                  }}
                  onStudAdd={(x, y) => {
                    const currentPositions = spec.studs?.positions || [];
                    if (currentPositions.length >= VALIDATION_CONSTRAINTS.studs.maxCount) {
                      alert(`Maximum ${VALIDATION_CONSTRAINTS.studs.maxCount} studs allowed`);
                      return;
                    }
                    const clamped = clampToPlate(x, y);
                    const snappedX = snapValue(clamped.x);
                    const snappedY = snapValue(clamped.y);
                    const newStud = {
                      x: snappedX,
                      y: snappedY,
                      diameter: 0.5,
                      length: 4,
                      grade: 'A307' as const,
                    };
                    updateSpec({
                      studs: {
                        positions: [...currentPositions, newStud],
                      },
                    });
                  }}
                  onStudRemove={(index) => {
                    const newPositions = spec.studs!.positions.filter((_, i) => i !== index);
                    updateSpec({
                      studs: newPositions.length > 0
                        ? { positions: newPositions }
                        : undefined,
                    });
                  }}
                />
              </div>
            )}

            {/* Studs List */}
            <div className="space-y-4">
              <p className="text-white/60 text-sm">
                Configure each stud's properties below, or use the visual editor above to position them.
              </p>
              
              {spec.studs?.positions && spec.studs.positions.length > 0 && (
                <div className="space-y-3">
                  {spec.studs.positions.map((stud, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-semibold">Stud {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => {
                            const newPositions = spec.studs!.positions.filter((_, i) => i !== index);
                            updateSpec({
                              studs: newPositions.length > 0
                                ? { positions: newPositions }
                                : undefined,
                            });
                          }}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                            X (inches)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min={spec.plate?.length ? -(spec.plate.length / 2) : undefined}
                            max={spec.plate?.length ? spec.plate.length / 2 : undefined}
                            value={stud.x || ''}
                            onChange={(e) => {
                              const newPositions = [...spec.studs!.positions];
                              const raw = roundToTwoDecimals(parseNumber(e.target.value)) ?? 0;
                              const { x } = clampToPlate(raw, stud.y ?? 0);
                              newPositions[index] = {
                                ...stud,
                                x,
                              };
                              updateSpec({ studs: { positions: newPositions } });
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#DC143C] transition-colors"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                            Y (inches)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min={spec.plate?.width ? -(spec.plate.width / 2) : undefined}
                            max={spec.plate?.width ? spec.plate.width / 2 : undefined}
                            value={stud.y || ''}
                            onChange={(e) => {
                              const newPositions = [...spec.studs!.positions];
                              const raw = roundToTwoDecimals(parseNumber(e.target.value)) ?? 0;
                              const { y } = clampToPlate(stud.x ?? 0, raw);
                              newPositions[index] = {
                                ...stud,
                                y,
                              };
                              updateSpec({ studs: { positions: newPositions } });
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#DC143C] transition-colors"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                            Diameter (inches)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min={VALIDATION_CONSTRAINTS.studs.diameter.min}
                            max={VALIDATION_CONSTRAINTS.studs.diameter.max}
                            value={stud.diameter || ''}
                            onChange={(e) => {
                              const newPositions = [...spec.studs!.positions];
                              newPositions[index] = {
                                ...stud,
                                diameter: roundToTwoDecimals(parseNumber(e.target.value)) || 0,
                              };
                              updateSpec({ studs: { positions: newPositions } });
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#DC143C] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                            Length (inches)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={stud.length || ''}
                            onChange={(e) => {
                              const newPositions = [...spec.studs!.positions];
                              newPositions[index] = {
                                ...stud,
                                length: roundToTwoDecimals(parseNumber(e.target.value)) || 0,
                              };
                              updateSpec({ studs: { positions: newPositions } });
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-[#DC143C] transition-colors"
                          />
                        </div>
                        <div className="col-span-2">
                          <ConfigDropdown
                            label="Grade"
                            options={STUD_GRADE_OPTIONS}
                            value={stud.grade || 'A307'}
                            onChange={(value) => {
                              const newPositions = [...spec.studs!.positions];
                              newPositions[index] = { ...stud, grade: value as 'A307' | 'A325' };
                              updateSpec({ studs: { positions: newPositions } });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(!spec.studs?.positions || spec.studs.positions.length === 0) && spec.plate?.length && spec.plate?.width && (
                <p className="text-white/40 text-sm text-center py-4">
                  Click on the plate in the visual editor above to add your first stud
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 3: Finish & Tolerance */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Finish & Tolerance</h3>

            <ConfigDropdown
              label="Finish"
              options={FINISH_OPTIONS}
              value={spec.finish || 'none'}
              onChange={(value) => updateSpec({ finish: value as EmbedSpec['finish'] })}
            />

            <ConfigDropdown
              label="Tolerance"
              options={TOLERANCE_OPTIONS}
              value={spec.tolerance || 'standard'}
              onChange={(value) => updateSpec({ tolerance: value as EmbedSpec['tolerance'] })}
            />

            <ConfigDropdown
              label="Lead Time"
              options={LEADTIME_OPTIONS}
              value={spec.leadTime || 'standard'}
              onChange={(value) => updateSpec({ leadTime: value as EmbedSpec['leadTime'] })}
            />
          </motion.div>
        )}

        {/* Step 4: Quantity */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Quantity</h3>

            <div>
              <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
                Quantity
              </label>
              <input
                type="number"
                min={VALIDATION_CONSTRAINTS.quantity.min}
                value={spec.quantity || 1}
                onChange={(e) => updateSpec({ quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#DC143C] transition-colors"
              />
              {validationErrors['quantity'] && (
                <p className="mt-1 text-red-400 text-sm">{validationErrors['quantity']}</p>
              )}
            </div>

            {/* Price Display */}
            <div className="pt-6 border-t border-white/10">
              <PriceDisplay
                priceBreakdown={priceBreakdown}
                quantity={spec.quantity || 1}
              />
            </div>
          </motion.div>
        )}

        {/* Step 5: Project Information */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Project Information</h3>
            <p className="text-white/60 text-sm mb-6">
              Provide project details for order processing and delivery (optional but recommended).
            </p>

            <div>
              <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={spec.projectName || ''}
                onChange={(e) => updateSpec({ projectName: e.target.value })}
                placeholder="e.g., Downtown Office Building"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
                Project Number
              </label>
              <input
                type="text"
                value={spec.projectNumber || ''}
                onChange={(e) => updateSpec({ projectNumber: e.target.value })}
                placeholder="e.g., PROJ-2024-001"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
              />
            </div>

            <div className="space-y-3">
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
                Special Instructions
              </label>
              <textarea
                value={spec.specialInstructions || ''}
                onChange={(e) => updateSpec({ specialInstructions: e.target.value })}
                placeholder="Any special requirements or notes for this order..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#DC143C] transition-colors resize-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
        >
          Back
        </button>

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceedToNextStep(currentStep)}
            className="px-6 py-3 bg-[#DC143C] text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#B01030] transition-colors"
          >
            Next
          </button>
        ) : currentStep === 5 ? (
          <div className="flex gap-3">
            {onExportQuote && (
              <button
                type="button"
                onClick={() => {
                  const specForValidation = spec as Partial<EmbedSpec>;
                  if (isEmbedSpecComplete(specForValidation) && validateEmbedSpec(specForValidation).length === 0) {
                    onExportQuote(specForValidation as EmbedSpec);
                  }
                }}
                disabled={!isEmbedSpecComplete(spec as Partial<EmbedSpec>) || validateEmbedSpec(spec as Partial<EmbedSpec>).length > 0}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
              >
                Export Quote
              </button>
            )}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isEmbedSpecComplete(spec as Partial<EmbedSpec>) || validateEmbedSpec(spec as Partial<EmbedSpec>).length > 0}
              className="px-6 py-3 bg-[#DC143C] text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#B01030] transition-colors flex-1"
            >
              {currentEmbedIndex !== null && currentEmbedIndex !== undefined ? 'Update Embed' : 'Add Embed'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}


