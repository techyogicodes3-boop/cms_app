'use client';

import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

function StatusPill({ status }) {
  const active = status === 'Active';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
      active ? 'bg-[#EDF7EE] text-[#6D9B72]' : 'bg-[#FFF0F0] text-[#D95C5C]'
    }`}>
      {status}
    </span>
  );
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function ItemsList({ items, onEdit, onView, onDelete }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] shadow-[0_10px_30px_rgba(43,20,14,0.08)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F6ECDD] text-left text-[#2E1A14]">
            <tr>
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Child Name</th>
              <th className="w-64 max-w-64 px-4 py-3 font-semibold">Child Description</th>
              <th className="px-4 py-3 font-semibold">Parent Name</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Updated On</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8D8CC]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#FFF9F3]">
                <td className="px-4 py-3">
                  <img
                    src={item.image || '/placeholder-item.jpg'}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg border border-[#E8D8CC] bg-[#F6ECDD] object-cover"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-[#2E1A14]">{item.name}</div>
                </td>
                 <td className="w-64 max-w-64 px-4 py-3">
                  <div className="max-w-56 truncate text-xs text-[#7A625A]" title={item.description || '—'}>
                    {item.description || '—'}
                  </div>
                </td>
                <td className="px-4 py-3 text-[#2E1A14]">{item.catalogueName || item.catalogueId || '—'}</td>
                <td className="px-4 py-3 font-semibold text-[#2E1A14]">{item.price}</td>
                <td className="px-4 py-3 text-[#2E1A14]">{item.stock ?? 0}</td>
                <td className="px-4 py-3"><StatusPill status={item.status} /></td>
                <td className="px-4 py-3 text-[#7A625A]">{formatDate(item.updatedAt || item.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onView?.(item)} className="cursor-pointer rounded-md p-1.5 text-[#4A2318] hover:bg-[#F6ECDD]" aria-label="View child">
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button onClick={() => onEdit?.(item)} className="cursor-pointer rounded-md p-1.5 text-[#C98A78] hover:bg-[#F6ECDD]" aria-label="Edit child">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button onClick={() => onDelete?.(item)} className="cursor-pointer rounded-md p-1.5 text-[#D95C5C] hover:bg-[#FFF0F0]" aria-label="Delete child">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
