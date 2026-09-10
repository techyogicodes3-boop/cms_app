'use client';

import { Heart, Star, Eye, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '../../../utils/priceFormatter';
import { useAddToCart } from '../../../hooks/useCart';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ImageSlider from './ImageSlider';

/**
 * Item Card Component
 * Displays a single item from the API
 */
export default function ItemCard({ item, catalogueId }) {
  const addToCart = useAddToCart();
  const [isAdding, setIsAdding] = useState(false);
  const images = Array.isArray(item.imageUrls) && item.imageUrls.length
    ? item.imageUrls
    : [item.image || item.imageUrl || item.thumbnail].filter(Boolean);

  const handleAddToCart = async () => {
    if (!item?.uuid) {
      toast.error('Item information is missing');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart.mutateAsync({
        catalogueItemId: item.uuid,
        quantity: 1,
      });
      toast.success('Item added to cart');
      
      // Store catalogueId mapping for cart page
      if (typeof window !== 'undefined' && catalogueId) {
        const mapping = JSON.parse(localStorage.getItem('cartItemCatalogueMap') || '{}');
        mapping[item.uuid] = catalogueId;
        localStorage.setItem('cartItemCatalogueMap', JSON.stringify(mapping));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };
  // Truncate description if too long
  const shortDescription = item.validatedDescription
    ? item.validatedDescription.length > 100
      ? item.validatedDescription.substring(0, 100) + '...'
      : item.validatedDescription
    : '';

  return (
    <article className="group flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 overflow-hidden">
      <div className="relative h-44 overflow-hidden bg-[#FFF9F3] sm:h-48">
        {/* Item Image */}
        <ImageSlider images={images} alt={item.name || 'Product'} className="h-full w-full" />

        {/* Wishlist button */}
        <button
          type="button"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm text-slate-400 shadow-sm hover:text-rose-500 hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Quick View overlay on hover */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-slate-900/8 transition-all duration-200">
          <Link
            href={`/catalogues/${catalogueId}/items/${item.uuid}`}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-md hover:shadow-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            <span>Quick View</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-2.5">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
          {item.name}
        </h3>
        {shortDescription && (
          <p className="mt-1 text-sm sm:text-base text-slate-500 leading-relaxed line-clamp-2">
            {shortDescription}
          </p>
        )}
      </div>

      <div className="px-5 pb-5 pt-2 space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-slate-900">
            {formatPrice(item.price)}
          </span>
        </div>
        {/* Buttons row */}
        <div className="flex items-center justify-between gap-2">
          {/* Primary Add to Cart button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm sm:text-base font-semibold text-white shadow-md hover:brightness-110 hover:shadow-lg active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
          </button>

          {/* Secondary view details button */}
          <Link
            href={`/catalogues/${catalogueId}/items/${item.uuid}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="View details"
          >
            <Eye className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
