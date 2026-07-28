'use client';
import React, { useState } from 'react';
import { Pencil, Eye, Trash2 } from 'lucide-react';

export default function ItemCard({ item, onEdit, onView, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div
      className={`relative bg-white rounded-md border border-slate-200 overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-lg scale-[1.02] z-10' : 'shadow-sm hover:shadow-md'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView?.(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView?.(item);
        }
      }}
    >
      {/* Image Section */}
      <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
        <img
          src={item.image || '/placeholder-item.jpg'}
          alt={item.name}
          className={`w-full h-full object-contain transition-all duration-300 ${isHovered ? 'blur-sm scale-110' : ''
            }`}
        />

        <div className="absolute top-1 right-1">
          <span className={`px-1 py-0.5 text-[9px] font-medium rounded ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
        </div>

        {/* Hover Actions */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/20 backdrop-blur-sm transition-all duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(item);
              }}
              className="cursor-pointer p-1.5 bg-white rounded-full shadow-lg hover:bg-blue-50 hover:scale-110 transition-all"
              aria-label="Edit item"
            >
              <Pencil className="h-3.5 w-3.5 text-blue-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView?.(item);
              }}
              className="cursor-pointer p-1.5 bg-white rounded-full shadow-lg hover:bg-green-50 hover:scale-110 transition-all"
              aria-label="View item details"
            >
              <Eye className="h-3.5 w-3.5 text-green-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(item);
              }}
              className="cursor-pointer p-1.5 bg-white rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all"
              aria-label="Delete item"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-600" />
            </button>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-2">
        <h3 className="text-xs font-semibold text-slate-900 mb-0.5 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-base font-bold text-blue-600 mb-1">{item.price}</p>
        <div className="flex items-center justify-between text-[10px] text-slate-600">
          <span>{item.catalogueName || item.catalogueId || 'Catalogue'}</span>
          <span>Stock: {item.stock}</span>
        </div>
      </div>
    </div>
  );
}
