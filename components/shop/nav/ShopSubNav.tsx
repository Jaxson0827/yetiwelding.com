'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { shopNavItems } from '@/lib/shop/navigation';
import MegaMenu from './MegaMenu';
import MobileShopDrawer from './MobileShopDrawer';

const HOVER_CLOSE_DELAY = 120;

export default function ShopSubNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on route change.
  useEffect(() => {
    setOpenMenu(null);
    setDrawerOpen(false);
  }, [pathname]);

  // ESC closes any open menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };

  const handleLeave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), HOVER_CLOSE_DELAY);
  };

  const isActiveCategory = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <>
      <motion.div
        className="sticky top-0 z-50 w-full"
        animate={{
          boxShadow: scrolled
            ? '0 1px 3px rgba(0,0,0,0.4), 0 0 24px rgba(220,20,60,0.05)'
            : '0 0 0 rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.2 }}
        style={{
          background: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(12px) saturate(160%)',
          WebkitBackdropFilter: 'blur(12px) saturate(160%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="container mx-auto flex h-16 items-center gap-4 px-4 lg:gap-6">
          {/* Back-to-main escape */}
          <Link
            href="/"
            className="hidden items-center gap-1 text-xs font-medium uppercase tracking-wider text-white/60 transition-colors hover:text-white sm:flex"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden md:inline">Back to Yeti Welding</span>
            <span className="md:hidden">Back</span>
          </Link>

          <div className="hidden h-6 w-px bg-white/15 sm:block" />

          {/* Wordmark */}
          <Link
            href="/shop"
            className="flex shrink-0 items-center gap-2 group"
            aria-label="Yeti Steel Goods home"
          >
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors group-hover:text-accent-red">
              Yeti
            </span>
            <span className="text-sm font-medium uppercase tracking-[0.18em] text-white/70 transition-colors group-hover:text-white">
              Steel Goods
            </span>
          </Link>

          {/* Desktop nav items */}
          <nav
            className="ml-4 hidden flex-1 items-center gap-5 lg:flex xl:gap-7"
            onMouseLeave={handleLeave}
          >
            {shopNavItems.map((item) => {
              const isOpen = openMenu === item.label;
              const isActive = isActiveCategory(item.href);
              const hasMenu = !!item.megaMenu;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasMenu && handleEnter(item.label)}
                >
                  <Link
                    href={item.href}
                    aria-haspopup={hasMenu ? 'menu' : undefined}
                    aria-expanded={hasMenu ? isOpen : undefined}
                    className={`group flex items-center gap-1 py-2 text-sm font-medium tracking-wide transition-colors ${
                      isActive || isOpen
                        ? 'text-white'
                        : 'text-white/85 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasMenu && (
                      <motion.svg
                        className="h-3 w-3 text-white/60"
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
                    )}
                    <span
                      className={`absolute inset-x-0 -bottom-0.5 h-[2px] origin-center bg-accent-red transition-transform duration-200 ${
                        isActive || isOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Utility icons */}
          <div className="ml-auto flex items-center gap-1 lg:gap-2">
            <UtilityIcon label="Search" srLabel="Search">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </UtilityIcon>
            <UtilityIcon label="Account" srLabel="Account">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 21a8 8 0 0116 0"
                />
              </svg>
            </UtilityIcon>
            <CartIcon />

            {/* Mobile hamburger */}
            <button
              type="button"
              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mega menu portal under the bar */}
        <AnimatePresence>
          {openMenu && (
            <MegaMenu
              key={openMenu}
              navItem={shopNavItems.find((n) => n.label === openMenu)!}
              onMouseEnter={() => handleEnter(openMenu)}
              onMouseLeave={handleLeave}
              onClose={() => setOpenMenu(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Page dim while a mega menu is open */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={handleLeave}
          />
        )}
      </AnimatePresence>

      <MobileShopDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

function UtilityIcon({
  children,
  label,
  srLabel,
}: {
  children: React.ReactNode;
  label: string;
  srLabel: string;
}) {
  return (
    <button
      type="button"
      title={label}
      className="hidden h-9 w-9 items-center justify-center rounded text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
    >
      <span className="sr-only">{srLabel}</span>
      {children}
    </button>
  );
}

function CartIcon() {
  // Visual-only cart per spec. Badge is a static placeholder.
  const itemCount = 0;
  return (
    <button
      type="button"
      title="Cart"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded text-white/80 transition-colors hover:bg-white/10 hover:text-white"
    >
      <span className="sr-only">Cart ({itemCount})</span>
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-red px-1 text-[10px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </button>
  );
}
