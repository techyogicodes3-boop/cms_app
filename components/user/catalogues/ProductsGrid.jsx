'use client';

import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatPrice } from '../../../utils/priceFormatter';
import { useAddToCart } from '../../../hooks/useCart';
import toast from 'react-hot-toast';
import ImageSlider from './ImageSlider';

export default function ProductsGrid({ products, catalogueId, parentName }) {
  const [activeFilters, setActiveFilters] = useState([]);
  const addToCart = useAddToCart();
  const [addingItems, setAddingItems] = useState({});

  const handleAddToCart = async (product) => {
    const productId = product?.id;
    if (!productId) {
      toast.error('Item information is missing');
      return;
    }

    setAddingItems((prev) => ({ ...prev, [productId]: true }));
    try {
      await addToCart.mutateAsync({
        catalogueItemId: productId,
        quantity: 1,
        name: product.title,
        priceAtAdd: product.price,
        image: product.imageUrl,
      });
      toast.success('Item added to cart');
      
      // Store catalogueId mapping for cart page
      if (typeof window !== 'undefined' && catalogueId) {
        const mapping = JSON.parse(localStorage.getItem('cartItemCatalogueMap') || '{}');
        mapping[productId] = catalogueId;
        localStorage.setItem('cartItemCatalogueMap', JSON.stringify(mapping));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add item to cart');
    } finally {
      setAddingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const removeFilter = (filter) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  // Transform backend data to match ProductsGrid format
  const transformedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return products.map((item) => ({
      id: item.uuid,
      title: item.name,
      description: item.validatedDescription || '',
      price: item.price,
      brand: '',
      rating: 4.5,
      reviews: 0,
      badge: null,
      imageUrls: Array.isArray(item.imageUrls) && item.imageUrls.length
        ? item.imageUrls
        : [item.imageUrl || item.image].filter(Boolean),
      imageUrl: item.imageUrls?.[0] || item.imageUrl || item.image || null,
    }));
  }, [products]);

  return (
    <section aria-labelledby="all-products-heading" className="w-full">
      <div className="overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] shadow-[0_10px_30px_rgba(43,20,14,0.08)]">
        <div className="flex flex-col gap-3 border-b border-[#E8D8CC] bg-[#FFFCF8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div>
            <h2
              id="all-products-heading"
              className="capitalize brand-serif text-2xl font-bold leading-tight text-[#2E1A14]"
            >
              {parentName ? `${parentName} Products` : 'Products'}
            </h2>
            <p className="mt-1 text-sm text-[#7A625A]">
              Showing {transformedProducts.length} {transformedProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
            {activeFilters.length > 0 && (
              <>
                <span className="text-slate-500">Active Filters:</span>
                {activeFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => removeFilter(filter)}
                    className="inline-flex items-center gap-1 rounded-full border border-[#E8D8CC] bg-[#F6ECDD] px-3 py-1 text-xs font-medium text-[#2E1A14] transition-opacity hover:opacity-80"
                  >
                    {filter}
                    <span className="ml-1">×</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="px-4 sm:px-5 pb-5 pt-5">
          {transformedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-base text-[#7A625A]">No child products available in this parent collection.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {transformedProducts.map((product) => {
              const badgeColor =
                product.badge === 'BESTSELLER'
                  ? 'bg-emerald-500'
                  : product.badge === 'NEW'
                    ? 'bg-orange-500'
                    : product.badge === 'PRE-ORDER'
                      ? 'bg-purple-500'
                      : product.badge === 'LIMITED'
                        ? 'bg-indigo-500'
                        : product.badge?.includes('%')
                          ? 'bg-rose-500'
                          : 'bg-slate-600';

              return (
                <article
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] shadow-[0_10px_30px_rgba(43,20,14,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C98A78]"
                >
                  <div className="relative h-44 overflow-hidden bg-[#FFF9F3] sm:h-48">
                    <ImageSlider images={product.imageUrls} alt={product.title} className="h-full w-full" />
                    {product.badge && (
                      <span
                        className={`absolute left-3 top-3 rounded ${badgeColor} px-2.5 py-1 text-[0.65rem] font-semibold text-white`}
                      >
                        {product.badge}
                      </span>
                    )}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#2B140E]/0 opacity-0 transition-all duration-200 group-hover:bg-[#2B140E]/20 group-hover:opacity-100">
                      <Link
                        href={catalogueId ? `/catalogues/${catalogueId}/items/${product.id}` : '#'}
                        className="pointer-events-auto inline-flex items-center gap-2 rounded-lg bg-[#FFFCF8] px-4 py-2 text-sm font-semibold text-[#2E1A14] shadow-md hover:bg-[#F6ECDD] focus:outline-none focus:ring-2 focus:ring-[#D85C6B]"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        <span>Quick View</span>
                      </Link>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1 p-5">
                    {product.brand && (
                    <p className="text-sm font-medium text-[#7A625A]">{product.brand}</p>
                    )}
                    <h3 title={product.title} className="line-clamp-2 h-12 text-base font-bold leading-snug text-[#2E1A14] sm:text-lg">
                      {product.title}
                    </h3>
                    {product.description && <p title={product.description} className="mt-1 line-clamp-2 h-10 text-sm leading-5 text-[#7A625A]">{product.description}</p>}
                    <div className="mt-2 flex items-center gap-1 text-[#C89A4B]">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star key={value} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                      ))}
                      <span className="ml-1 text-xs font-semibold text-[#7A625A]">4.8</span>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-0 space-y-3">
                  <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-[#2E1A14]">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    {/* Buttons row */}
                    <div className="flex items-center justify-between gap-2">
                      {/* Primary Add to Cart button */}
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        disabled={addingItems[product.id]}
                        className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#D85C6B] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#4A2318] focus:outline-none focus:ring-2 focus:ring-[#D85C6B] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                        <span>{addingItems[product.id] ? 'Adding...' : 'Add to Cart'}</span>
                      </button>

                      {/* Secondary quick-view icon button */}
                      <Link
                        href={catalogueId ? `/catalogues/${catalogueId}/items/${product.id}` : '#'}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] text-[#D85C6B] shadow-sm transition-all hover:bg-[#F6ECDD] focus:outline-none focus:ring-2 focus:ring-[#D85C6B]"
                        aria-label="Quick view"
                      >
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                      </Link>
                    </div>
                    
                  </div>
                </article>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
