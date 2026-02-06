'use client';

import React, { useEffect, useState } from 'react';
import { DumpsterGateConfig, Finish, MountingOption, PowderCoatColor } from '@/lib/dumpsterGates/types';
import { formatDimension, parseDimension, validateBlockHeight, validateWidth } from '@/lib/dumpsterGates/validation';
import ConfigDropdown, { DropdownOption } from '@/components/ConfigDropdown';

interface ConfigurationPanelProps {
  config: DumpsterGateConfig;
  onConfigChange: (config: Partial<DumpsterGateConfig>) => void;
}

type Unit = 'ft' | 'in';

function roundToFraction(value: number, denom: number) {
  return Math.round(value * denom) / denom;
}

function parseInchesInput(value: string): number | null {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Accept: 72, 72", 72 in, 72 inches
  const m = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:"|in|inch|inches)?\s*$/i);
  if (!m) return null;
  const inches = parseFloat(m[1]);
  if (isNaN(inches)) return null;
  return inches;
}

function parseFeetByUnit(value: string, unit: Unit): number | null {
  if (unit === 'ft') return parseDimension(value);
  const inches = parseInchesInput(value);
  if (inches === null) return null;
  return inches / 12;
}

function formatByUnit(feet: number, unit: Unit): string {
  if (unit === 'ft') return formatDimension(feet);
  const inches = roundToFraction(feet * 12, 16);
  const isWhole = Math.abs(inches - Math.round(inches)) < 1e-6;
  return `${isWhole ? Math.round(inches) : Math.round(inches * 100) / 100}"`;
}

function UnitToggle({ value, onChange }: { value: Unit; onChange: (unit: Unit) => void }) {
  return (
    <div className="inline-flex shrink-0 overflow-hidden rounded-lg border-2 border-white/20 bg-white/5">
      <button
        type="button"
        onClick={() => onChange('ft')}
        className={`px-3 py-2 text-xs font-semibold transition-colors ${
          value === 'ft' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
        }`}
        aria-pressed={value === 'ft'}
      >
        Ft
      </button>
      <button
        type="button"
        onClick={() => onChange('in')}
        className={`px-3 py-2 text-xs font-semibold transition-colors ${
          value === 'in' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
        }`}
        aria-pressed={value === 'in'}
      >
        In
      </button>
    </div>
  );
}

const FINISH_OPTIONS: { value: Finish; label: string; note?: string }[] = [
  { value: 'raw-steel', label: 'Raw steel' },
  { value: 'prime-painted', label: 'Prime painted' },
  { value: 'powder-coat-black', label: 'Powder coat', note: 'Adds 3–5 business days' },
  { value: 'galvanized', label: 'Galvanized' },
];

const POWDER_COAT_COLORS: { value: PowderCoatColor; label: string; hex: string }[] = [
  { value: 'black', label: 'Black', hex: '#111827' },
  { value: 'white', label: 'White', hex: '#ffffff' },
  { value: 'gray', label: 'Gray', hex: '#9ca3af' },
  { value: 'red', label: 'Red', hex: '#dc2626' },
  { value: 'blue', label: 'Blue', hex: '#2563eb' },
  { value: 'green', label: 'Green', hex: '#16a34a' },
  { value: 'bronze', label: 'Bronze', hex: '#a16207' },
];

export default function ConfigurationPanel({ config, onConfigChange }: ConfigurationPanelProps) {
  const [enclLengthUnit, setEnclLengthUnit] = useState<Unit>('ft');
  const [leftHeightUnit, setLeftHeightUnit] = useState<Unit>('ft');
  const [rightHeightUnit, setRightHeightUnit] = useState<Unit>('ft');
  const [blockWidthUnit, setBlockWidthUnit] = useState<Unit>('in');

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
    setEnclLengthInput(formatByUnit(config.enclosureLengthFt, enclLengthUnit));
    setLeftHeightInput(formatByUnit(config.leftHeightFt, leftHeightUnit));
    setRightHeightInput(formatByUnit(config.rightHeightFt, rightHeightUnit));

    const blockWidthFt = config.blockWidthIn / 12;
    setBlockWidthInput(formatByUnit(blockWidthFt, blockWidthUnit));
  }, [
    config.enclosureLengthFt,
    config.leftHeightFt,
    config.rightHeightFt,
    config.blockWidthIn,
    enclLengthUnit,
    leftHeightUnit,
    rightHeightUnit,
    blockWidthUnit,
  ]);

  const handleEnclLengthChange = (value: string) => {
    setEnclLengthInput(value);
    const parsed = parseFeetByUnit(value, enclLengthUnit);
    if (parsed === null) {
      setEnclLengthError(enclLengthUnit === 'in' ? 'Invalid format. Examples: 168 or 168"' : 'Invalid format. Examples: 14\' 0", 14.5, 168"');
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
    const parsed = parseFeetByUnit(value, leftHeightUnit);
    if (parsed === null) {
      setLeftHeightError(leftHeightUnit === 'in' ? 'Invalid format. Examples: 72 or 72"' : 'Invalid format. Examples: 6\' 0", 6.0, 72"');
      return;
    }
    const validation = validateBlockHeight(parsed);
    if (!validation.valid) {
      setLeftHeightError(validation.error);
      return;
    }
    setLeftHeightError(undefined);
    onConfigChange({ leftHeightFt: parsed });
  };

  const handleRightHeightChange = (value: string) => {
    setRightHeightInput(value);
    const parsed = parseFeetByUnit(value, rightHeightUnit);
    if (parsed === null) {
      setRightHeightError(rightHeightUnit === 'in' ? 'Invalid format. Examples: 72 or 72"' : 'Invalid format. Examples: 6\' 0", 6.0, 72"');
      return;
    }
    const validation = validateBlockHeight(parsed);
    if (!validation.valid) {
      setRightHeightError(validation.error);
      return;
    }
    setRightHeightError(undefined);
    onConfigChange({ rightHeightFt: parsed });
  };

  const handleBlockWidthChange = (value: string) => {
    setBlockWidthInput(value);
    const parsedFt = parseFeetByUnit(value, blockWidthUnit);
    if (parsedFt === null) {
      setBlockWidthError(blockWidthUnit === 'in' ? 'Invalid format. Examples: 8 or 8"' : 'Invalid format. Examples: 0\' 8", 0.67, 8"');
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
    if (finish === 'powder-coat-black') {
      onConfigChange({ finish, powderCoatColor: config.powderCoatColor || 'black' });
      return;
    }
    onConfigChange({ finish, powderCoatColor: undefined });
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
            <label className="block text-white/70 text-sm mb-2">Enclosure overall (outside-to-outside)</label>
            <div className="flex items-stretch gap-2">
              <input
                type="text"
                value={enclLengthInput}
                onChange={(e) => handleEnclLengthChange(e.target.value)}
                onBlur={() => {
                  const parsed = parseFeetByUnit(enclLengthInput, enclLengthUnit);
                  if (parsed !== null && validateWidth(parsed).valid) {
                    setEnclLengthInput(formatByUnit(parsed, enclLengthUnit));
                  }
                }}
                placeholder={formatByUnit(config.enclosureLengthFt, enclLengthUnit)}
                className={`w-full px-4 py-3 rounded-lg border-2 bg-white/5 text-white focus:outline-none ${
                  enclLengthError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/20 focus:border-red-500'
                }`}
              />
              <UnitToggle
                value={enclLengthUnit}
                onChange={(nextUnit) => {
                  const parsed = parseFeetByUnit(enclLengthInput, enclLengthUnit);
                  setEnclLengthUnit(nextUnit);
                  if (parsed !== null && validateWidth(parsed).valid) {
                    setEnclLengthInput(formatByUnit(parsed, nextUnit));
                  }
                }}
              />
            </div>
            {enclLengthError && <p className="mt-1 text-red-400 text-xs">{enclLengthError}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Left block height</label>
              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  value={leftHeightInput}
                  onChange={(e) => handleLeftHeightChange(e.target.value)}
                  onBlur={() => {
                    const parsed = parseFeetByUnit(leftHeightInput, leftHeightUnit);
                    if (parsed !== null && validateBlockHeight(parsed).valid) {
                      setLeftHeightInput(formatByUnit(parsed, leftHeightUnit));
                    }
                  }}
                  placeholder={formatByUnit(config.leftHeightFt, leftHeightUnit)}
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-white/5 text-white focus:outline-none ${
                    leftHeightError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/20 focus:border-red-500'
                  }`}
                />
                <UnitToggle
                  value={leftHeightUnit}
                  onChange={(nextUnit) => {
                    const parsed = parseFeetByUnit(leftHeightInput, leftHeightUnit);
                    setLeftHeightUnit(nextUnit);
                    if (parsed !== null && validateBlockHeight(parsed).valid) {
                      setLeftHeightInput(formatByUnit(parsed, nextUnit));
                    }
                  }}
                />
              </div>
              {leftHeightError && <p className="mt-1 text-red-400 text-xs">{leftHeightError}</p>}
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Right block height</label>
              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  value={rightHeightInput}
                  onChange={(e) => handleRightHeightChange(e.target.value)}
                  onBlur={() => {
                    const parsed = parseFeetByUnit(rightHeightInput, rightHeightUnit);
                    if (parsed !== null && validateBlockHeight(parsed).valid) {
                      setRightHeightInput(formatByUnit(parsed, rightHeightUnit));
                    }
                  }}
                  placeholder={formatByUnit(config.rightHeightFt, rightHeightUnit)}
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-white/5 text-white focus:outline-none ${
                    rightHeightError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/20 focus:border-red-500'
                  }`}
                />
                <UnitToggle
                  value={rightHeightUnit}
                  onChange={(nextUnit) => {
                    const parsed = parseFeetByUnit(rightHeightInput, rightHeightUnit);
                    setRightHeightUnit(nextUnit);
                    if (parsed !== null && validateBlockHeight(parsed).valid) {
                      setRightHeightInput(formatByUnit(parsed, nextUnit));
                    }
                  }}
                />
              </div>
              {rightHeightError && <p className="mt-1 text-red-400 text-xs">{rightHeightError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
                Block width
              </label>
              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  value={blockWidthInput}
                  onChange={(e) => handleBlockWidthChange(e.target.value)}
                  onBlur={() => {
                    const parsedFt = parseFeetByUnit(blockWidthInput, blockWidthUnit);
                    if (parsedFt !== null && parsedFt > 0) {
                      setBlockWidthInput(formatByUnit(parsedFt, blockWidthUnit));
                    }
                  }}
                  placeholder={formatByUnit(config.blockWidthIn / 12, blockWidthUnit)}
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-white/5 text-white focus:outline-none ${
                    blockWidthError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/20 focus:border-red-500'
                  }`}
                />
                <UnitToggle
                  value={blockWidthUnit}
                  onChange={(nextUnit) => {
                    const parsed = parseFeetByUnit(blockWidthInput, blockWidthUnit);
                    setBlockWidthUnit(nextUnit);
                    if (parsed !== null && parsed > 0) {
                      setBlockWidthInput(formatByUnit(parsed, nextUnit));
                    }
                  }}
                />
              </div>
              {blockWidthError && <p className="mt-1 text-red-400 text-xs">{blockWidthError}</p>}
              <p className="mt-1 text-white/60 text-xs">Examples: 8&quot;, 8 in, or 0&apos; 8&quot;</p>
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
          <>
            <p className="mt-2 text-white/60 text-sm">Adds 3–5 business days</p>

            <div className="mt-4">
              <label className="block text-white text-sm font-medium mb-3">
                Powder coat color <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-7 gap-2">
                {POWDER_COAT_COLORS.map((c) => {
                  const selected = (config.powderCoatColor || 'black') === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      title={c.label}
                      onClick={() => onConfigChange({ powderCoatColor: c.value })}
                      className={`h-10 w-10 rounded-md border-2 transition-all ${
                        selected ? 'border-red-500 ring-2 ring-red-500/40' : 'border-white/20 hover:border-white/40'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      aria-label={`Powder coat color: ${c.label}`}
                      aria-pressed={selected}
                    >
                      <span className="sr-only">{c.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-white/60 text-xs">
                Selected:{' '}
                <span className="text-white/80 font-medium">
                  {POWDER_COAT_COLORS.find((c) => c.value === (config.powderCoatColor || 'black'))?.label || 'Black'}
                </span>
              </p>
            </div>
          </>
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

