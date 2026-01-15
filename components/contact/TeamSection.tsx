'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TeamMember {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  description: string;
}

// Placeholder team data - can be updated with actual team members
const teamMembers: TeamMember[] = [
  {
    name: 'Office Team',
    role: 'General Inquiries',
    email: 'office@yetiwelding.com',
    phone: '801-995-8906',
    description: 'Our office team is here to help with general questions, quote requests, and scheduling.',
  },
  {
    name: 'Project Managers',
    role: 'Project Coordination',
    email: 'office@yetiwelding.com',
    phone: '801-995-8906',
    description: 'For questions about ongoing projects, timelines, and project-specific inquiries.',
  },
  {
    name: 'Sales Team',
    role: 'Quotes & Estimates',
    email: 'office@yetiwelding.com',
    phone: '801-995-8906',
    description: 'Ready to discuss your project needs and provide detailed quotes and estimates.',
  },
];

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    },
  };

  return (
    <section ref={sectionRef} className="w-full py-20 px-4 bg-black">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight text-glow">
            Who to Contact
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Our team is ready to help. Reach out to the right person for your needs.
          </p>
        </motion.div>

        {/* Team Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div
                className="relative h-full p-6 rounded-lg overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(40, 10, 10, 0.6) 50%, rgba(60, 15, 15, 0.6) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(220, 20, 60, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(220, 20, 60, 0.1)',
                }}
              >
                {/* Pattern Overlay */}
                <div
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220, 20, 60, 0.8) 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(220, 20, 60, 0.2) 0%, transparent 70%)',
                  }}
                />

                <div className="relative z-10">
                  {/* Role Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-accent-red/20 text-accent-red text-xs font-semibold uppercase tracking-wider rounded-full border border-accent-red/30">
                      {member.role}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl font-bold mb-3 text-white uppercase tracking-tight">
                    {member.name}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {member.description}
                  </p>

                  {/* Contact Methods */}
                  <div className="space-y-3">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center text-white/80 hover:text-accent-red transition-colors group/link"
                      >
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm group-hover/link:translate-x-1 transition-transform">
                          {member.email}
                        </span>
                      </a>
                    )}

                    {member.phone && (
                      <a
                        href={`tel:${member.phone.replace(/\D/g, '')}`}
                        className="flex items-center text-white/80 hover:text-accent-red transition-colors group/link"
                      >
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-sm group-hover/link:translate-x-1 transition-transform">
                          {member.phone}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}











