'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function MapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const address = '1680 W 1600 S, Springville, UT 84663';
  const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  const embedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3049.8810056095285!2d-111.64330422350295!3d40.14493427213621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x874dbd9f3fcd7b73%3A0xf71fc42215dc7841!2sYeti%20Welding!5e0!3m2!1sen!2sus!4v1766509104684!5m2!1sen!2sus';

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
            Visit Our Workshop
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Stop by our facility to see our work in action or discuss your project in person.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Container */}
            <motion.div
              className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                border: '1px solid rgba(220, 20, 60, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(220, 20, 60, 0.1)',
              }}
            >
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Yeti Welding Location"
              />
            </motion.div>

            {/* Address Information */}
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                className="p-8 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(40, 10, 10, 0.6) 50%, rgba(60, 15, 15, 0.6) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(220, 20, 60, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(220, 20, 60, 0.1)',
                }}
              >
                <h3 className="text-2xl font-bold mb-6 text-white uppercase tracking-tight">
                  Yeti Welding
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 mr-3 mt-1 text-accent-red flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
                    <div>
                      <p className="text-white/90 font-medium mb-1">Address</p>
                      <p className="text-white/70">{address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 mr-3 mt-1 text-accent-red flex-shrink-0"
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
                    <div>
                      <p className="text-white/90 font-medium mb-1">Business Hours</p>
                      <div className="text-white/70 space-y-1 text-sm">
                        <p>Monday - Friday: 7:00 AM - 5:00 PM</p>
                        <p>Saturday: 8:00 AM - 12:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-accent-red text-white uppercase text-sm font-semibold tracking-wider rounded-lg hover:bg-[#B01030] transition-colors"
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Get Directions
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}








