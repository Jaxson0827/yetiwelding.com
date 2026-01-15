'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CartItem } from './CartContext';

interface SavedItemsContextType {
  savedItems: CartItem[];
  saveItem: (item: CartItem) => void;
  removeSavedItem: (id: string) => void;
  moveToCart: (item: CartItem) => void;
  getSavedItemsCount: () => number;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

const SAVED_ITEMS_STORAGE_KEY = 'yeti-welding-saved-items';

// Load saved items from localStorage
function loadSavedItemsFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(SAVED_ITEMS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load saved items from localStorage:', error);
  }
  return [];
}

// Save saved items to localStorage
function saveSavedItemsToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save saved items to localStorage:', error);
  }
}

export function SavedItemsProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved items from localStorage on mount
  useEffect(() => {
    const loadedItems = loadSavedItemsFromStorage();
    setSavedItems(loadedItems);
    setIsInitialized(true);
  }, []);

  // Save saved items to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      saveSavedItemsToStorage(savedItems);
    }
  }, [savedItems, isInitialized]);

  const saveItem = useCallback((item: CartItem) => {
    setSavedItems((prev) => {
      // Check if item with same ID already exists
      const existingIndex = prev.findIndex((existingItem) => existingItem.id === item.id);
      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev];
        updated[existingIndex] = item;
        return updated;
      }
      // Add new item
      return [...prev, item];
    });
  }, []);

  const removeSavedItem = useCallback((id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const moveToCart = useCallback((item: CartItem) => {
    // This will be called from components that have access to CartContext
    // The actual move logic will be handled in the component
    return item;
  }, []);

  const getSavedItemsCount = useCallback(() => {
    return savedItems.length;
  }, [savedItems]);

  return (
    <SavedItemsContext.Provider
      value={{
        savedItems,
        saveItem,
        removeSavedItem,
        moveToCart,
        getSavedItemsCount,
      }}
    >
      {children}
    </SavedItemsContext.Provider>
  );
}

export function useSavedItems() {
  const context = useContext(SavedItemsContext);
  if (context === undefined) {
    throw new Error('useSavedItems must be used within a SavedItemsProvider');
  }
  return context;
}





