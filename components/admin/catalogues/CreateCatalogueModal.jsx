"use client";

import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";

export default function CreateCatalogueModal({
  open,
  createForm,
  createError,
  createLoading,
  onClose,
  onCreate,
  onFormChange,
}) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreviewUrl.startsWith("blob:")) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImagePreviewUrl(URL.createObjectURL(file));
    onFormChange({ ...createForm, imageFile: file, imageUrl: "", imagePublicId: "" });
  };

  if (!open) return null;
  const displayError = createError;
  const previewImageUrl = imagePreviewUrl || createForm.imageUrl;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Create New Catalogue
            </h2>
            <p className="text-sm text-slate-500">
              Add a new product catalogue to your store
            </p>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {displayError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
              {displayError}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Catalogue Name
            </label>
            <input
              type="text"
              placeholder="Enter catalogue name"
              value={createForm.name}
              onChange={(e) =>
                onFormChange({ ...createForm, name: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe your catalogue..."
              value={createForm.description}
              onChange={(e) =>
                onFormChange({
                  ...createForm,
                  description: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Catalogue Image
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="url"
                placeholder="https://example.com/catalogue-image.jpg"
                value={createForm.imageUrl || ""}
                onChange={(e) =>
                  {
                    setImagePreviewUrl("");
                    onFormChange({ ...createForm, imageFile: null, imageUrl: e.target.value, imagePublicId: "" });
                  }
                }
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Upload className="h-4 w-4" />
                Choose
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageFileChange} disabled={createLoading} />
              </label>
              {previewImageUrl && (
                <button type="button" onClick={() => { setImagePreviewUrl(""); onFormChange({ ...createForm, imageFile: null, imageUrl: "", imagePublicId: "" }); }} className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2.5 text-slate-600 hover:bg-slate-50" aria-label="Remove catalogue image">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            {previewImageUrl && (
              <div className="mt-2 h-28 w-44 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <img src={previewImageUrl} alt="Catalogue preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <label className="mt-2 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-600"
              checked={createForm.shouldAutoPublish}
              onChange={(e) =>
                onFormChange({
                  ...createForm,
                  shouldAutoPublish: e.target.checked,
                })
              }
            />
            <span className="text-sm text-slate-700">
              Auto-publish catalogue after creation
            </span>
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            className="cursor-pointer px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={createLoading}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={onCreate}
          >
            <span>{createLoading ? "Creating..." : "Create Catalogue"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
