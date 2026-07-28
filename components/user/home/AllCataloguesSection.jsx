'use client';

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Gift,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';

export default function AllCataloguesSection({
  title,
  subtitle,
  items,
  itemsPerPage = 6,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const activePage = Math.min(currentPage, totalPages || 1);

  const paginatedItems = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  }, [items, activePage, itemsPerPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <section className="border-t border-[#C9963A] bg-[#FFF8ED]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-[#3A211E]">
            {title}
          </h2>
          <p className="mt-1 text-[#3A211E]">{subtitle}</p>
        </div>

        {/* Empty State */}
        {paginatedItems.length === 0 ? (
          <p className="py-12 text-center text-[#3A211E]">
            No catalogues available.
          </p>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((item) => (
                <article
                  key={item.slug}
                  className="group cursor-pointer overflow-hidden rounded-lg border border-[#C9963A] bg-[#FFF8ED] shadow-md shadow-[#3A211E]/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#3A211E]/15"
                >
                  <div className="relative h-40 overflow-hidden bg-[#FFF9F3]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain p-2"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                          const fallback = event.currentTarget.parentElement?.querySelector('[data-image-fallback]');
                          fallback?.classList.remove('hidden');
                        }}
                      />
                    ) : ['Beauty & Personal Care', 'Fashion & Apparel', 'Gaming & Entertainment', 'Home & Living', 'Cars'].includes(item.category) ? (
                      <Image
                        src={`/images/categories/${item.category === 'Beauty & Personal Care' ? 'beauty_personal_care' :
                          item.category === 'Fashion & Apparel' ? 'fashion_apparel' :
                            item.category === 'Gaming & Entertainment' ? 'gaming_entertainment' :
                              item.category === 'Home & Living' ? 'home_living' :
                                'cars'
                          }.png`}
                        alt={item.category}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                        className="object-contain p-2"
                      />
                    ) : null}

                    <div data-image-fallback className={`h-full w-full items-center justify-center bg-[#F6ECDD] text-[#C89A4B] ${item.image ? 'hidden' : 'flex'}`}>
                      <Gift className="h-10 w-10" aria-hidden="true" />
                    </div>

                    {item.category && item.category !== 'General' && (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-[#3A211E] px-3 py-1 text-sm text-[#FFF8ED]">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-[#3A211E]">
                      {item.title}
                    </h3>
                    <p className="line-clamp-3 text-[#3A211E]">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1 text-sm text-[#3A211E]">
                      <Tag className="w-4 h-4" />
                      {item.itemsLabel}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="px-6 pb-6">
                    <Link
                      href={`/catalogues/${item.slug}`}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#3A211E] py-3 text-[#FFF8ED] transition hover:bg-[#C9963A] hover:text-[#3A211E]"
                    >
                      Browse Items
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => goToPage(activePage - 1)}
                  disabled={activePage === 1}
                  className="cursor-pointer rounded-md border border-[#C9963A] bg-[#FFF8ED] p-2 text-[#3A211E] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 rounded-md border text-sm font-medium
                        ${page === activePage
                          ? 'border-[#3A211E] bg-[#3A211E] text-[#FFF8ED]'
                          : 'cursor-pointer border-[#C9963A] bg-[#FFF8ED] text-[#3A211E] hover:bg-[#C9963A]'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(activePage + 1)}
                  disabled={activePage === totalPages}
                  className="cursor-pointer rounded-md border border-[#C9963A] bg-[#FFF8ED] p-2 text-[#3A211E] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
