'use client';

export default function TradeBanner() {
  return (
    <div className="rounded-lg border border-white/15 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-red/20 text-accent-red">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 1l2.6 5.4 6 .8-4.4 4.2 1.1 6L10 14.7 4.7 17.4l1.1-6L1.4 7.2l6-.8z" />
            </svg>
          </span>
          <span className="text-sm font-semibold text-white">Yeti Welding</span>
          <span className="inline-flex items-center rounded-full bg-accent-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Trade
          </span>
        </div>
        <a
          href="/contact"
          className="inline-flex items-center gap-1 text-xs font-semibold text-white/85 hover:text-white"
        >
          See Trade Benefits
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
      <p className="mt-3 text-sm font-semibold text-white">
        Buying for a business?
      </p>
      <p className="mt-0.5 text-xs text-white/60">
        Get special pricing and priority fulfillment for tight schedules.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {['Trade Pricing', 'Priority Shipping', 'Tax Exempt Ordering'].map((b) => (
          <span
            key={b}
            className="inline-flex rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/80"
          >
            {b}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-white/45">
        Built for design, installation, and procurement teams.
      </p>
    </div>
  );
}
