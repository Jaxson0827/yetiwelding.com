'use client';

import { CartProvider } from '@/contexts/CartContext';
import { SavedItemsProvider } from '@/contexts/SavedItemsContext';

export default function CartProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <SavedItemsProvider>
        {children}
      </SavedItemsProvider>
    </CartProvider>
  );
}











