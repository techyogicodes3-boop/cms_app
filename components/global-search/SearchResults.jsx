'use client';

import Link from 'next/link';
import { Package, Folder, AlertCircle, Search } from 'lucide-react';

export default function SearchResults({ results, isSearching, error, query, onResultClick }) {
  if (isSearching) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#3A211E] border-r-transparent" />
        <p className="mt-4 text-sm text-[#3A211E]">Searching...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-[#C9963A]" />
        <p className="text-sm text-[#3A211E]">{error}</p>
      </div>
    );
  }

  if (!results || (results.catalogues.length === 0 && results.items.length === 0)) {
    return (
      <div className="p-8 text-center">
        <Search className="mx-auto mb-4 h-12 w-12 text-[#C9963A]" />
        <p className="text-sm text-[#3A211E]">No results found for &quot;{query}&quot;</p>
        <p className="mt-2 text-xs text-[#3A211E]">Try different keywords</p>
      </div>
    );
  }

  return (
    <div className="py-2">
      {/* Catalogues Section */}
      {results.catalogues.length > 0 && (
        <div className="mb-4">
          <div className="border-b border-[#C9963A] bg-[#FFF8ED] px-4 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#3A211E]">
              Catalogues ({results.catalogues.length})
            </h3>
          </div>
          <div className="px-2 py-2">
            {results.catalogues.map((catalogue) => (
              <Link
                key={catalogue.uuid}
                href={`/catalogues/${catalogue.uuid}`}
                onClick={onResultClick}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-[#C9963A]"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#3A211E]">
                  <Folder className="h-5 w-5 text-[#FFF8ED]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-[#3A211E]">
                    {catalogue.name}
                  </p>
                  {catalogue.description && (
                    <p className="truncate text-xs text-[#3A211E]">
                      {catalogue.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Items Section */}
      {results.items.length > 0 && (
        <div>
          <div className="border-b border-[#C9963A] bg-[#FFF8ED] px-4 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#3A211E]">
              Items ({results.items.length})
            </h3>
          </div>
          <div className="px-2 py-2">
            {results.items.map((item) => (
              <Link
                key={item.uuid}
                href={`/catalogues/${item.catalogueId}/items/${item.uuid}`}
                onClick={onResultClick}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-[#C9963A]"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#3A211E]">
                  <Package className="h-5 w-5 text-[#FFF8ED]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-[#3A211E]">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.price && (
                      <p className="text-sm font-bold text-[#3A211E]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    )}
                    {item.description && (
                      <p className="truncate text-xs text-[#3A211E]">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
