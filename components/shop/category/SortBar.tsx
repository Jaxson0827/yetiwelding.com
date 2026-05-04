'use client';

export type SortKey = 'trending' | 'newest' | 'price-asc' | 'price-desc';

const options: { id: SortKey; label: string }[] = [
  { id: 'trending', label: 'Trending' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to high' },
  { id: 'price-desc', label: 'Price: High to low' },
];

interface Props {
  value: SortKey;
  onChange: (next: SortKey) => void;
}

export default function SortBar({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-1 py-4">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              active
                ? 'bg-white text-black'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
