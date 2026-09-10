"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import AdminImageManager from "@/components/admin/commonComponents/AdminImageManager";
import { cleanupUploadedImages, createImageEntries, uploadImageEntries } from "@/utils/imageEntries";
import api from "@/utils/axios";

export default function EditItemModal({ open, item, catalogues = [], onClose, onSave }) {
  const [formData, setFormData] = useState({
    catalogueId: "",
    name: "",
    price: "",
    stock: "",
    status: "Active",
    description: "",
    images: [],
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!item) return;
    const priceValue =
      typeof item.price === "number"
        ? String(item.price)
        : typeof item.price === "string"
          ? item.price.replace(/\$|₹|,/g, "").trim()
          : item.priceRaw != null
            ? String(item.priceRaw)
            : "";

    setFormData({
      catalogueId: item.catalogueId || "",
      name: item.name || "",
      price: priceValue,
      stock: item.stock != null ? String(item.stock) : "",
      status: item.status === "Inactive" ? "Inactive" : "Active",
      description: item.description || item.validatedDescription || "",
      images: createImageEntries(item.imageUrls, item.imagePublicIds, {
        imageUrl: item.image || item.imageUrl,
        imagePublicId: item.imagePublicId,
      }),
    });
    setError(null);
  }, [item]);

  if (!open) return null;

  const updateForm = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemId = item?.uuid || item?.id || item?._id;
    if (!itemId) return;
    if (!formData.catalogueId) {
      setError("Select a catalogue for this item.");
      return;
    }
    if (!formData.name.trim()) {
      setError("Item name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    let uploadedPublicIds = [];
    let committed = false;
    try {
      const uploaded = await uploadImageEntries(formData.images, "items");
      uploadedPublicIds = uploaded.uploadedPublicIds;
      const imageUrls = uploaded.images.map((image) => image.url);
      const imagePublicIds = uploaded.images.map((image) => image.publicId || "");
      const payload = {
        catalogueId: formData.catalogueId,
        name: formData.name.trim(),
        price: Number(formData.price || 0),
        imageUrls,
        imagePublicIds,
        validatedDescription: formData.description,
        stock: Number(formData.stock || 0),
        isActive: formData.status === "Active",
      };
      const res = await api.put(`/api/v1/admin/items/${encodeURIComponent(itemId)}`, payload);
      const result = res.data || {};
      if (!result.success) {
        throw new Error(result?.message || result?.error || "Failed to update item.");
      }
      committed = true;
      onSave?.({ ...result.data, catalogueId: formData.catalogueId });
      onClose?.();
    } catch (err) {
      if (!committed && (!err?.request || err?.response)) {
        await cleanupUploadedImages(uploadedPublicIds);
      }
      setError(err?.message || "Failed to update item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Edit Item</h2>
            <p className="mt-1 text-sm text-slate-600">Update product information and catalogue relation.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close modal">
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Catalogue *</label>
            <select value={formData.catalogueId} onChange={(e) => updateForm("catalogueId", e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="">Select catalogue</option>
              {catalogues.map((cat) => {
                const id = cat.uuid || cat.id;
                return <option key={id} value={id}>{cat.catalogueName || cat.name}</option>;
              })}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Item Name</label>
            <input value={formData.name} onChange={(e) => updateForm("name", e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Price</label>
              <input type="number" step="0.01" value={formData.price} onChange={(e) => updateForm("price", e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Stock</label>
              <input type="number" value={formData.stock} onChange={(e) => updateForm("stock", e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>

          <AdminImageManager
            label="Item images"
            images={formData.images}
            onChange={(images) => updateForm("images", images)}
            disabled={saving}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
            <textarea rows={4} value={formData.description} onChange={(e) => updateForm("description", e.target.value)} className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
            <select value={formData.status} onChange={(e) => updateForm("status", e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button type="button" onClick={onClose} className="cursor-pointer rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving} className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
