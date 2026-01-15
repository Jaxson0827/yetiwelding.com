'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import SavedItemCard from '@/components/cart/SavedItemCard';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, getTotalPrice, addItem } = useCart();
  const { savedItems, removeSavedItem } = useSavedItems();
  const router = useRouter();
  const subtotal = getTotalPrice();

  const handleSaveForLater = (item: any) => {
    // Remove from cart when saving for later
    removeItem(item.id);
  };

  const handleMoveToCart = (item: any) => {
    // Add to cart and remove from saved items
    addItem(item);
    removeSavedItem(item.id);
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      router.push('/checkout');
    }
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 uppercase tracking-tight">
              Shopping Cart
            </h1>

            {items.length === 0 ? (
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
                <p className="text-white/60 mb-8">Start adding items to your cart to continue.</p>
                <Link
                  href="/order"
                  className="inline-block bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                      onQuantityChange={updateItemQuantity}
                      onSaveForLater={handleSaveForLater}
                    />
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <CartSummary
                    subtotal={subtotal}
                    onCheckout={handleCheckout}
                  />
                </div>
              </div>
            )}

            {/* Saved Items Section */}
            {savedItems.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 uppercase tracking-tight">
                  Saved for Later ({savedItems.length})
                </h2>
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
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

