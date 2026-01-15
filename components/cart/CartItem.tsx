'use client';

import React from 'react';
import { CartItem as CartItemType } from '@/contexts/CartContext';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import { useSavedItems } from '@/contexts/SavedItemsContext';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onSaveForLater?: (item: CartItemType) => void;
}

export default function CartItem({ item, onRemove, onQuantityChange, onSaveForLater }: CartItemProps) {
  const { saveItem } = useSavedItems();

  const handleSaveForLater = () => {
    saveItem(item);
    if (onSaveForLater) {
      onSaveForLater(item);
    }
  };
  const getCurrentQuantity = () => {
    if (item.productType === 'steel-plate-embeds') {
      return (item.configuration as EmbedSpec).quantity;
    } else {
      return (item.configuration as DumpsterGateConfig).quantity;
    }
  };

  const currentQuantity = getCurrentQuantity();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  const handleDecrease = () => {
    if (currentQuantity > 1) {
      handleQuantityChange(currentQuantity - 1);
    }
  };

  const handleIncrease = () => {
    handleQuantityChange(currentQuantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      handleQuantityChange(value);
    } else if (e.target.value === '') {
      // Allow empty input while typing
    }
  };
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
            {config.studs?.positions?.length || 0} studs
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
        </div>
      );
    }
  };

  return (
    <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {renderProductDetails()}
          {item.isCustomFabrication && (
            <span className="inline-block mt-2 px-2 py-1 bg-yellow-500/20 text-yellow-200 text-xs rounded">
              Custom Fabrication
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <label className="text-white/60 text-sm">Quantity:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrease}
                disabled={currentQuantity <= 1}
                className={`w-8 h-8 rounded flex items-center justify-center font-semibold transition-colors ${
                  currentQuantity <= 1
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={currentQuantity}
                onChange={handleInputChange}
                onBlur={(e) => {
                  if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
                    e.target.value = '1';
                    handleQuantityChange(1);
                  }
                }}
                className="w-16 px-2 py-1 bg-white/10 border-2 border-white/20 rounded text-white text-center text-sm focus:outline-none focus:border-[#DC143C]"
              />
              <button
                onClick={handleIncrease}
                className="w-8 h-8 rounded flex items-center justify-center font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-white/60 text-xs mb-1">
              ${(item.price / currentQuantity).toFixed(2)} each
            </p>
            <p className="text-white font-bold text-lg">
              ${item.price.toFixed(2)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSaveForLater}
              className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm rounded transition-colors"
            >
              Save for Later
            </button>
            <button
              onClick={() => onRemove(item.id)}
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

