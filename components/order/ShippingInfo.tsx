'use client';

import React from 'react';

interface ShippingInfoProps {
  customerInfo?: {
    name?: string;
    shippingAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
  };
  shippingMethod?: string;
  shippingCost?: number;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
}

export default function ShippingInfo({
  customerInfo,
  shippingMethod,
  shippingCost,
  trackingNumber,
  estimatedDeliveryDate,
}: ShippingInfoProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
      <h3 className="text-white text-xl font-bold mb-4">Shipping Information</h3>
      
      <div className="space-y-4">
        {customerInfo?.shippingAddress && (
          <div>
            <p className="text-white/60 text-sm mb-2">Shipping Address</p>
            <div className="text-white">
              {customerInfo.name && <p className="font-semibold">{customerInfo.name}</p>}
              <p>{customerInfo.shippingAddress.street}</p>
              <p>
                {customerInfo.shippingAddress.city}, {customerInfo.shippingAddress.state}{' '}
                {customerInfo.shippingAddress.zip}
              </p>
              {customerInfo.shippingAddress.country && (
                <p>{customerInfo.shippingAddress.country}</p>
              )}
            </div>
          </div>
        )}

        {shippingMethod && (
          <div>
            <p className="text-white/60 text-sm mb-1">Shipping Method</p>
            <p className="text-white capitalize">
              {shippingMethod.replace('-', ' ')}
            </p>
          </div>
        )}

        {shippingCost !== undefined && shippingCost > 0 && (
          <div>
            <p className="text-white/60 text-sm mb-1">Shipping Cost</p>
            <p className="text-white font-semibold">${shippingCost.toFixed(2)}</p>
          </div>
        )}

        {trackingNumber && (
          <div>
            <p className="text-white/60 text-sm mb-1">Tracking Number</p>
            <p className="text-white font-mono text-sm">{trackingNumber}</p>
            <a
              href="#"
              className="text-[#DC143C] hover:text-[#B01030] text-sm mt-1 inline-block"
              onClick={(e) => {
                e.preventDefault();
                // In production, link to carrier tracking
                alert('Tracking link would open carrier website');
              }}
            >
              Track Package →
            </a>
          </div>
        )}

        {estimatedDeliveryDate && (
          <div>
            <p className="text-white/60 text-sm mb-1">Estimated Delivery</p>
            <p className="text-white font-semibold">{formatDate(estimatedDeliveryDate)}</p>
          </div>
        )}
      </div>
    </div>
  );
}





