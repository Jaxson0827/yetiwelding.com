'use client';

import React from 'react';
import { ShippingOption, ShippingMethod } from '@/lib/shipping/calculator';

interface ShippingMethodSelectorProps {
  options: ShippingOption[];
  selectedMethod: ShippingMethod;
  onMethodChange: (method: ShippingMethod) => void;
  isLoading?: boolean;
}

export default function ShippingMethodSelector({
  options,
  selectedMethod,
  onMethodChange,
  isLoading = false,
}: ShippingMethodSelectorProps) {
  if (isLoading) {
    return (
      <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#DC143C]"></div>
          <span className="ml-3 text-white/80">Calculating shipping...</span>
        </div>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
        <p className="text-white/60 text-sm">
          Enter your shipping address to calculate shipping costs.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
      <h3 className="text-white text-xl font-bold mb-4">Shipping Method</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.method}
            className={`flex items-start p-4 rounded-lg cursor-pointer transition-colors ${
              selectedMethod === option.method
                ? 'bg-[#DC143C]/20 border-2 border-[#DC143C]'
                : 'bg-white/5 border-2 border-white/20 hover:bg-white/10'
            }`}
          >
            <input
              type="radio"
              name="shippingMethod"
              value={option.method}
              checked={selectedMethod === option.method}
              onChange={() => onMethodChange(option.method)}
              className="w-4 h-4 text-[#DC143C] bg-white/10 border-white/20 focus:ring-[#DC143C] mt-1"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">{option.name}</div>
                  <div className="text-white/60 text-sm mt-1">{option.description}</div>
                  <div className="text-white/60 text-xs mt-1">
                    Estimated delivery: {option.estimatedDays}
                  </div>
                </div>
                <div className="text-white font-bold text-lg ml-4">
                  ${option.cost.toFixed(2)}
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}





