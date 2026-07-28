import { API_BASE_URL } from "@/constants/api";
import api from "@/utils/axios";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const FOLDER_MAP = {
  items: "chocotraill/products",
  products: "chocotraill/products",
  catalogues: "chocotraill/catalogues",
  reviews: "chocotraill/reviews",
};

export async function uploadImageFile(file, folder) {
  if (!file) return null;

  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Upload a JPG, PNG, or WebP image.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", FOLDER_MAP[folder] || folder || FOLDER_MAP.products);

  const response = await api.post(`${API_BASE_URL}/images/upload`, formData);
  const uploadJson = response.data || {};

  if (!uploadJson.success) {
    throw new Error(uploadJson?.message || uploadJson?.error || "Failed to upload image.");
  }

  if (!uploadJson.data?.imageUrl || !uploadJson.data?.publicId) {
    throw new Error("Image upload did not return Cloudinary details.");
  }

  return uploadJson.data;
}
