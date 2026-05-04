'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { shopNavItems } from '@/lib/shop/navigation';
import { ShopNavItem, MegaMenuItem } from '@/lib/shop/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileShopDrawer({ open, onClose }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Reset expansion when drawer closes.
  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 z-[70] flex w-[85vw] max-w-[360px] flex-col bg-gray-warm-100 text-white shadow-2xl lg:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <Link
                href="/shop"
                onClick={onClose}
                className="text-sm font-bold uppercase tracking-[0.18em] text-white"
              >
                Yeti Steel Goods
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded text-white/80 hover:bg-white/10 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Nav body */}
            <nav className="flex-1 overflow-auto">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-xs font-medium uppercase tracking-wider text-white/60 hover:text-white"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Yeti Welding
              </Link>

              <ul className="px-2 py-2">
                {shopNavItems.map((item) => (
                  <DrawerItem
                    key={item.label}
                    item={item}
                    isOpen={expanded === item.label}
                    onToggle={() =>
                      setExpanded((prev) => (prev === item.label ? null : item.label))
                    }
                    onSelect={onClose}
                  />
                ))}
              </ul>
            </nav>

            {/* Footer utility row */}
            <div className="border-t border-white/10 p-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/85 hover:bg-white/10"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  Search
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/85 hover:bg-white/10"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 21a8 8 0 0116 0"
                    />
                  </svg>
                  Account
                </button>
              </div>
              <button
                type="button"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded bg-accent-red px-3 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-red-light"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                View Cart
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerItem({
  item,
  isOpen,
  onToggle,
  onSelect,
}: {
  item: ShopNavItem;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: () => void;
}) {
  const hasMenu = !!item.megaMenu;
  const allItems: MegaMenuItem[] = hasMenu
    ? item.megaMenu!.columns.flatMap((c) => c.items)
    : [];

  if (!hasMenu) {
    return (
      <li>
        <Link
          href={item.href}
          onClick={onSelect}
          className="flex items-center justify-between rounded-md px-3 py-3 text-base font-semibold text-white hover:bg-white/5"
        >
          <span>{item.label}</span>
          <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-base font-semibold text-white hover:bg-white/5"
      >
        <span>{item.label}</span>
        <motion.svg
          className="h-4 w-4 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="space-y-1 pb-2 pl-3 pr-2 pt-1">
              {/* Top-level category link */}
              <li>
                <Link
                  href={item.href}
                  onClick={onSelect}
                  className="block rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-accent-red hover:bg-white/5"
                >
                  Shop all {item.label}
                </Link>
              </li>
              {allItems.map((sub) => (
                <li key={sub.href}>
                  <Link
                    href={sub.href}
                    onClick={onSelect}
                    className="flex items-start gap-3 rounded-md px-3 py-2 hover:bg-white/5"
                  >
                    {(sub.icon || sub.image) && (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-white/10 bg-white/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sub.icon || sub.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{sub.label}</p>
                      <p className="text-xs text-white/55">{sub.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
