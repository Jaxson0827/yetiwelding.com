'use client';

import React, { useEffect, useState } from 'react';
import DimensionGraphic, { type DumpsterGatePrintValues } from './DimensionGraphic';
import type { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import { formatDimension } from '@/lib/dumpsterGates/validation';
import { getFinishLabel, getGateHeightFt } from '@/lib/dumpsterGates/display';

interface DrawingSheetProps {
  config: DumpsterGateConfig;
  printValues: DumpsterGatePrintValues;
}

function Cell({
  label,
  value,
  className = '',
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-gate-paper px-2.5 py-1.5 ${className}`}>
      <div className="font-drafting text-[9px] uppercase tracking-[0.08em] text-gate-ink/55">{label}</div>
      <div className="font-drafting text-[12px] font-bold uppercase leading-tight text-gate-ink sm:text-[13px]">
        {value}
      </div>
    </div>
  );
}

/**
 * The configurator's live drawing, presented as a shop drawing sheet: paper, border, title block.
 * Everything in crimson is something the customer controls.
 */
export default function DrawingSheet({ config, printValues }: DrawingSheetProps) {
  // Date is client-only to avoid a server/client mismatch around midnight.
  const [today, setToday] = useState('');
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
    );
  }, []);

  return (
    <figure className="bg-gate-paper p-2 text-gate-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:p-3">
      {/* Sheet border (double line, like a printed drawing) */}
      <div className="border border-gate-ink/80 p-[3px]">
        <div className="border border-gate-ink/40">
          <div className="px-1 pt-2 sm:px-3 sm:pt-4">
            <DimensionGraphic values={printValues} style={config.style} frameless hide={['gateWidth']} />
          </div>

          {/* Title block. gap-px over an ink background draws the cell rules. */}
          <div className="grid grid-cols-2 gap-px border-t border-gate-ink/80 bg-gate-ink/80 sm:grid-cols-[1.5fr_1fr_1fr_1fr_0.7fr]">
            <div className="col-span-2 bg-gate-paper px-2.5 py-2 sm:col-span-1">
              <div className="font-drafting text-[13px] font-bold uppercase leading-tight tracking-[0.04em]">
                Dumpster enclosure gate
              </div>
              <div className="font-drafting text-[10px] uppercase tracking-[0.06em] text-gate-ink/60">
                Double swing, front elevation
              </div>
            </div>
            <Cell label="Enclosure" value={<span className="text-accent-red">{formatDimension(config.enclosureLengthFt)}</span>} />
            <Cell label="Gate height" value={<span className="text-accent-red">{formatDimension(getGateHeightFt(config))}</span>} />
            <Cell label="Posts" value={config.mounting === 'with-posts' ? 'Included' : 'Gate only'} />
            <Cell label="Qty" value={config.quantity} />
            <div className="col-span-2 bg-gate-paper px-2.5 py-1.5 sm:col-span-1 sm:col-start-1 sm:row-start-2">
              <div className="font-drafting text-[11px] font-bold uppercase tracking-[0.06em]">Yeti Welding</div>
              <div className="font-drafting text-[9px] uppercase tracking-[0.06em] text-gate-ink/55">Springville, Utah</div>
            </div>
            <Cell label="Finish" value={getFinishLabel(config)} className="col-span-2" />
            <Cell label="Scale" value="NTS" />
            <Cell label="Date" value={today || '\u00a0'} />
          </div>
        </div>
      </div>
      <figcaption className="mt-2 px-1 text-[12px] leading-snug text-gate-ink/70">
        Reference drawing. After you order, we email a dimensioned shop drawing for you to approve before we cut steel.
      </figcaption>
    </figure>
  );
}
