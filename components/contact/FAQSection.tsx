'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // General Questions
  {
    question: 'What areas do you serve?',
    answer: 'We primarily serve the Utah area, including Salt Lake City, Provo, Springville, and surrounding communities. We also take on projects throughout the Intermountain West region. Contact us to discuss your location and project needs.',
    category: 'General',
  },
  {
    question: 'How long has Yeti Welding been in business?',
    answer: 'Yeti Welding has been serving customers with exceptional welding and fabrication services for decades. Our experience and commitment to quality craftsmanship have made us a trusted name in the industry.',
    category: 'General',
  },
  
  // Pricing & Quotes
  {
    question: 'How do I get a quote?',
    answer: 'You can request a quote through our contact form, by phone, or by email. For accurate pricing, please provide details about your project including dimensions, materials, and any specific requirements. We typically provide quotes within 24-48 hours.',
    category: 'Pricing & Quotes',
  },
  {
    question: 'What factors affect pricing?',
    answer: 'Pricing depends on several factors including project complexity, materials required, quantity, finish options, and timeline. Custom fabrication projects are priced individually based on your specific needs. We provide transparent, detailed quotes with no hidden fees.',
    category: 'Pricing & Quotes',
  },
  {
    question: 'Do you offer payment plans?',
    answer: 'Payment terms vary by project size and scope. For larger projects, we can discuss payment schedules. Typically, we require a deposit to begin work, with the balance due upon completion. Contact us to discuss payment options for your specific project.',
    category: 'Pricing & Quotes',
  },
  
  // Services
  {
    question: 'What types of welding do you specialize in?',
    answer: 'We specialize in structural welding, custom fabrication, and ornamental work. Our team is experienced with MIG, TIG, and stick welding techniques, working with various metals including steel, aluminum, and stainless steel.',
    category: 'Services',
  },
  {
    question: 'Can you work from my designs or drawings?',
    answer: 'Absolutely! We can work from your existing designs, drawings, or specifications. If you need design assistance, we can also help develop your concept from initial ideas to finished product. Bring us your vision and we\'ll make it a reality.',
    category: 'Services',
  },
  {
    question: 'Do you provide installation services?',
    answer: 'Yes, we offer installation services for many of our projects. Installation availability depends on the project type and location. We can discuss installation options when you request a quote for your project.',
    category: 'Services',
  },
  
  // Project Timeline
  {
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary based on complexity, size, and current workload. Custom fabrication projects typically take 2-6 weeks. We\'ll provide an estimated timeline when you request a quote.',
    category: 'Project Timeline',
  },
  {
    question: 'Can you accommodate rush orders?',
    answer: 'We understand that sometimes projects have tight deadlines. We do our best to accommodate rush orders when possible, though rush fees may apply. Contact us as soon as possible to discuss your timeline and we\'ll work with you to find a solution.',
    category: 'Project Timeline',
  },
  {
    question: 'Will I receive updates during the project?',
    answer: 'Yes, we believe in keeping our customers informed. We\'ll provide updates at key milestones and are always available to answer questions about your project\'s progress. Communication is important to us.',
    category: 'Project Timeline',
  },
  
  // Materials & Specifications
  {
    question: 'What materials do you work with?',
    answer: 'We work with a wide range of materials including various grades of steel, stainless steel, aluminum, and other metals. We can help you select the best material for your project based on your needs, budget, and application requirements.',
    category: 'Materials & Specifications',
  },
  {
    question: 'Do you offer different finish options?',
    answer: 'Yes, we offer various finish options including powder coating, paint, and natural finishes. We can match existing finishes or help you choose the best option for your project. Discuss your finish preferences when requesting a quote.',
    category: 'Materials & Specifications',
  },
  {
    question: 'Can you match existing metalwork?',
    answer: 'We can often match existing metalwork in terms of style, finish, and specifications. For the best results, provide photos or samples of what you\'d like to match, and we\'ll work to create a cohesive look.',
    category: 'Materials & Specifications',
  },
];

const categories = ['All', 'General', 'Pricing & Quotes', 'Services', 'Project Timeline', 'Materials & Specifications'];

export default function FAQSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
        duration: 0.5,
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
            Frequently Asked Questions
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Find answers to common questions about our services, pricing, and process.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50 transition-all duration-300 backdrop-blur-sm"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300
                ${selectedCategory === category
                  ? 'bg-accent-red text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/20'
                }
              `}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          className="max-w-4xl mx-auto space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <AnimatePresence mode="wait">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={`${faq.question}-${index}`}
                  variants={itemVariants}
                  layout
                >
                  <div
                    className={`
                      rounded-lg overflow-hidden transition-all duration-300
                      ${openIndex === index
                        ? 'bg-white/10 border-accent-red/50'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                      }
                      border
                    `}
                    style={{
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    }}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-accent-red/50 rounded-lg"
                      aria-expanded={openIndex === index}
                    >
                      <h3 className="text-white font-semibold text-lg pr-4">
                        {faq.question}
                      </h3>
                      <motion.svg
                        className="w-5 h-5 text-accent-red flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </button>

                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-0">
                            <p className="text-white/80 leading-relaxed">
                              {faq.answer}
                            </p>
                            <div className="mt-3">
                              <span className="text-xs text-white/40 uppercase tracking-wider">
                                {faq.category}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-white/60"
              >
                <p>No FAQs found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 text-accent-red hover:text-[#B01030] transition-colors"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}











