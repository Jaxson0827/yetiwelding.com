'use client';

import { VariantOption } from '@/lib/shop/types';

interface Props {
  option: VariantOption;
  selected: boolean;
  onSelect: () => void;
}

export default function OptionCard({ option, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
        selected
          ? 'border-white bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.4)]'
          : 'border-white/15 bg-white/[0.02] hover:border-white/35 hover:bg-white/[0.04]'
      }`}
    >
      {option.thumbImage ? (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-white/10 bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={option.thumbImage} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="h-10 w-10 shrink-0 rounded border border-white/10 bg-white/5" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{option.label}</p>
        {option.sublabel && (
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/55">
            {option.sublabel}
          </p>
        )}
      </div>
    </button>
  );
}
