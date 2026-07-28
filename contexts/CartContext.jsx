'use client';

import { createContext, useContext, useMemo } from 'react';
import { useCart } from '../hooks/useCart';

const CartContext = createContext(null);

/**
 * Cart Provider - Provides frontend cart data and helper values.
 */
export function CartProvider({ children }) {
  const { data: cartData, isLoading, error, refetch } = useCart();

  // Memoize cart object to prevent unnecessary re-renders
  const cart = useMemo(() => {
    return cartData?.data || { items: [], totalAmount: 0 };
  }, [cartData?.data]);

  // Memoize itemCount calculation
  const itemCount = useMemo(() => {
    if (!cart?.items || !Array.isArray(cart.items)) return 0;
    return cart.items.reduce((sum, item) => {
      const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 0;
      return sum + quantity;
    }, 0);
  }, [cart]);

  // Memoize context value
  const value = useMemo(() => {
    return {
      cart,
      isLoading,
      error,
      refetch,
      itemCount,
    };
  }, [cart, isLoading, error, refetch, itemCount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to use cart context.
 * @returns {Object} Cart context value
 */
export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    // Return default values if context not available
    return {
      cart: { items: [], totalAmount: 0 },
      isLoading: false,
      error: null,
      refetch: () => {},
      itemCount: 0,
    };
  }
  return context;
}
