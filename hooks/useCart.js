import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../services/cart.service';

export const useCart = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const refreshCart = () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    };

    window.addEventListener('cart-changed', refreshCart);
    window.addEventListener('storage', refreshCart);

    return () => {
      window.removeEventListener('cart-changed', refreshCart);
      window.removeEventListener('storage', refreshCart);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ catalogueItemId, quantity, ...details }) =>
      addToCart(catalogueItemId, quantity, details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ catalogueItemId, quantity }) => updateCartItem(catalogueItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (catalogueItemId) => removeCartItem(catalogueItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
