'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { DumpsterGateConfig, getCartKey } from '@/lib/dumpsterGates/types';
import { priceGate } from '@/lib/dumpsterGates/pricing';
import { useCart } from '@/contexts/CartContext';
import { formatDimension, getSlopeDiffIn, isSlopeWithinTolerance } from '@/lib/dumpsterGates/validation';
import DimensionGraphic from './DimensionGraphic';
import ConfigurationPanel from './ConfigurationPanel';
import PricingSummary from './PricingSummary';

export default function DumpsterGateConfigurator() {
  const { addItem } = useCart();
  const [config, setConfig] = useState<DumpsterGateConfig>({
    size: 'custom',
    style: 'double-swing',
    finish: 'prime-painted',
    mounting: 'with-posts',
    quantity: 1,
    isCustom: true,
    widthFt: 14,
    heightFt: 6,

    enclosureLengthFt: 14,
    leftHeightFt: 6,
    rightHeightFt: 6,
    blockWidthIn: 8,
    bottomGapIn: 4,
  });

  const slopeDiffIn = useMemo(() => getSlopeDiffIn(config.leftHeightFt, config.rightHeightFt), [
    config.leftHeightFt,
    config.rightHeightFt,
  ]);
  const slopeWithinTolerance = useMemo(
    () => isSlopeWithinTolerance(config.leftHeightFt, config.rightHeightFt, 3),
    [config.leftHeightFt, config.rightHeightFt]
  );
  const requiresQuote = useMemo(() => !slopeWithinTolerance, [slopeWithinTolerance]);

  const printValues = useMemo(() => {
    const minHeightFt = Math.min(config.leftHeightFt, config.rightHeightFt);

    return {
      enclOverall: formatDimension(config.enclosureLengthFt),
      // TODO: Replace with correct math once provided.
      enclCTOC: formatDimension(config.enclosureLengthFt),
      lGap: '',
      cGap: '',
      rGap: '',
      gateHeight: formatDimension(minHeightFt),
      // TODO: Replace with correct gate math once provided.
      gateWidth: formatDimension(config.enclosureLengthFt / 2),
      blockWidth: `${Math.round(config.blockWidthIn * 100) / 100}"`,
      blockHeight: '',
      bottomGap: `${config.bottomGapIn}"`,
      postDepth: '',
    };
  }, [
    config.enclosureLengthFt,
    config.leftHeightFt,
    config.rightHeightFt,
    config.blockWidthIn,
    config.bottomGapIn,
  ]);

  // Calculate pricing
  const priceBreakdown = useMemo(() => {
    return priceGate(config);
  }, [config]);

  // Handle configuration changes
  const handleConfigChange = useCallback((partialConfig: Partial<DumpsterGateConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partialConfig };

      // Lock to custom-only + double swing.
      next.isCustom = true;
      next.size = 'custom';
      next.style = 'double-swing';

      // Keep legacy pricing fields aligned with enclosure inputs.
      next.widthFt = next.enclosureLengthFt;
      next.heightFt = Math.min(next.leftHeightFt, next.rightHeightFt);

      return next;
    });
  }, []);

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    if (requiresQuote) return;
    const cartKey = getCartKey(config);
    const cartItem = {
      id: cartKey,
      productType: 'dumpster-gate' as const,
      configuration: config,
      price: priceBreakdown.totalPrice,
      isCustomFabrication: config.isCustom,
    };
    addItem(cartItem);
    
    // Show success feedback (you could add a toast here)
    alert(`Added ${config.quantity} gate${config.quantity > 1 ? 's' : ''} to cart`);
  }, [config, priceBreakdown, addItem, requiresQuote]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side: Dimension Graphic */}
        <div className="order-2 lg:order-1">
          <DimensionGraphic
            values={printValues}
            style={config.style}
          />
          {!slopeWithinTolerance && (
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
              <p className="text-yellow-200 text-sm">
                Slope detected: left/right height differs by {Math.round(slopeDiffIn)}&quot;. This exceeds our 3&quot; tolerance — please request a quote.
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Configuration Panel + Pricing Summary */}
        <div className="order-1 lg:order-2 space-y-8">
          {/* Configuration Panel */}
          <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-white text-2xl font-bold mb-6">Configure Your Gate</h2>
            <ConfigurationPanel config={config} onConfigChange={handleConfigChange} />
          </div>

          {/* Pricing Summary */}
          <PricingSummary
            config={config}
            priceBreakdown={priceBreakdown}
            onAddToCart={handleAddToCart}
            requiresQuote={requiresQuote}
            quoteReason={`Slope exceeds 3" tolerance (${Math.round(slopeDiffIn)}").`}
          />
        </div>
      </div>
    </div>
  );
}

