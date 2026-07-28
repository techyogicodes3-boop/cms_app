'use client';

import { useQuery } from '@tanstack/react-query';
import { getCatalogueById } from '../services/catalogue.service';

/**
 * React Query hook to fetch a single catalogue by ID
 * @param {string} catalogueId - Catalogue ID
 * @param {Object} options - Query options
 * @returns {Object} Query result with data, isLoading, error, etc.
 */
export const useCatalogueById = (catalogueId, options = {}) => {
  return useQuery({
    queryKey: ['catalogue', catalogueId],
    queryFn: () => getCatalogueById(catalogueId),
    enabled: !!catalogueId, // Only run if catalogueId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
    ...options,
  });
};
