'use client';

import {
  Award,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Gift,
  HeartHandshake,
  PackageCheck,
} from 'lucide-react';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCatalogueImage } from '../../../utils/imageHelpers';

const benefits = [
  {
    title: 'Premium Quality',
    text: 'Finest ingredients',
    icon: Award,
  },
  {
    title: 'Beautifully Packed',
    text: 'Gift-ready packaging',
    icon: BadgeCheck,
  },
  {
    title: 'Perfect for Every Occasion',
    text: 'Birthdays, anniversaries & more',
    icon: Gift,
  },
  {
    title: 'Made with Love',
    text: 'Crafted to make you smile',
    icon: HeartHandshake,
  },
];

const categoryAssetMap = {
  'Beauty & Personal Care': '/images/categories/beauty_personal_care.png',
  Cars: '/images/categories/cars.png',
  'Fashion & Apparel': '/images/categories/fashion_apparel.png',
  'Gaming & Entertainment': '/images/categories/gaming_entertainment.png',
  'Home & Living': '/images/categories/home_living.png',
};

function normalizeCategoryName(catalogue) {
  const category = catalogue?.type || catalogue?.category || catalogue?.catalogueType;
  const name = catalogue?.catalogueName || catalogue?.name;
  const value = category && category !== 'General' ? category : name;
  return value?.trim() || '';
}

function getItemCount(catalogues) {
  return catalogues.reduce((sum, catalogue) => sum + Number(catalogue.itemsCount || 0), 0);
}

export default function BrowseCategories({ catalogues = [] }) {
  const router = useRouter();
  const sliderRef = useRef(null);

  const categories = useMemo(() => {
    const groups = new Map();

    catalogues.forEach((catalogue) => {
      const label = normalizeCategoryName(catalogue);
      if (!label) return;

      const current = groups.get(label) || {
        label,
        catalogues: [],
        image: null,
      };

      current.catalogues.push(catalogue);
      current.image =
        current.image ||
        getCatalogueImage(catalogue) ||
        categoryAssetMap[label] ||
        null;

      groups.set(label, current);
    });

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        count: group.catalogues.length,
        itemCount: getItemCount(group.catalogues),
        href:
          group.catalogues.length === 1
            ? `/catalogues/${group.catalogues[0].uuid || group.catalogues[0].id}`
            : `/catalogues?category=${encodeURIComponent(group.label)}`,
      }))
      .slice(0, 8);
  }, [catalogues]);

  if (categories.length === 0) return null;

  const scrollCategories = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = Math.min(slider.clientWidth * 0.8, 420);
    slider.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="border-y border-[#E8D8CC] bg-[#FFF9F3]" aria-labelledby="shop-by-category">
      <div className="border-b border-[#E8D8CC]/80 bg-[#FFFCF8]/80">
        <div className="scrollbar-none mx-auto flex max-w-7xl snap-x gap-5 overflow-x-auto px-4 py-5 scroll-smooth sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-6 lg:grid-cols-4 lg:px-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="flex min-w-[245px] snap-start items-center justify-start gap-4 text-left sm:min-w-0">
                <Icon className="h-9 w-9 shrink-0 stroke-[1.8] text-[#B27A2E]" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold text-[#3A211E]">{benefit.title}</h3>
                  <p className="mt-1 text-xs font-medium text-[#7A625A]">{benefit.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1 text-center">
          <h2 id="shop-by-category" className="brand-serif text-3xl font-bold leading-none text-[#3A211E] sm:text-4xl">
            Shop by Category
          </h2>
          <div className="mx-auto mt-2 flex w-16 items-center justify-center text-[#B27A2E]" aria-hidden="true">
            <span className="h-px w-5 bg-[#B27A2E]/60" />
            <span className="mx-1.5 brand-serif text-xl leading-none">~</span>
            <span className="h-px w-5 bg-[#B27A2E]/60" />
          </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => scrollCategories('prev')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E8D8CC] bg-[#FFFCF8] text-[#4A2318] shadow-sm transition hover:border-[#B27A2E] hover:text-[#B27A2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B27A2E]"
              aria-label="Previous categories"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollCategories('next')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E8D8CC] bg-[#FFFCF8] text-[#4A2318] shadow-sm transition hover:border-[#B27A2E] hover:text-[#B27A2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B27A2E]"
              aria-label="Next categories"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="scrollbar-none mt-7 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-2 scroll-smooth sm:gap-8 lg:justify-center lg:overflow-visible"
        >
          {categories.map((category) => (
            <button
              key={category.label}
              type="button"
              onClick={() => router.push(category.href)}
              className="group flex min-w-[104px] shrink-0 snap-start cursor-pointer flex-col items-center text-center sm:min-w-[120px]"
              title={`${category.label}${category.itemCount ? `, ${category.itemCount} items` : ''}`}
            >
              <span className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[#E8D8CC] bg-[#F6ECDD] shadow-[0_10px_24px_rgba(58,33,30,0.10)] transition group-hover:-translate-y-0.5 group-hover:border-[#B27A2E] sm:h-28 sm:w-28">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.label}
                    className="h-full w-full object-contain p-2"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                      const fallback = event.currentTarget.nextElementSibling;
                      fallback?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <span className={`flex h-full w-full items-center justify-center bg-[#F6ECDD] text-[#B27A2E] ${category.image ? 'hidden' : ''}`}>
                  <PackageCheck className="h-9 w-9" aria-hidden="true" />
                </span>
              </span>
              <span className="mt-4 max-w-[120px] text-sm font-bold leading-tight text-[#3A211E]">
                {category.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
