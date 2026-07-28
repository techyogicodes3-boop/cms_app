'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllCatalogues } from '../services/catalogue.service';

/**
 * React Query hook to fetch all published catalogues
 * @returns {Object} Query result with data, isLoading, error, etc.
 */
export const useCatalogues = () => {
  return useQuery({
    queryKey: ['catalogues'],
    queryFn: getAllCatalogues,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime in v4)
    retry: 2,
    retryDelay: 1000,
  });
};
