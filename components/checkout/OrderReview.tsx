'use client';

import React from 'react';
import { CartItem } from '@/contexts/CartContext';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import { getDumpsterGateSizeDisplay } from '@/lib/dumpsterGates/validation';
import type { PergolaConfig } from '@/lib/pergolas/types';
import { COLORS } from '@/lib/pergolas/colors';
import { getDesign } from '@/lib/pergolas/panels';

interface OrderReviewProps {
  items: CartItem[];
  subtotal?: number;
  shippingCost?: number;
  taxAmount?: number;
  total?: number;
  showTaxPlaceholder?: boolean;
}

export default function OrderReview({
  items,
  subtotal,
  shippingCost = 0,
  taxAmount = 0,
  total,
  showTaxPlaceholder = false,
}: OrderReviewProps) {
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
        </div>
      );
    }
    if (item.productType === 'pergola') {
      const config = item.configuration as PergolaConfig;
      const colorName = COLORS.find((c) => c.id === config.colorId)?.name ?? config.colorId;
      const roofName = getDesign(config.roofDesignId).name;
      return (
        <div className="space-y-1">
          <h4 className="text-white font-semibold">Custom Pergola</h4>
          <p className="text-white/70 text-sm">
            {config.span}×{config.depth}×{config.height} ft
          </p>
          <p className="text-white/70 text-sm">
            Color: {colorName} • Roof: {roofName}
          </p>
          <p className="text-white/70 text-sm">Qty: {config.quantity ?? 1}</p>
        </div>
      );
    }
    const config = item.configuration as DumpsterGateConfig;
      const sizeDisplay = getDumpsterGateSizeDisplay(config);
      const powderCoatColorLabel =
        config.finish === 'powder-coat-black' && config.powderCoatColor
          ? config.powderCoatColor.charAt(0).toUpperCase() + config.powderCoatColor.slice(1)
          : null;
      return (
        <div className="space-y-1">
          <h4 className="text-white font-semibold">Dumpster Gate</h4>
          <p className="text-white/70 text-sm">
            Size: {sizeDisplay} • Style: {config.style.replace('-', ' ')}
          </p>
          <p className="text-white/70 text-sm">
            Finish:{' '}
            {config.finish === 'powder-coat-black'
              ? `Powder coat${powderCoatColorLabel ? ` (${powderCoatColorLabel})` : ''}`
              : config.finish.replace('-', ' ')}{' '}
            • {config.mounting.replace('-', ' ')}
          </p>
          <p className="text-white/70 text-sm">Qty: {config.quantity}</p>
        </div>
      );
  };

  return (
    <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
      <h3 className="text-white text-2xl font-bold mb-6">Order Review</h3>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="pb-4 border-b border-white/10 last:border-0">
            {renderItemDetails(item)}
            <div className="mt-2 flex justify-end">
              <p className="text-white font-semibold">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

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
        {showTaxPlaceholder ? (
          <div className="flex justify-between text-white/80">
            <span>Tax</span>
            <span className="text-white/50">Calculated at checkout</span>
          </div>
        ) : (
          taxAmount > 0 && (
            <div className="flex justify-between text-white/80">
              <span>Tax</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
          )
        )}
        <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-white/20">
          <span>Total</span>
          <span>
            $
            {total !== undefined
              ? total.toFixed(2)
              : items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

