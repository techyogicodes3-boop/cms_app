'use client';

import { ChevronUp } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_des' },
];

export default function FiltersSidebar({ brands, onFilterChange, priceRange, currentFilters }) {
  const [localMaxPrice, setLocalMaxPrice] = useState(null);

  const currentMax = localMaxPrice !== null ? localMaxPrice : (priceRange?.max || 2500);

  // Debounce the actual filter change call
  const debouncedFilterChange = useMemo(
    () => debounce((value) => {
      if (onFilterChange) {
        onFilterChange({ type: 'maxPrice', value });
      }
    }, 300),
    [onFilterChange]
  );
  const [expandedSections, setExpandedSections] = useState({
    priceRange: true,
    sortBy: true,
    brand: true,
    rating: true,
    availability: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const handleChange = (type, value) => {
    if (onFilterChange) {
      if (type === 'priceRange') {
        const newMaxPrice = value[1];
        setLocalMaxPrice(newMaxPrice);
        debouncedFilterChange(newMaxPrice);
        return;
      }
      onFilterChange({ type, value });
    }
  };

  const handleReset = () => {
    setLocalMaxPrice(priceRange?.max || 2500);
    if (onFilterChange) {
      onFilterChange({ type: 'reset', value: null });
    }
  };

  return (
    <aside className="w-full flex-shrink-0">
      <div className="space-y-7 rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.08)] sm:p-6">
        <div className="flex items-center justify-between text-base font-semibold text-[#2E1A14]">
          <span>Filter By</span>
          <button
            type="button"
            className="cursor-pointer text-xs font-medium text-[#D85C6B] hover:text-[#4A2318] hover:underline"
            onClick={handleReset}
          >
            Reset All
          </button>
        </div>

        {/* <div className="space-y-2.5">
          <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search within catalogue..."
              className="w-full rounded-md border border-slate-200 bg-slate-50/80 pl-10 pr-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>
        </div> */}

        <div className="space-y-3.5">
          <button
            type="button"
            onClick={() => toggleSection('priceRange')}
            className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wide text-[#2E1A14] transition-colors hover:text-[#D85C6B]"
          >
            <span>Price Range</span>
            {/* <ChevronUp
              className={`h-4 w-4 text-slate-400 transition-transform ${expandedSections.priceRange ? '' : 'rotate-180'}`}
            /> */}
          </button>
          {expandedSections.priceRange && (
            <div className="space-y-3.5">
              <input
                type="range"
                min={0}
                max={priceRange?.max || 2500}
                value={currentMax}
                className="w-full cursor-pointer accent-[#D85C6B]"
                onChange={(e) => handleChange('priceRange', [0, Number(e.target.value)])}
              />
              <div className="flex items-center justify-between text-sm text-[#7A625A]">
                <div className="flex flex-col gap-1">
                  <span className="uppercase tracking-wide">Min Price</span>
                  <span className="rounded border border-[#E8D8CC] bg-[#FFFCF8] px-2.5 py-1.5 text-xs text-[#2E1A14]">
                    ₹0
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="uppercase tracking-wide">Max Price</span>
                  <span className="rounded border border-[#E8D8CC] bg-[#FFFCF8] px-2.5 py-1.5 text-xs text-[#2E1A14]">
                    ₹{currentMax?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3.5">
          <button
            type="button"
            onClick={() => toggleSection('sortBy')}
            className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wide text-[#2E1A14] transition-colors hover:text-[#D85C6B]"
          >
            <span>Sort By</span>
            {/* <ChevronUp
              className={`h-4 w-4 text-slate-400 transition-transform ${expandedSections.sortBy ? '' : 'rotate-180'}`}
            /> */}
          </button>
          {expandedSections.sortBy && (
            <div className="space-y-2.5 text-base text-[#2E1A14]">
              {SORT_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    checked={currentFilters?.sortBy === option.value}
                    className="h-4 w-4 border-[#E8D8CC] text-[#D85C6B] focus:ring-[#D85C6B]"
                    onChange={() => handleChange('sortBy', option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Filter by brand */}
        {/* <div className="space-y-3.5">
          <button
            type="button"
            onClick={() => toggleSection('brand')}
            className="flex w-full items-center justify-between text-sm font-semibold text-slate-500 uppercase tracking-wide hover:text-slate-700 transition-colors"
          >
            <span>Brand</span>
            <ChevronUp
              className={`h-4 w-4 text-slate-400 transition-transform ${expandedSections.brand ? '' : 'rotate-180'}`}
            />
          </button>
          {expandedSections.brand && (
            <div className="space-y-2.5 text-base text-slate-700 max-h-52 overflow-y-auto pr-1.5 scrollbar-none">
              {brands.map((brand, index) => (
                <label key={brand.name} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={index === 1}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => handleChange('brand', { name: brand.name, checked: e.target.checked })}
                  />
                  <span className="flex-1">
                    {brand.name} <span className="text-xs text-slate-400">({brand.count})</span>
                  </span>
                </label>
              ))}
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline mt-1"
              >
                Show More
              </button>
            </div>
          )}
        </div> */}

        {/* Filter by Rating  */}
        {/* <div className="space-y-3.5">
          <button
            type="button"
            onClick={() => toggleSection('rating')}
            className="flex w-full items-center justify-between text-sm font-semibold text-slate-500 uppercase tracking-wide hover:text-slate-700 transition-colors"
          >
            <span>Rating</span>
            <ChevronUp
              className={`h-4 w-4 text-slate-400 transition-transform ${expandedSections.rating ? '' : 'rotate-180'}`}
            />
          </button>
          {expandedSections.rating && (
            <div className="space-y-2.5 text-base text-slate-700">
              {[
                { stars: 5, count: 89 },
                { stars: 4, count: 45 },
                { stars: 3, count: 18 },
              ].map((item) => (
                <label key={item.stars} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => handleChange('rating', { stars: item.stars, checked: e.target.checked })}
                  />
                  <span className="flex items-center gap-1">
                    <span className="text-amber-400">
                      {'★'.repeat(item.stars)}
                      {item.stars < 5 && <span className="text-slate-300">{'★'.repeat(5 - item.stars)}</span>}
                    </span>
                    <span className="text-xs text-slate-400">({item.count})</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div> */}

        {/* Filter by availability */}
        {/* <div className="space-y-3.5">
          <button
            type="button"
            onClick={() => toggleSection('availability')}
            className="flex w-full items-center justify-between text-sm font-semibold text-slate-500 uppercase tracking-wide hover:text-slate-700 transition-colors"
          >
            <span>Availability</span>
            <ChevronUp
              className={`h-4 w-4 text-slate-400 transition-transform ${expandedSections.availability ? '' : 'rotate-180'}`}
            />
          </button>
          {expandedSections.availability && (
            <div className="space-y-2.5 text-base text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  onChange={(e) => handleChange('availability', { label: 'In Stock', checked: e.target.checked })}
                />
                <span>
                  In Stock <span className="text-xs text-slate-400">(134)</span>
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  onChange={(e) => handleChange('availability', { label: 'Pre-Order', checked: e.target.checked })}
                />
                <span>
                  Pre-Order <span className="text-xs text-slate-400">(22)</span>
                </span>
              </label>
            </div>
          )}
        </div> */}
      </div>
    </aside>
  );
}
