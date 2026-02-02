'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PriceBreakdown } from '@/lib/steelEmbeds/types';

interface PriceDisplayProps {
  priceBreakdown: PriceBreakdown | null;
  quantity: number;
}

export default function PriceDisplay({ priceBreakdown, quantity }: PriceDisplayProps) {
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
    </div>
  );
}







