'use client';

import React, { useState, useEffect } from 'react';
import { DumpsterGateConfig, GateSize, GateStyle, Finish, MountingOption, GATE_DIMENSIONS, MAX_SINGLE_SWING_WIDTH_FT } from '@/lib/dumpsterGates/types';
import { parseDimension, formatDimension, validateWidth, validateHeight } from '@/lib/dumpsterGates/validation';

interface ConfigurationPanelProps {
  config: DumpsterGateConfig;
  onConfigChange: (config: Partial<DumpsterGateConfig>) => void;
}

const SIZE_OPTIONS: { value: GateSize; label: string }[] = [
  { value: '10x6', label: "10' × 6'" },
  { value: '12x6', label: "12' × 6'" },
  { value: '14x6', label: "14' × 6'" },
  { value: '16x6', label: "16' × 6'" },
  { value: '18x6', label: "18' × 6'" },
  { value: 'custom', label: 'Custom' },
];

const STYLE_OPTIONS: { value: GateStyle; label: string }[] = [
  { value: 'double-swing', label: 'Double Swing' },
  { value: 'single-swing-left', label: 'Single Swing (Left)' },
  { value: 'single-swing-right', label: 'Single Swing (Right)' },
];

const FINISH_OPTIONS: { value: Finish; label: string; note?: string }[] = [
  { value: 'raw-steel', label: 'Raw steel' },
  { value: 'prime-painted', label: 'Prime painted' },
  { value: 'powder-coat-black', label: 'Powder coat (black)', note: 'Adds 3–5 business days' },
  { value: 'galvanized', label: 'Galvanized' },
];

export default function ConfigurationPanel({ config, onConfigChange }: ConfigurationPanelProps) {
  const [customWidthInput, setCustomWidthInput] = useState(formatDimension(config.widthFt));
  const [customHeightInput, setCustomHeightInput] = useState(formatDimension(config.heightFt));
  const [customWidthError, setCustomWidthError] = useState<string | undefined>();
  const [customHeightError, setCustomHeightError] = useState<string | undefined>();

  // Sync input values when config changes externally (e.g., from dimension graphic edits)
  useEffect(() => {
    if (config.isCustom) {
      setCustomWidthInput(formatDimension(config.widthFt));
      setCustomHeightInput(formatDimension(config.heightFt));
      // Clear errors when config changes externally
      setCustomWidthError(undefined);
      setCustomHeightError(undefined);
    } else if (config.size !== 'custom') {
      // When switching to preset, update inputs to match preset dimensions
      const dims = GATE_DIMENSIONS[config.size as keyof typeof GATE_DIMENSIONS];
      if (dims) {
        setCustomWidthInput(formatDimension(dims.widthFt));
        setCustomHeightInput(formatDimension(dims.heightFt));
      }
    }
  }, [config.widthFt, config.heightFt, config.isCustom, config.size]);

  const isSingleSwing = config.style !== 'double-swing';
  const currentWidthFt = config.isCustom ? config.widthFt : GATE_DIMENSIONS[config.size as keyof typeof GATE_DIMENSIONS]?.widthFt || 14;
  const showInvalidCombinationWarning = isSingleSwing && currentWidthFt > MAX_SINGLE_SWING_WIDTH_FT;

  const handleSizeChange = (size: GateSize) => {
    onConfigChange({ size });
  };

  const handleCustomWidthChange = (value: string) => {
    setCustomWidthInput(value);
    const parsed = parseDimension(value);
    
    if (parsed === null) {
      setCustomWidthError('Invalid format. Use: 15\' 6" or 15.5');
      return;
    }

    const validation = validateWidth(parsed);
    if (!validation.valid) {
      setCustomWidthError(validation.error);
      return;
    }

    setCustomWidthError(undefined);
    onConfigChange({
      size: 'custom',
      isCustom: true,
      widthFt: parsed,
    });
  };

  const handleCustomHeightChange = (value: string) => {
    setCustomHeightInput(value);
    const parsed = parseDimension(value);
    
    if (parsed === null) {
      setCustomHeightError('Invalid format. Use: 6\' or 6.0');
      return;
    }

    const validation = validateHeight(parsed);
    if (!validation.valid) {
      setCustomHeightError(validation.error);
      return;
    }

    setCustomHeightError(undefined);
    onConfigChange({
      size: 'custom',
      isCustom: true,
      heightFt: parsed,
    });
  };

  const handleStyleChange = (style: GateStyle) => {
    onConfigChange({ style });
  };

  const handleFinishChange = (finish: Finish) => {
    onConfigChange({ finish });
  };

  const handleMountingChange = (mounting: MountingOption) => {
    onConfigChange({ mounting });
  };

  const handleQuantityChange = (quantity: number) => {
    if (quantity >= 1) {
      onConfigChange({ quantity });
    }
  };

  return (
    <div className="space-y-8">
      {/* A. Preset Size Selector */}
      <div>
        <label className="block text-white text-sm font-medium mb-3">
          Gate Size <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSizeChange(option.value)}
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                config.size === option.value
                  ? 'border-red-500 bg-red-500/10 text-white'
                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Custom Size Inputs */}
        {config.size === 'custom' && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-2 py-1 text-xs font-semibold text-red-500 bg-red-500/10 rounded">
                Custom Size
              </span>
            </div>
            
            <div>
              <label className="block text-white/70 text-sm mb-2">Width</label>
              <input
                type="text"
                value={customWidthInput}
                onChange={(e) => handleCustomWidthChange(e.target.value)}
                onBlur={() => {
                  // Format on blur if valid
                  const parsed = parseDimension(customWidthInput);
                  if (parsed !== null && validateWidth(parsed).valid) {
                    setCustomWidthInput(formatDimension(parsed));
                  }
                }}
                placeholder={formatDimension(config.widthFt)}
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white/5 text-white focus:outline-none ${
                  customWidthError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/20 focus:border-red-500'
                }`}
              />
              {customWidthError && (
                <p className="mt-1 text-red-400 text-xs">{customWidthError}</p>
              )}
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Height</label>
              <input
                type="text"
                value={customHeightInput}
                onChange={(e) => handleCustomHeightChange(e.target.value)}
                onBlur={() => {
                  // Format on blur if valid
                  const parsed = parseDimension(customHeightInput);
                  if (parsed !== null && validateHeight(parsed).valid) {
                    setCustomHeightInput(formatDimension(parsed));
                  }
                }}
                placeholder={formatDimension(config.heightFt)}
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white/5 text-white focus:outline-none ${
                  customHeightError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/20 focus:border-red-500'
                }`}
              />
              {customHeightError && (
                <p className="mt-1 text-red-400 text-xs">{customHeightError}</p>
              )}
            </div>

            <p className="text-white/60 text-sm">
              Custom sizes subject to review before fabrication.
            </p>
          </div>
        )}
      </div>

      {/* B. Gate Style */}
      <div>
        <label className="block text-white text-sm font-medium mb-3">
          Gate Style <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {STYLE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center p-3 rounded-lg border-2 border-white/20 bg-white/5 hover:border-white/40 cursor-pointer transition-all"
            >
              <input
                type="radio"
                name="gate-style"
                value={option.value}
                checked={config.style === option.value}
                onChange={() => handleStyleChange(option.value)}
                className="mr-3 w-4 h-4 text-red-500 focus:ring-red-500 focus:ring-2"
              />
              <span className="text-white">{option.label}</span>
            </label>
          ))}
        </div>
        {config.style === 'double-swing' && (
          <p className="mt-2 text-white/60 text-sm">
            Double swing recommended for openings over 10'
          </p>
        )}
        {showInvalidCombinationWarning && (
          <div className="mt-2 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <p className="text-yellow-200 text-sm">
              Single swing recommended up to {MAX_SINGLE_SWING_WIDTH_FT}'. Double swing required above that.
            </p>
          </div>
        )}
        {isSingleSwing && currentWidthFt > MAX_SINGLE_SWING_WIDTH_FT && (
          <div className="mt-2 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <p className="text-yellow-200 text-sm">
              Maximum single swing width is {MAX_SINGLE_SWING_WIDTH_FT}'. Please select double swing for widths over {MAX_SINGLE_SWING_WIDTH_FT}'.
            </p>
          </div>
        )}
      </div>

      {/* C. Finish */}
      <div>
        <label className="block text-white text-sm font-medium mb-3">
          Finish <span className="text-red-500">*</span>
        </label>
        <select
          value={config.finish}
          onChange={(e) => handleFinishChange(e.target.value as Finish)}
          className="w-full px-4 py-3 rounded-lg border-2 border-white/20 bg-white/5 text-white focus:border-red-500 focus:outline-none"
        >
          {FINISH_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {config.finish === 'powder-coat-black' && (
          <p className="mt-2 text-white/60 text-sm">
            Adds 3–5 business days
          </p>
        )}
        {config.finish === 'galvanized' && (
          <div className="mt-2 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
            <p className="text-blue-200 text-sm">
              Extended lead time. Contact us if schedule is critical.
            </p>
          </div>
        )}
      </div>

      {/* D. Post/Mounting Option */}
      <div>
        <label className="block text-white text-sm font-medium mb-3">
          Mounting Option <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <label className="flex items-center p-3 rounded-lg border-2 border-white/20 bg-white/5 hover:border-white/40 cursor-pointer transition-all">
            <input
              type="radio"
              name="mounting"
              value="with-posts"
              checked={config.mounting === 'with-posts'}
              onChange={() => handleMountingChange('with-posts')}
              className="mr-3 w-4 h-4 text-red-500 focus:ring-red-500 focus:ring-2"
            />
            <span className="text-white">Includes steel posts</span>
          </label>
          <label className="flex items-center p-3 rounded-lg border-2 border-white/20 bg-white/5 hover:border-white/40 cursor-pointer transition-all">
            <input
              type="radio"
              name="mounting"
              value="gate-only"
              checked={config.mounting === 'gate-only'}
              onChange={() => handleMountingChange('gate-only')}
              className="mr-3 w-4 h-4 text-red-500 focus:ring-red-500 focus:ring-2"
            />
            <span className="text-white">Gate only (mount to existing steel)</span>
          </label>
        </div>
        <p className="mt-2 text-white/60 text-sm">
          Not sure? Most dumpster enclosures need posts.
        </p>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-white text-sm font-medium mb-3">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleQuantityChange(config.quantity - 1)}
            disabled={config.quantity <= 1}
            className="w-10 h-10 rounded-lg border-2 border-white/20 bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/40 transition-all"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={config.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-20 px-4 py-2 rounded-lg border-2 border-white/20 bg-white/5 text-white text-center focus:border-red-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(config.quantity + 1)}
            className="w-10 h-10 rounded-lg border-2 border-white/20 bg-white/5 text-white hover:border-white/40 transition-all"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

