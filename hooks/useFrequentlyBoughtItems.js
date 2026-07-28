'use client';

import { useQuery } from '@tanstack/react-query';
import { useCatalogues } from './useCatalogues';
import { getItemsByCatalogue } from '../services/item.service';

const MAX_ITEMS = 4;

/**
 * Maps API item + catalogue to FrequentlyBoughtTogether product shape.
 * @param {Object} item - API item { uuid, name, price, imageUrls, ... }
 * @param {string} catalogueId - Catalogue uuid
 * @param {string} [catalogueName] - Catalogue name for brand display
 */
function mapItemToProduct(item, catalogueId, catalogueName = '') {
  const imageUrl = item.imageUrls?.[0] || item.imageUrl || item.image || item.coverImage || item.thumbnail || null;
  return {
    id: item.uuid,
    catalogueId,
    title: item.name || 'Product',  
    description: item.validatedDescription || 'No validated description available',
    price: typeof item.price === 'number' ? String(item.price) : (item.price ?? '0'),
    brand: catalogueName || 'Catalog',
    rating: 4.5,
    badge: null,
    imageUrl,
  };
}

/**
 * Fetches up to 4 catalogue items for "Frequently Bought Together" section.
 * Uses first published catalogue; items are limited to MAX_ITEMS (4).
 */
export function useFrequentlyBoughtItems() {
  const { data: cataloguesData, isLoading: cataloguesLoading } = useCatalogues();
  const firstCatalogue = cataloguesData?.data?.[0];
  const catalogueId = firstCatalogue?.uuid ?? null;
  const catalogueName = firstCatalogue?.name ?? '';

  const itemsQuery = useQuery({
    queryKey: ['frequentlyBoughtItems', catalogueId],
    queryFn: async () => {
      const res = await getItemsByCatalogue(catalogueId, { page: 1, limit: MAX_ITEMS });
      const items = res?.data ?? [];
      return items.map((item) => mapItemToProduct(item, catalogueId, catalogueName));
    },
    enabled: !!catalogueId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const products = (itemsQuery.data ?? []).slice(0, MAX_ITEMS);
  const isLoading = cataloguesLoading || itemsQuery.isLoading;

  return {
    products,
    isLoading,
    error: itemsQuery.error,
  };
}
