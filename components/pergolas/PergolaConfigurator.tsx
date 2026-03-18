'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, colorHex } from '@/lib/pergolas/colors';
import { ROOF_DESIGNS } from '@/lib/pergolas/panels';
import { pricePergola } from '@/lib/pergolas/pricing';
import { buyEligibleForConfig, configFromSlug, leadWeeksForSlug } from '@/lib/pergolas/standardKits';
import type { PergolaConfig } from '@/lib/pergolas/types';
import { getCartKey } from '@/lib/pergolas/types';
import { useCart } from '@/contexts/CartContext';
import { QUOTE_ONLY_MODE } from '@/lib/quoteOnlyMode';
import { saveQuoteDraft } from '@/lib/quoteDraft';
import { playfairDisplay } from '@/lib/fonts';

const PergolaViewer3D = dynamic(() => import('./PergolaViewer3D'), { ssr: false });

const PRESET_SIZES = [
  { label: '12×12', span: 12, depth: 12 },
  { label: '12×16', span: 12, depth: 16 },
  { label: '12×20', span: 12, depth: 20 },
];

export default function PergolaConfigurator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kitSlug = searchParams?.get('kit');
  const { addItem } = useCart();

  const [cfg, setCfg] = useState<PergolaConfig>({
    span: 12,
    depth: 12,
    height: 10,
    colorId: 'black',
    roofDesignId: ROOF_DESIGNS[0]?.id ?? 'palmleaf',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!kitSlug) return;
    const preset = configFromSlug(kitSlug);
    if (preset) {
      setCfg((v) => ({
        ...v,
        span: preset.span,
        depth: preset.depth,
        height: preset.height ?? v.height,
      }));
    }
  }, [kitSlug]);

  const priceResult = useMemo(() => pricePergola(cfg, cfg.quantity ?? 1), [cfg]);
  const buyInfo = buyEligibleForConfig(cfg);
  const lead = buyInfo.kit ? leadWeeksForSlug(buyInfo.kit.slug) : [3, 5];

  const colorName = COLORS.find((c) => c.id === cfg.colorId)?.name ?? 'Color';
  const roofName = ROOF_DESIGNS.find((r) => r.id === cfg.roofDesignId)?.name ?? '';

  const pill = useCallback(
    (active: boolean) =>
      `px-3 py-2 rounded-md border text-sm transition-colors ${
        active
          ? 'bg-[#DC143C] text-white border-[#DC143C]'
          : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30'
      }`,
    []
  );

  const handleGetQuote = useCallback(() => {
    const fullConfig: PergolaConfig = {
      ...cfg,
      quantity: cfg.quantity ?? 1,
    };
    saveQuoteDraft('pergola', fullConfig, {
      totalPrice: priceResult.totalPrice,
      leadTime: `${lead[0]}–${lead[1]} weeks`,
    });
    router.push('/contact?from=quote');
  }, [cfg, priceResult, lead, router]);

  const handleAddToCart = useCallback(() => {
    const fullConfig: PergolaConfig = {
      ...cfg,
      quantity: cfg.quantity ?? 1,
    };
    const cartId = `${getCartKey(fullConfig)}-${Date.now()}`;
    const isCustomFabrication = priceResult.confidence === 'review';

    addItem({
      id: cartId,
      productType: 'pergola',
      configuration: fullConfig,
      price: priceResult.totalPrice,
      isCustomFabrication,
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [cfg, priceResult, addItem]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6 lg:gap-8">
        {/* Left controls */}
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
          <div
            className="p-6 rounded-lg"
            style={{
              background:
                'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(40, 10, 10, 0.8) 50%, rgba(60, 15, 15, 0.8) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(220, 20, 60, 0.3)',
            }}
          >
            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-6">Design Your Pergola</h2>

            <section className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">Size</div>
              <div className="flex gap-2 flex-wrap">
                {PRESET_SIZES.map((s) => {
                  const selected = cfg.span === s.span && cfg.depth === s.depth;
                  return (
                    <button
                      key={`${s.span}x${s.depth}`}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setCfg((v) => ({ ...v, span: s.span, depth: s.depth }))}
                      className={pill(selected)}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">Height</div>
              <div className="grid grid-cols-3 gap-2">
                {[8, 10, 12].map((h) => (
                  <button
                    key={h}
                    type="button"
                    className={pill(cfg.height === h)}
                    onClick={() => setCfg((v) => ({ ...v, height: h }))}
                    aria-pressed={cfg.height === h}
                  >
                    {h} ft
                  </button>
                ))}
              </div>
            </section>

            <section className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">Color</div>
              <div className="grid grid-cols-6 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    title={c.name}
                    className={`h-8 w-8 rounded-md border-2 transition-colors ${
                      cfg.colorId === c.id ? 'border-[#DC143C] ring-2 ring-[#DC143C]/50' : 'border-transparent hover:border-white/40'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setCfg((v) => ({ ...v, colorId: c.id }))}
                  >
                    <span className="sr-only">{c.name}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">Roof Design</div>
              <div className="grid grid-cols-1 gap-2">
                {ROOF_DESIGNS.map((rd) => (
                  <button
                    key={rd.id}
                    type="button"
                    className={pill(cfg.roofDesignId === rd.id)}
                    onClick={() => setCfg((v) => ({ ...v, roofDesignId: rd.id }))}
                    aria-pressed={cfg.roofDesignId === rd.id}
                  >
                    {rd.name}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* Right column */}
        <div className="space-y-4">
          {/* Spec strip */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="px-2 py-1 rounded-md bg-white/10 text-white/90">Color: {colorName}</span>
            <span className="px-2 py-1 rounded-md bg-white/10 text-white/90">Roof: {roofName}</span>
            <span className="px-2 py-1 rounded-md bg-white/10 text-white/90">
              Size: {cfg.span}×{cfg.depth}×{cfg.height} ft
            </span>
          </div>

          <div className="p-4 border-2 border-white/20 rounded-lg bg-black/30">
            <PergolaViewer3D config={cfg} />
          </div>

          {/* Order Summary & Price Box */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-6 shadow-xl shadow-black/30 transition-all duration-300 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-0.5"
            style={{
              background:
                'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(40, 10, 10, 0.8) 50%, rgba(60, 15, 15, 0.8) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(220, 20, 60, 0.3)',
            }}
          >
            {/* Header */}
            <h3 className={`${playfairDisplay.className} text-white text-xl font-bold tracking-tight mb-1`}>
              Custom Steel Pergola
            </h3>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 mb-5">
              <svg className="w-3.5 h-3.5 text-[#DC143C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-white/60">Fabricated in Utah</span>
            </div>

            {/* Configuration Summary - horizontal */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 mb-5 pb-5 border-b border-white/10">
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wider text-white/50">Size</span>
                <span className="text-white font-medium">
                  {cfg.span}×{cfg.depth}×{cfg.height} ft
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wider text-white/50">Color</span>
                <span className="text-white font-medium flex items-center gap-2">
                  {colorName}
                  <span
                    className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                    style={{ backgroundColor: colorHex(cfg.colorId) }}
                  />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wider text-white/50">Roof</span>
                <span className="text-white font-medium">{roofName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wider text-white/50">Height</span>
                <span className="text-white font-medium">{cfg.height} ft</span>
              </div>
            </div>

            {/* Price breakdown + Total + CTA - horizontal */}
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              {priceResult.breakdown && (
                <>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wider text-white/50">Frame & components</span>
                    <span className="text-white font-semibold">${priceResult.breakdown.frame.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wider text-white/50">Posts included</span>
                    <span className="text-white font-semibold">{priceResult.breakdown.posts}</span>
                  </div>
                </>
              )}
              <div className="flex flex-col px-4 py-2 rounded-lg bg-white/5 border-l-2 border-[#DC143C]">
                <span className="text-xs font-medium uppercase tracking-wider text-white/50">Total</span>
                <span className="text-white text-2xl font-bold">${priceResult.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1.5 ml-auto">
                {QUOTE_ONLY_MODE ? (
                  <button
                    type="button"
                    onClick={handleGetQuote}
                    className="bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 whitespace-nowrap shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/50 focus:ring-offset-2 focus:ring-offset-black"
                  >
                    Get a Quote
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 whitespace-nowrap shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/50 focus:ring-offset-2 focus:ring-offset-black"
                  >
                    Add to Cart
                  </button>
                )}
                <span className="text-xs text-white/50 text-right">
                  Lead time {lead[0]}–{lead[1]} weeks
                </span>
              </div>
            </div>

            {priceResult.confidence === 'review' && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-yellow-200/90">
                  This configuration may require a quote. We&apos;ll review before fabrication.
                </p>
              </div>
            )}
          </motion.div>

          <div className="text-sm text-white/70">
            Posts modeled as 4×4. Includes pre-cut steel, hardware, anchors as specified, finish schedule, and install
            guide.
          </div>
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
