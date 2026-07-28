export default function DeleteConfirmModal({
  open,
  deleteTarget,
  deleteError,
  deleteLoading,
  onClose,
  onConfirm,
}) {
  if (!open || !deleteTarget) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <span className="text-red-600 text-xl">⚠️</span>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-center text-lg font-semibold text-slate-900">
          Delete Catalogue?
        </h3>

        {/* Description */}
        <p className="mt-2 text-center text-sm text-slate-600">
          Are you sure you want to delete this catalogue? This action cannot be
          undone and all associated items will be removed.
        </p>

        {deleteError && (
          <p className="mt-3 text-center text-sm text-red-600" role="alert">
            {deleteError}
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={deleteLoading}
            className="cursor-pointer flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={deleteLoading}
            className="cursor-pointer flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
