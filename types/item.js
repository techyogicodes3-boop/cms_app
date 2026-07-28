/**
 * Item Type Definitions
 */

/**
 * @typedef {Object} Item
 * @property {string} uuid - Item unique identifier
 * @property {string} name - Item name
 * @property {string} validatedDescription - Item description (AI validated)
 * @property {number} price - Item price
 */

/**
 * API Response for Get Items By Catalogue
 * @typedef {Object} CatalogueItemsResponse
 * @property {boolean} success - API success flag
 * @property {Item[]} data - Array of items
 */

/**
 * API Response for Get Single Item
 * @typedef {Object} ItemDetailsResponse
 * @property {boolean} success - API success flag
 * @property {Item} data - Item details
 */
