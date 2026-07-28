"use client";

import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";

export default function EditCatalogueModal({
  open,
  editForm,
  editError,
  editLoading,
  onClose,
  onSave,
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
    onFormChange({ ...editForm, imageFile: file, imageUrl: "", imagePublicId: "" });
  };

  if (!open) return null;
  const displayError = editError;
  const previewImageUrl = imagePreviewUrl || editForm.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="edit-catalogue-title">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 id="edit-catalogue-title" className="text-lg font-semibold text-slate-900">
              Edit Catalogue
            </h2>
            <p className="text-sm text-slate-500">
              Update catalogue information
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
              value={editForm.name}
              disabled={editLoading}
              onChange={(e) =>
                onFormChange({ ...editForm, name: e.target.value })
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
              value={editForm.description}
              onChange={(e) =>
                onFormChange({ ...editForm, description: e.target.value })
              }
              disabled={editLoading}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-70"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Catalogue Image
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="url"
                value={editForm.imageUrl || ""}
                onChange={(e) =>
                  {
                    setImagePreviewUrl("");
                    onFormChange({ ...editForm, imageFile: null, imageUrl: e.target.value, imagePublicId: "" });
                  }
                }
                disabled={editLoading}
                placeholder="https://example.com/catalogue-image.jpg"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-70"
              />
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Upload className="h-4 w-4" />
                Choose
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageFileChange} disabled={editLoading} />
              </label>
              {previewImageUrl && (
                <button type="button" onClick={() => { setImagePreviewUrl(""); onFormChange({ ...editForm, imageFile: null, imageUrl: "", imagePublicId: "" }); }} className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2.5 text-slate-600 hover:bg-slate-50" aria-label="Remove catalogue image">
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
              checked={editForm.published}
              onChange={(e) =>
                onFormChange({ ...editForm, published: e.target.checked })
              }
            />
            <span className="text-sm text-slate-700">
              Keep catalogue published
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
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm"
            disabled={editLoading}
            onClick={onSave}
          >
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
