'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DumpsterGateConfig, getCartKey } from '@/lib/dumpsterGates/types';
import { priceGate } from '@/lib/dumpsterGates/pricing';
import { formatDimension } from '@/lib/dumpsterGates/validation';
import { getGateHeightFt, getGateQuoteReasons, getMaxWallHeightFt } from '@/lib/dumpsterGates/display';
import { useCart } from '@/contexts/CartContext';
import { GATE_ONLINE_CHECKOUT } from '@/lib/onlineCheckout';
import { saveQuoteDraft } from '@/lib/quoteDraft';
import DrawingSheet from './DrawingSheet';
import ConfigurationPanel from './ConfigurationPanel';
import PricingSummary, { formatUsd } from './PricingSummary';

const INITIAL: DumpsterGateConfig = {
  size: 'custom',
  style: 'double-swing',
  finish: 'prime-painted',
  mounting: 'with-posts',
  quantity: 1,
  isCustom: true,
  widthFt: 14,
  heightFt: 6 - 4 / 12,
  enclosureLengthFt: 14,
  leftHeightFt: 6,
  rightHeightFt: 6,
  blockWidthIn: 8,
  bottomGapIn: 4,
};

export default function DumpsterGateConfigurator() {
  const router = useRouter();
  const { addItem } = useCart();
  const [config, setConfig] = useState<DumpsterGateConfig>(INITIAL);
  const [justAdded, setJustAdded] = useState(false);

  const quoteReasons = useMemo(() => getGateQuoteReasons(config), [config]);
  const priceBreakdown = useMemo(() => priceGate(config), [config]);
  const canBuy = GATE_ONLINE_CHECKOUT && quoteReasons.length === 0;

  const printValues = useMemo(() => {
    const enclCTOCFt = Math.max(0, config.enclosureLengthFt - config.blockWidthIn / 12);
    return {
      enclOverall: formatDimension(config.enclosureLengthFt),
      enclCTOC: formatDimension(enclCTOCFt),
      lGap: '2"',
      cGap: '2"',
      rGap: '2"',
      gateHeight: formatDimension(getGateHeightFt(config)),
      // Leaf width needs the shop's real formula (gaps, post sizes); hidden on the drawing until then.
      gateWidth: formatDimension(config.enclosureLengthFt / 2),
      blockWidth: `${Math.round(config.blockWidthIn * 100) / 100}"`,
      blockHeight: formatDimension(getMaxWallHeightFt(config)),
      bottomGap: `${config.bottomGapIn}"`,
      postDepth: `3'`,
    };
  }, [config]);

  const handleConfigChange = useCallback((partial: Partial<DumpsterGateConfig>) => {
    setJustAdded(false);
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      // Online gates are always custom-size, double swing.
      next.isCustom = true;
      next.size = 'custom';
      next.style = 'double-swing';
      // Legacy pricing fields follow the enclosure inputs.
      next.widthFt = next.enclosureLengthFt;
      next.heightFt = getGateHeightFt(next);
      return next;
    });
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!canBuy) return;
    addItem({
      id: getCartKey(config),
      productType: 'dumpster-gate',
      configuration: config,
      price: priceBreakdown.totalPrice,
      isCustomFabrication: true,
    });
    setJustAdded(true);
  }, [addItem, canBuy, config, priceBreakdown.totalPrice]);

  const handleRequestQuote = useCallback(() => {
    saveQuoteDraft('dumpster-gate', config, { leadTime: priceBreakdown.leadTime });
    router.push('/contact?from=quote');
  }, [config, priceBreakdown.leadTime, router]);

  // Phone-width sticky bar: visible while the configurator is on screen and the summary card isn't.
  const sectionRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [sectionInView, setSectionInView] = useState(false);
  const [summaryInView, setSummaryInView] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const a = new IntersectionObserver(([e]) => setSectionInView(e.isIntersecting), { threshold: 0 });
    const b = new IntersectionObserver(([e]) => setSummaryInView(e.isIntersecting), { threshold: 0.2 });
    if (sectionRef.current) a.observe(sectionRef.current);
    if (summaryRef.current) b.observe(summaryRef.current);
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, []);
  const showBar = sectionInView && !summaryInView;

  return (
    <div ref={sectionRef}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <DrawingSheet config={config} printValues={printValues} />
        </div>

        <div className="space-y-8">
          <div className="border border-gate-rule bg-gate-plate p-5 sm:p-6">
            <ConfigurationPanel config={config} onConfigChange={handleConfigChange} />
          </div>
          <div ref={summaryRef} id="gate-summary">
            <PricingSummary
              config={config}
              priceBreakdown={priceBreakdown}
              online={GATE_ONLINE_CHECKOUT}
              quoteReasons={quoteReasons}
              onAddToCart={handleAddToCart}
              onRequestQuote={handleRequestQuote}
              justAdded={justAdded}
            />
          </div>
        </div>
      </div>

      {/* Sticky action bar (phones and tablets) */}
      <div
        aria-hidden={!showBar}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-gate-rule bg-black/95 px-4 py-3 backdrop-blur transition-transform duration-200 motion-reduce:transition-none lg:hidden ${
          showBar ? 'translate-y-0' : 'pointer-events-none translate-y-full'
        }`}
      >
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate font-drafting text-xs text-gate-mute">
              {formatDimension(config.enclosureLengthFt)} × {formatDimension(getGateHeightFt(config))} gate
            </div>
            <div className="font-display text-lg font-extrabold text-white [font-stretch:110%]">
              {canBuy ? formatUsd(priceBreakdown.totalPrice) : 'Priced by quote'}
            </div>
          </div>
          {canBuy && justAdded ? (
            <a
              href="/checkout"
              tabIndex={showBar ? 0 : -1}
              className="shrink-0 bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              Go to checkout
            </a>
          ) : (
            <button
              type="button"
              tabIndex={showBar ? 0 : -1}
              onClick={canBuy ? handleAddToCart : handleRequestQuote}
              className="shrink-0 bg-accent-red px-5 py-3 text-sm font-semibold text-white"
            >
              {canBuy ? 'Add to cart' : 'Request a quote'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
