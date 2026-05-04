'use client';

import { VariantGroup, SelectionMap } from '@/lib/shop/types';
import OptionCard from './OptionCard';

interface Props {
  groups: VariantGroup[];
  selection: SelectionMap;
  onChange: (groupId: string, optionId: string) => void;
}

export default function VariantSelector({ groups, selection, onChange }: Props) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const cols = group.columns ?? 2;
        return (
          <div key={group.id}>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
              {group.label}
            </h3>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
            >
              {group.options.map((opt) => (
                <OptionCard
                  key={opt.id}
                  option={opt}
                  selected={selection[group.id] === opt.id}
                  onSelect={() => onChange(group.id, opt.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
