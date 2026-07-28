import api from '../utils/axios';
import { getAuthenticatedApiUrl } from '../constants/api';

/**
 * Get all published catalogues
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getAllCatalogues = async () => {
  console.log("hii");

  try {
    // Request only published catalogues
    console.log("hii");
    const response = await api.get(getAuthenticatedApiUrl('/catalogues'), {
      params: {
        published: 'true'
      }
    });

    if (!response.data || !response.data.success) {
      throw new Error('Failed to fetch catalogues');
    }

    // Backend already filters by published, but double-check
    // const publishedCatalogues = (response.data.data || []).filter(
    //   (catalogue) => catalogue.isPublished === true
    // );
    // console.log("publishedCatalogues:",publishedCatalogues);

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    // Error fetching catalogues

    if (error.response) {
      // Server responded with error status
      if (error.response.status === 404) {
        // Return empty array if 404 (no catalogues found)
        return {
          success: true,
          data: [],
        };
      }
      throw new Error(
        error.response.data?.message || `Failed to fetch catalogues: ${error.response.status}`
      );
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};

/**
 * Get single catalogue by ID.
 * Backend does not expose GET /catalogues/:id; we use the list API and find by uuid.
 * @param {string} catalogueId - Catalogue uuid
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getCatalogueById = async (catalogueId) => {
  if (!catalogueId) {
    throw new Error('Catalogue ID is required');
  }
  try {
    const response = await api.get(getAuthenticatedApiUrl(`/catalogues/${encodeURIComponent(catalogueId)}`));

    if (!response.data || !response.data.success) {
      throw new Error('Failed to fetch catalogue');
    }

    const catalogue = response.data.data;
    if (!catalogue) {
      throw new Error('Catalogue not found');
    }

    return {
      success: true,
      data: catalogue,
    };
  } catch (error) {
    if (error.message === 'Catalogue not found') {
      throw error;
    }
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('Catalogue not found');
      }
      throw new Error(
        error.response.data?.message || `Failed to fetch catalogue: ${error.response.status}`
      );
    }
    if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

/**
 * Get all catalogue types
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getAllCatalogueTypes = async () => {
  try {
    const response = await api.get(getAuthenticatedApiUrl('/catalogue-types'));

    if (!response.data || !response.data.success) {
      throw new Error('Failed to fetch catalogue types');
    }

    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || `Failed to fetch catalogue types: ${error.response.status}`
      );
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};
