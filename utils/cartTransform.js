import { formatPrice } from './priceFormatter';

/**
 * Normalize image from cart item OR catalogue item
 */
const normalizeImage = (cartItem, itemDetails) => {
  // 1️⃣ Cart API already sends image (MOST IMPORTANT)
  if (typeof cartItem?.image === 'string') {
    return cartItem.image;
  }

  // 2️⃣ Catalogue image (fallback)
  if (!itemDetails) return null;

  if (typeof itemDetails.image === 'string') return itemDetails.image;
  if (typeof itemDetails.imageUrl === 'string') return itemDetails.imageUrl;
  if (Array.isArray(itemDetails.imageUrls) && itemDetails.imageUrls.length > 0) {
    return itemDetails.imageUrls[0];
  }
  if (itemDetails.image?.url) return itemDetails.image.url;
  if (itemDetails.image?.secure_url) return itemDetails.image.secure_url;

  if (Array.isArray(itemDetails.images) && itemDetails.images.length > 0) {
    const img = itemDetails.images[0];
    if (typeof img === 'string') return img;
    if (img?.url) return img.url;
    if (img?.secure_url) return img.secure_url;
  }

  return null;
};

/**
 * Transform cart item from API to UI format
 */
export const transformCartItemToUI = (cartItem, itemDetails, itemId) => {
  const image = normalizeImage(cartItem, itemDetails);
  const price = Number(itemDetails?.price ?? cartItem.priceAtAdd ?? cartItem.price ?? 0);
  const stock = Number(itemDetails?.stock);

  const description =
    itemDetails?.validatedDescription ||
    itemDetails?.description ||
    itemDetails?.shortDescription ||
    '';

  return {
    id: itemId || cartItem.catalogueItemId,
    cartItemId: itemId,
    catalogueItemId: cartItem.catalogueItemId,

    // ✅ FIXED: image now comes from cart API
    image,

    title:
      itemDetails?.name ||
      cartItem.name ||
      'Unknown Item',

    variant: description
      ? description.length > 80
        ? description.slice(0, 80) + '...'
        : description
      : 'No description available',

    badge: 'In Stock',
    stock: Number.isFinite(stock) ? stock : null,
    isActive: itemDetails?.isActive !== false,
    discount: null,
    quantity: cartItem.quantity ?? 1,
    price,
    oldPrice: null,
    priceNote: null,
  };
};
