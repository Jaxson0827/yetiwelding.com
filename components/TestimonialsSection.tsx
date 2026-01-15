'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company?: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 2,
    quote: 'Dillon runs an absolutely killer company. This guy\'s brain is next-level and handles complex projects / problems like it\'s no big deal. His crew? Well, It would be damn hard to find better suited pros. They can execute and saved my tail from the fire more times than I\'m comfortable admitting. Whatever your project, they know how to deliver.',
    author: 'Sean Flanagan',
    role: 'Customer',
    rating: 5,
  },
  {
    id: 3,
    quote: 'No one better. We have worked with Yeti for years and there isn\'t anything that they can\'t handle.',
    author: 'Devin Mergens',
    role: 'Customer',
    rating: 5,
  },
  {
    id: 4,
    quote: 'Great place to get custom fab work done!! They are super fun!',
    author: 'Therin Garrett',
    role: 'Customer',
    rating: 5,
  },
  {
    id: 5,
    quote: 'Yeti Welding kills it on every single project they complete! From the selling to the execution! Hardest working fabrication shop in the state. Would recommend you hit these guys up for all your projects.',
    author: 'Cody Shurian',
    role: 'Customer',
    rating: 5,
  },
  {
    id: 6,
    quote: 'Checked out their shop for a school trip. Super nice guys that are really passionate about their work. Their work is the best in Utah by far',
    author: 'Tristan Cecil',
    role: 'Customer',
    rating: 5,
  },
  {
    id: 7,
    quote: 'Yeti Welding is an excellent company to execute your welding and fabrication projects. 5 star would definitely recommend',
    author: 'Wyatt Smith',
    role: 'Customer',
    rating: 5,
  },
  {
    id: 8,
    quote: 'Awesome workers! I was super stoked with how things worked out! I strongly recommend yeti welding for any of your metal projects!',
    author: 'Colton Archibald',
    role: 'Customer',
    rating: 5,
  },
  {
    id: 9,
    quote: 'I am a student at shs and came thru and did a tour this place is super cool they really are trying to be the best',
    author: 'Benji Campbell',
    role: 'Customer',
    rating: 5,
  },
  {
    id: 10,
    quote: 'Wide variety of projects they can do and always make them in good time and quality',
    author: 'Cole Thurston',
    role: 'Customer',
    rating: 5,
  },
  {
    id: 11,
    quote: 'I got to take a field trip to yeti welding and it is an amazing place with really nice people',
    author: 'keaton collings',
    role: 'Customer',
    rating: 5,
  },
  {
    id: 12,
    quote: 'Great customer service, very knowledgeable and solved all my problems. Project turned out mint👌',
    author: 'Mason Garrett',
    role: 'Customer',
    rating: 5,
  },
  {
    id: 13,
    quote: 'Reliable, trustworthy best in the business!',
    author: 'Caleb Hales',
    role: 'Customer',
    rating: 5,
  },
  {
    id: 1,
    quote: 'Working with Yeti was a blast, they crushed it from helping me with initial design to fab and install. Super cool guys',
    author: 'Jaxson Robson',
    role: 'Customer',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isInView]);

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    },
  };

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-gradient-to-b from-black via-gray-900 to-black py-20 md:py-28 px-4 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-red rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="w-16 h-px bg-white/30 mr-4" />
            <span className="text-white/60 uppercase text-xs tracking-[0.2em] font-light">
              CLIENT TESTIMONIALS
            </span>
            <div className="w-16 h-px bg-white/30 ml-4" />
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            WHAT OUR CLIENTS SAY
          </motion.h2>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-lg p-8 md:p-12"
            >
              <div className="text-center">
                {/* Star Rating */}
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                    <motion.svg
                      key={i}
                      className="w-6 h-6 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>

                {/* Quote */}
                <motion.blockquote
                  className="text-white text-xl md:text-2xl leading-relaxed mb-8 italic"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  "{testimonials[currentIndex].quote}"
                </motion.blockquote>

                {/* Author */}
                <div className="border-t border-white/20 pt-6 flex items-center justify-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-accent-red/20 border-2 border-accent-red/50 flex items-center justify-center flex-shrink-0">
                    {testimonials[currentIndex].avatar ? (
                      <img 
                        src={testimonials[currentIndex].avatar} 
                        alt={testimonials[currentIndex].author}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-accent-red font-bold text-lg">
                        {testimonials[currentIndex].author.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  {/* Author Info */}
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg mb-1">
                      {testimonials[currentIndex].author}
                    </p>
                    <p className="text-white/70 text-sm">
                      {testimonials[currentIndex].role}
                      {testimonials[currentIndex].company && ` • ${testimonials[currentIndex].company}`}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-accent-red w-8'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

