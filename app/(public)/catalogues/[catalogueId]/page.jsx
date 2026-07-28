'use client';

import { use, useMemo, useState } from 'react';
import UserNavbar from '../../../../components/user/home/UserNavbar';
import SiteFooter from '../../../../components/footer/SiteFooter';
import CatalogueHero from '../../../../components/user/catalogues/CatalogueHero';
import FiltersSidebar from '../../../../components/user/catalogues/FiltersSidebar';
import ProductsGrid from '../../../../components/user/catalogues/ProductsGrid';
import Breadcrumb from '../../../../components/user/product/Breadcrumb';
import { ShoppingBag } from 'lucide-react';
import { useCatalogueItems } from '../../../../hooks/useCatalogueItems';
import { useCatalogueById } from '../../../../hooks/useCatalogueById';
import { useCatalogues } from '../../../../hooks/useCatalogues';
import { buildBreadcrumb } from '@/utils/buildBreadcrumb';
import Link from 'next/link';

export default function CataloguePage({ params }) {
  const { catalogueId } = use(params);


  const [filters, setFilters] = useState({
    sortBy: 'newest',
    maxPrice: null
  });

  const { data: itemsData, isLoading: itemsLoading, error: itemsError, refetch: refetchItems } = useCatalogueItems(catalogueId, filters);

  // Fetch catalogue details using hook for consistent caching
  const { data: catalogueData, isLoading: catalogueLoading, error: catalogueError } = useCatalogueById(catalogueId);

  // Fetch all catalogues for "You May Also Like" section
  const { data: allCataloguesData } = useCatalogues();

  const isLoading = itemsLoading || catalogueLoading;
  const error = itemsError || catalogueError;

  const handleFilterChange = ({ type, value }) => {
    setFilters((prev) => {
      if (type === 'reset') {
        return { sortBy: 'newest', maxPrice: null };
      }
      return { ...prev, [type]: value };
    });
  };

  // Prepare "You May Also Like" catalogues (exclude current catalogue, take 3 others)
  const recommendedCatalogues = useMemo(() => {
    if (!allCataloguesData?.data || !catalogueId) {
      return [];
    }
    // Filter out current catalogue and take first 3
    const otherCatalogues = allCataloguesData.data
      .filter((cat) => cat.uuid !== catalogueId)
      .slice(0, 3)
      .map((cat) => ({
        category: cat.type || '',
        badge: cat.isPublished ? (cat.type === 'Books' ? 'Curated' : cat.type === 'Gaming' ? 'HOT' : null) : null,
        title: cat.catalogueName || cat.name || 'Untitled Catalogue',
        description: cat.description || 'Browse items in this catalogue.',
        itemsLabel: '0 items', // This would need to be fetched separately
        rating: '4.8',
        slug: cat.uuid,
      }));
    return otherCatalogues;
  }, [allCataloguesData, catalogueId]);

  // Prepare hero stats from items data (API returns totalItems for paginated count)
  const heroStats = itemsData?.data
    ? [
      {
        label: 'Total Items',
        value: String(itemsData.totalItems ?? itemsData.data.length),
        icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
      },
    ]
    : [];

  // Get catalogue info
  const catalogue = catalogueData?.data?.catalogue ?? catalogueData?.data;
  const catalogueTitle = catalogue?.catalogueName || catalogue?.name || 'Catalogue';

  const footerProps = {
    quickLinks: ['Home', 'Catalogues', 'Categories', 'Brands', 'About Us'],
    supportLinks: ['Help Center', 'Contact Us', 'FAQs', 'Shipping Info', 'Returns'],
    legalLinks: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer', 'Licenses'],
    socialLinks: [['Facebook', '#'], ['Twitter', '#'], ['LinkedIn', '#'], ['Instagram', '#']],
    copyright:"© 2026 chocotraill. All rights reserved."
    
  };

  const breadcrumbItems = useMemo(() => {
    if (!catalogue) return [{ label: 'Home', href: '/home' }, { label: 'Catalogues', href: '/catalogues' }];
  
    return buildBreadcrumb({ catalogue });
  }, [catalogue]);
  

  // No catalogue ID in URL (invalid route)
  if (!catalogueId) {
    return (
      <>
        <UserNavbar />
        <Breadcrumb items={[{ label: 'Home', href: '/home' }, { label: 'Catalogues', href: '/catalogues' }, { label: 'Not found', href: '' }]} />
        <main className="bg-slate-50 min-h-screen flex items-center justify-center px-4">
          <div className="text-center py-12">
            <p className="text-base text-slate-600">Catalogue not found.</p>
            <Link href="/catalogues" className="mt-4 inline-flex text-blue-600 hover:underline">Back to Catalogues</Link>
          </div>
        </main>
        <SiteFooter {...footerProps} />
      </>
    );
  }

  return (
    <>
      <UserNavbar />
      <Breadcrumb items={breadcrumbItems} />
      <main className="bg-slate-50 min-h-screen">
        {catalogue && (
          <CatalogueHero
            badge="Catalogue"
            status="Published"
            title={catalogueTitle}
            description={catalogue.description || 'Browse items in this catalogue'}
            stats={heroStats}
          />
        )}

        {isLoading && !catalogue && (
          <div className="bg-white border-b border-slate-200 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-32 bg-slate-200 animate-pulse rounded" />
            </div>
          </div>
        )}

        {error && !catalogue && (
          <div className="bg-white border-b border-slate-200 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12">
                <p className="text-base text-slate-600">
                  {error.message || 'Failed to load catalogue. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <section className="py-6 sm:py-8 lg:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sticky filters column on desktop */}
            <div className="hidden lg:block lg:w-80 xl:w-96 lg:sticky lg:top-24 self-start">
              <FiltersSidebar
                key={catalogueId}
                brands={[]}
                onFilterChange={handleFilterChange}
                priceRange={itemsData?.priceRange}
                currentFilters={filters}
              />
            </div>

            {/* Main products column */}
            <div className="w-full">
              {isLoading ? (
                <div className="rounded-2xl bg-white shadow-md border border-slate-200 p-8">
                  <div className="text-center py-12">
                    <p className="text-base text-slate-600">Loading items...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="rounded-2xl bg-white shadow-md border border-slate-200 p-8">
                  <div className="text-center py-12">
                    <p className="text-base text-slate-600">
                      {error.message || 'Failed to load items. Please try again.'}
                    </p>
                    <button
                      onClick={() => refetchItems()}
                      className="mt-4 text-blue-600 hover:underline"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <ProductsGrid products={itemsData?.data || []} catalogueId={catalogueId} parentName={catalogueTitle} />
              )}
            </div>
          </div>
        </section>


        {/* <section>
          {savedForLaterItems.length > 0 && (
            <section className="pb-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SavedForLater
                  items={savedForLaterItems}
                  onMoveToCart={handleMoveToCart}
                  onRemove={handleRemoveSaved}
                />
              </div>
            </section>
          )}
        </section> */}

      </main>

      <SiteFooter {...footerProps} />
    </>
  );
}
