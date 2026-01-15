'use client';

import React from 'react';
import { CartItem } from '@/contexts/CartContext';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { DumpsterGateConfig } from '@/lib/dumpsterGates/types';

interface OrderDetailsProps {
  items?: CartItem[];
  steelEmbeds?: EmbedSpec[];
  dumpsterGates?: DumpsterGateConfig[];
  subtotal?: number;
  shippingCost?: number;
  taxAmount?: number;
  orderTotal?: number;
}

export default function OrderDetails({
  items = [],
  steelEmbeds = [],
  dumpsterGates = [],
  subtotal,
  shippingCost = 0,
  taxAmount = 0,
  orderTotal,
}: OrderDetailsProps) {
  const renderItemDetails = (item: CartItem) => {
    if (item.productType === 'steel-plate-embeds') {
      const config = item.configuration as EmbedSpec;
      return (
        <div className="space-y-1">
          <h4 className="text-white font-semibold">Steel Plate Embed</h4>
          <p className="text-white/70 text-sm">
            {config.plate.length}" × {config.plate.width}" × {config.plate.thickness}" • {config.plate.material}
          </p>
          <p className="text-white/70 text-sm">
            {config.studs?.positions?.length || 0} studs • Qty: {config.quantity}
          </p>
          <p className="text-white/70 text-sm">
            Finish: {config.finish} • {config.leadTime === 'rush' ? 'Rush' : 'Standard'}
          </p>
        </div>
      );
    } else {
      const config = item.configuration as DumpsterGateConfig;
      const sizeDisplay = config.isCustom 
        ? `${config.widthFt}' × ${config.heightFt}'`
        : config.size;
      return (
        <div className="space-y-1">
          <h4 className="text-white font-semibold">Dumpster Gate</h4>
          <p className="text-white/70 text-sm">
            Size: {sizeDisplay} • Style: {config.style.replace('-', ' ')}
          </p>
          <p className="text-white/70 text-sm">
            Finish: {config.finish.replace('-', ' ')} • {config.mounting.replace('-', ' ')}
          </p>
          <p className="text-white/70 text-sm">Qty: {config.quantity}</p>
        </div>
      );
    }
  };

  // Use items if available, otherwise fall back to steelEmbeds/dumpsterGates
  const displayItems = items.length > 0 ? items : [];

  return (
    <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
      <h3 className="text-white text-2xl font-bold mb-6">Order Items</h3>
      
      {displayItems.length > 0 ? (
        <div className="space-y-4">
          {displayItems.map((item, index) => (
            <div key={item.id || index} className="pb-4 border-b border-white/10 last:border-0">
              {renderItemDetails(item)}
              <div className="mt-2 flex justify-end">
                <p className="text-white font-semibold">${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/60 text-sm">No items found</p>
      )}

      {(subtotal !== undefined || orderTotal !== undefined) && (
        <div className="mt-6 pt-6 border-t border-white/20 space-y-2">
          {subtotal !== undefined && (
            <div className="flex justify-between text-white/80">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          )}
          {shippingCost > 0 && (
            <div className="flex justify-between text-white/80">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
          )}
          {taxAmount > 0 && (
            <div className="flex justify-between text-white/80">
              <span>Tax</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
          )}
          {orderTotal !== undefined && (
            <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-white/20">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}





