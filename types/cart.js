/**
 * @typedef {Object} CartItem
 * @property {string} catalogueItemId - Item UUID from catalogue
 * @property {number} quantity - Quantity in cart
 * @property {number} priceAtAdd - Price when item was added (use this for display)
 */

/**
 * @typedef {Object} CartResponse
 * @property {boolean} success
 * @property {Object} data
 * @property {CartItem[]} data.items
 * @property {number} data.totalAmount
 */

/**
 * @typedef {Object} AddToCartRequest
 * @property {string} catalogueItemId - Item UUID
 * @property {number} quantity - Quantity to add
 */

/**
 * @typedef {Object} UpdateCartRequest
 * @property {number} quantity - New quantity
 */
