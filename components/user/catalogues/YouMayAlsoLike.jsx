import { ArrowRight, Star, Tag } from 'lucide-react';
import Link from 'next/link';

export default function YouMayAlsoLike({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 border-t border-slate-200" aria-labelledby="you-may-also-like">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8">
          <div>
            <h2
              id="you-may-also-like"
              className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight"
            >
              You May Also Like
            </h2>
            <p className="mt-1 text-base text-slate-600">Similar catalogues based on your interests</p>
          </div>
          <Link
            href="/catalogues"
            className="inline-flex items-center gap-1.5 text-base font-medium text-blue-600 hover:underline"
          >
            View All
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {items.map((item) => (
            <article
              key={item.slug || item.title}
              className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="relative h-40 sm:h-44 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 to-slate-900/10" />
                <div className="h-full w-full bg-gradient-to-tr from-slate-700 via-slate-500 to-slate-300" />
                <span className="absolute left-3 top-3 inline-flex rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-900">
                  {item.category}
                </span>
                {item.badge && (
                  <span className={`absolute right-3 top-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium text-white ${
                    item.badge === 'Curated' ? 'bg-emerald-500' :
                    item.badge === 'HOT' ? 'bg-orange-500' :
                    item.badge === 'TRENDING' ? 'bg-orange-500' :
                    item.badge === 'NEW' ? 'bg-blue-500' :
                    'bg-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="flex-1 p-6 space-y-3.5">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-base text-slate-600 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Tag className="h-4 w-4" aria-hidden="true" />
                  <span>{item.itemsLabel}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400" fill="currentColor" aria-hidden="true" />
                    <span>{item.rating}</span>
                  </span>
                </div>
              </div>
              <div className="px-6 pb-6">
                <Link
                  href={item.slug ? `/catalogues/${item.slug}` : '/catalogues'}
                  className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-md hover:brightness-110 hover:shadow-lg active:scale-[0.98] transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  View Catalogue
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
