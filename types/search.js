/**
 * Search result types (for JSDoc documentation)
 */

/**
 * @typedef {Object} SearchResult
 * @property {Array} catalogues - Array of matching catalogues
 * @property {Array} items - Array of matching items
 * @property {number} totalResults - Total number of results
 */

/**
 * @typedef {Object} CatalogueResult
 * @property {string} id - Catalogue ID
 * @property {string} name - Catalogue name
 * @property {string} description - Catalogue description
 */

/**
 * @typedef {Object} ItemResult
 * @property {string} id - Item ID
 * @property {string} name - Item name
 * @property {string} description - Item description
 * @property {number} price - Item price
 * @property {string} catalogueId - Parent catalogue ID
 */

// Export empty object for imports
export default {};