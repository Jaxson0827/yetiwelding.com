'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { GardenBoxConfig } from '@/lib/gardenBoxes/types';
import {
  GARDEN_BOX_SIZES,
  GARDEN_BOX_HEIGHTS,
  GARDEN_BOX_FINISHES,
  GARDEN_BOX_ADD_ON_IDS,
  GARDEN_BOX_ADD_ON_LABELS,
} from '@/lib/gardenBoxes/types';
import { getCartKey } from '@/lib/gardenBoxes/types';
import { priceGardenBox } from '@/lib/gardenBoxes/pricing';
import { useCart } from '@/contexts/CartContext';
import ConfigDropdown from '@/components/ConfigDropdown';
import GardenBoxPanelDiagrams from './GardenBoxPanelDiagrams';

const GardenBoxViewer3D = dynamic(() => import('./GardenBoxViewer3D'), { ssr: false });

type FormStep = 1 | 2 | 3;

const DEFAULT_CONFIG: GardenBoxConfig = {
  size: '4x2',
  height: 18,
  finish: 'raw',
  addOns: {},
};

const STEP_LABELS: Record<FormStep, string> = {
  1: 'Size',
  2: 'Style',
  3: 'Options',
};

function pill(active: boolean) {
  return `px-3 py-2 rounded-md border text-sm transition-all duration-200 hover:scale-[1.02] ${
    active
      ? 'bg-[#DC143C] text-white border-[#DC143C] ring-2 ring-[#DC143C]/30'
      : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30'
  }`;
}

const FINISH_SWATCH_STYLES: Record<string, React.CSSProperties> = {
  raw: {
    background:
      'linear-gradient(135deg, #8b9298 0%, #6b7280 40%, #5a5f65 60%, #4b5056 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
  },
  'powder-black': {
    background:
      'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  'powder-bronze': {
    background:
      'linear-gradient(135deg, #b45309 0%, #92400e 50%, #78350f 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
  },
  corten: {
    background:
      'linear-gradient(135deg, #b45309 0%, #8b4513 40%, #5c4033 100%)',
    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
  },
};

export default function GardenBoxConfigurator() {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [config, setConfig] = useState<GardenBoxConfig>(DEFAULT_CONFIG);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addItem } = useCart();

  const priceResult = useMemo(() => priceGardenBox(config, config.quantity ?? 1), [config]);

  const handleAddToCart = useCallback(() => {
    const fullConfig: GardenBoxConfig = {
      ...config,
      quantity: config.quantity ?? 1,
    };
    const cartId = `${getCartKey(fullConfig)}-${Date.now()}`;

    addItem({
      id: cartId,
      productType: 'garden-box',
      configuration: fullConfig,
      price: priceResult.totalPrice,
      isCustomFabrication: false,
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [config, priceResult, addItem]);

  const updateConfig = useCallback((updates: Partial<GardenBoxConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleAddOn = useCallback((id: keyof GardenBoxConfig['addOns']) => {
    setConfig((prev) => ({
      ...prev,
      addOns: {
        ...prev.addOns,
        [id]: !prev.addOns?.[id],
      },
    }));
  }, []);

  const handleDownloadSpecSheet = useCallback(async () => {
    try {
      const res = await fetch('/api/garden-boxes/spec-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            ...config,
            quantity: config.quantity ?? 1,
          },
        }),
      });
      if (!res.ok) throw new Error('Failed to generate spec sheet');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'garden-box-spec.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  }, [config]);

  const CheckIcon = () => (
    <svg className="w-4 h-4 shrink-0 text-[#DC143C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
        {/* Left: 3D Preview + Panel diagrams */}
        <div className="order-2 lg:order-1 lg:sticky lg:top-24 lg:self-start space-y-6">
          <GardenBoxViewer3D config={config} />
          <div className="lg:mt-6">
            <GardenBoxPanelDiagrams />
            <button
              type="button"
              onClick={handleDownloadSpecSheet}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Spec Sheet (PDF)
            </button>
          </div>
        </div>

        {/* Right: Step wizard + Technical Specs + Price */}
        <aside className="order-1 lg:order-2">
          <div
            className="p-8 rounded-lg flex flex-col shadow-lg shadow-black/20"
            style={{
              background:
                'linear-gradient(135deg, rgba(35, 15, 18, 0.95) 0%, rgba(50, 20, 25, 0.95) 50%, rgba(60, 25, 30, 0.95) 100%)',
              border: '1px solid rgba(220, 20, 60, 0.3)',
            }}
          >
            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-1">
              Design Your Steel Garden Bed
            </h2>
            <p className="text-white/70 text-sm mb-8">Design your raised garden bed in under a minute.</p>

            {/* Step indicator */}
            <div className="flex gap-4 mb-8">
              {([1, 2, 3] as FormStep[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCurrentStep(s)}
                  className={`flex flex-col items-center gap-1 transition-all duration-200 hover:scale-[1.02] ${
                    currentStep === s ? 'ring-2 ring-[#DC143C]/30 rounded-full' : ''
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full font-semibold text-sm flex items-center justify-center ${
                      currentStep === s ? 'bg-[#DC143C] text-white' : 'bg-white/20 text-white/80 hover:bg-white/30'
                    }`}
                  >
                    {s}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/60">{STEP_LABELS[s]}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <section>
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">Size</div>
                    <div className="flex gap-2 flex-wrap">
                      {GARDEN_BOX_SIZES.map((s) => {
                        const selected = config.size === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => updateConfig({ size: s.id })}
                            className={pill(selected)}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                  <section>
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">Height</div>
                    <div className="grid grid-cols-4 gap-2">
                      {GARDEN_BOX_HEIGHTS.map((h) => (
                        <button
                          key={h}
                          type="button"
                          className={pill(config.height === h)}
                          onClick={() => updateConfig({ height: h })}
                          aria-pressed={config.height === h}
                        >
                          {h}"
                        </button>
                      ))}
                    </div>
                  </section>
                  <section>
                    <ConfigDropdown
                      label="Quantity"
                      options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
                        value: String(n),
                        label: String(n),
                      }))}
                      value={String(config.quantity ?? 1)}
                      onChange={(v) => updateConfig({ quantity: parseInt(v, 10) })}
                    />
                  </section>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <section>
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">Finish</div>
                    <div className="grid grid-cols-2 gap-3">
                      {GARDEN_BOX_FINISHES.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          className={`flex items-center gap-3 px-3 py-2 rounded-md border text-sm transition-all duration-200 hover:scale-[1.02] ${
                            config.finish === f.id
                              ? 'bg-[#DC143C] text-white border-[#DC143C] ring-2 ring-[#DC143C]/30'
                              : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30'
                          }`}
                          onClick={() => updateConfig({ finish: f.id })}
                          aria-pressed={config.finish === f.id}
                        >
                          <span
                            className="w-12 h-12 rounded border border-white/30 shrink-0"
                            style={FINISH_SWATCH_STYLES[f.id] ?? { backgroundColor: f.hex ?? '#6b7280' }}
                          />
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <section>
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">Add-ons</div>
                    <div className="space-y-3">
                      {GARDEN_BOX_ADD_ON_IDS.map((id) => (
                        <label
                          key={id}
                          className="flex items-center justify-between gap-4 p-3 rounded-md bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                        >
                          <span className="text-white text-sm">{GARDEN_BOX_ADD_ON_LABELS[id]}</span>
                          <input
                            type="checkbox"
                            checked={!!config.addOns?.[id]}
                            onChange={() => toggleAddOn(id)}
                            className="w-5 h-5 rounded border-white/30 text-[#DC143C] focus:ring-[#DC143C]"
                          />
                        </label>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step nav */}
            <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1) as FormStep)}
                disabled={currentStep === 1}
                className="text-white/70 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                Back
              </button>
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => Math.min(3, s + 1) as FormStep)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Next
                </button>
              ) : null}
            </div>

            {/* Technical Specs (inside panel) */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-3">Technical Specs</h3>
              <ul className="space-y-2 text-sm text-white/70 mb-4">
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  Heavy-duty 11 gauge steel panels
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  Bolt-together with pre-drilled flanges
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  Stainless steel hardware included
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  Exact dimensions diagram below
                </li>
              </ul>
              <button
                type="button"
                onClick={handleDownloadSpecSheet}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Spec Sheet (PDF)
              </button>
            </div>

            {/* Price + Add to Cart (inside panel) */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-4">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-white/50">Total</span>
                <div className="text-2xl font-bold text-white">${priceResult.totalPrice.toLocaleString()}</div>
              </div>
              <div className="text-sm text-white/70">
                Shipping calculated at checkout · Ships flat-pack · Typically arrives in 2–3 weeks
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Add to Cart
              </button>
              <p className="text-xs text-white/50">*Large sizes may ship freight. All hardware included · Made in Utah</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom two-column: Technical Specs expanded + Why steel? */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">Technical Specs</h3>
          <ul className="space-y-2 text-sm text-white/70 mb-6">
            <li className="flex items-center gap-2">
              <CheckIcon />
              Heavy-duty 11 gauge steel panels
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon />
              Bolt-together with pre-drilled flanges
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon />
              Stainless steel hardware included
            </li>
          </ul>
          <div className="mb-4">
            <GardenBoxPanelDiagrams />
          </div>
          <button
            type="button"
            onClick={handleDownloadSpecSheet}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Spec Sheet (PDF)
          </button>
        </div>
        <div className="p-6 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">Why steel?</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#4a7c59] flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Won&apos;t rot like wood
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#4a7c59] flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Won&apos;t crack like composite
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#4a7c59] flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              10+ year lifespan
            </li>
          </ul>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed bottom-8 right-8 bg-[#DC143C] text-white px-6 py-4 rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Added to cart!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
