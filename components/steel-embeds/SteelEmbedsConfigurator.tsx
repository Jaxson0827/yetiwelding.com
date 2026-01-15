'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmbedPreview3D from './EmbedPreview3D';
import EmbedSpecForm from './EmbedSpecForm';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { useCart } from '@/contexts/CartContext';
import { priceEmbed } from '@/lib/steelEmbeds/pricing';

export default function SteelEmbedsConfigurator() {
  const [spec, setSpec] = useState<Partial<EmbedSpec>>({});
  const [configuredEmbeds, setConfiguredEmbeds] = useState<EmbedSpec[]>([]);
  const [currentEmbedIndex, setCurrentEmbedIndex] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addItem } = useCart();

  const handleSpecChange = useCallback((newSpec: Partial<EmbedSpec>) => {
    setSpec(newSpec);
  }, []);

  const handleAddEmbed = useCallback((completeSpec: EmbedSpec) => {
    if (currentEmbedIndex !== null) {
      // Update existing embed
      const updated = [...configuredEmbeds];
      updated[currentEmbedIndex] = completeSpec;
      setConfiguredEmbeds(updated);
      setCurrentEmbedIndex(null);
      setSpec({});
    } else {
      // Add new embed
      setConfiguredEmbeds(prev => [...prev, completeSpec]);
      setSpec({});
    }
  }, [currentEmbedIndex, configuredEmbeds]);

  const handleEditEmbed = useCallback((index: number) => {
    setCurrentEmbedIndex(index);
    setSpec(configuredEmbeds[index]);
  }, [configuredEmbeds]);

  const handleRemoveEmbed = useCallback((index: number) => {
    setConfiguredEmbeds(prev => prev.filter((_, i) => i !== index));
    if (currentEmbedIndex === index) {
      setCurrentEmbedIndex(null);
      setSpec({});
    } else if (currentEmbedIndex !== null && currentEmbedIndex > index) {
      setCurrentEmbedIndex(currentEmbedIndex - 1);
    }
  }, [currentEmbedIndex]);

  const handleAddAllToCart = useCallback(() => {
    configuredEmbeds.forEach(embedSpec => {
      const priceBreakdown = priceEmbed(embedSpec);
      const unitPrice = priceBreakdown.unitPrice;
      const totalPrice = unitPrice * embedSpec.quantity;

      const cartItem = {
        id: `steel-embed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productType: 'steel-plate-embeds' as const,
        configuration: embedSpec,
        price: totalPrice,
      };

      addItem(cartItem);
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setConfiguredEmbeds([]);
    setCurrentEmbedIndex(null);
    setSpec({});
  }, [configuredEmbeds, addItem]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-start">
        {/* Left Column: Preview */}
        <div className="order-2 lg:order-1 w-full flex flex-col gap-6">
          {/* 3D Preview */}
          <div className="flex flex-col h-[500px]">
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm flex-shrink-0">3D Preview</h3>
            <div className="flex-1 h-full">
              <EmbedPreview3D glbUrl={null} previewStatus="none" spec={spec} />
            </div>
          </div>
        </div>

        {/* Right Column: Spec Form */}
        <div className="order-1 lg:order-2">
          <div
            className="p-8 rounded-lg sticky top-8"
            style={{
              background:
                'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(40, 10, 10, 0.8) 50%, rgba(60, 15, 15, 0.8) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(220, 20, 60, 0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
                {currentEmbedIndex !== null ? `Edit Embed ${currentEmbedIndex + 1}` : 'Configure Steel Embed'}
              </h2>
              {configuredEmbeds.length > 0 && (
                <span className="text-white/60 text-sm">
                  {configuredEmbeds.length} embed{configuredEmbeds.length !== 1 ? 's' : ''} configured
                </span>
              )}
            </div>

            <EmbedSpecForm
              onSpecChange={handleSpecChange}
              onAddToCart={handleAddEmbed}
              currentEmbedIndex={currentEmbedIndex}
              onExportQuote={async (spec) => {
                try {
                  const response = await fetch('/api/steel-embeds/export-quote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ embedSpecs: [spec] }),
                  });
                  const data = await response.json();
                  if (data.success && data.pdfUrl) {
                    window.open(data.pdfUrl, '_blank');
                  }
                } catch (error) {
                  console.error('Failed to export quote:', error);
                  alert('Failed to export quote. Please try again.');
                }
              }}
            />

            {/* Configured Embeds List */}
            {configuredEmbeds.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Configured Embeds</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {configuredEmbeds.map((embed, index) => {
                    const priceBreakdown = priceEmbed(embed);
                    const totalPrice = priceBreakdown.unitPrice * embed.quantity;
                    
                    return (
                      <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-white font-semibold mb-1">
                              Embed {index + 1}: {embed.plate.length}" × {embed.plate.width}" × {embed.plate.thickness}"
                            </h4>
                            <p className="text-white/60 text-sm">
                              {embed.plate.material} • {embed.studs?.positions?.length || 0} studs • Qty: {embed.quantity}
                            </p>
                            <p className="text-white/80 text-sm font-semibold mt-1">
                              ${totalPrice.toFixed(2)} total
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              type="button"
                              onClick={() => handleEditEmbed(index)}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveEmbed(index)}
                              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="text-white/60 text-sm">Total Embeds: {configuredEmbeds.length}</p>
                    <p className="text-white font-semibold text-lg mt-1">
                      Total: ${configuredEmbeds.reduce((sum, embed) => {
                        const priceBreakdown = priceEmbed(embed);
                        return sum + (priceBreakdown.unitPrice * embed.quantity);
                      }, 0).toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAllToCart}
                    className="px-6 py-3 bg-[#DC143C] text-white rounded-lg font-semibold hover:bg-[#B01030] transition-colors"
                  >
                    Add All to Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification */}
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
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-semibold">Added to cart!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


