"use client";

import AdminImageManager from "@/components/admin/commonComponents/AdminImageManager";

export default function EditCatalogueModal({
  open,
  editForm,
  editError,
  editLoading,
  onClose,
  onSave,
  onFormChange,
}) {
  if (!open) return null;
  const displayError = editError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="edit-catalogue-title">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8">
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

          <AdminImageManager
            label="Catalogue images"
            images={editForm.images || []}
            onChange={(images) => onFormChange({ ...editForm, images })}
            disabled={editLoading}
          />

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
