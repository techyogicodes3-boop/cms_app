// API Configuration Constants
export const API_BASE_PATH = '/api/v1';
export const API_BASE_URL = API_BASE_PATH;
export const AUTHENTICATED_API_BASE_URL = API_BASE_PATH;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  
  // User endpoints
  PROFILE: '/user/profile',
  
  // Admin endpoints
  ADMIN_SETTINGS: '/admin/settings',
  
  // Catalogue endpoints (authenticated user/admin API)
  CATALOGUES: '/catalogues',
  CATALOGUE_ITEMS: '/catalogue/items',
  CATALOGUE_BY_ID: (id) => `/catalogues/${id}`,
  ITEMS_BY_CATALOGUE: (id) => `/catalogues/${id}/items`,
  ITEM_DETAILS: (catalogueId, itemId) => `/catalogues/${catalogueId}/items/${itemId}`,
  
  // Search endpoint (Authenticated API)
  SEARCH: '/search',
};

// Construct full API URLs
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
export const getAuthenticatedApiUrl = (endpoint) => `${AUTHENTICATED_API_BASE_URL}${endpoint}`;
export const getPublicApiUrl = getAuthenticatedApiUrl;
