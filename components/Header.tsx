'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileOrderDropdownOpen, setIsMobileOrderDropdownOpen] = useState(false);
  const [isDesktopOrderDropdownOpen, setIsDesktopOrderDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const desktopOrderDropdownRef = useRef<HTMLDivElement>(null);

  // Increment this version number when you update the logo to force cache refresh
  const LOGO_VERSION = '4';
  const logoPath = `/Website Logo.png?v=${LOGO_VERSION}`;

  const navItems = [
    { label: 'HOME', href: '/' },
    { 
      label: 'ORDER', 
      href: '#',
      dropdownItems: [
        { label: 'Dumpster Gates', href: '/order/dumpster-gates' },
        { label: 'Steel Plate Embeds', href: '/order/steel-embeds' },
      ]
    },
    { label: 'SERVICES', href: '/services' },
    { label: 'PROJECTS', href: '/projects' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close desktop dropdown on route change.
  useEffect(() => {
    setIsDesktopOrderDropdownOpen(false);
  }, [pathname]);

  // Close desktop dropdown on outside click / Escape.
  useEffect(() => {
    if (!isDesktopOrderDropdownOpen) return;

    function handleMouseDown(e: MouseEvent) {
      const el = desktopOrderDropdownRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        setIsDesktopOrderDropdownOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
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

  return (
    <motion.header
      className="text-white w-full z-50 fixed top-0 overflow-visible"
      initial={{ y: 0 }}
      animate={{
        height: isScrolled ? '80px' : '100px',
      }}
      transition={{ duration: 0.3 }}
      style={{
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
      }}
    >
      {/* Subtle overlay pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220, 20, 60, 0.8) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
      <div className="container mx-auto px-4 py-1.5 flex items-center justify-between h-full relative z-10">
        {/* Logo */}
        <motion.a
          href="/"
          className="flex items-center relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="relative drop-shadow-lg"
            animate={{
              width: isScrolled ? '240px' : '288px',
              height: isScrolled ? '96px' : '128px',
            }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: isScrolled ? '-32px' : '-32px', background: 'transparent' }}
          >
            {/* Using regular img tag instead of Next.js Image to support query string cache-busting */}
            <img
              src={logoPath}
              alt="Yeti Welding Logo"
              className="object-contain w-full h-full"
              style={{ top: '-12px', left: '1px', position: 'relative' }}
              loading="eager"
              suppressHydrationWarning
            />
          </motion.div>
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navItems.map((item) => (
            <div 
              key={item.label} 
              className="relative"
              ref={item.dropdownItems ? desktopOrderDropdownRef : undefined}
            >
              {item.dropdownItems ? (
                <button
                  type="button"
                  className={`text-white/95 uppercase text-sm xl:text-base font-semibold tracking-wider transition-all relative py-2 group/link flex items-center gap-1.5 ${
                    isDesktopOrderDropdownOpen ? 'text-white' : 'hover:text-white'
                  }`}
                  style={{
                    textShadow: isDesktopOrderDropdownOpen ? '0 0 10px rgba(220, 20, 60, 0.5)' : 'none',
                  }}
                  aria-haspopup="menu"
                  aria-expanded={isDesktopOrderDropdownOpen}
                  onClick={() => setIsDesktopOrderDropdownOpen((v) => !v)}
                >
                  {item.label}
                  <motion.svg
                    className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: isDesktopOrderDropdownOpen ? 180 : 0 }}
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
              ) : (
                <a
                  href={item.href}
                  className={`text-white/95 uppercase text-sm xl:text-base font-semibold tracking-wider transition-all relative py-2 group/link flex items-center gap-1.5 ${
                    pathname === item.href ? 'text-white' : 'hover:text-white'
                  }`}
                  style={{
                    textShadow: pathname === item.href ? '0 0 10px rgba(220, 20, 60, 0.5)' : 'none',
                  }}
                >
                  {item.label}
                </a>
              )}
                {/* Animated Underline with Glow */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(220, 20, 60, 0.8) 50%, transparent 100%)',
                    boxShadow: '0 0 8px rgba(220, 20, 60, 0.6)',
                  }}
                  initial={{ width: 0, opacity: 0 }}
                  whileHover={{ width: '100%', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5"
                    layoutId="activeTab"
                    initial={false}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(90deg, transparent 0%, rgba(220, 20, 60, 1) 50%, transparent 100%)',
                      boxShadow: '0 0 10px rgba(220, 20, 60, 0.8)',
                    }}
                  />
                )}
              {/* Dropdown Menu (desktop click-to-open) */}
              {item.dropdownItems && (
                <AnimatePresence>
                  {isDesktopOrderDropdownOpen && (
                    <motion.div
                      className="absolute top-full left-0 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className="min-w-[220px] rounded-lg overflow-hidden mt-2"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(40, 10, 10, 0.98) 50%, rgba(60, 15, 15, 0.98) 100%)',
                          backdropFilter: 'blur(20px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                          border: '1px solid rgba(220, 20, 60, 0.3)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 60px rgba(220, 20, 60, 0.15)',
                        }}
                        role="menu"
                      >
                        {/* Pattern Overlay */}
                        <div
                          className="absolute inset-0 opacity-5 pointer-events-none"
                          style={{
                            backgroundImage:
                              'radial-gradient(circle at 2px 2px, rgba(220, 20, 60, 0.8) 1px, transparent 0)',
                            backgroundSize: '40px 40px',
                          }}
                        />
                        <div className="relative z-10 py-2">
                          {item.dropdownItems.map((dropdownItem) => {
                            const isActive = pathname === dropdownItem.href;
                            return (
                              <a
                                key={dropdownItem.href}
                                href={dropdownItem.href}
                                role="menuitem"
                                className={`block px-6 py-3 text-white/95 uppercase text-sm font-semibold tracking-wider transition-all relative group/item ${
                                  isActive ? 'text-white' : 'hover:text-white hover:bg-white/5'
                                }`}
                                style={{
                                  textShadow: isActive ? '0 0 10px rgba(220, 20, 60, 0.5)' : 'none',
                                }}
                                onClick={() => setIsDesktopOrderDropdownOpen(false)}
                              >
                                {dropdownItem.label}
                                {/* Hover Glow Effect */}
                                <motion.div
                                  className="absolute left-0 top-0 bottom-0 opacity-0 group-hover/item:opacity-100"
                                  style={{
                                    background:
                                      'linear-gradient(to bottom, transparent 0%, rgba(220, 20, 60, 0.8) 50%, transparent 100%)',
                                    boxShadow: '0 0 8px rgba(220, 20, 60, 0.6)',
                                  }}
                                  initial={{ width: 0 }}
                                  whileHover={{ width: '4px' }}
                                  transition={{ duration: 0.3 }}
                                />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* Cart Button - Amazon Style */}
        <Link
          href="/cart"
          className="relative flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded transition-colors group"
        >
          <div className="relative flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white group-hover:text-white/90 transition-colors"
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
              <motion.span
                className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.span>
            )}
          </div>
          <span className="text-white text-xs font-medium group-hover:text-white/90 transition-colors">
            Cart
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            if (isMenuOpen) {
              setIsMobileOrderDropdownOpen(false);
            }
          }}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <motion.svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
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
          </motion.svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsMenuOpen(false);
                setIsMobileOrderDropdownOpen(false);
              }}
            />
            <motion.nav
              className="lg:hidden z-50 relative"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(40, 10, 10, 0.98) 50%, rgba(60, 15, 15, 0.98) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderTop: '1px solid rgba(220, 20, 60, 0.3)',
              }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
                {navItems.map((item, index) => (
                  <div key={item.label}>
                    {item.dropdownItems ? (
                      <>
                        <motion.button
                          className="w-full text-left text-white uppercase text-base font-semibold hover:text-red-200 transition-all py-2 flex items-center justify-between"
                          onClick={() => setIsMobileOrderDropdownOpen(!isMobileOrderDropdownOpen)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span>{item.label}</span>
                          <motion.svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ rotate: isMobileOrderDropdownOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </motion.svg>
                        </motion.button>
                        <AnimatePresence>
                          {isMobileOrderDropdownOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pt-2 pb-2 space-y-2">
                                {item.dropdownItems.map((dropdownItem, subIndex) => {
                                  const isActive = pathname === dropdownItem.href;
                                  return (
                                    <motion.a
                                      key={dropdownItem.href}
                                      href={dropdownItem.href}
                                      className={`block text-white/80 uppercase text-sm font-semibold hover:text-red-200 transition-all py-2 ${
                                        isActive ? 'text-white' : ''
                                      }`}
                                      onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsMobileOrderDropdownOpen(false);
                                      }}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: (index * 0.1) + (subIndex * 0.05) + 0.1 }}
                                    >
                                      {dropdownItem.label}
                                    </motion.a>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <motion.a
                        href={item.href}
                        className="text-white uppercase text-base font-semibold hover:text-red-200 transition-all py-2 block"
                        onClick={() => setIsMenuOpen(false)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {item.label}
                      </motion.a>
                    )}
                  </div>
                ))}
                {/* Mobile Cart Link */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="pt-4 border-t border-white/10 mt-4"
                >
                  <Link
                    href="/cart"
                    className="flex items-center justify-between text-white uppercase text-base font-semibold hover:text-red-200 transition-all py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Cart</span>
                    {itemCount > 0 && (
                      <span className="bg-white text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

