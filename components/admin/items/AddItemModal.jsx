"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import AdminImageManager from "@/components/admin/commonComponents/AdminImageManager";
import { cleanupUploadedImages, uploadImageEntries } from "@/utils/imageEntries";
import api from "@/utils/axios";

const ADD_ITEM_API_BASE = "/api/v1/admin/catalogues";

function formatDisplayItem(item, catalogueName) {
  const imageUrl = item.imageUrls?.[0] || item.imageUrl || item.image;
  return {
    ...item,
    id: item.uuid,
    uuid: item.uuid,
    name: item.name || "",
    price: `₹${Number(item.price || 0).toLocaleString()}`,
    priceRaw: item.price,
    description: item.validatedDescription || item.description || "",
    stock: item.stock ?? 0,
    status: item.isActive === false ? "Inactive" : "Active",
    image: imageUrl || "/placeholder-item.jpg",
    catalogueName,
  };
}

export default function AddItemModal({
  open,
  onClose,
  catalogueId,
  catalogueName,
  lockCatalogueSelection = false,
  catalogues = [],
  onItemAdded,
}) {
  const [form, setForm] = useState({
    catalogueId: catalogueId || "",
    name: "",
    price: "",
    images: [],
    stock: "0",
    description: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;

    setForm({
      catalogueId: catalogueId || "",
      name: "",
      price: "",
      images: [],
      stock: "0",
      description: "",
      status: "Active",
    });
    setError(null);
  }, [open, catalogueId]);

  if (!open) return null;

  const selectedCatalogueId = lockCatalogueSelection ? catalogueId : form.catalogueId;
  const selectedCatalogue = catalogues.find((cat) => (cat.uuid || cat.id) === selectedCatalogueId);
  const selectedCatalogueName = catalogueName || selectedCatalogue?.catalogueName || selectedCatalogue?.name || "";
  const hasCatalogueOptions = catalogues.length > 0;
  const cannotSelectCatalogue = !lockCatalogueSelection && !hasCatalogueOptions;

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleClose = () => {
    setForm({
      catalogueId: catalogueId || "",
      name: "",
      price: "",
      images: [],
      stock: "0",
      description: "",
      status: "Active",
    });
    setError(null);
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const targetCatalogueId = lockCatalogueSelection ? catalogueId : form.catalogueId;
    if (!targetCatalogueId) {
      setError("Select a catalogue for this item.");
      return;
    }
    if (!lockCatalogueSelection && !catalogues.some((cat) => (cat.uuid || cat.id) === targetCatalogueId)) {
      setError("Select a valid parent component for this item.");
      return;
    }
    if (!form.name.trim()) {
      setError("Item name is required.");
      return;
    }

    const price = Number(form.price || 0);
    if (Number.isNaN(price) || price < 0) {
      setError("Enter a valid price.");
      return;
    }
    const stock = Number(form.stock || 0);
    if (!Number.isInteger(stock) || stock < 0) {
      setError("Enter a valid stock quantity.");
      return;
    }

    setLoading(true);
    setError(null);
    let uploadedPublicIds = [];
    let committed = false;
    try {
      const uploaded = await uploadImageEntries(form.images, "items");
      uploadedPublicIds = uploaded.uploadedPublicIds;
      const imageUrls = uploaded.images.map((image) => image.url);
      const imagePublicIds = uploaded.images.map((image) => image.publicId || "");
      const body = {
        name: form.name.trim(),
        price,
        stock,
        validatedDescription: form.description.trim(),
        isActive: form.status === "Active",
        imageUrls,
        imagePublicIds,
      };
      const res = await api.post(`${ADD_ITEM_API_BASE}/${encodeURIComponent(targetCatalogueId)}/items`, body);
      const json = res.data || {};
      if (!json.success) {
        throw new Error(json?.message || json?.error || "Failed to add item.");
      }
      committed = true;
      onItemAdded?.(formatDisplayItem({ ...json.data, catalogueId: targetCatalogueId }, selectedCatalogueName));
      handleClose();
    } catch (err) {
      if (!committed && (!err?.request || err?.response)) {
        await cleanupUploadedImages(uploadedPublicIds);
      }
      setError(err?.message || "Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Add New Item</h2>
            <p className="mt-1 text-sm text-slate-600">Create an item and link it to a catalogue.</p>
          </div>
          <button type="button" onClick={handleClose} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {cannotSelectCatalogue && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Create a parent component before adding a child component.
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Catalogue *</label>
            <select
              value={selectedCatalogueId}
              disabled={lockCatalogueSelection || cannotSelectCatalogue}
              onChange={(e) => updateForm("catalogueId", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
              required
            >
              <option value="">Select catalogue</option>
              {catalogues.map((cat) => {
                const id = cat.uuid || cat.id;
                return <option key={id} value={id}>{cat.catalogueName || cat.name}</option>;
              })}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Item Name *</label>
            <input value={form.name} onChange={(e) => updateForm("name", e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Price</label>
              <input type="number" min="0" step="any" value={form.price} onChange={(e) => updateForm("price", e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => updateForm("stock", e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <AdminImageManager
            label="Item images"
            images={form.images}
            onChange={(images) => setForm((previous) => ({ ...previous, images }))}
            disabled={loading}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => updateForm("description", e.target.value)} className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
            <select value={form.status} onChange={(e) => updateForm("status", e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button type="button" onClick={handleClose} className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading || cannotSelectCatalogue} className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
