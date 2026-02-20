'use client';

import React from 'react';
import { CartItem as CartItemType } from '@/contexts/CartContext';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import type { PergolaConfig } from '@/lib/pergolas/types';
import type { GardenBoxConfig } from '@/lib/gardenBoxes/types';
import { GARDEN_BOX_FINISHES, GARDEN_BOX_ADD_ON_LABELS } from '@/lib/gardenBoxes/types';
import { getDumpsterGateSizeDisplay } from '@/lib/dumpsterGates/validation';
import { COLORS } from '@/lib/pergolas/colors';
import { getDesign } from '@/lib/pergolas/panels';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, newQuantity: number) => void;
}

export default function CartItem({ item, onRemove, onQuantityChange }: CartItemProps) {
  const getCurrentQuantity = () => {
    if (item.productType === 'steel-plate-embeds') {
      return (item.configuration as EmbedSpec).quantity;
    }
    if (item.productType === 'pergola') {
      return (item.configuration as PergolaConfig).quantity ?? 1;
    }
    if (item.productType === 'garden-box') {
      return (item.configuration as GardenBoxConfig).quantity ?? 1;
    }
    return (item.configuration as DumpsterGateConfig).quantity;
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
        </div>
      );
    }
    if (item.productType === 'garden-box') {
      const config = item.configuration as GardenBoxConfig;
      const sizeLabel = { '4x2': "4'×2'", '6x3': "6'×3'", '8x4': "8'×4'" }[config.size];
      const finishLabel = GARDEN_BOX_FINISHES.find((f) => f.id === config.finish)?.label ?? config.finish;
      const addOns = config.addOns
        ? Object.entries(config.addOns)
            .filter(([, v]) => v)
            .map(([k]) => GARDEN_BOX_ADD_ON_LABELS[k as keyof typeof GARDEN_BOX_ADD_ON_LABELS])
            .join(', ')
        : '';
      return (
        <div className="space-y-1">
          <h4 className="text-white font-semibold">Steel Garden Box</h4>
          <p className="text-white/70 text-sm">
            {sizeLabel} × {config.height}" • {finishLabel}
          </p>
          {addOns && <p className="text-white/70 text-sm">Add-ons: {addOns}</p>}
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
          <h4 className="text-white font-semibold">
            Dumpster Gate
          </h4>
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
        </div>
      );
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

