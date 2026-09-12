'use client';

import { use, useMemo } from 'react';
import FeaturedCataloguesSection from '../../../../../../components/user/home/FeaturedCataloguesSection';
import UserNavbar from '../../../../../../components/user/home/UserNavbar';
import SiteFooter from '../../../../../../components/footer/SiteFooter';
import Breadcrumb from '../../../../../../components/user/product/Breadcrumb';
import ProductImageGallery from '../../../../../../components/user/product/ProductImageGallery';
import ProductInfo from '../../../../../../components/user/product/ProductInfo';
import ProductTabs from '../../../../../../components/user/product/ProductTabs';
import DescriptionTab from '../../../../../../components/user/product/DescriptionTab';
import ProductReviews from '../../../../../../components/user/product/ProductReviews';
import { useItemDetails } from '../../../../../../hooks/useItemDetails';
import { useCatalogues } from '../../../../../../hooks/useCatalogues';
import { useCatalogueById } from '../../../../../../hooks/useCatalogueById';
import { formatPrice } from '../../../../../../utils/priceFormatter';
import { ErrorState } from '../../../../../../components/common/ErrorState';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { buildBreadcrumb } from '@/utils/buildBreadcrumb';
export default function ItemDetailPage({ params }) {
  const { catalogueId, itemId } = use(params);

  const { data, isLoading, error, refetch } =
    useItemDetails(catalogueId, itemId);

  const { data: cataloguesData } = useCatalogues();
  const { data: catalogueData } = useCatalogueById(catalogueId);

  const item = data?.data;
  const catalogue = catalogueData?.data;

  /* ---------------- Breadcrumb ---------------- */
  const breadcrumbItems = useMemo(() => {
    if (!catalogue) return [];
    return buildBreadcrumb({ catalogue, item });
  }, [catalogue, item]);
  
  

  /* ---------------- Dynamic Product Images ---------------- */
  const productImages = useMemo(() => {
    if (!item) return [];

    const urls = Array.isArray(item.imageUrls) && item.imageUrls.length > 0
      ? item.imageUrls
      : [item.imageUrl || item.image].filter(Boolean);

    if (urls.length > 0) {
      return [...new Set(urls)].slice(0, 10).map((url, index) => ({
        id: index,
        url,
        alt: `${item.name} image ${index + 1}`,
      }));
    }

    return [];
  }, [item]);

  /* ---------------- Featured Catalogues ---------------- */
  const featuredCatalogues = useMemo(() => {
    if (!cataloguesData?.data?.length) return [];

    return cataloguesData.data.slice(0, 3).map((cat) => ({
      category: cat.type || '',
      badge: cat.isPublished ? 'Published' : null,
      title: cat.catalogueName || cat.name || 'Untitled Catalogue',
      description: cat.description || 'Explore this curated collection.',
      itemsLabel: '0 items',
      rating: '4.8',
      slug: cat.uuid,
      image: cat.image || cat.imageUrl || cat.coverImage || null,
      images: Array.isArray(cat.imageUrls) && cat.imageUrls.length
        ? cat.imageUrls
        : [cat.image || cat.imageUrl || cat.coverImage].filter(Boolean),
    }));
  }, [cataloguesData]);

  /* ---------------- Loading ---------------- */
  if (isLoading) {
    return (
      <>
        <UserNavbar />
        <Breadcrumb items={breadcrumbItems} />
        <main className="min-h-screen bg-slate-50" />
        <SiteFooter />
      </>
    );
  }

  /* ---------------- Error ---------------- */
  if (error) {
    return (
      <>
        <UserNavbar />
        <Breadcrumb items={breadcrumbItems} />
        <ErrorState
          message={error.message || 'Failed to load item'}
          onRetry={refetch}
        />
        <SiteFooter />
      </>
    );
  }

  /* ---------------- Not Found ---------------- */
  if (!item) {
    return (
      <>
        <UserNavbar />
        <Breadcrumb items={breadcrumbItems} />
        <div className="text-center py-16">
          <p>Item not found</p>
          <Link
            href={`/catalogues/${catalogueId}`}
            className="text-blue-600 underline"
          >
            Back to Catalogue
          </Link>
        </div>
        <SiteFooter />
      </>
    );
  }

  

  /* ---------------- Product Info ---------------- */
  const productData = {
    title: item.name,
    description: item.validatedDescription || item.name,
    price: formatPrice(item.price),
    image: productImages[0]?.url || null,
    inStock: item.stock > 0,
    availableUnits: item.stock,
    shippingTime: 'Ships within 24–48 hours',
  };

  const descriptionSections = item.validatedDescription
    ? [
        {
          heading: 'Product Description',
          content: item.validatedDescription,
        },
      ]
    : [];

  return (
    <>
      <UserNavbar />
      {catalogue && item && <Breadcrumb items={breadcrumbItems} />}

      <main className="bg-slate-50">
        {/* Product Section */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProductImageGallery
              images={productImages}
              productTitle={item.name}
            />
            <ProductInfo
              product={productData}
              itemId={item.uuid}
              catalogueId={catalogueId}
            />
          </div>
        </section>

        {/* Tabs */}
        {/* <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <ProductTabs>
              <DescriptionTab
                aiEnhanced={!!item.validatedDescription}
                content={item.validatedDescription || item.name}
                sections={descriptionSections}
              />
            </ProductTabs>
          </div>
        </section> */}

        <ProductReviews productId={item.uuid} productName={item.name} />
      </main>

      <SiteFooter />
    </>
  );
}
