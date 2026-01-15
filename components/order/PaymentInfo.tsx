'use client';

import React from 'react';

interface PaymentInfoProps {
  paymentStatus?: string;
  paymentIntentId?: string;
  orderTotal?: number;
}

export default function PaymentInfo({
  paymentStatus,
  paymentIntentId,
  orderTotal,
}: PaymentInfoProps) {
  const getPaymentStatusDisplay = () => {
    switch (paymentStatus) {
      case 'paid':
        return {
          label: 'Paid',
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
        };
      case 'pending':
        return {
          label: 'Payment Pending',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
        };
      default:
        return {
          label: 'Not Paid',
          color: 'text-white/60',
          bgColor: 'bg-white/5',
          borderColor: 'border-white/10',
        };
    }
  };

  const status = getPaymentStatusDisplay();

  return (
    <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
      <h3 className="text-white text-xl font-bold mb-4">Payment Information</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-white/60 text-sm mb-1">Payment Status</p>
          <div className={`inline-block px-3 py-1 rounded-lg border ${status.bgColor} ${status.borderColor}`}>
            <span className={`font-semibold ${status.color}`}>{status.label}</span>
          </div>
        </div>

        {paymentIntentId && (
          <div>
            <p className="text-white/60 text-sm mb-1">Payment ID</p>
            <p className="text-white font-mono text-sm">{paymentIntentId}</p>
          </div>
        )}

        {orderTotal !== undefined && (
          <div>
            <p className="text-white/60 text-sm mb-1">Order Total</p>
            <p className="text-white font-bold text-lg">${orderTotal.toFixed(2)}</p>
          </div>
        )}

        {paymentStatus === 'paid' && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-200 text-sm">
              ✓ Payment confirmed. Your order is being processed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}





