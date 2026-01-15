'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PriceBreakdown } from '@/lib/steelEmbeds/types';

interface PriceDisplayProps {
  priceBreakdown: PriceBreakdown | null;
  quantity: number;
}

export default function PriceDisplay({ priceBreakdown, quantity }: PriceDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!priceBreakdown) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
            Price
          </label>
          <p className="text-white/60 text-sm">Complete the form to see pricing</p>
        </div>
      </div>
    );
  }

  const unitPrice = priceBreakdown.unitPrice;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
          Price
        </label>
        <motion.div
          key={totalPrice}
          initial={{ scale: 1.1, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-5xl font-bold text-white"
          style={{
            textShadow: '0 0 20px rgba(220, 20, 60, 0.5)',
          }}
        >
          ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </motion.div>
        {quantity > 1 && (
          <p className="text-white/60 text-sm mt-1">
            ${unitPrice.toFixed(2)} per unit × {quantity} units
          </p>
        )}
      </div>

      {/* Confidence Badge */}
      <div className="pt-2">
        {priceBreakdown.confidence === 'high' ? (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50">
            <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-200 text-xs font-medium">Instant Quote</span>
          </div>
        ) : (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/50">
            <svg className="w-4 h-4 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-yellow-200 text-xs font-medium">Review may be required</span>
          </div>
        )}
      </div>

      {/* Line Items Breakdown */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/60 hover:text-white text-sm font-medium flex items-center"
        >
          {isExpanded ? 'Hide' : 'Show'} breakdown
          <svg
            className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2"
            >
              {priceBreakdown.lineItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-white/80">{item.label}</span>
                  <span className="text-white font-medium">
                    ${item.amount.toFixed(2)}
                    {item.quantity && ` (×${item.quantity})`}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}







