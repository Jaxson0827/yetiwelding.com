'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { services } from '@/lib/homepageData';

export default function ServicesPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ServicesPreview.tsx:component-init',message:'ServicesPreview client render',data:{isClient:true,isInView},timestamp:Date.now(),sessionId:'debug-session',runId:'hydration-debug',hypothesisId:'D'})}).catch(()=>{});
  } else {
    fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ServicesPreview.tsx:component-init',message:'ServicesPreview server render',data:{isClient:false},timestamp:Date.now(),sessionId:'debug-session',runId:'hydration-debug',hypothesisId:'D'})}).catch(()=>{});
  }
  useEffect(() => {
    const links = document.querySelectorAll('a[href*="/services#"]');
    links.forEach((link, idx) => {
      fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ServicesPreview.tsx:useEffect',message:'Service links after mount',data:{index:idx,href:link.getAttribute('href'),className:link.className,actualClassName:link.getAttribute('class')},timestamp:Date.now(),sessionId:'debug-session',runId:'hydration-debug',hypothesisId:'E'})}).catch(()=>{});
    });
  }, []);
  // #endregion

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    },
  };

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-black py-24 md:py-32 px-4 relative overflow-hidden"
    >
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-red rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-red rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent-red rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* Enhanced Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex items-center justify-center mb-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/40 to-white/40 mr-4" />
            <span className="text-white/70 uppercase text-xs tracking-[0.3em] font-light">
              WHAT WE OFFER
            </span>
            <div className="w-20 h-px bg-gradient-to-l from-transparent via-white/40 to-white/40 ml-4" />
          </motion.div>
          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase mb-8 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            OUR SERVICES
          </motion.h2>
          <motion.p
            className="text-white/80 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Professional welding and fabrication services delivered with precision and craftsmanship
          </motion.p>
        </motion.div>

        {/* Enhanced Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 lg:gap-14 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {services.map((service) => {
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -12, scale: 1.03 }}
                className="group relative"
              >
                <Link
                  href={service.href}
                  className="block h-full cursor-pointer"
                  scroll={false}
                  // #region agent log
                  ref={(el) => {
                    if (el) {
                      const actualEl = el as HTMLElement;
                      fetch('http://127.0.0.1:7242/ingest/cd5489ff-eedc-4e2e-941b-60915ad9b8e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ServicesPreview.tsx:link-ref',message:'Service link element rendered',data:{href:service.href,className:actualEl?.className,actualClassName:actualEl?.getAttribute('class'),isClient:typeof window !== 'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'hydration-debug',hypothesisId:'C'})}).catch(()=>{});
                    }
                  }}
                  // #endregion
                  onClick={(e) => {
                    // Use full page navigation to preserve hash
                    e.preventDefault();
                    if (typeof window !== 'undefined') {
                      window.location.href = service.href;
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="relative h-full min-h-[380px] rounded-xl overflow-hidden cursor-pointer">
                    {/* Enhanced Background Image */}
                    {service.image && (
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Enhanced gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-black/85 group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70 transition-all duration-500" />
                        {/* Accent overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-red/0 via-accent-red/0 to-accent-red/0 group-hover:from-accent-red/15 group-hover:via-accent-red/8 group-hover:to-accent-red/20 transition-all duration-500" />
                      </div>
                    )}
                    
                    {/* Glassmorphism border */}
                    <div className="absolute inset-0 z-10 rounded-xl border border-white/10 group-hover:border-accent-red/50 transition-all duration-500" />
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-10">
                      {/* Top Section */}
                      <div>
                        {/* Service Name */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white uppercase mb-5 tracking-wide leading-tight text-shadow-medium">
                          {service.name}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-white/85 text-base leading-relaxed">
                          {service.shortDescription}
                        </p>
                      </div>
                      
                      {/* Bottom Section - Learn More */}
                      <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10 group-hover:border-accent-red/40 transition-colors duration-300">
                        <span className="text-accent-red text-sm uppercase tracking-wider font-semibold group-hover:text-white transition-colors duration-300">
                          Learn More
                        </span>
                        <motion.svg
                          className="w-6 h-6 text-accent-red group-hover:text-white transition-colors duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </motion.svg>
                      </div>
                    </div>
                    
                    {/* Enhanced Hover Glow Effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500 pointer-events-none z-5"
                      style={{
                        boxShadow: 'inset 0 0 80px rgba(220, 20, 60, 0.25), 0 0 50px rgba(220, 20, 60, 0.4)',
                      }}
                    />
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10 overflow-hidden rounded-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Link
            href="/services"
            className="group relative inline-flex items-center justify-center px-12 py-5 border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white uppercase text-sm font-semibold tracking-[0.2em] overflow-hidden rounded-lg hover:border-accent-red/50 transition-all duration-300"
          >
            <motion.span
              className="relative z-10 flex items-center gap-3"
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 0 }}
            >
              VIEW ALL SERVICES
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent-red to-[#B01030]"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
            />
            <motion.span
              className="absolute inset-0 flex items-center justify-center text-white z-10 gap-3"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              VIEW ALL SERVICES
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

