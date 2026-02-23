'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import EmbedPreviewSwitcher from './EmbedPreviewSwitcher';
import EmbedSpecForm from './EmbedSpecForm';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { useCart } from '@/contexts/CartContext';
import { priceEmbed } from '@/lib/steelEmbeds/pricing';
import { QUOTE_ONLY_MODE } from '@/lib/quoteOnlyMode';
import { saveQuoteDraft } from '@/lib/quoteDraft';

export default function SteelEmbedsConfigurator() {
  const router = useRouter();
  const [spec, setSpec] = useState<Partial<EmbedSpec>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const { addItem } = useCart();

  const handleSpecChange = useCallback((newSpec: Partial<EmbedSpec>) => {
    setSpec(newSpec);
  }, []);

  const handleGetQuote = useCallback((embedSpec: EmbedSpec) => {
    const priceBreakdown = priceEmbed(embedSpec);
    const totalPrice = priceBreakdown.unitPrice * embedSpec.quantity;
    saveQuoteDraft('steel-plate-embeds', embedSpec, {
      totalPrice,
      unitPrice: priceBreakdown.unitPrice,
      leadTime: 'Standard',
    });
    router.push('/contact?from=quote');
  }, [router]);

  const handleAddToCart = useCallback((embedSpec: EmbedSpec) => {
    const priceBreakdown = priceEmbed(embedSpec);
    const unitPrice = priceBreakdown.unitPrice;
    const totalPrice = unitPrice * embedSpec.quantity;

    // Configs requiring manual review (high stud count, non-standard shape, etc.) get quote option at checkout
    const isCustomFabrication = priceBreakdown.confidence === 'review';

    const cartItem = {
      id: `steel-embed-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      productType: 'steel-plate-embeds' as const,
      configuration: embedSpec,
      price: totalPrice,
      isCustomFabrication,
    };

    addItem(cartItem);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [addItem]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-10 items-start">
        {/* Left Column: Preview */}
        <div className="order-2 lg:order-1 w-full flex flex-col gap-6 lg:sticky lg:top-8">
          <EmbedPreviewSwitcher spec={spec} />
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
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
                  Design Your Embed Plate
                </h2>
              </div>
              <p className="text-white/70 text-sm mt-2">
                Create a custom steel embed plate in minutes—no drawings required.
              </p>
            </div>

            <EmbedSpecForm
              onSpecChange={handleSpecChange}
              onAddToCart={handleAddToCart}
              onGetQuote={QUOTE_ONLY_MODE ? handleGetQuote : undefined}
            />
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


