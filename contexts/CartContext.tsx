'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { EmbedSpec } from '@/lib/steelEmbeds/types';
import { DumpsterGateConfig } from '@/lib/dumpsterGates/types';
import { priceEmbed } from '@/lib/steelEmbeds/pricing';
import { priceGate } from '@/lib/dumpsterGates/pricing';

export interface CartItem {
  id: string;
  productType: 'steel-plate-embeds' | 'dumpster-gate';
  configuration: EmbedSpec | DumpsterGateConfig;
  price: number;
  isCustomFabrication?: boolean; // Flag for custom fabrication items
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'yeti-welding-cart';

// Load cart from localStorage
function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return [];
}

// Save cart to localStorage
function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadedItems = loadCartFromStorage();
    setItems(loadedItems);
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(items);
    }
  }, [items, isInitialized]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      // Check if item with same ID already exists (for quantity updates)
      const existingIndex = prev.findIndex((existingItem) => existingItem.id === item.id);
      if (existingIndex >= 0) {
        // Update existing item (merge quantities if same product)
        const updated = [...prev];
        updated[existingIndex] = item;
        return updated;
      }
      // Add new item
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItemQuantity = useCallback((id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item if quantity is less than 1
      removeItem(id);
      return;
    }

    setItems((prev) => {
      const itemIndex = prev.findIndex((item) => item.id === id);
      if (itemIndex === -1) return prev;

      const item = prev[itemIndex];
      const updatedItems = [...prev];

      // Update quantity in configuration
      if (item.productType === 'steel-plate-embeds') {
        const config = { ...item.configuration } as EmbedSpec;
        config.quantity = newQuantity;
        
        // Recalculate price based on new quantity
        const priceBreakdown = priceEmbed(config);
        const totalPrice = priceBreakdown.unitPrice * newQuantity;

        updatedItems[itemIndex] = {
          ...item,
          configuration: config,
          price: totalPrice,
        };
      } else if (item.productType === 'dumpster-gate') {
        const config = { ...item.configuration } as DumpsterGateConfig;
        config.quantity = newQuantity;
        
        // Recalculate price based on new quantity
        const priceBreakdown = priceGate(config);
        const totalPrice = priceBreakdown.totalPrice;

        updatedItems[itemIndex] = {
          ...item,
          configuration: config,
          price: totalPrice,
        };
      }

      return updatedItems;
    });
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => {
      const itemPrice = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
      return total + itemPrice;
    }, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.length;
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        getTotalPrice,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}






