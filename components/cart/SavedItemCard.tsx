'use client';

import React from 'react';
import { CartItem as CartItemType } from '@/contexts/CartContext';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { DumpsterGateConfig } from '@/lib/dumpsterGates/types';

interface SavedItemCardProps {
  item: CartItemType;
  onMoveToCart: () => void;
  onRemove: () => void;
}

export default function SavedItemCard({ item, onMoveToCart, onRemove }: SavedItemCardProps) {
  const renderProductDetails = () => {
    if (item.productType === 'steel-plate-embeds') {
      const config = item.configuration as EmbedSpec;
      return (
        <div className="space-y-1">
          <h4 className="text-white font-semibold">
            Steel Plate Embed
          </h4>
          <p className="text-white/70 text-sm">
            {config.plate.length}" × {config.plate.width}" × {config.plate.thickness}" • {config.plate.material}
          </p>
          <p className="text-white/70 text-sm">
            {config.studs?.positions?.length || 0} studs • Qty: {config.quantity}
          </p>
          <p className="text-white/70 text-sm">
            Finish: {config.finish} • {config.leadTime === 'rush' ? 'Rush' : 'Standard'} lead time
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
          <h4 className="text-white font-semibold">
            Dumpster Gate
          </h4>
          <p className="text-white/70 text-sm">
            Size: {sizeDisplay} • Style: {config.style.replace('-', ' ')}
          </p>
          <p className="text-white/70 text-sm">
            Finish: {config.finish.replace('-', ' ')} • {config.mounting.replace('-', ' ')}
          </p>
          <p className="text-white/70 text-sm">
            Qty: {config.quantity}
          </p>
        </div>
      );
    }
  };

  return (
    <div className="bg-white/5 border-2 border-white/20 rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {renderProductDetails()}
          {item.isCustomFabrication && (
            <span className="inline-block mt-2 px-2 py-1 bg-yellow-500/20 text-yellow-200 text-xs rounded">
              Custom Fabrication
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-white font-bold">
            ${item.price.toFixed(2)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onMoveToCart}
              className="px-3 py-1.5 bg-[#DC143C] hover:bg-[#B01030] text-white text-sm rounded transition-colors"
            >
              Move to Cart
            </button>
            <button
              onClick={onRemove}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}





