import api from "@/utils/axios";
import { uploadImageFile } from "@/utils/uploadImage";

export const MAX_PRODUCT_IMAGES = 10;

export function createImageEntries(imageUrls = [], imagePublicIds = [], legacy = {}) {
  const urls = Array.isArray(imageUrls) && imageUrls.length
    ? imageUrls
    : [legacy.imageUrl].filter(Boolean);
  const publicIds = Array.isArray(imagePublicIds) && imagePublicIds.length
    ? imagePublicIds
    : [legacy.imagePublicId].filter(Boolean);

  return urls.filter(Boolean).slice(0, MAX_PRODUCT_IMAGES).map((url, index) => ({
    id: `existing-${index}-${url}`,
    url,
    publicId: publicIds[index] || "",
  }));
}

export async function uploadImageEntries(entries = [], folder) {
  const uploadedPublicIds = [];

  try {
    const resolved = [];
    for (const entry of entries.slice(0, MAX_PRODUCT_IMAGES)) {
      if (entry.file) {
        const uploaded = await uploadImageFile(entry.file, folder);
        const publicId = uploaded?.publicId || uploaded?.imagePublicId || "";
        if (publicId) uploadedPublicIds.push(publicId);
        resolved.push({ url: uploaded.imageUrl, publicId });
      } else if (entry.url?.trim()) {
        resolved.push({ url: entry.url.trim(), publicId: entry.publicId || "" });
      }
    }
    return { images: resolved, uploadedPublicIds };
  } catch (error) {
    await cleanupUploadedImages(uploadedPublicIds);
    throw error;
  }
}

export async function cleanupUploadedImages(publicIds = []) {
  await Promise.allSettled(
    publicIds.filter(Boolean).map((publicId) =>
      api.delete("/api/v1/images", { data: { publicId } })
    )
  );
}
