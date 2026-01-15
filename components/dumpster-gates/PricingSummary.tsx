'use client';

import React, { useState } from 'react';
import { PriceBreakdown, DumpsterGateConfig, GATE_DIMENSIONS } from '@/lib/dumpsterGates/types';
import { formatDimension } from '@/lib/dumpsterGates/validation';

interface PricingSummaryProps {
  config: DumpsterGateConfig;
  priceBreakdown: PriceBreakdown;
  onAddToCart: () => void;
}

export default function PricingSummary({ config, priceBreakdown, onAddToCart }: PricingSummaryProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [customSizeAcknowledged, setCustomSizeAcknowledged] = useState(false);

  const finishLabel = config.finish === 'powder-coat-black' 
    ? 'Powder Coat' 
    : config.finish === 'prime-painted'
    ? 'Prime Painted'
    : config.finish === 'galvanized'
    ? 'Galvanized'
    : 'Raw Steel';

  const mountingLabel = config.mounting === 'with-posts' ? 'Includes Posts' : 'Gate Only';

  return (
    <div className="sticky top-8">
      <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6 backdrop-blur-sm">
        {/* Product Name */}
        <h3 className="text-white text-xl font-bold mb-2">Steel Dumpster Gate</h3>
        
        {/* Trust Indicator */}
        <p className="text-white/60 text-sm mb-4">Fabricated in Utah</p>

        {/* Configuration Summary */}
        <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Size:</span>
            <span className="text-white font-medium">
              {config.isCustom
                ? `${formatDimension(config.widthFt)} × ${formatDimension(config.heightFt)}`
                : `${GATE_DIMENSIONS[config.size as keyof typeof GATE_DIMENSIONS].widthFt}' × ${GATE_DIMENSIONS[config.size as keyof typeof GATE_DIMENSIONS].heightFt}'`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Style:</span>
            <span className="text-white font-medium">
              {config.style === 'double-swing' ? 'Double Swing' : 
               config.style === 'single-swing-left' ? 'Single Swing (Left)' : 
               'Single Swing (Right)'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Finish:</span>
            <span className="text-white font-medium">{finishLabel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Mounting:</span>
            <span className="text-white font-medium">{mountingLabel}</span>
          </div>
          {config.quantity > 1 && (
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Quantity:</span>
              <span className="text-white font-medium">{config.quantity}</span>
            </div>
          )}
        </div>

        {/* Custom Size Pricing Header */}
        {config.isCustom && (
          <div className="mb-3">
            <h4 className="text-white font-semibold text-sm">Custom Size Pricing</h4>
          </div>
        )}

        {/* Pricing Breakdown - Mobile Expandable */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="md:hidden w-full flex items-center justify-between text-white/70 text-sm mb-2 hover:text-white transition-colors"
          >
            <span>Pricing breakdown</span>
            <svg
              className={`w-4 h-4 transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Desktop: Always visible, Mobile: Conditional */}
          <div className={`${showBreakdown ? 'block' : 'hidden'} md:block space-y-2`}>
            {priceBreakdown.lineItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-white/70">{item.label}</span>
                <span className="text-white">${item.amount.toFixed(2)}</span>
              </div>
            ))}
            {config.quantity > 1 && (
              <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                <span className="text-white/70">Unit Price:</span>
                <span className="text-white">${priceBreakdown.unitPrice.toFixed(2)}</span>
              </div>
            )}
            {config.quantity > 1 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Quantity:</span>
                <span className="text-white">× {config.quantity}</span>
              </div>
            )}
          </div>
        </div>

        {/* Lead Time */}
        <div className="mb-4 pb-4 border-b border-white/10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/70">Estimated Lead Time:</span>
            <span className="text-white font-medium">{priceBreakdown.leadTime}</span>
          </div>
          {config.finish === 'galvanized' && (
            <p className="text-blue-200 text-xs mt-1">
              Contact us if schedule is critical
            </p>
          )}
        </div>

        {/* Total Price */}
        <div className="mb-6">
          <div className="flex justify-between items-baseline">
            <span className="text-white/70 text-sm">Total:</span>
            <span className="text-white text-2xl font-bold">
              ${priceBreakdown.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Custom Fabrication Safety */}
        {config.isCustom && (
          <div className="mb-4 space-y-3">
            <div className="px-3 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
              <p className="text-yellow-200 text-sm font-medium">
                🛠 Custom Fabrication – Subject to Review
              </p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customSizeAcknowledged}
                onChange={(e) => setCustomSizeAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-red-500 focus:ring-red-500 focus:ring-2 rounded border-white/20 bg-white/5"
              />
              <span className="text-white/80 text-sm">
                I understand custom dimensions are fabricated to order and are non-returnable.
              </span>
            </label>
          </div>
        )}

        {/* Add to Cart CTA */}
        <button
          type="button"
          onClick={onAddToCart}
          disabled={config.isCustom && !customSizeAcknowledged}
          className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors mb-3 ${
            config.isCustom && !customSizeAcknowledged
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          Add to Cart
        </button>

        {/* Secondary Link */}
        {!config.isCustom && (
          <a
            href="/contact"
            className="block text-center text-white/60 hover:text-white text-sm transition-colors"
          >
            Need a custom size? Request a quote →
          </a>
        )}
      </div>
    </div>
  );
}

