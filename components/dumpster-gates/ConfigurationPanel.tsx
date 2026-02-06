'use client';

import React, { useEffect, useState } from 'react';
import { DumpsterGateConfig, Finish, MountingOption } from '@/lib/dumpsterGates/types';
import { formatDimension, parseDimension, validateHeight, validateWidth } from '@/lib/dumpsterGates/validation';
import ConfigDropdown, { DropdownOption } from '@/components/ConfigDropdown';

interface ConfigurationPanelProps {
  config: DumpsterGateConfig;
  onConfigChange: (config: Partial<DumpsterGateConfig>) => void;
}

const FINISH_OPTIONS: { value: Finish; label: string; note?: string }[] = [
  { value: 'raw-steel', label: 'Raw steel' },
  { value: 'prime-painted', label: 'Prime painted' },
  { value: 'powder-coat-black', label: 'Powder coat (black)', note: 'Adds 3–5 business days' },
  { value: 'galvanized', label: 'Galvanized' },
];

export default function ConfigurationPanel({ config, onConfigChange }: ConfigurationPanelProps) {
  const [enclLengthInput, setEnclLengthInput] = useState(formatDimension(config.enclosureLengthFt));
  const [leftHeightInput, setLeftHeightInput] = useState(formatDimension(config.leftHeightFt));
  const [rightHeightInput, setRightHeightInput] = useState(formatDimension(config.rightHeightFt));
  const [blockWidthInput, setBlockWidthInput] = useState(`${Math.round(config.blockWidthIn * 100) / 100}"`);

  const [enclLengthError, setEnclLengthError] = useState<string | undefined>();
  const [leftHeightError, setLeftHeightError] = useState<string | undefined>();
  const [rightHeightError, setRightHeightError] = useState<string | undefined>();
  const [blockWidthError, setBlockWidthError] = useState<string | undefined>();

  // Sync input values when config changes externally
  useEffect(() => {
    setEnclLengthInput(formatDimension(config.enclosureLengthFt));
    setLeftHeightInput(formatDimension(config.leftHeightFt));
    setRightHeightInput(formatDimension(config.rightHeightFt));
    setBlockWidthInput(`${Math.round(config.blockWidthIn * 100) / 100}"`);
  }, [config.enclosureLengthFt, config.leftHeightFt, config.rightHeightFt, config.blockWidthIn]);

  const handleEnclLengthChange = (value: string) => {
    setEnclLengthInput(value);
    const parsed = parseDimension(value);
    if (parsed === null) {
      setEnclLengthError('Invalid format. Use: 14\' 6" or 14.5');
      return;
    }
    const validation = validateWidth(parsed);
    if (!validation.valid) {
      setEnclLengthError(validation.error);
      return;
    }
    setEnclLengthError(undefined);
    onConfigChange({ enclosureLengthFt: parsed });
  };

  const handleLeftHeightChange = (value: string) => {
    setLeftHeightInput(value);
    const parsed = parseDimension(value);
    if (parsed === null) {
      setLeftHeightError('Invalid format. Use: 6\' or 6.0');
      return;
    }
    const validation = validateHeight(parsed);
    if (!validation.valid) {
      setLeftHeightError(validation.error);
      return;
    }
    setLeftHeightError(undefined);
    onConfigChange({ leftHeightFt: parsed });
  };

  const handleRightHeightChange = (value: string) => {
    setRightHeightInput(value);
    const parsed = parseDimension(value);
    if (parsed === null) {
      setRightHeightError('Invalid format. Use: 6\' or 6.0');
      return;
    }
    const validation = validateHeight(parsed);
    if (!validation.valid) {
      setRightHeightError(validation.error);
      return;
    }
    setRightHeightError(undefined);
    onConfigChange({ rightHeightFt: parsed });
  };

  const handleBlockWidthChange = (value: string) => {
    setBlockWidthInput(value);
    const parsedFt = parseDimension(value);
    if (parsedFt === null) {
      setBlockWidthError('Invalid format. Use: 8" or 0\' 8"');
      return;
    }
    const inches = parsedFt * 12;
    if (isNaN(inches) || inches <= 0) {
      setBlockWidthError('Block width must be positive');
      return;
    }
    setBlockWidthError(undefined);
    onConfigChange({ blockWidthIn: Math.round(inches * 16) / 16 });
  };

  const handleBottomGapChange = (bottomGapIn: 4 | 5 | 6 | 7) => {
    onConfigChange({ bottomGapIn });
  };

  const bottomGapOptions: DropdownOption[] = [
    { value: '4', label: '4"' },
    { value: '5', label: '5"' },
    { value: '6', label: '6"' },
    { value: '7', label: '7"' },
  ];

  const finishDropdownOptions: DropdownOption[] = FINISH_OPTIONS.map((o) => ({
    value: o.value,
    label: o.label,
  }));

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
      {/* A. Enclosure Inputs */}
      <div>
        <label className="block text-white text-sm font-medium mb-3">
          Enclosure Inputs <span className="text-red-500">*</span>
        </label>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Enclosure length (outside-to-outside)</label>
            <input
              type="text"
              value={enclLengthInput}
              onChange={(e) => handleEnclLengthChange(e.target.value)}
              onBlur={() => {
                const parsed = parseDimension(enclLengthInput);
                if (parsed !== null && validateWidth(parsed).valid) {
                  setEnclLengthInput(formatDimension(parsed));
                }
              }}
              placeholder={formatDimension(config.enclosureLengthFt)}
              className={`w-full px-4 py-3 rounded-lg border-2 bg-white/5 text-white focus:outline-none ${
                enclLengthError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white/20 focus:border-red-500'
              }`}
            />
            {enclLengthError && <p className="mt-1 text-red-400 text-xs">{enclLengthError}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Left height</label>
              <input
                type="text"
                value={leftHeightInput}
                onChange={(e) => handleLeftHeightChange(e.target.value)}
                onBlur={() => {
                  const parsed = parseDimension(leftHeightInput);
                  if (parsed !== null && validateHeight(parsed).valid) {
                    setLeftHeightInput(formatDimension(parsed));
                  }
                }}
                placeholder={formatDimension(config.leftHeightFt)}
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white/5 text-white focus:outline-none ${
                  leftHeightError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/20 focus:border-red-500'
                }`}
              />
              {leftHeightError && <p className="mt-1 text-red-400 text-xs">{leftHeightError}</p>}
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Right height</label>
              <input
                type="text"
                value={rightHeightInput}
                onChange={(e) => handleRightHeightChange(e.target.value)}
                onBlur={() => {
                  const parsed = parseDimension(rightHeightInput);
                  if (parsed !== null && validateHeight(parsed).valid) {
                    setRightHeightInput(formatDimension(parsed));
                  }
                }}
                placeholder={formatDimension(config.rightHeightFt)}
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white/5 text-white focus:outline-none ${
                  rightHeightError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/20 focus:border-red-500'
                }`}
              />
              {rightHeightError && <p className="mt-1 text-red-400 text-xs">{rightHeightError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
                Block width
              </label>
              <input
                type="text"
                value={blockWidthInput}
                onChange={(e) => handleBlockWidthChange(e.target.value)}
                onBlur={() => {
                  const parsedFt = parseDimension(blockWidthInput);
                  if (parsedFt !== null && parsedFt > 0) {
                    const inches = Math.round(parsedFt * 12 * 16) / 16;
                    setBlockWidthInput(`${Math.round(inches * 100) / 100}"`);
                  }
                }}
                placeholder={`${config.blockWidthIn}"`}
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white/5 text-white focus:outline-none ${
                  blockWidthError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/20 focus:border-red-500'
                }`}
              />
              {blockWidthError && <p className="mt-1 text-red-400 text-xs">{blockWidthError}</p>}
              <p className="mt-1 text-white/60 text-xs">Examples: 8&quot; or 0&apos; 8&quot;</p>
            </div>
            <div>
              <ConfigDropdown
                label="Bottom gap"
                options={bottomGapOptions}
                value={String(config.bottomGapIn)}
                onChange={(value) => handleBottomGapChange(parseInt(value, 10) as 4 | 5 | 6 | 7)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* B. Finish */}
      <div>
        <ConfigDropdown
          label="Finish"
          options={finishDropdownOptions}
          value={config.finish}
          onChange={(value) => handleFinishChange(value as Finish)}
        />
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

      {/* C. Post/Mounting Option */}
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

