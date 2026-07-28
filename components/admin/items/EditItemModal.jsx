"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Upload, X } from "lucide-react";
import { uploadImageFile } from "@/utils/uploadImage";
import api from "@/utils/axios";

export default function EditItemModal({ open, item, catalogues = [], onClose, onSave }) {
  const [formData, setFormData] = useState({
    catalogueId: "",
    name: "",
    price: "",
    stock: "",
    status: "Active",
    description: "",
    imageUrl: "",
    imagePublicId: "",
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

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
      imageUrl: item.image || item.imageUrl || item.imageUrls?.[0] || "",
      imagePublicId: item.imagePublicId || item.imagePublicIds?.[0] || "",
    });
    setError(null);
    setImageFile(null);
    setImagePreviewUrl("");
  }, [item]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl.startsWith("blob:")) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  if (!open) return null;

  const updateForm = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, imageUrl: "", imagePublicId: "" }));
    setError(null);
  };

  const previewImageUrl = imagePreviewUrl || formData.imageUrl;

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
    try {
      const uploaded = imageFile ? await uploadImageFile(imageFile, "items") : null;
      const imageUrl = uploaded?.imageUrl || formData.imageUrl.trim();
      const imagePublicId = uploaded?.publicId || uploaded?.imagePublicId || formData.imagePublicId;
      const payload = {
        catalogueId: formData.catalogueId,
        name: formData.name.trim(),
        price: Number(formData.price || 0),
        imageUrls: imageUrl ? [imageUrl] : [],
        imagePublicIds: imagePublicId ? [imagePublicId] : [],
        validatedDescription: formData.description,
        stock: Number(formData.stock || 0),
        isActive: formData.status === "Active",
      };
      const res = await api.put(`/api/v1/admin/items/${encodeURIComponent(itemId)}`, payload);
      const result = res.data || {};
      if (!result.success) {
        throw new Error(result?.message || result?.error || "Failed to update item.");
      }
      onSave?.({ ...result.data, catalogueId: formData.catalogueId });
      onClose?.();
    } catch (err) {
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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Image</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input type="url" value={formData.imageUrl} onChange={(e) => { setImageFile(null); setImagePreviewUrl(""); setFormData((prev) => ({ ...prev, imageUrl: e.target.value, imagePublicId: "" })); }} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Upload className="h-4 w-4" />
                Choose
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageFileChange} disabled={saving} />
              </label>
              {previewImageUrl && (
                <button type="button" onClick={() => { setImageFile(null); setImagePreviewUrl(""); setFormData((prev) => ({ ...prev, imageUrl: "", imagePublicId: "" })); }} className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2.5 text-slate-600 hover:bg-slate-50" aria-label="Remove item image">
                  <Trash2 className="cursor-pointer h-4 w-4" />
                </button>
              )}
            </div>
            {previewImageUrl && <img src={previewImageUrl} alt="Item preview" className="mt-3 h-28 w-28 rounded-lg border border-slate-200 object-cover" />}
          </div>

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
