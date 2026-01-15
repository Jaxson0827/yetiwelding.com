'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FooterLink {
  label: string;
  href: string;
}

export default function Footer() {
  // Increment this version number when you update the logo to force cache refresh
  const LOGO_VERSION = '4';
  const logoPath = `/Website Logo.png?v=${LOGO_VERSION}`;
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Footer.tsx:logoPath',message:'Footer client logo path',data:{logoPath,LOGO_VERSION,isClient:true},timestamp:Date.now(),sessionId:'debug-session',runId:'hydration-debug',hypothesisId:'A'})}).catch(()=>{});
  } else {
    fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Footer.tsx:logoPath',message:'Footer server logo path',data:{logoPath,LOGO_VERSION,isClient:false},timestamp:Date.now(),sessionId:'debug-session',runId:'hydration-debug',hypothesisId:'A'})}).catch(()=>{});
  }
  // #endregion
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: '-50px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    },
  };

  // Quick Links
  const quickLinks: FooterLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  // Services
  const services: FooterLink[] = [
    { label: 'Custom Fabrication', href: '/services#custom-fabrication' },
    { label: 'Structural Welding', href: '/services#structural-welding' },
    { label: 'Ornamental Work', href: '/services#ornamental-work' },
  ];

  // Company Info
  const companyInfo: FooterLink[] = [
    { label: 'About Us', href: '/about' },
    { label: 'Our Process', href: '/#process' },
    { label: 'Certifications', href: '/#certifications' },
  ];

  // Estimator contact info - placeholder values, can be updated
  const estimatorName = 'Request an Estimate';
  const estimatorPhone = '801-995-8906'; // Using main phone as placeholder
  const estimatorEmail = 'office@yetiwelding.com'; // Using main email as placeholder

  return (
    <footer ref={footerRef} className="w-full bg-black text-white py-12 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Main Footer Content */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Column 1: Company/Logo Section */}
          <motion.div
            className="sm:col-span-2 lg:col-span-1 xl:col-span-1"
            variants={itemVariants}
          >
            <motion.div
              className="relative w-32 h-16 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              style={{ background: 'transparent' }}
            >
              {/* Using regular img tag instead of Next.js Image to support query string cache-busting */}
              <img
                src={logoPath}
                alt="Yeti Welding Logo"
                className="object-contain w-full h-full"
                loading="lazy"
                suppressHydrationWarning
                // #region agent log
                ref={(el) => {
                  if (el) {
                    fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Footer.tsx:img-ref',message:'Footer logo img rendered',data:{src:el.src,actualSrc:el.getAttribute('src'),computedSrc:logoPath,isClient:typeof window !== 'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'hydration-debug',hypothesisId:'B'})}).catch(()=>{});
                  }
                }}
                // #endregion
              />
            </motion.div>
            <p className="text-white/70 text-sm mb-4 max-w-xs">
              Professional welding services with decades of experience. Trusted craftsmanship that speaks for itself.
            </p>
            {/* Social Media */}
            <div>
              <h3 className="text-white uppercase text-sm font-semibold mb-3 tracking-wider">
                FOLLOW US
              </h3>
              <div className="flex space-x-3">
                <motion.a
                  href="https://www.instagram.com/yeti_welding/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#DC143C] rounded flex items-center justify-center text-white hover:bg-[#B01030] transition-colors"
                  aria-label="Visit our Instagram page"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="https://www.youtube.com/@yetiwelding6975"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#DC143C] rounded flex items-center justify-center text-white hover:bg-[#B01030] transition-colors"
                  aria-label="Visit our YouTube channel"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="https://www.tiktok.com/@yetiwelding?_r=1&_t=ZT-92FZiplFCPt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#DC143C] rounded flex items-center justify-center text-white hover:bg-[#B01030] transition-colors"
                  aria-label="Visit our TikTok page"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white uppercase text-sm font-semibold mb-4 tracking-wider">
              QUICK LINKS
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <motion.a
                    href={link.href}
                    className="text-white/70 hover:text-accent-red transition-colors text-sm flex items-center group"
                    whileHover={{ x: 5 }}
                  >
                    <span>{link.label}</span>
                    <svg
                      className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Services */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white uppercase text-sm font-semibold mb-4 tracking-wider">
              SERVICES
            </h3>
            <ul className="space-y-3">
              {services.map((link) => (
                <li key={link.href}>
                  <motion.a
                    href={link.href}
                    className="text-white/70 hover:text-accent-red transition-colors text-sm flex items-center group"
                    whileHover={{ x: 5 }}
                  >
                    <span>{link.label}</span>
                    <svg
                      className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Company Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white uppercase text-sm font-semibold mb-4 tracking-wider">
              COMPANY
            </h3>
            <ul className="space-y-3">
              {companyInfo.map((link) => (
                <li key={link.href}>
                  <motion.a
                    href={link.href}
                    className="text-white/70 hover:text-accent-red transition-colors text-sm flex items-center group"
                    whileHover={{ x: 5 }}
                  >
                    <span>{link.label}</span>
                    <svg
                      className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 5: Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white uppercase text-sm font-semibold mb-4 tracking-wider">
              CONTACT
            </h3>
            <div className="space-y-3 text-sm">
              <motion.a
                href="tel:8019958906"
                className="flex items-center text-white/70 hover:text-accent-red transition-colors"
                whileHover={{ x: 5 }}
              >
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>801-995-8906</span>
              </motion.a>
              <motion.a
                href="mailto:office@yetiwelding.com"
                className="flex items-center text-white/70 hover:text-accent-red transition-colors"
                whileHover={{ x: 5 }}
              >
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>office@yetiwelding.com</span>
              </motion.a>
              <motion.a
                href="https://maps.google.com/?q=1680+W+1600+S+Springville+UT+84663"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start text-white/70 hover:text-accent-red transition-colors"
                whileHover={{ x: 5 }}
              >
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>1680 W 1600 S, Springville, UT 84663</span>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Estimator Contact Section */}
        <motion.div
          className="border-t border-white/20 pt-8 mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white uppercase text-sm font-semibold mb-4 tracking-wider">
                ESTIMATOR
              </h3>
              <div className="space-y-3 text-sm">
                <motion.a
                  href={`tel:${estimatorPhone.replace(/-/g, '')}`}
                  className="flex items-center text-white/70 hover:text-accent-red transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{estimatorPhone}</span>
                </motion.a>
                <motion.a
                  href={`mailto:${estimatorEmail}`}
                  className="flex items-center text-white/70 hover:text-accent-red transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{estimatorEmail}</span>
                </motion.a>
                <motion.a
                  href="/contact"
                  className="inline-flex items-center text-accent-red hover:text-[#B01030] transition-colors text-sm font-semibold uppercase tracking-wider mt-2"
                  whileHover={{ x: 5 }}
                >
                  {estimatorName}
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-white/20 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/70"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p>©2025 Yeti Welding. Site Designed by Kite Media.</p>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <motion.a
              href="/privacy-policy"
              className="hover:text-white transition-colors"
              whileHover={{ x: 2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="/terms-of-service"
              className="hover:text-white transition-colors"
              whileHover={{ x: 2 }}
            >
              Terms of Service
            </motion.a>
            <motion.a
              href="/accessibility"
              className="hover:text-white transition-colors"
              whileHover={{ x: 2 }}
            >
              Accessibility
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
