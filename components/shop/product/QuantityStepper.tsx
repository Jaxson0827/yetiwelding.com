'use client';

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}

export default function QuantityStepper({ value, onChange, min = 1, max = 99 }: Props) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className="inline-flex h-12 w-[112px] items-center overflow-hidden rounded border border-white/15 bg-white/[0.04]">
      <button
        type="button"
        onClick={dec}
        aria-label="Decrease quantity"
        className="flex h-full w-9 items-center justify-center text-white/80 hover:bg-white/10 hover:text-white"
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        readOnly
        aria-label="Quantity"
        className="h-full w-full border-x border-white/10 bg-transparent text-center text-sm font-semibold text-white focus:outline-none"
      />
      <button
        type="button"
        onClick={inc}
        aria-label="Increase quantity"
        className="flex h-full w-9 items-center justify-center text-white/80 hover:bg-white/10 hover:text-white"
      >
        +
      </button>
    </div>
  );
}
