'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaqSection } from '@/lib/shop/faq';

export default function FaqAccordion({ section }: { section: FaqSection }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="border-t border-white/10 pt-10">
      <header className="text-center">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          {section.title}
        </h2>
        <p className="mt-2 text-sm text-white/55 md:text-base">
          {section.subtitle}
        </p>
      </header>

      <ul className="mt-8 mx-auto max-w-3xl">
        {section.questions.map((item, i) => {
          const open = openIndex === i;
          return (
            <li key={i} className="border-t border-white/10 first:border-t-0">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-center gap-4 py-4 text-left"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-red/15 text-accent-red">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="flex-1 text-sm font-medium text-white md:text-base">
                  {item.q}
                </span>
                <motion.svg
                  className="h-4 w-4 text-white/55"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 pl-10 pr-2 text-sm leading-relaxed text-white/70">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
