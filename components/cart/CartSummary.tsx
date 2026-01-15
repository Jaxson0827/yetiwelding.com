'use client';

import React from 'react';

interface CartSummaryProps {
  subtotal: number;
  tax?: number;
  shipping?: number;
  onCheckout: () => void;
  isCheckoutDisabled?: boolean;
}

export default function CartSummary({ 
  subtotal, 
  tax = 0, 
  shipping = 0, 
  onCheckout,
  isCheckoutDisabled = false 
}: CartSummaryProps) {
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6 sticky top-8">
      <h3 className="text-white text-2xl font-bold mb-6">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-white/80">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between text-white/80">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        )}
        {shipping > 0 && (
          <div className="flex justify-between text-white/80">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t border-white/20 pt-3 flex justify-between text-white font-bold text-xl">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          isCheckoutDisabled
            ? 'bg-white/10 text-white/50 cursor-not-allowed'
            : 'bg-[#DC143C] hover:bg-[#B01030] text-white'
        }`}
      >
        Proceed to Checkout
      </button>

      <p className="text-white/60 text-xs mt-4 text-center">
        * Final pricing may vary based on final specifications
      </p>
    </div>
  );
}





