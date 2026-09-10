// API URLs
export const LIST_CATALOGUES_API_URL = "/api/v1/catalogues";
export const CATALOGUES_API_URL = "/api/v1/admin/catalogues";
export const EDIT_CATALOGUE_BASE_URL = "/api/v1/admin/catalogues";

export function getPublishCatalogueUrl(catalogueId) {
  return `${CATALOGUES_API_URL}/${catalogueId}/publish`;
}

export function getEditCatalogueUrl(catalogueId) {
  return `${EDIT_CATALOGUE_BASE_URL}/${catalogueId}`;
}

// Type options and styling
export const STATUS_OPTIONS = ["All Status", "Public", "Drafts"];

export const typeTone = {
  Electronics: "bg-blue-50 text-blue-700",
  Cars: "bg-rose-50 text-rose-700",
  "Soft Drinks": "bg-amber-50 text-amber-700",
  Fashion: "bg-emerald-50 text-emerald-700",
  Home: "bg-orange-50 text-orange-700",
  Sports: "bg-purple-50 text-purple-700",
  Beauty: "bg-pink-50 text-pink-700",
  Books: "bg-indigo-50 text-indigo-700",
  Food: "bg-lime-50 text-lime-700",
  Gaming: "bg-sky-50 text-sky-700",
  "Fashion & Apparel": "bg-emerald-50 text-emerald-700",
  "Home & Living": "bg-orange-50 text-orange-700",
  "Sports & Fitness": "bg-purple-50 text-purple-700",
  Bike: "bg-sky-50 text-sky-700",
  Vehicle: "bg-slate-50 text-slate-700",
};

// Icon mappings
export const iconMap = {
  Cars: "🚗",
  Electronics: "📱",
  "Soft Drinks": "🥤",
  Fashion: "👕",
  "Fashion & Apparel": "👕",
  Home: "🏠",
  "Home & Living": "🏠",
  Sports: "⚽",
  "Sports & Fitness": "⚽",
  Bike: "🏍️",
  Beauty: "💄",
  Books: "📚",
  Food: "🍔",
  Gaming: "🎮",
  Vehicle: "🚙",
};

export const iconBgMap = {
  Cars: "bg-rose-50",
  Electronics: "bg-blue-50",
  "Soft Drinks": "bg-amber-50",
  Fashion: "bg-emerald-50",
  "Fashion & Apparel": "bg-emerald-50",
  Home: "bg-orange-50",
  "Home & Living": "bg-orange-50",
  Sports: "bg-purple-50",
  "Sports & Fitness": "bg-purple-50",
  Bike: "bg-sky-50",
  Beauty: "bg-pink-50",
  Books: "bg-indigo-50",
  Food: "bg-lime-50",
  Gaming: "bg-sky-50",
  Vehicle: "bg-slate-50",
};

// Helper function to map API item to display format
export function mapCatalogueItem(item, index) {
  const type = item.type ?? "General";
  const imageUrls = Array.isArray(item.imageUrls) && item.imageUrls.length
    ? item.imageUrls
    : [item.image ?? item.imageUrl ?? item.coverImage ?? item.thumbnail].filter(Boolean);
  const imagePublicIds = Array.isArray(item.imagePublicIds) && item.imagePublicIds.length
    ? item.imagePublicIds
    : [item.imagePublicId ?? item.publicId].filter(Boolean);
  
  return {
    id: item.uuid ?? item._id ?? `catalogue-${index}`,
    name: item.catalogueName ?? item.name,
    subtitle: item.description,
    type: type,
    icon: iconMap[type] ?? "📦",
    iconBg: iconBgMap[type] ?? "bg-slate-50",
    image: imageUrls[0] ?? null,
    imagePublicId: imagePublicIds[0] ?? null,
    imageUrls,
    imagePublicIds,
    // Support both boolean `isPublished` and string `status` from API
    active: typeof item.isPublished === 'boolean'
      ? item.isPublished
      : (item.status === 'Active' || item.status === true),
    created: item.createdAt 
        ? new Date(item.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        : item.createdDate
        ? new Date(item.createdDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—",
  
    items: typeof item.itemsCount === 'number'
      ? item.itemsCount
      : Array.isArray(item.items)
      ? item.items.length
      : Array.isArray(item.products)
      ? item.products.length
      : 0,
  };
}
