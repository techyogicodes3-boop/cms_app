import api from '../utils/axios';
import { getAuthenticatedApiUrl } from '../constants/api';

/**
 * Get items by catalogue ID
 * @param {string} catalogueId
 * @param {{ page?: number, limit?: number }} [params] - Optional pagination
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getItemsByCatalogue = async (catalogueId, params = {}) => {
  try {
    if (!catalogueId) {
      throw new Error('Catalogue ID is required');
    }

    const url = getAuthenticatedApiUrl(`/catalogues/${catalogueId}/items`);
    const response = await api.get(url, { params });

    if (!response.data || !response.data.success) {
      throw new Error('Failed to fetch items');
    }

    return {
      success: true,
      data: response.data.data || [],
      totalItems: response.data.totalItems ?? (response.data.data || []).length,
      totalPages: response.data.totalPages,
      page: response.data.page,
      priceRange: response.data.priceRange,
    };
  } catch (error) {
    // Error fetching items
    if (error.response) {
      if (error.response.status === 404) {
        return {
          success: true,
          data: [],
          totalItems: 0,
          totalPages: 0,
          page: 1,
        };
      }
      throw new Error(
        error.response.data?.message || `Failed to fetch items: ${error.response.status}`
      );
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};

/**
 * Get single item by catalogue ID and item ID
 * @param {string} catalogueId - Catalogue ID
 * @param {string} itemId - Item ID (uuid)
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getItemDetails = async (catalogueId, itemId) => {
  try {
    const response = await api.get(
      getAuthenticatedApiUrl(`/catalogues/${catalogueId}/items/${itemId}`)
    );

    if (!response.data || !response.data.success) {
      throw new Error('Failed to fetch item details');
    }

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    // Error fetching item details

    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('Item not found');
      }
      throw new Error(
        error.response.data?.message || `Failed to fetch item: ${error.response.status}`
      );
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};
