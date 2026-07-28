'use client';

import UserNavbar from '../../../components/user/home/UserNavbar';
import SiteFooter from '../../../components/footer/SiteFooter';
import HomeCTASection from '../../../components/user/home/HomeCTASection';
import { useCatalogues } from '../../../hooks/useCatalogues';
import { CatalogueGridSkeleton } from '../../../components/common/LoadingSkeleton';
import { ErrorState } from '../../../components/common/ErrorState';
import { ArrowRight, Tag, Gift } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

function CataloguesLoading() {
  return (
    <>
      <UserNavbar />
      <main className="min-h-screen bg-brand-ivory">
        <div className="ui-container py-10">
          <div className="ui-card p-6 text-sm font-semibold text-text-secondary">Loading catalogues...</div>
        </div>
      </main>
    </>
  );
}

function CataloguesContent() {
  const { data: cataloguesData, isLoading, error, refetch } = useCatalogues();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';

  // ✅ FIX: All catalogues
  const allCatalogues = useMemo(() => {
    if (!cataloguesData?.data?.length) return [];

    return cataloguesData.data
      .filter((cat) => {
        if (!selectedCategory) return true;
        const category = cat.type && cat.type !== 'General' ? cat.type : cat.catalogueName || cat.name || '';
        return category === selectedCategory;
      })
      .map((cat) => ({
        category: cat.type || '',
        title: cat.catalogueName,                 // FIX
        description: cat.description,
        itemsLabel: `${cat.itemsCount} items`,    // FIX
        // rating: '4.5',
        slug: cat.uuid,
        image: cat.image || cat.imageUrl || cat.coverImage || cat.thumbnail || cat.imageUrls?.[0] || null,
      }));
  }, [cataloguesData, selectedCategory]);

  const totalCatalogueItems = useMemo(() => {
    if (!cataloguesData?.data?.length) return 0;
    return cataloguesData.data.reduce((sum, catalogue) => sum + Number(catalogue.itemsCount || 0), 0);
  }, [cataloguesData]);

  return (
    <>
      <UserNavbar />
      <main className="min-h-screen bg-brand-ivory">
        {/* Header Section */}
        <section className="border-b border-border-light bg-white py-10">
          <div className="ui-container">
            <div className="max-w-3xl">
              <span className="ui-badge-premium">
                <Gift className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Premium gifting collections
              </span>
              <h1 className="mt-4 text-3xl font-bold text-text-primary sm:text-4xl">All Catalogues</h1>
              <p className="mt-2 text-base leading-7 text-text-secondary">
                Browse curated gifts, chocolates, hampers, festive boxes, and special-occasion collections.
              </p>
            </div>
          </div>
        </section>

        {/* Catalogues Grid Section */}
        <section className="overflow-x-hidden bg-brand-ivory" aria-labelledby="all-catalogues">
          <div className="ui-container py-8 sm:py-10 lg:py-12">
            <div className="mb-6 rounded-[18px] border border-border-light bg-white p-5 shadow-[0_2px_8px_rgba(58,33,30,0.06)] sm:flex sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="all-catalogues"
                  className="text-2xl font-semibold leading-tight text-text-primary sm:text-3xl"
                >
                  Explore Collections
                </h2>
                <p className="mt-1 text-base text-text-secondary">
                  {isLoading ? 'Loading catalogues...' : error ? 'Failed to load catalogues' : `Showing ${allCatalogues.length} ${allCatalogues.length === 1 ? 'catalogue' : 'catalogues'}${selectedCategory ? ` in ${selectedCategory}` : ''}`}
                </p>
              </div>
              {selectedCategory && (
                <Link href="/catalogues" className="mt-4 inline-flex text-sm font-semibold text-brand-cocoa hover:text-brand-gold sm:mt-0">
                  View all catalogues
                </Link>
              )}
            </div>

            {isLoading && (
              <CatalogueGridSkeleton count={6} />
            )}

            {error && (
              <ErrorState
                message={error.message || 'Failed to load catalogues. Please try again.'}
                onRetry={() => refetch()}
              />
            )}

            {!isLoading && !error && (
              <>
                {allCatalogues.length === 0 ? (
                  <div className="ui-card mx-auto max-w-lg p-8 text-center">
                    <Gift className="mx-auto h-12 w-12 text-brand-gold" aria-hidden="true" />
                    <h3 className="mt-4 text-xl font-bold text-text-primary">No catalogues available</h3>
                    <p className="mt-2 text-sm text-text-secondary">New gifting collections will appear here once published.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {allCatalogues.map((item) => (
                      <article
                        key={item.title}
                        className="ui-card-interactive flex flex-col overflow-hidden"
                      >
                        <div className="group relative aspect-[4/3] overflow-hidden bg-[#FFF9F3]">

                          {/* Category Image */}
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-contain p-2"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                const next = e.target.nextElementSibling;
                                if (next) {
                                  next.classList.remove('hidden');
                                  next.classList.add('flex');
                                }
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
                            <div className="flex h-full w-full items-center justify-center bg-surface-soft text-brand-gold">
                              <Gift className="h-10 w-10" aria-hidden="true" />
                            </div>
                          )}
                          <div className="hidden h-full w-full items-center justify-center bg-surface-soft text-brand-gold">
                            <Gift className="h-10 w-10" aria-hidden="true" />
                          </div>

                          {item.category && item.category !== 'General' && (
                            <span className="absolute left-3 top-3 z-20 inline-flex rounded-full bg-brand-espresso px-3 py-1.5 text-xs font-semibold text-white">
                              {item.category}
                            </span>
                          )}
                          {item.badge && (
                            <span className="absolute right-3 top-3 z-20 inline-flex rounded-full bg-warning-bg px-2.5 py-1 text-xs font-semibold text-brand-espresso shadow-sm ring-1 ring-brand-gold/40">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <div>
                            <h3 className="text-lg font-semibold leading-tight text-text-primary">
                              {item.title}
                            </h3>
                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-text-secondary">
                              {item.description}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
                            <span className="inline-flex items-center gap-1.5">
                              <Tag className="h-4 w-4" aria-hidden="true" />
                              <span>{item.itemsLabel}</span>
                            </span>
                          </div>
                        </div>
                        <div className="px-5 pb-5">
                          <Link
                            href={item.slug ? `/catalogues/${item.slug}` : '/catalogues'}
                            className="ui-btn-primary w-full"
                          >
                            Browse Items
                            <ArrowRight className="ml-1.5 h-5 w-5" aria-hidden="true" />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <HomeCTASection
          stats={[
            { value: cataloguesData?.data?.length?.toLocaleString() || '0', label: 'Catalogues' },
            { value: totalCatalogueItems.toLocaleString(), label: 'Items' },
          ]}
        />
      </main>

      <SiteFooter
        quickLinks={['Home', 'Catalogues', 'Categories', 'Brands', 'About Us']}
        supportLinks={['Help Center', 'Contact Us', 'FAQs', 'Shipping Info', 'Returns']}
        legalLinks={['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer', 'Licenses']}
        socialLinks={[
          ['Facebook', '#'],
          ['Twitter', '#'],
          ['LinkedIn', '#'],
          ['Instagram', '#'],
        ]}
        copyright="© 2026 chocotraill. All rights reserved."
      />
    </>
  );
}

export default function CataloguesPage() {
  return (
    <Suspense fallback={<CataloguesLoading />}>
      <CataloguesContent />
    </Suspense>
  );
}
