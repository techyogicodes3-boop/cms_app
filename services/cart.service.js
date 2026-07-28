const CART_STORAGE_KEY = "chocotraillCart";
const CART_MAPPING_STORAGE_KEY = "cartItemCatalogueMap";

function getCurrentUserId() {
  if (typeof window === "undefined") return "guest";

  try {
    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;
    return user?.id || user?.uuid || user?.email || "guest";
  } catch {
    return "guest";
  }
}

function getCartStorageKey() {
  return `${CART_STORAGE_KEY}:${getCurrentUserId()}`;
}

const notifyCartChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-changed"));
  }
};

const readCartItems = () => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(getCartStorageKey());
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(getCartStorageKey());
    return [];
  }
};

const writeCartItems = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(getCartStorageKey(), JSON.stringify(items));
  notifyCartChanged();
};

export const clearCartStorage = () => {
  if (typeof window === "undefined") return;

  const currentKey = getCartStorageKey();
  localStorage.removeItem(currentKey);
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(CART_MAPPING_STORAGE_KEY);
  notifyCartChanged();
};

const toCartResponse = (items) => ({
  success: true,
  data: {
    items,
    totalAmount: items.reduce((sum, item) => {
      const price = Number(item.priceAtAdd || item.price || 0);
      const quantity = Number(item.quantity || 1);
      return sum + price * quantity;
    }, 0),
  },
});

export const getCart = async () => {
  return toCartResponse(readCartItems());
};

export const addToCart = async (catalogueItemId, quantity = 1, details = {}) => {
  if (!catalogueItemId) {
    throw new Error("Catalogue item ID is required");
  }

  const qty = Math.max(1, Number(quantity) || 1);
  const items = readCartItems();
  const existingIndex = items.findIndex((item) => item.catalogueItemId === catalogueItemId);

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      ...details,
      quantity: Number(items[existingIndex].quantity || 1) + qty,
      updatedAt: new Date().toISOString(),
    };
  } else {
    items.push({
      id: catalogueItemId,
      _id: catalogueItemId,
      catalogueItemId,
      quantity: qty,
      priceAtAdd: Number(details.priceAtAdd || details.price || 0),
      name: details.name,
      image: details.image,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  writeCartItems(items);
  return toCartResponse(items);
};

export const updateCartItem = async (catalogueItemId, quantity) => {
  if (!catalogueItemId) {
    throw new Error("Catalogue item ID is required");
  }

  const qty = Math.max(1, Number(quantity) || 1);
  const items = readCartItems();
  const existingIndex = items.findIndex((item) => item.catalogueItemId === catalogueItemId);

  if (existingIndex < 0) {
    throw new Error("Item not in cart");
  }

  items[existingIndex] = {
    ...items[existingIndex],
    quantity: qty,
    updatedAt: new Date().toISOString(),
  };

  writeCartItems(items);
  return toCartResponse(items);
};

export const removeCartItem = async (catalogueItemId) => {
  if (!catalogueItemId) {
    throw new Error("Catalogue item ID is required");
  }

  const items = readCartItems().filter((item) => item.catalogueItemId !== catalogueItemId);
  writeCartItems(items);
  return toCartResponse(items);
};

export const clearCart = async () => {
  writeCartItems([]);
  return toCartResponse([]);
};
