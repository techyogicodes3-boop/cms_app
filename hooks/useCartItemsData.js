'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCatalogues } from './useCatalogues';
import { getItemsByCatalogue } from '../services/item.service';
import { removeCartItem, updateCartItem } from '../services/cart.service';
import { transformCartItemToUI } from '../utils/cartTransform';

export const useCartItemsData = (cartItems) => {
  const queryClient = useQueryClient();
  const { data: cataloguesData } = useCatalogues();

  const [transformedItems, setTransformedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const cartItemsArray = useMemo(
    () => cartItems ?? [],
    [cartItems]
  );

  const catalogues = useMemo(
    () => cataloguesData?.data ?? [],
    [cataloguesData]
  );

  useEffect(() => {
    // ✅ Guard: avoid [] → [] → [] loop
    if (cartItemsArray.length === 0) {
      setTransformedItems(prev =>
        prev.length === 0 ? prev : []
      );
      setIsLoading(false);
      return;
    }

    if (catalogues.length === 0) return;

    let cancelled = false;

    const fetchAndTransformItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const cachedMapping =
          typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('cartItemCatalogueMap') || '{}')
            : {};

        const catalogueGroups = {};
        const itemsWithoutMapping = [];

        for (const cartItem of cartItemsArray) {
          const catalogueId = cachedMapping[cartItem.catalogueItemId];
          if (catalogueId) {
            (catalogueGroups[catalogueId] ||= []).push(cartItem);
          } else {
            itemsWithoutMapping.push(cartItem);
          }
        }

        const fetchPromises = Object.keys(catalogueGroups).map(async (catalogueId) => {
          let cached = queryClient.getQueryData(['catalogue-items', catalogueId]);
          if (!cached?.data) {
            const res = await getItemsByCatalogue(catalogueId);
            if (res.success) {
              queryClient.setQueryData(['catalogue-items', catalogueId], res);
              cached = res;
            }
          }
          return { catalogueId, data: cached?.data || [] };
        });

        if (itemsWithoutMapping.length > 0) {
          for (const catalogue of catalogues) {
            fetchPromises.push(
              (async () => {
                let cached = queryClient.getQueryData(['catalogue-items', catalogue.uuid]);
                if (!cached?.data) {
                  const res = await getItemsByCatalogue(catalogue.uuid);
                  if (res.success) {
                    queryClient.setQueryData(['catalogue-items', catalogue.uuid], res);
                    cached = res;
                  }
                }
                return { catalogueId: catalogue.uuid, data: cached?.data || [] };
              })()
            );
          }
        }

        const results = await Promise.all(fetchPromises);
        if (cancelled) return;

        const itemDetailsMap = {};
        results.forEach(({ catalogueId, data }) => {
          data.forEach(item => {
            itemDetailsMap[item.uuid] = item;

            if (typeof window !== 'undefined') {
              const mapping = JSON.parse(localStorage.getItem('cartItemCatalogueMap') || '{}');
              if (!mapping[item.uuid]) {
                mapping[item.uuid] = catalogueId;
                localStorage.setItem('cartItemCatalogueMap', JSON.stringify(mapping));
              }
            }
          });
        });

        const transformedResults = await Promise.all(cartItemsArray.map(async (cartItem, index) => {
          const itemDetails = itemDetailsMap[cartItem.catalogueItemId];
          const stock = Number(itemDetails?.stock);
          const hasStockLimit = Number.isFinite(stock);
          const isUnavailable =
            !itemDetails ||
            itemDetails.isActive === false ||
            (hasStockLimit && stock <= 0);

          if (isUnavailable) {
            await removeCartItem(cartItem.catalogueItemId);
            return null;
          }

          let nextCartItem = cartItem;
          if (hasStockLimit && Number(cartItem.quantity || 1) > stock) {
            await updateCartItem(cartItem.catalogueItemId, stock);
            nextCartItem = { ...cartItem, quantity: stock };
          }

          return transformCartItemToUI(
            nextCartItem,
            itemDetails,
            cartItem._id || cartItem.id || `item-${index}`
          );
        }));

        const transformed = transformedResults.filter(Boolean);

        setTransformedItems(transformed);
        setIsLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err);
        setIsLoading(false);
      }
    };

    fetchAndTransformItems();

    return () => {
      cancelled = true;
    };
  }, [cartItemsArray, catalogues, queryClient]);

  return {
    items: transformedItems,
    isLoading,
    error
  };
};
