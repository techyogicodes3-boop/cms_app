/**
 * Format price in INR (Indian Rupees)
 * @param {number} price - Price value
 * @returns {string} Formatted price string (e.g., "₹1,299")
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '₹0';
  }

  // Format with Indian numbering system
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format price as simple number with commas (no currency symbol)
 * @param {number} price - Price value
 * @returns {string} Formatted price string (e.g., "1,299")
 */
export const formatPriceNumber = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '0';
  }

  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(price);
};