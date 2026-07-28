/**
 * Image Helper Functions
 * Utilities for handling image URLs and fallbacks
 */

/**
 * Get full image URL from backend
 * @param {string} imagePath - Image path from API (relative or full URL)
 * @param {string} baseUrl - Optional base URL for relative image paths
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath, baseUrl = '') => {
  if (!imagePath) return null;
  
  // If already a full URL (http:// or https://), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If starts with /, it's an absolute path from server
  if (imagePath.startsWith('/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // Otherwise, assume it's a relative path
  return `${baseUrl}/${imagePath}`;
};

/**
 * Get image from item/catalogue data
 * Checks multiple possible image field names
 * @param {Object} data - Item or catalogue data
 * @returns {string|null} Image URL or null
 */
export const getImageFromData = (data) => {
  if (!data) return null;
  
  // Check common image field names
  const imageFields = [
    'image',
    'imageUrl',
    'thumbnail',
    'thumbnailUrl',
    'photo',
    'picture',
    'img',
    'cover',
    'coverImage'
  ];
  
  for (const field of imageFields) {
    if (data[field]) {
      return getImageUrl(data[field]);
    }
  }
  
  // Check if images array exists
  if (data.images && Array.isArray(data.images) && data.images.length > 0) {
    return getImageUrl(data.images[0]);
  }
  
  return null;
};

/**
 * Get catalogue image
 * @param {Object} catalogue - Catalogue object from API
 * @returns {string|null} Image URL or null
 */
export const getCatalogueImage = (catalogue) => {
  return getImageFromData(catalogue);
};

/**
 * Get item image
 * @param {Object} item - Item object from API
 * @returns {string|null} Image URL or null
 */
export const getItemImage = (item) => {
  return getImageFromData(item);
};

/**
 * Get placeholder image for specific type
 * @param {string} type - Type of placeholder ('catalogue', 'item', 'product')
 * @returns {string} Placeholder image URL
 */
export const getPlaceholderImage = (type = 'default') => {
  const placeholders = {
    catalogue: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    item: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    product: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    default: 'https://via.placeholder.com/400x400/cbd5e1/475569?text=No+Image'
  };
  
  return placeholders[type] || placeholders.default;
};

/**
 * Check if image URL is valid
 * @param {string} url - Image URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};
