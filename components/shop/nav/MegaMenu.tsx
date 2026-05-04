'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShopNavItem, MegaMenuItem } from '@/lib/shop/types';

interface Props {
  navItem: ShopNavItem;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export default function MegaMenu({ navItem, onMouseEnter, onMouseLeave, onClose }: Props) {
  if (!navItem.megaMenu) return null;
  const { variant, columns } = navItem.megaMenu;

  return (
    <motion.div
      className="absolute inset-x-0 top-full z-50 hidden lg:block"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4">
        <div
          className="rounded-b-xl border border-t-0 border-white/10 bg-gray-warm-100 p-8 text-white shadow-2xl"
          role="menu"
          aria-label={`${navItem.label} menu`}
        >
          {variant === 'columns' ? (
            <ColumnLayout columns={columns} onSelect={onClose} />
          ) : (
            <ImageCardLayout columns={columns} onSelect={onClose} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ColumnLayout({
  columns,
  onSelect,
}: {
  columns: { label?: string; items: MegaMenuItem[] }[];
  onSelect: () => void;
}) {
  return (
    <div
      className="grid gap-x-10 gap-y-6"
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0,1fr))` }}
    >
      {columns.map((col, i) => (
        <div key={i} className="space-y-3">
          {col.label && (
            <h4 className="border-b border-white/10 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
              {col.label}
            </h4>
          )}
          <ul className="space-y-1">
            {col.items.map((item) => (
              <li key={item.href}>
                <ColumnRow item={item} onSelect={onSelect} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ColumnRow({ item, onSelect }: { item: MegaMenuItem; onSelect: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onSelect}
      className="group flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-white/5"
      role="menuitem"
    >
      {item.icon ? (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.icon}
            alt=""
            className="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-12 w-12 shrink-0 rounded-md border border-white/10 bg-white/5" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white transition-colors group-hover:text-accent-red">
          {item.label}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-white/55">{item.description}</p>
      </div>
    </Link>
  );
}

function ImageCardLayout({
  columns,
  onSelect,
}: {
  columns: { label?: string; items: MegaMenuItem[] }[];
  onSelect: () => void;
}) {
  // Image-card menus typically use a single column with two large cards.
  const allItems = columns.flatMap((c) => c.items);
  const sectionLabel = columns.find((c) => c.label)?.label;

  return (
    <div className="space-y-4">
      {sectionLabel && (
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
          {sectionLabel}
        </h4>
      )}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${Math.min(allItems.length, 2)}, minmax(0,1fr))`,
        }}
      >
        {allItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onSelect}
            className="group block overflow-hidden rounded-lg border border-white/10 bg-black/30 transition-colors hover:border-accent-red/40"
            role="menuitem"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/5">
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div className="p-4">
              <p className="text-base font-semibold text-white transition-colors group-hover:text-accent-red">
                {item.label}
              </p>
              <p className="mt-1 text-sm text-white/60">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
