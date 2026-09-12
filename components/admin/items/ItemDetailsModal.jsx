'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import api from '@/utils/axios';

const ITEM_DETAILS_API_BASE = '/api/v1/catalogues';

function formatPrice(value) {
  if (value == null) return '—';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return `₹${num.toLocaleString()}`;
}

function mapApiItemToDetails(data) {
  const imageUrl = data.imageUrls?.[0] || data.imageUrl || data.image;
  const status = data.isActive === false
      ? 'Inactive'
      : 'Active';
  const description = data.validatedDescription || data.description || '';

  return {
    id: data.uuid,
    uuid: data.uuid,
    name: data.name ?? '',
    price: formatPrice(data.price),
    priceRaw: data.price,
    image: imageUrl || '/placeholder-item.jpg',
    stock: data.stock != null ? `${data.stock}` : '—',
    status,
    description,
    ...data,
  };
}

export default function ItemDetailsModal({ open, item, onClose, onEdit, catalogueId, catalogueName }) {
  const [detailsItem, setDetailsItem] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const itemId = item?.id ?? item?.uuid;

  const fetchItemDetails = useCallback(async () => {
    if (!catalogueId || !itemId) return;
    setDetailsLoading(true);
    setDetailsError(null);
    setDetailsItem(null);
    setSelectedImage(0);
    try {
      const url = `${ITEM_DETAILS_API_BASE}/${encodeURIComponent(catalogueId)}/items/${encodeURIComponent(itemId)}`;
      const res = await api.get(url);
      const json = res.data || {};
      if (!json.success) {
        setDetailsError(json?.message || json?.error || 'Failed to load item details.');
        return;
      }
      const data = json.data;
      setDetailsItem(data ? mapApiItemToDetails(data) : null);
    } catch (err) {
      setDetailsError(err?.message || 'Failed to load item details.');
    } finally {
      setDetailsLoading(false);
    }
  }, [catalogueId, itemId]);

  useEffect(() => {
    if (open && catalogueId && itemId) {
      fetchItemDetails();
    } else {
      setDetailsItem(null);
      setDetailsError(null);
    }
  }, [open, catalogueId, itemId, fetchItemDetails]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Inactive':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const displayItem = detailsItem || (open && item ? {
    name: item.name,
    price: item.price,
    image: item.image || '/placeholder-item.jpg',
    imageUrls: item.imageUrls || [item.image].filter(Boolean),
    stock: item.stock ?? '—',
    status: item.status ?? 'Active',
    description: item.description || item.validatedDescription || '',
    catalogueName: item.catalogueName || catalogueName,
  } : null);

  if (!open) return null;

  const displayImages = [...new Set((displayItem?.imageUrls?.length ? displayItem.imageUrls : [displayItem?.image]).filter(Boolean))];
  const activeImage = displayImages[selectedImage % Math.max(displayImages.length, 1)] || '/placeholder-item.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto z-10">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Item Details</h2>
            <p className="text-sm text-slate-600 mt-1">Complete product information</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6">
          {detailsLoading && (
            <div className="py-12 text-center text-slate-500">Loading item details...</div>
          )}

          {detailsError && !detailsLoading && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
              {detailsError}
            </div>
          )}

          {displayItem && !detailsLoading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="w-full aspect-square rounded-lg bg-slate-100 overflow-hidden mb-4">
                    <img
                      src={activeImage}
                      alt={displayItem.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {displayImages.length > 1 && (
                    <div className="mb-4 grid grid-cols-5 gap-2" aria-label={`${displayImages.length} product images`}>
                      {displayImages.map((image, index) => (
                        <button key={`${image}-${index}`} type="button" onClick={() => setSelectedImage(index)} className={`aspect-square overflow-hidden rounded-lg border-2 bg-slate-50 ${selectedImage === index ? 'border-blue-600' : 'border-slate-200'}`} aria-label={`Show product image ${index + 1}`}>
                          <img src={image} alt={`${displayItem.name} ${index + 1}`} className="h-full w-full object-contain p-1" />
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(displayItem.status)}`}>
                      {displayItem.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{displayItem.name}</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-4">{displayItem.price}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-slate-600">Catalogue:</span>
                      <span className="ml-2 text-sm text-slate-900">{displayItem.catalogueName || catalogueName || displayItem.catalogueId || '—'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600">Stock:</span>
                      <span className="ml-2 text-sm text-slate-900">
                        {displayItem.stock === '—' ? '—' : `${displayItem.stock} units`}
                      </span>
                    </div>
                    {/* <div>
                      <span className="text-sm font-medium text-slate-600">Category:</span>
                      <span className="ml-2 text-sm text-slate-900">
                        {displayItem.category || catalogueName || '—'}
                      </span>
                    </div> */}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Description</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {displayItem.description || 'No description available.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={onClose}
                  className="cursor-pointer px-6 py-2.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onEdit?.(displayItem);
                    onClose();
                  }}
                  className="cursor-pointer px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Item
                </button>
              </div>
            </>
          )}

          {!displayItem && !detailsLoading && !detailsError && (
            <div className="py-12 text-center text-slate-500">No item selected.</div>
          )}
        </div>
      </div>
    </div>
  );
}
