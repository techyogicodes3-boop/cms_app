'use client';

import { useQuery } from '@tanstack/react-query';
import { getItemsByCatalogue } from '../services/item.service';

/**
 * React Query hook to fetch items by catalogue ID
 * @param {string} catalogueId - Catalogue ID
 * @param {Object} options - Query options
 * @returns {Object} Query result with data, isLoading, error, etc.
 */
export const useCatalogueItems = (catalogueId, filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['catalogue-items', catalogueId, filters],
    queryFn: () => getItemsByCatalogue(catalogueId, filters),
    enabled: !!catalogueId, // Only run if catalogueId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime in v4)
    retry: 2,
    retryDelay: 1000,
    ...options,
  });
};
