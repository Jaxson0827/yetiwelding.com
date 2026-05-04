'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  totalPrice: number;
  productName: string;
}

export default function AddToCartButton({ totalPrice, productName }: Props) {
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 2200);
  };

  return (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded bg-accent-red px-6 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-colors hover:bg-accent-red-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <span>Add to Cart</span>
        <span className="text-white/85">— ${totalPrice.toFixed(2)}</span>
      </button>
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded border border-white/15 bg-gray-warm-100 px-4 py-2 text-xs text-white shadow-xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="polite"
          >
            Added <span className="font-semibold">{productName}</span> · visual demo
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
