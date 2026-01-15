'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { DumpsterGateConfig, DimensionDisplay, GATE_DIMENSIONS, getCartKey } from '@/lib/dumpsterGates/types';
import { priceGate } from '@/lib/dumpsterGates/pricing';
import { useCart } from '@/contexts/CartContext';
import { parseDimension, formatDimension, validateWidth, validateHeight, validateGateStyle } from '@/lib/dumpsterGates/validation';
import DimensionGraphic from './DimensionGraphic';
import ConfigurationPanel from './ConfigurationPanel';
import PricingSummary from './PricingSummary';

export default function DumpsterGateConfigurator() {
  const { addItem } = useCart();
  const [config, setConfig] = useState<DumpsterGateConfig>({
    size: '14x6',
    style: 'double-swing',
    finish: 'prime-painted',
    mounting: 'with-posts',
    quantity: 1,
    isCustom: false,
    widthFt: 14,
    heightFt: 6,
  });

  const [widthError, setWidthError] = useState<string | undefined>();
  const [heightError, setHeightError] = useState<string | undefined>();
  const [styleWarning, setStyleWarning] = useState<string | undefined>();

  // Calculate dimensions display
  const dimensions: DimensionDisplay = useMemo(() => {
    const widthFt = config.isCustom ? config.widthFt : GATE_DIMENSIONS[config.size].widthFt;
    const heightFt = config.isCustom ? config.heightFt : GATE_DIMENSIONS[config.size].heightFt;
    const leafWidth = config.style === 'double-swing' 
      ? widthFt / 2 
      : widthFt;
    
    return {
      overallWidth: formatDimension(widthFt),
      overallHeight: formatDimension(heightFt),
      leafWidth: formatDimension(leafWidth),
      groundClearance: '2"',
    };
  }, [config.size, config.style, config.isCustom, config.widthFt, config.heightFt]);

  // Calculate pricing
  const priceBreakdown = useMemo(() => {
    return priceGate(config);
  }, [config]);

  // Handle dimension change from editable label
  const handleDimensionChange = useCallback((dimension: 'width' | 'height', value: string) => {
    const parsed = parseDimension(value);
    
    if (parsed === null) {
      if (dimension === 'width') {
        setWidthError('Invalid format. Use: 15\' 6" or 15.5');
      } else {
        setHeightError('Invalid format. Use: 6\' or 6.0');
      }
      return;
    }

    // Validate dimension
    let validation;
    if (dimension === 'width') {
      validation = validateWidth(parsed);
      if (!validation.valid) {
        setWidthError(validation.error);
        return;
      }
      setWidthError(undefined);
    } else {
      validation = validateHeight(parsed);
      if (!validation.valid) {
        setHeightError(validation.error);
        return;
      }
      setHeightError(undefined);
    }

    // Update config
    setConfig((prev) => {
      const newConfig = {
        ...prev,
        isCustom: true,
        size: 'custom' as const,
        [dimension === 'width' ? 'widthFt' : 'heightFt']: parsed,
      };

      // If width changed, check if we need to auto-switch style
      if (dimension === 'width') {
        const styleValidation = validateGateStyle(parsed, newConfig.style);
        if (styleValidation.shouldSwitch) {
          setStyleWarning(styleValidation.error);
          newConfig.style = 'double-swing';
        } else {
          setStyleWarning(undefined);
        }
      }

      return newConfig;
    });
  }, []);

  // Handle width change from dimension graphic
  const handleWidthChange = useCallback((value: string) => {
    handleDimensionChange('width', value);
  }, [handleDimensionChange]);

  // Handle height change from dimension graphic
  const handleHeightChange = useCallback((value: string) => {
    handleDimensionChange('height', value);
  }, [handleDimensionChange]);

  // Handle configuration changes
  const handleConfigChange = useCallback((partialConfig: Partial<DumpsterGateConfig>) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...partialConfig };
      
      // If size changed to a preset, update widthFt/heightFt and clear custom flag
      if (partialConfig.size && partialConfig.size !== 'custom' && partialConfig.size in GATE_DIMENSIONS) {
        const dims = GATE_DIMENSIONS[partialConfig.size as keyof typeof GATE_DIMENSIONS];
        newConfig.widthFt = dims.widthFt;
        newConfig.heightFt = dims.heightFt;
        newConfig.isCustom = false;
        setWidthError(undefined);
        setHeightError(undefined);
        setStyleWarning(undefined);
      }
      
      // If size changed to custom, set isCustom flag
      if (partialConfig.size === 'custom') {
        newConfig.isCustom = true;
      }
      
      // If style changed, check if it's valid for current width
      if (partialConfig.style && newConfig.widthFt) {
        const styleValidation = validateGateStyle(newConfig.widthFt, newConfig.style);
        if (styleValidation.shouldSwitch) {
          setStyleWarning(styleValidation.error);
        } else {
          setStyleWarning(undefined);
        }
      }
      
      return newConfig;
    });
  }, []);

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    const cartKey = getCartKey(config);
    const cartItem = {
      id: cartKey,
      productType: 'dumpster-gate' as const,
      configuration: config,
      price: priceBreakdown.totalPrice,
      isCustomFabrication: config.isCustom,
    };
    addItem(cartItem);
    
    // Show success feedback (you could add a toast here)
    alert(`Added ${config.quantity} gate${config.quantity > 1 ? 's' : ''} to cart`);
  }, [config, priceBreakdown, addItem]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side: Dimension Graphic */}
        <div className="order-2 lg:order-1">
          <DimensionGraphic
            dimensions={dimensions}
            style={config.style}
            onWidthChange={handleWidthChange}
            onHeightChange={handleHeightChange}
            widthError={widthError}
            heightError={heightError}
          />
          {styleWarning && (
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
              <p className="text-yellow-200 text-sm">{styleWarning}</p>
            </div>
          )}
        </div>

        {/* Right Side: Configuration Panel + Pricing Summary */}
        <div className="order-1 lg:order-2 space-y-8">
          {/* Configuration Panel */}
          <div className="bg-white/5 border-2 border-white/20 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-white text-2xl font-bold mb-6">Configure Your Gate</h2>
            <ConfigurationPanel config={config} onConfigChange={handleConfigChange} />
          </div>

          {/* Pricing Summary */}
          <PricingSummary
            config={config}
            priceBreakdown={priceBreakdown}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}

