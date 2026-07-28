'use client';

import { useQuery } from '@tanstack/react-query';
import { getItemDetails } from '../services/item.service';

/**
 * React Query hook to fetch single item details
 * @param {string} catalogueId - Catalogue ID
 * @param {string} itemId - Item ID (uuid)
 * @param {Object} options - Query options
 * @returns {Object} Query result with data, isLoading, error, etc.
 */
export const useItemDetails = (catalogueId, itemId, options = {}) => {
  return useQuery({
    queryKey: ['item-details', catalogueId, itemId],
    queryFn: () => getItemDetails(catalogueId, itemId),
    enabled: !!catalogueId && !!itemId, // Only run if both IDs are provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime in v4)
    retry: 2,
    retryDelay: 1000,
    ...options,
  });
};
