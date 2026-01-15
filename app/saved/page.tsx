'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import { useCart } from '@/contexts/CartContext';
import SavedItemCard from '@/components/cart/SavedItemCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SavedItemsPage() {
  const { savedItems, removeSavedItem } = useSavedItems();
  const { addItem } = useCart();

  const handleMoveToCart = (item: any) => {
    // Add to cart and remove from saved items
    addItem(item);
    removeSavedItem(item.id);
  };

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
                Saved for Later
              </h1>
              <Link
                href="/cart"
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                View Cart →
              </Link>
            </div>

            {savedItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="mb-6">
                  <svg
                    className="w-24 h-24 mx-auto text-white/20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">No saved items</h2>
                <p className="text-white/60 mb-8">Items you save for later will appear here.</p>
                <Link
                  href="/order"
                  className="inline-block bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {savedItems.map((item) => (
                  <SavedItemCard
                    key={item.id}
                    item={item}
                    onMoveToCart={() => handleMoveToCart(item)}
                    onRemove={() => removeSavedItem(item.id)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}





