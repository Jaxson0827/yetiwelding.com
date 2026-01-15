'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { missionContent, visionContent, companyStats } from '@/lib/aboutData';

export default function MissionVisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState<'mission' | 'vision'>('mission');

  return (
    <section
      id="mission-vision"
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 px-4 overflow-hidden bg-[#0B0B0B]"
      aria-labelledby="mission-vision-heading"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.04) 10px, rgba(255,255,255,0.04) 20px)',
        }}
      />
      
      {/* Content */}
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Left Column - Text Content */}
          <div className="flex flex-col">
            {/* Yellow line above headline */}
            <div className="w-16 h-1 bg-accent-red mb-4" />
            
            {/* Headline */}
            <h2
              id="mission-vision-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase mb-6 leading-tight"
            >
              A TEAM OF RELIABLE AND{' '}
              <span className="text-accent-red">EXPERIENCED EXPERTS</span>
            </h2>
            
            {/* Introductory Paragraph */}
            <p className="text-base md:text-lg text-white/70 mb-8 leading-relaxed">
              As a dedicated welding and fabrication company, we are personally invested in every step - championing your vision to deliver projects that inspire, perform, and endure. Our core values - Quality, Integrity, Craftsmanship, Experience, Innovation, and Dedication - guide everything we do.
            </p>
            
            {/* Tabs */}
            <div className="flex gap-0 mb-6">
              <button
                onClick={() => setActiveTab('mission')}
                className={`px-6 py-3 text-sm md:text-base font-semibold uppercase transition-all duration-300 ${
                  activeTab === 'mission'
                    ? 'bg-white/10 text-white border border-white/30'
                    : 'bg-transparent text-white/80 border border-white/20 hover:bg-white/5'
                }`}
                aria-pressed={activeTab === 'mission'}
                aria-label="View mission statement"
              >
                Our Mission
              </button>
              <button
                onClick={() => setActiveTab('vision')}
                className={`px-6 py-3 text-sm md:text-base font-semibold uppercase transition-all duration-300 border-l-0 ${
                  activeTab === 'vision'
                    ? 'bg-white/10 text-white border border-white/30'
                    : 'bg-transparent text-white/80 border border-white/20 hover:bg-white/5'
                }`}
                aria-pressed={activeTab === 'vision'}
                aria-label="View vision statement"
              >
                Our Vision
              </button>
            </div>
            
            {/* Mission/Vision Statement */}
            <motion.div 
              className="text-base md:text-lg text-white/70 leading-relaxed"
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'mission' ? (
                <p>{missionContent.primaryStatement}</p>
              ) : (
                <p>{visionContent.statement}</p>
              )}
            </motion.div>
          </div>

          {/* Right Column - Image with Stats Overlay */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/3] bg-gray-900 overflow-hidden">
              {/* Image - using team photo as placeholder */}
              <Image
                src="/homepage/team_photo.jpeg"
                alt="Yeti Welding team members representing decades of combined experience in metal fabrication and welding services"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Stats Overlay at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gray-800 px-6 py-4">
                <div className="flex items-end gap-3">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-none">
                    {companyStats.yearsInBusiness}
                  </span>
                  <div className="flex flex-col pb-1">
                    <span className="text-base md:text-lg font-bold text-accent-red uppercase leading-tight mb-0.5">
                      YEARS OF
                    </span>
                    <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase leading-tight">
                      EXPERIENCE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

