'use client';

import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { QUOTE_ONLY_MODE } from '@/lib/quoteOnlyMode';

interface HeaderProps {
  showCart?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  dropdownItems?: Array<{
    label: string;
    href: string;
  }>;
}

const navItems: NavItem[] = [
  { label: 'HOME', href: '/' },
  {
    label: 'ORDER',
    href: '#',
    dropdownItems: [
      { label: 'Dumpster Gates', href: '/order/dumpster-gates' },
      { label: 'Steel Plate Embeds', href: '/order/steel-embeds' },
      { label: 'Pergolas', href: '/order/pergolas' },
      { label: 'Garden Boxes', href: '/order/garden-boxes' },
    ],
  },
  { label: 'SERVICES', href: '/services' },
  { label: 'PROJECTS', href: '/projects' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
];

function HeaderShell({ itemCount, showCart }: { itemCount: number; showCart: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileOrderDropdownOpen, setIsMobileOrderDropdownOpen] = useState(false);
  const [isDesktopOrderDropdownOpen, setIsDesktopOrderDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const desktopOrderDropdownRef = useRef<HTMLDivElement>(null);
  const logoPath = '/Website Logo.png';

  const isOrderSectionActive = useMemo(
    () => pathname.startsWith('/order'),
    [pathname]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsDesktopOrderDropdownOpen(false);
    setIsMenuOpen(false);
    setIsMobileOrderDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isDesktopOrderDropdownOpen) return;

    function handleMouseDown(event: MouseEvent) {
      const element = desktopOrderDropdownRef.current;
      if (element && !element.contains(event.target as Node)) {
        setIsDesktopOrderDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDesktopOrderDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDesktopOrderDropdownOpen]);

  const headerHeightClass = isScrolled ? 'h-20' : 'h-[100px]';
  const logoSizeClass = isScrolled ? 'h-24 w-[240px]' : 'h-32 w-[288px]';
  const headerStyle = {
    background: isScrolled
      ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(40, 10, 10, 0.95) 50%, rgba(80, 20, 20, 0.95) 100%)'
      : 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(30, 8, 8, 0.98) 40%, rgba(60, 15, 15, 0.98) 70%, rgba(100, 25, 25, 0.98) 100%)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderBottom: isScrolled
      ? '1px solid rgba(220, 20, 60, 0.2)'
      : '1px solid rgba(220, 20, 60, 0.3)',
    boxShadow: isScrolled
      ? '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(220, 20, 60, 0.1)'
      : '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 60px rgba(220, 20, 60, 0.15)',
  } satisfies CSSProperties;

  return (
    <header
      className={`fixed top-0 z-50 w-full overflow-visible text-white transition-[height] duration-300 ${headerHeightClass}`}
      style={headerStyle}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220, 20, 60, 0.8) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />

      <div className="container relative z-10 mx-auto flex h-full items-center justify-between px-4 py-1.5">
        <Link href="/" className="group relative flex items-center">
          <div
            className={`relative -mb-8 drop-shadow-lg transition-[width,height,transform] duration-300 group-hover:scale-[1.02] ${logoSizeClass}`}
          >
            <Image
              src={logoPath}
              alt="Yeti Welding Logo"
              fill
              className="object-contain"
              style={{ top: '-12px', left: '1px' }}
              sizes="(max-width: 1024px) 192px, 288px"
              quality={60}
            />
          </div>
        </Link>

        <nav className="hidden items-center space-x-6 lg:flex xl:space-x-8">
          {navItems.map((item) => {
            const isDropdown = Boolean(item.dropdownItems);
            const isActive = isDropdown ? isOrderSectionActive : pathname === item.href;

            return (
              <div
                key={item.label}
                className="group relative"
                ref={isDropdown ? desktopOrderDropdownRef : undefined}
              >
                {isDropdown ? (
                  <button
                    type="button"
                    className={`flex items-center gap-1.5 py-2 text-sm font-semibold tracking-wider text-white/95 transition-colors xl:text-base ${
                      isDesktopOrderDropdownOpen ? 'text-white' : 'hover:text-white'
                    }`}
                    style={{
                      textShadow: isDesktopOrderDropdownOpen
                        ? '0 0 10px rgba(220, 20, 60, 0.5)'
                        : 'none',
                    }}
                    aria-haspopup="menu"
                    aria-expanded={isDesktopOrderDropdownOpen}
                    onClick={() => setIsDesktopOrderDropdownOpen((open) => !open)}
                  >
                    {item.label}
                    <svg
                      className={`h-3.5 w-3.5 text-white/70 transition-transform duration-200 ${
                        isDesktopOrderDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1.5 py-2 text-sm font-semibold tracking-wider text-white/95 transition-colors xl:text-base ${
                      isActive ? 'text-white' : 'hover:text-white'
                    }`}
                    style={{
                      textShadow: isActive ? '0 0 10px rgba(220, 20, 60, 0.5)' : 'none',
                    }}
                  >
                    {item.label}
                  </Link>
                )}

                <div
                  className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                    isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                  }`}
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(220, 20, 60, 0.9) 50%, transparent 100%)',
                    boxShadow: '0 0 8px rgba(220, 20, 60, 0.6)',
                  }}
                />

                {isDropdown && (
                  <div
                    className={`absolute left-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-lg transition-all duration-200 ${
                      isDesktopOrderDropdownOpen
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-2 opacity-0'
                    }`}
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(40, 10, 10, 0.98) 50%, rgba(60, 15, 15, 0.98) 100%)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      border: '1px solid rgba(220, 20, 60, 0.3)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 60px rgba(220, 20, 60, 0.15)',
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-5"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 2px 2px, rgba(220, 20, 60, 0.8) 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                      }}
                    />
                    <div className="relative z-10 py-2" role="menu">
                      {item.dropdownItems?.map((dropdownItem) => {
                        const isDropdownActive = pathname === dropdownItem.href;

                        return (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            role="menuitem"
                            className={`group/item relative block px-6 py-3 text-sm font-semibold tracking-wider text-white/95 transition-all ${
                              isDropdownActive ? 'text-white' : 'hover:bg-white/5 hover:text-white'
                            }`}
                            style={{
                              textShadow: isDropdownActive
                                ? '0 0 10px rgba(220, 20, 60, 0.5)'
                                : 'none',
                            }}
                            onClick={() => setIsDesktopOrderDropdownOpen(false)}
                          >
                            <span
                              className={`absolute left-0 top-0 h-full transition-all duration-300 ${
                                isDropdownActive
                                  ? 'w-1 opacity-100'
                                  : 'w-0 opacity-0 group-hover/item:w-1 group-hover/item:opacity-100'
                              }`}
                              style={{
                                background:
                                  'linear-gradient(to bottom, transparent 0%, rgba(220, 20, 60, 0.8) 50%, transparent 100%)',
                                boxShadow: '0 0 8px rgba(220, 20, 60, 0.6)',
                              }}
                            />
                            {dropdownItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {showCart && !QUOTE_ONLY_MODE && (
            <Link
              href="/cart"
              className="group relative hidden items-center gap-2 rounded px-3 py-2 transition-colors hover:bg-white/5 lg:flex"
            >
              <div className="relative flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-white transition-colors group-hover:text-white/90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-white px-1 text-[10px] font-bold text-black">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-white transition-colors group-hover:text-white/90">
                Cart
              </span>
            </Link>
          )}

          <button
            type="button"
            className="p-2 text-white lg:hidden"
            onClick={() => {
              setIsMenuOpen((open) => !open);
              if (isMenuOpen) {
                setIsMobileOrderDropdownOpen(false);
              }
            }}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            aria-label="Close menu"
            onClick={() => {
              setIsMenuOpen(false);
              setIsMobileOrderDropdownOpen(false);
            }}
          />
          <nav
            className="relative z-50 lg:hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(40, 10, 10, 0.98) 50%, rgba(60, 15, 15, 0.98) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              borderTop: '1px solid rgba(220, 20, 60, 0.3)',
            }}
          >
            <div className="container mx-auto flex flex-col space-y-3 px-4 py-4">
              {navItems.map((item) => {
                const isDropdown = Boolean(item.dropdownItems);

                if (isDropdown) {
                  return (
                    <div key={item.label}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between py-2 text-left text-base font-semibold uppercase text-white transition-colors hover:text-red-200"
                        onClick={() => setIsMobileOrderDropdownOpen((open) => !open)}
                      >
                        <span>{item.label}</span>
                        <svg
                          className={`h-5 w-5 transition-transform duration-300 ${
                            isMobileOrderDropdownOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <div
                        className={`overflow-hidden pl-4 transition-all duration-300 ${
                          isMobileOrderDropdownOpen
                            ? 'max-h-64 pb-2 pt-2 opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        {item.dropdownItems?.map((dropdownItem) => {
                          const isDropdownActive = pathname === dropdownItem.href;

                          return (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className={`block py-2 text-sm font-semibold uppercase transition-colors ${
                                isDropdownActive ? 'text-white' : 'text-white/80 hover:text-red-200'
                              }`}
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsMobileOrderDropdownOpen(false);
                              }}
                            >
                              {dropdownItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-2 text-base font-semibold uppercase text-white transition-colors hover:text-red-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {showCart && !QUOTE_ONLY_MODE && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <Link
                    href="/cart"
                    className="flex items-center justify-between py-2 text-base font-semibold uppercase text-white transition-colors hover:text-red-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Cart</span>
                    {itemCount > 0 && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

function CartAwareHeader() {
  const { getItemCount } = useCart();
  return <HeaderShell itemCount={getItemCount()} showCart />;
}

export default function Header({ showCart = false }: HeaderProps) {
  if (showCart && !QUOTE_ONLY_MODE) {
    return <CartAwareHeader />;
  }

  return <HeaderShell itemCount={0} showCart={false} />;
}

