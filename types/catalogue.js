/**
 * Catalogue Type Definitions
 */ 

export const Catalogue = {
  _id: String,
  name: String,
  description: String,
  isPublished: Boolean,
};

/**
 * @typedef {Object} Catalogue
 * @property {string} _id - Catalogue ID
 * @property {string} name - Catalogue name
 * @property {string} description - Catalogue description
 * @property {boolean} isPublished - Whether catalogue is published
 */

/**
 * API Response for Get All Catalogues
 * @typedef {Object} CataloguesResponse
 * @property {boolean} success - API success flag
 * @property {Catalogue[]} data - Array of catalogues
 */
