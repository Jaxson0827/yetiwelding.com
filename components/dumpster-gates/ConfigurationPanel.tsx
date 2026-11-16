'use client';

import React, { useEffect, useId, useState } from 'react';
import type { DumpsterGateConfig, Finish, MountingOption, PowderCoatColor } from '@/lib/dumpsterGates/types';
import { formatDimension, parseDimension, validateBlockHeight, validateWidth } from '@/lib/dumpsterGates/validation';

interface ConfigurationPanelProps {
  config: DumpsterGateConfig;
  onConfigChange: (config: Partial<DumpsterGateConfig>) => void;
}

type Unit = 'ft' | 'in';

function parseInchesInput(value: string): number | null {
  const m = value.trim().match(/^(\d+(?:\.\d+)?)\s*(?:"|in|inch|inches)?\s*$/i);
  return m ? parseFloat(m[1]) : null;
}

function parseFeetByUnit(value: string, unit: Unit): number | null {
  if (unit === 'ft') return parseDimension(value);
  const inches = parseInchesInput(value);
  return inches === null ? null : inches / 12;
}

function formatByUnit(feet: number, unit: Unit): string {
  if (unit === 'ft') return formatDimension(feet);
  const inches = Math.round(feet * 12 * 16) / 16;
  const isWhole = Math.abs(inches - Math.round(inches)) < 1e-6;
  return `${isWhole ? Math.round(inches) : Math.round(inches * 100) / 100}"`;
}

const fieldBase =
  'w-full bg-black/40 px-3.5 py-3 text-[15px] text-white placeholder:text-white/30 outline-none transition-colors ' +
  'border focus-visible:border-accent-red focus-visible:ring-1 focus-visible:ring-accent-red';

/** Feet/inches text input with its own unit toggle, parse + validation. */
function DimensionInput({
  label,
  hint,
  valueFt,
  defaultUnit,
  validate,
  onCommit,
}: {
  label: string;
  hint?: string;
  valueFt: number;
  defaultUnit: Unit;
  validate: (ft: number) => string | undefined;
  onCommit: (ft: number) => void;
}) {
  const id = useId();
  const [unit, setUnit] = useState<Unit>(defaultUnit);
  const [text, setText] = useState(formatByUnit(valueFt, defaultUnit));
  const [error, setError] = useState<string | undefined>();
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(formatByUnit(valueFt, unit));
  }, [valueFt, unit, focused]);

  const handleChange = (value: string) => {
    setText(value);
    const parsed = parseFeetByUnit(value, unit);
    if (parsed === null) {
      setError(unit === 'in' ? 'Use inches, like 96 or 96"' : `Use feet and inches, like 14' 6" or 14.5`);
      return;
    }
    const err = validate(parsed);
    setError(err);
    if (!err) onCommit(parsed);
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-white">
        {label}
      </label>
      <div className="flex items-stretch">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            const parsed = parseFeetByUnit(text, unit);
            if (parsed !== null && !validate(parsed)) setText(formatByUnit(parsed, unit));
          }}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          className={`${fieldBase} font-drafting ${error ? 'border-accent-red' : 'border-gate-rule'}`}
        />
        <div className="flex shrink-0 border border-l-0 border-gate-rule" role="group" aria-label={`${label} units`}>
          {(['ft', 'in'] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => {
                const parsed = parseFeetByUnit(text, unit);
                setUnit(u);
                if (parsed !== null && !validate(parsed)) setText(formatByUnit(parsed, u));
              }}
              aria-pressed={unit === u}
              className={`w-11 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent-red ${
                unit === u ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-[#ff6b81]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-gate-mute">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0 border-t border-gate-rule first:border-t-0">
      <legend className="mb-4 flex items-center gap-3 pr-3">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center border border-white/70 font-drafting text-[13px] font-bold text-white"
        >
          {n}
        </span>
        <span className="font-display text-lg font-bold text-white [font-stretch:112%]">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

const FINISH_OPTIONS: { value: Finish; label: string; note: string }[] = [
  { value: 'prime-painted', label: 'Primed', note: 'Ready for your paint' },
  { value: 'powder-coat-black', label: 'Powder coat', note: 'Adds 3–5 business days' },
  { value: 'galvanized', label: 'Galvanized', note: 'Longest-lasting, longer lead time' },
  { value: 'raw-steel', label: 'Raw steel', note: 'Will rust until coated' },
];

const POWDER_COAT_COLORS: { value: PowderCoatColor; label: string; hex: string }[] = [
  { value: 'black', label: 'Black', hex: '#111111' },
  { value: 'white', label: 'White', hex: '#f4f4f2' },
  { value: 'gray', label: 'Gray', hex: '#8f969b' },
  { value: 'bronze', label: 'Bronze', hex: '#6b4a2b' },
  { value: 'green', label: 'Green', hex: '#2f5a3a' },
  { value: 'blue', label: 'Blue', hex: '#26456e' },
  { value: 'red', label: 'Red', hex: '#8f1d1d' },
];

const MOUNTING_OPTIONS: { value: MountingOption; label: string; note: string }[] = [
  { value: 'with-posts', label: 'Steel posts included', note: 'Posts set about 3\' deep in concrete beside your walls. Most enclosures need these.' },
  { value: 'gate-only', label: 'Gate only', note: 'You already have steel posts or embeds to hang it on.' },
];

function OptionCard({
  name,
  checked,
  onChange,
  label,
  note,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  note: string;
}) {
  return (
    <label
      className={`relative flex cursor-pointer flex-col gap-0.5 border px-3.5 py-3 transition-colors has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-accent-red ${
        checked ? 'border-white bg-white/[0.06]' : 'border-gate-rule hover:border-white/40'
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className="flex items-center gap-2 text-[15px] font-semibold text-white">
        <span
          aria-hidden="true"
          className={`h-3 w-3 shrink-0 border ${checked ? 'border-accent-red bg-accent-red' : 'border-white/50'}`}
        />
        {label}
      </span>
      <span className="pl-5 text-xs leading-relaxed text-gate-mute">{note}</span>
    </label>
  );
}

export default function ConfigurationPanel({ config, onConfigChange }: ConfigurationPanelProps) {
  const powderColor = config.powderCoatColor || 'black';

  return (
    <div className="space-y-8">
      <Step n={1} title="Enclosure width">
        <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
          <DimensionInput
            label="Outside of wall to outside of wall"
            hint="Measure across the front of the enclosure."
            valueFt={config.enclosureLengthFt}
            defaultUnit="ft"
            validate={(ft) => (validateWidth(ft).valid ? undefined : validateWidth(ft).error)}
            onCommit={(ft) => onConfigChange({ enclosureLengthFt: ft })}
          />
          <DimensionInput
            label="Wall thickness"
            hint="One wall, at the opening."
            valueFt={config.blockWidthIn / 12}
            defaultUnit="in"
            validate={(ft) => (ft > 0 && ft * 12 <= 24 ? undefined : 'Enter a wall thickness up to 24"')}
            onCommit={(ft) => onConfigChange({ blockWidthIn: Math.round(ft * 12 * 16) / 16 })}
          />
        </div>
      </Step>

      <Step n={2} title="Wall heights">
        <div className="grid gap-4 sm:grid-cols-2">
          <DimensionInput
            label="Left wall"
            hint="Pad to top of wall, at the front corner."
            valueFt={config.leftHeightFt}
            defaultUnit="ft"
            validate={(ft) => (validateBlockHeight(ft).valid ? undefined : validateBlockHeight(ft).error)}
            onCommit={(ft) => onConfigChange({ leftHeightFt: ft })}
          />
          <DimensionInput
            label="Right wall"
            hint="Same spot on the other side."
            valueFt={config.rightHeightFt}
            defaultUnit="ft"
            validate={(ft) => (validateBlockHeight(ft).valid ? undefined : validateBlockHeight(ft).error)}
            onCommit={(ft) => onConfigChange({ rightHeightFt: ft })}
          />
        </div>
        <div className="mt-5">
          <div id="gap-label" className="mb-1.5 text-sm font-medium text-white">
            Gap under the gate
          </div>
          <div role="radiogroup" aria-labelledby="gap-label" className="inline-flex border border-gate-rule">
            {([4, 5, 6, 7] as const).map((gap) => {
              const active = config.bottomGapIn === gap;
              return (
                <button
                  key={gap}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onConfigChange({ bottomGapIn: gap })}
                  className={`w-14 py-2.5 font-drafting text-sm transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent-red ${
                    active ? 'bg-white font-bold text-black' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {gap}&quot;
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-gate-mute">
            More gap clears snow and an uneven pad. Gate height is your taller wall minus this gap.
          </p>
        </div>
      </Step>

      <Step n={3} title="Finish">
        <div className="grid gap-2 sm:grid-cols-2">
          {FINISH_OPTIONS.map((o) => (
            <OptionCard
              key={o.value}
              name="finish"
              checked={config.finish === o.value}
              onChange={() =>
                onConfigChange(
                  o.value === 'powder-coat-black'
                    ? { finish: o.value, powderCoatColor: config.powderCoatColor || 'black' }
                    : { finish: o.value, powderCoatColor: undefined }
                )
              }
              label={o.label}
              note={o.note}
            />
          ))}
        </div>
        {config.finish === 'powder-coat-black' && (
          <div className="mt-4">
            <div id="color-label" className="mb-2 text-sm font-medium text-white">
              Color <span className="font-normal text-gate-mute">(black is standard, other colors are quoted)</span>
            </div>
            <div role="radiogroup" aria-labelledby="color-label" className="flex flex-wrap gap-2">
              {POWDER_COAT_COLORS.map((c) => {
                const selected = powderColor === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={c.label}
                    title={c.label}
                    onClick={() => onConfigChange({ powderCoatColor: c.value })}
                    className={`h-9 w-9 border transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-red ${
                      selected ? 'border-white ring-2 ring-white ring-offset-2 ring-offset-black' : 'border-white/25'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
            <p className="mt-2 text-xs text-gate-mute">
              Selected: <span className="text-white">{POWDER_COAT_COLORS.find((c) => c.value === powderColor)?.label}</span>
            </p>
          </div>
        )}
      </Step>

      <Step n={4} title="Posts and quantity">
        <div className="grid gap-2">
          {MOUNTING_OPTIONS.map((o) => (
            <OptionCard
              key={o.value}
              name="mounting"
              checked={config.mounting === o.value}
              onChange={() => onConfigChange({ mounting: o.value })}
              label={o.label}
              note={o.note}
            />
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span id="qty-label" className="text-sm font-medium text-white">
            How many gates like this?
          </span>
          <div className="flex items-stretch border border-gate-rule" role="group" aria-labelledby="qty-label">
            <button
              type="button"
              onClick={() => config.quantity > 1 && onConfigChange({ quantity: config.quantity - 1 })}
              disabled={config.quantity <= 1}
              aria-label="One fewer"
              className="w-10 text-lg text-white transition-colors hover:bg-white/10 disabled:text-white/25 disabled:hover:bg-transparent"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={50}
              value={config.quantity}
              aria-label="Quantity"
              onChange={(e) => {
                const q = Math.min(50, Math.max(1, parseInt(e.target.value, 10) || 1));
                onConfigChange({ quantity: q });
              }}
              className="w-12 border-x border-gate-rule bg-transparent py-2 text-center font-drafting text-white outline-none [appearance:textfield] focus-visible:bg-white/10 [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => config.quantity < 50 && onConfigChange({ quantity: config.quantity + 1 })}
              aria-label="One more"
              className="w-10 text-lg text-white transition-colors hover:bg-white/10"
            >
              +
            </button>
          </div>
        </div>
      </Step>
    </div>
  );
}
