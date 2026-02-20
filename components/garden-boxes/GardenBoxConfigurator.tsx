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

const GardenBoxViewer3D = dynamic(() => import('./GardenBoxViewer3D'), { ssr: false });

type FormStep = 1 | 2 | 3;

const DEFAULT_CONFIG: GardenBoxConfig = {
  size: '4x2',
  height: 18,
  finish: 'raw',
  addOns: {},
};

function pill(active: boolean) {
  return `px-3 py-2 rounded-md border text-sm transition-colors ${
    active
      ? 'bg-[#DC143C] text-white border-[#DC143C]'
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

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
        {/* Left: 3D Preview */}
        <div className="order-2 lg:order-1 lg:sticky lg:top-24 lg:self-start">
          <GardenBoxViewer3D config={config} />
        </div>

        {/* Right: Step wizard */}
        <aside className="order-1 lg:order-2">
          <div
            className="p-8 rounded-lg"
            style={{
              background:
                'linear-gradient(135deg, rgba(20, 15, 15, 0.6) 0%, rgba(40, 20, 25, 0.65) 50%, rgba(50, 25, 30, 0.7) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(220, 20, 60, 0.3)',
            }}
          >
            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-1">
              Design Your Steel Garden Bed
            </h2>
            <p className="text-white/70 text-sm mb-8">Design your raised garden bed in under a minute.</p>

            {/* Step indicator */}
            <div className="flex gap-2 mb-8">
              {([1, 2, 3] as FormStep[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCurrentStep(s)}
                  className={`w-8 h-8 rounded-full font-semibold text-sm transition-colors ${
                    currentStep === s ? 'bg-[#DC143C] text-white' : 'bg-white/20 text-white/80 hover:bg-white/30'
                  }`}
                >
                  {s}
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
                          className={`flex items-center gap-3 px-3 py-2 rounded-md border text-sm transition-colors ${
                            config.finish === f.id
                              ? 'bg-[#DC143C] text-white border-[#DC143C]'
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
                          className="flex items-center justify-between gap-4 p-3 rounded-md bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer"
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

            {/* Why steel? reassurance */}
            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/60">
              <div className="font-semibold text-white/70 mb-1">Why steel?</div>
              <ul className="space-y-0.5 list-disc pl-4">
                <li>Won&apos;t rot like wood</li>
                <li>Won&apos;t crack like composite</li>
                <li>10+ year lifespan</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky price bar */}
      <div
        className="sticky bottom-0 left-0 right-0 z-40 mt-8 p-4 rounded-lg flex flex-wrap items-center justify-between gap-4"
        style={{
          background:
            'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(40, 10, 10, 0.9) 100%)',
          border: '1px solid rgba(220, 20, 60, 0.3)',
        }}
      >
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-white/50">Total</span>
            <div className="text-2xl font-bold text-white">${priceResult.totalPrice.toLocaleString()}</div>
          </div>
          <div className="text-sm text-white/70">
            Shipping: calculated at checkout · Lead time: 2–3 weeks
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-white/60">
            <span>11ga steel</span>
            <span>Bolt-together kit</span>
            <span>All hardware included</span>
            <span>Made in Utah</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          Add to Cart
        </button>
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
