import api from '../utils/axios';

/**
 * Perform a global search across catalogues and items
 * @param {string} query - Search query
 * @returns {Promise<Object>} Search results
 */
export async function performSearch(query) {
  if (!query || query.trim().length === 0) {
    return {
      catalogues: [],
      items: [],
      totalResults: 0,
    };
  }

  try {
    const response = await api.get('/api/v1/search', {
      params: { q: query },
    });

    return {
      catalogues: response.data.data?.catalogues || [],
      items: response.data.data?.items || [],
      totalResults: (response.data.data?.catalogues?.length || 0) + (response.data.data?.items?.length || 0),
    };
  } catch (error) {
    console.error('Search API error:', error);
    throw new Error(error.response?.data?.message || 'Search failed');
  }
}