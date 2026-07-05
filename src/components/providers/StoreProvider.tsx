'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, mockProducts } from '@/lib/mock-data';

interface StoreContextType {
  products: Product[];
  wishlist: string[];
  cart: { productId: string; quantity: number }[];
  toggleWishlist: (productId: string) => void;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products] = useState<Product[]>(mockProducts);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);

  // Optional: We can load from localStorage here in the future if persistence is needed.

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (productId: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <StoreContext.Provider value={{
      products,
      wishlist,
      cart,
      toggleWishlist,
      addToCart,
      removeFromCart,
      clearCart
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
