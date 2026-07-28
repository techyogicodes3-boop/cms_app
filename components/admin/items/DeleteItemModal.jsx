'use client';
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteItemModal({ open, item, onClose, onConfirm, loading, error }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full z-10">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Delete Item?</h2>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer px-6 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm?.(item)}
              disabled={loading}
              className={`cursor-pointer px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
          {error && (
            <div className="mt-3 text-sm text-red-600 text-center">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
