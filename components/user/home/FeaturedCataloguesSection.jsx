import { ArrowRight, Gift, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center justify-center rounded-md bg-[#3A211E] px-6 py-3 text-base font-medium text-[#FFF8ED] shadow-md shadow-[#3A211E]/15 transition-all hover:bg-[#C9963A] hover:text-[#3A211E] hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C9963A] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function FeaturedCataloguesSection({ title, subtitle, viewAllLabel, items }) {
  return (
    <section className="border-t border-[#C9963A] bg-[#FFF8ED]" aria-labelledby="featured-catalogues">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8">
          <div>
            <h2
              id="featured-catalogues"
              className="text-2xl font-semibold leading-tight text-[#3A211E] sm:text-3xl"
            >
              {title}
            </h2>
            <p className="mt-1 text-base text-[#3A211E]">{subtitle}</p>
          </div>
          <Link
            href="/catalogues"
            className="inline-flex cursor-pointer items-center gap-1.5 text-base font-semibold text-[#3A211E] hover:text-[#C9963A]"
          >
            {viewAllLabel}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 max-w-6xl mx-auto">
          {items.map((item) => (
            <article
              key={item.title}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-[#C9963A] bg-[#FFF8ED] shadow-md shadow-[#3A211E]/10 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:shadow-[#3A211E]/15"
            >
              <div className="relative h-40 overflow-hidden bg-[#FFF9F3] sm:h-44">
                {/* API image first, then legacy local category art, then plain fallback. */}
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
                ) : (
                  <div className="h-full w-full bg-[#C9963A]" />
                )}
                <div data-image-fallback className="hidden h-full w-full items-center justify-center bg-[#F6ECDD] text-[#C89A4B]">
                  <Gift className="h-10 w-10" aria-hidden="true" />
                </div>

                {item.category && item.category !== 'General' && (
                  <span className="absolute left-3 top-3 z-20 inline-flex rounded-full bg-[#3A211E] px-2.5 py-1 text-xs font-medium text-[#FFF8ED]">
                    {item.category}
                  </span>
                )}
                {item.badge && (
                  <span className="absolute right-3 top-3 z-20 inline-flex rounded-full bg-[#C9963A] px-2.5 py-1 text-xs font-medium text-[#3A211E] shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="flex-1 p-6 space-y-3.5">
                <div>
                  <h3 className="text-xl font-semibold leading-tight text-[#3A211E]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 text-base leading-relaxed text-[#3A211E]">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-[#3A211E]">
                  <span className="inline-flex items-center gap-1">
                    <Tag className="h-4 w-4" aria-hidden="true" />
                    <span>{item.itemsLabel}</span>
                  </span>
                </div>
              </div>
              <div className="px-5 pb-5">
                <Link href={item.slug ? `/catalogues/${item.slug}` : '/catalogues'} className="block">
                  <PrimaryButton className="w-full justify-center">
                    Browse Items
                    <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                  </PrimaryButton>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
