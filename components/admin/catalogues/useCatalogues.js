import { useState, useEffect } from "react";
import api from "@/utils/axios";
import {
  LIST_CATALOGUES_API_URL,
  CATALOGUES_API_URL,
  getPublishCatalogueUrl,
  getEditCatalogueUrl,
  mapCatalogueItem,
  iconMap,
  iconBgMap,
} from "./catalogueUtils";
import { uploadImageFile } from "@/utils/uploadImage";

const CATALOGUE_TYPES = [
  "Cars",
  "Soft Drinks",
  "Fashion & Apparel",
  "Home & Living",
  "Sports & Fitness",
  "Beauty & Personal Care",
  "Books & Stationery",
  "Food & Groceries",
  "Gaming & Entertainment"
];

export function useCatalogues() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [availableTypes, setAvailableTypes] = useState(["All Types", ...CATALOGUE_TYPES]);

  useEffect(() => {
    const fetchCatalogues = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await api.get(LIST_CATALOGUES_API_URL);
        const json = res.data || {};
        if (!json.success) {
          throw new Error(json?.message || json?.error || "Failed to load catalogues.");
        }
        const data = Array.isArray(json.data) ? json.data : [];
        const mapped = data.map((item, index) => mapCatalogueItem(item, index));

        setRows(mapped);
      } catch (err) {
        setLoadError(err?.message || "Something went wrong while loading catalogues.");
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogues();
  }, []);

  const toggleStatus = async (rowId) => {
    if (rowId == null) return;
    const row = rows.find((c) => c.id === rowId);
    if (!row) return;
    const newPublished = !row.active;
    setRows((prev) =>
      prev.map((c) =>
        c.id === rowId ? { ...c, active: newPublished } : c
      )
    );
    try {
      const res = await api.patch(getPublishCatalogueUrl(rowId), { isPublished: newPublished });
      const json = res.data || {};
      if (!json.success) {
        setRows((prev) =>
          prev.map((c) =>
            c.id === rowId ? { ...c, active: row.active } : c
          )
        );
      }
    } catch {
      setRows((prev) =>
        prev.map((c) =>
          c.id === rowId ? { ...c, active: row.active } : c
        )
      );
    }
  };

  const deleteCatalogue = async (id) => {
    try {
      await api.delete(`${CATALOGUES_API_URL}/${encodeURIComponent(id)}`);
      setRows((prev) => prev.filter((row) => row.id !== id));
      return { success: true };
    } catch (err) {
      const json = err?.response?.data || {};
      throw new Error(json?.message || json?.error || "Failed to delete catalogue.");
    }
  };

  const updateCatalogue = async (id, formData) => {
    const uploaded = formData.imageFile
      ? await uploadImageFile(formData.imageFile, "catalogues")
      : null;
    const imageUrl = uploaded?.imageUrl || formData.imageUrl || "";
    const imagePublicId = uploaded?.publicId || uploaded?.imagePublicId || formData.imagePublicId || "";

    const res = await api.put(getEditCatalogueUrl(id), {
        name: formData.name,
        description: formData.description || undefined,
        imageUrl,
        imagePublicId,
        isPublished: formData.published,
    });

    const json = res.data || {};
    if (!json.success) {
      throw new Error(json?.message || json?.error || "Failed to update catalogue.");
    }

    const data = json.data;
    setRows((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
            ...c,
            name: data.name ?? formData.name,
            type: data.type ?? c.type,
            subtitle: data.description ?? formData.description,
            image: data.imageUrl ?? imageUrl ?? c.image,
            imagePublicId: data.imagePublicId ?? imagePublicId ?? "",
            active: data.isPublished ?? formData.published,
          }
          : c
      )
    );

    return { success: true };
  };

  const createCatalogue = async (formData) => {
    const uploaded = formData.imageFile
      ? await uploadImageFile(formData.imageFile, "catalogues")
      : null;
    const imageUrl = uploaded?.imageUrl || formData.imageUrl || "";
    const imagePublicId = uploaded?.publicId || uploaded?.imagePublicId || formData.imagePublicId || "";

    const res = await api.post(CATALOGUES_API_URL, {
        name: formData.name,
        description: formData.description,
        imageUrl,
        imagePublicId,
        shouldAutoPublish: !!formData.shouldAutoPublish,
    });

    const json = res.data || {};
    if (!json.success) {
      throw new Error(json?.message || json?.error || "Failed to create catalogue.");
    }

    const data = json.data;
    const createdDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newRow = {
      id: data.uuid,
      icon: iconMap[data.type] ?? "📦",
      iconBg: iconBgMap[data.type] ?? "bg-blue-50",
      name: data.name,
      subtitle: data.description || "",
      image: data.imageUrl || imageUrl || null,
      imagePublicId: data.imagePublicId || imagePublicId || "",
      type: data.type,
      items: 0,
      active: data.isPublished ?? formData.shouldAutoPublish,
      created: createdDate,
    };

    setRows((prev) => [newRow, ...prev]);
    return { success: true };
  };

  return {
    rows,
    loading,
    loadError,
    availableTypes,
    toggleStatus,
    deleteCatalogue,
    updateCatalogue,
    createCatalogue,
  };
}
