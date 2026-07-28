'use client';

import React from 'react';
import { Filter, Grid3x3, List, RotateCcw, Search } from 'lucide-react';

export default function ItemsFiltersBar({
  viewMode = 'list',
  onViewModeChange,
  statusFilter = 'All Status',
  onStatusFilterChange,
  searchTerm = '',
  onSearchTermChange,
  parentFilter = 'All Parents',
  onParentFilterChange,
  catalogues = [],
}) {
  return (
    <div className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-4 shadow-[0_10px_30px_rgba(43,20,14,0.08)]">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7A625A]" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchTermChange?.(event.target.value)}
            placeholder="Search by child name, ID or parent..."
            className="h-12 w-full rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] pl-12 pr-4 text-sm text-[#2E1A14] outline-none focus:border-[#D85C6B] focus:ring-2 focus:ring-[#E9B8B0]/40"
          />
        </label>

        <select
          value={parentFilter}
          onChange={(event) => onParentFilterChange?.(event.target.value)}
          className="h-12 rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] px-4 text-sm text-[#2E1A14] outline-none focus:border-[#D85C6B] focus:ring-2 focus:ring-[#E9B8B0]/40"
        >
          <option value="All Parents">Select Parent</option>
          {catalogues.map((catalogue) => {
            const value = catalogue.uuid || catalogue.id;
            return (
              <option key={value} value={value}>
                {catalogue.catalogueName || catalogue.name || value}
              </option>
            );
          })}
        </select>

        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange?.(event.target.value)}
          className="h-12 rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] px-4 text-sm text-[#2E1A14] outline-none focus:border-[#D85C6B] focus:ring-2 focus:ring-[#E9B8B0]/40"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        

        <button
          type="button"
          onClick={() => {
            onSearchTermChange?.('');
            onParentFilterChange?.('All Parents');
            onStatusFilterChange?.('All Status');
          }}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] px-4 text-sm font-semibold text-[#2E1A14] hover:bg-[#F6ECDD]"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </button>
      </div>

      <div className="mt-4 inline-flex overflow-hidden rounded-lg border border-[#E8D8CC]">
        <button
          onClick={() => onViewModeChange?.('list')}
          className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold ${viewMode === 'list' ? 'bg-[#E9B8B0]/45 text-[#D85C6B]' : 'bg-[#FFFCF8] text-[#7A625A] hover:bg-[#F6ECDD]'}`}
        >
          <List className="h-4 w-4" aria-hidden="true" />
          Table
        </button>
        <button
          onClick={() => onViewModeChange?.('grid')}
          className={`inline-flex items-center gap-2 border-l border-[#E8D8CC] px-3 py-2 text-xs font-semibold ${viewMode === 'grid' ? 'bg-[#E9B8B0]/45 text-[#D85C6B]' : 'bg-[#FFFCF8] text-[#7A625A] hover:bg-[#F6ECDD]'}`}
        >
          <Grid3x3 className="h-4 w-4" aria-hidden="true" />
          Grid
        </button>
      </div>
    </div>
  );
}
