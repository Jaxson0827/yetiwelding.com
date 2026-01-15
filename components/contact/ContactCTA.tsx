'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function ContactCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Business hours: Monday-Friday 7AM-5PM, Saturday 8AM-12PM
  const getBusinessStatus = () => {
    const day = currentTime.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const currentMinutes = hour * 60 + minute;

    if (day === 0) {
      // Sunday - Closed
      return { isOpen: false, message: 'Closed - Opens Monday at 7:00 AM' };
    } else if (day === 6) {
      // Saturday - 8AM to 12PM
      if (currentMinutes >= 8 * 60 && currentMinutes < 12 * 60) {
        return { isOpen: true, message: 'Open - Closes at 12:00 PM' };
      } else if (currentMinutes < 8 * 60) {
        return { isOpen: false, message: 'Closed - Opens at 8:00 AM' };
      } else {
        return { isOpen: false, message: 'Closed - Opens Monday at 7:00 AM' };
      }
    } else {
      // Monday-Friday - 7AM to 5PM
      if (currentMinutes >= 7 * 60 && currentMinutes < 17 * 60) {
        return { isOpen: true, message: 'Open - Closes at 5:00 PM' };
      } else if (currentMinutes < 7 * 60) {
        return { isOpen: false, message: 'Closed - Opens at 7:00 AM' };
      } else {
        return { isOpen: false, message: 'Closed - Opens Tomorrow at 7:00 AM' };
      }
    }
  };

  const businessStatus = getBusinessStatus();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  return (
    <section ref={sectionRef} className="w-full py-20 px-4 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220, 20, 60, 0.8) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Red accent glow */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 20, 60, 0.3) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center"
        >
          {/* Response Time Promise */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <div
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full mb-6"
              style={{
                background: 'rgba(220, 20, 60, 0.1)',
                border: '1px solid rgba(220, 20, 60, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <svg
                className="w-6 h-6 text-accent-red"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-left">
                <p className="text-white/90 font-semibold text-sm uppercase tracking-wider">
                  Response Time Promise
                </p>
                <p className="text-white/70 text-xs">
                  We respond within 24 hours
                </p>
              </div>
            </div>
          </motion.div>

          {/* Business Hours Status */}
          <motion.div
            variants={itemVariants}
            className="mb-12"
          >
            <div
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg mb-4"
              style={{
                background: businessStatus.isOpen
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)',
                border: businessStatus.isOpen
                  ? '1px solid rgba(34, 197, 94, 0.3)'
                  : '1px solid rgba(239, 68, 68, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <motion.div
                className={`w-3 h-3 rounded-full ${businessStatus.isOpen ? 'bg-green-500' : 'bg-red-500'}`}
                animate={{
                  scale: businessStatus.isOpen ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: businessStatus.isOpen ? Infinity : 0,
                }}
              />
              <div className="text-left">
                <p className="text-white/90 font-semibold text-sm uppercase tracking-wider">
                  {businessStatus.isOpen ? 'We\'re Open' : 'We\'re Closed'}
                </p>
                <p className="text-white/70 text-xs">
                  {businessStatus.message}
                </p>
              </div>
            </div>

            {/* Business Hours Details */}
            <div className="text-white/60 text-sm space-y-1">
              <p>Monday - Friday: 7:00 AM - 5:00 PM</p>
              <p>Saturday: 8:00 AM - 12:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            variants={itemVariants}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight text-glow">
              Ready to Get Started?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Whether you have a question, need a quote, or want to discuss your next project,
              we're here to help. Reach out today and let's bring your vision to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#contact-form"
                className="px-8 py-4 bg-accent-red text-white uppercase text-sm font-semibold tracking-wider rounded-lg hover:bg-[#B01030] transition-colors inline-flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Us a Message
                <svg
                  className="w-5 h-5 ml-2"
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

              <motion.a
                href="tel:8019958906"
                className="px-8 py-4 bg-white/5 border border-white/20 text-white uppercase text-sm font-semibold tracking-wider rounded-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-5 h-5 mr-2"
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
                Call Now
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}











