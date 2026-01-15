'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const pathname = usePathname();

  // Increment this version number when you update the logo to force cache refresh
  const LOGO_VERSION = '4';
  const logoPath = `/Website Logo.png?v=${LOGO_VERSION}`;
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:logoPath',message:'Client logo path computed',data:{logoPath,LOGO_VERSION,isClient:true},timestamp:Date.now(),sessionId:'debug-session',runId:'hydration-debug',hypothesisId:'A'})}).catch(()=>{});
  } else {
    fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:logoPath',message:'Server logo path computed',data:{logoPath,LOGO_VERSION,isClient:false},timestamp:Date.now(),sessionId:'debug-session',runId:'hydration-debug',hypothesisId:'A'})}).catch(()=>{});
  }
  // #endregion

  const navItems = [
    { label: 'HOME', href: '/' },
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

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:useEffect',message:'Hovered nav item state changed',data:{hoveredNavItem},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'G'})}).catch(()=>{});
    // #endregion
  }, [hoveredNavItem]);

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
              // #region agent log
              ref={(el) => {
                if (el) {
                  fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:img-ref',message:'Logo img element rendered',data:{src:el.src,actualSrc:el.getAttribute('src'),computedSrc:logoPath,isClient:typeof window !== 'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'hydration-debug',hypothesisId:'B'})}).catch(()=>{});
                }
              }}
              // #endregion
            />
          </motion.div>
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navItems.map((item) => (
            <div 
              key={item.label} 
              className="relative group"
              onMouseEnter={(e) => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:104',message:'Parent group mouse enter',data:{item:item.label,hasDropdown:!!item.dropdownItems},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
                // #endregion
                // Clear any pending timeout
                const timeoutId = (e.currentTarget as any)._hoverTimeout;
                if (timeoutId) {
                  clearTimeout(timeoutId);
                  delete (e.currentTarget as any)._hoverTimeout;
                }
                if (item.dropdownItems) {
                  setHoveredNavItem(item.label);
                  // #region agent log
                  fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:104',message:'Set hovered nav item state',data:{item:item.label,state:'hovered'},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
                  // #endregion
                }
              }}
              onMouseLeave={(e) => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:104',message:'Parent group mouse leave',data:{item:item.label,relatedTarget:e.relatedTarget instanceof HTMLElement ? e.relatedTarget.tagName : null},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
                // #endregion
                if (item.dropdownItems) {
                  // Use a small delay to allow mouse to move to dropdown/bridge
                  // This prevents clearing when moving between child elements
                  const timeoutId = setTimeout(() => {
                    setHoveredNavItem(null);
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:104',message:'Clear hovered nav item state (delayed)',data:{item:item.label,state:'cleared'},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
                    // #endregion
                  }, 100);
                  // Store timeout to clear if mouse re-enters
                  (e.currentTarget as any)._hoverTimeout = timeoutId;
                }
              }}
            >
              <a
                href={item.href}
                className={`text-white/95 uppercase text-sm xl:text-base font-semibold tracking-wider transition-all relative py-2 group/link flex items-center gap-1.5 ${
                  pathname === item.href ? 'text-white' : 'hover:text-white'
                }`}
                style={{
                  textShadow: pathname === item.href ? '0 0 10px rgba(220, 20, 60, 0.5)' : 'none',
                }}
                onMouseEnter={() => {
                  // #region agent log
                  fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:105',message:'Link mouse enter',data:{item:item.label,hasDropdown:!!item.dropdownItems,currentHovered:hoveredNavItem},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
                  // #endregion
                  if (item.dropdownItems) {
                    setHoveredNavItem(item.label);
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:105',message:'Link set hover state',data:{item:item.label,willBeHovered:item.label},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
                    // #endregion
                  }
                }}
                onMouseLeave={(e) => {
                  // #region agent log
                  fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:105',message:'Link mouse leave',data:{item:item.label,relatedTarget:e.relatedTarget instanceof HTMLElement ? e.relatedTarget.tagName : null},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
                  // #endregion
                  // Don't clear state here - let parent group handle it
                  // This prevents clearing when moving to dropdown/bridge
                }}
              >
                {item.label}
                {/* Dropdown indicator chevron */}
                {item.dropdownItems && (
                  <motion.svg
                    className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
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
              </a>
              {/* Dropdown Menu */}
              {item.dropdownItems && (
                <>
                  {/* Invisible hover bridge to fill the gap */}
                  <div 
                    className="absolute top-full left-0 w-full h-2 z-40"
                    onMouseEnter={() => {
                      // #region agent log
                      fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:160',message:'Hover bridge mouse enter',data:{item:item.label},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'E'})}).catch(()=>{});
                      // #endregion
                      setHoveredNavItem(item.label);
                    }}
                  />
                  <div 
                    className={`absolute top-full left-0 transition-all duration-300 z-50 ${
                      hoveredNavItem === item.label ? 'opacity-100 visible' : 'opacity-0'
                    }`}
                    style={{
                      pointerEvents: 'auto'
                    }}
                    onMouseEnter={() => {
                      // #region agent log
                      fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:160',message:'Dropdown wrapper mouse enter',data:{item:item.label,isHovered:hoveredNavItem === item.label},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
                      // #endregion
                      setHoveredNavItem(item.label);
                    }}
                    onMouseLeave={() => {
                      // #region agent log
                      fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:160',message:'Dropdown wrapper mouse leave',data:{item:item.label},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
                      // #endregion
                      // Don't clear immediately - let parent group handle with delay
                    }}
                  >
                  <motion.div
                    className="min-w-[220px] rounded-lg overflow-hidden mt-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(40, 10, 10, 0.98) 50%, rgba(60, 15, 15, 0.98) 100%)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      border: '1px solid rgba(220, 20, 60, 0.3)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 60px rgba(220, 20, 60, 0.15)',
                    }}
                    initial={{ y: -10, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Pattern Overlay */}
                    <div
                      className="absolute inset-0 opacity-5 pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220, 20, 60, 0.8) 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                      }}
                    />
                    <div className="relative z-10 py-2">
                      {item.dropdownItems.map((dropdownItem, index) => {
                        const isActive = pathname === dropdownItem.href;
                        return (
                          <a
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className={`block px-6 py-3 text-white/95 uppercase text-sm font-semibold tracking-wider transition-all relative group/item ${
                              isActive ? 'text-white' : 'hover:text-white hover:bg-white/5'
                            }`}
                            style={{
                              textShadow: isActive ? '0 0 10px rgba(220, 20, 60, 0.5)' : 'none',
                            }}
                          >
                            {dropdownItem.label}
                            {/* Hover Glow Effect */}
                            <motion.div
                              className="absolute left-0 top-0 bottom-0 opacity-0 group-hover/item:opacity-100"
                              style={{
                                background: 'linear-gradient(to bottom, transparent 0%, rgba(220, 20, 60, 0.8) 50%, transparent 100%)',
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
                  </motion.div>
                </div>
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
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
                  </div>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

