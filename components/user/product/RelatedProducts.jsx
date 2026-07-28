'use client';

import { Star, Heart } from 'lucide-react';
import Link from 'next/link';
import { useAddToCart } from '../../../hooks/useCart';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function RelatedProducts({ products }) {
  // products array: [{ id, badge, image, brand, title, rating, price, oldPrice }, ...]
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
        image: product.image,
      });
      toast.success('Item added to cart');
    } catch (error) {
      toast.error(error.message || 'Failed to add item to cart');
    } finally {
      setAddingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };
  
  return (
    <section className="bg-white py-10 sm:py-12 lg:py-14" aria-labelledby="related-products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 id="related-products" className="text-2xl sm:text-3xl font-bold text-slate-900">
              You May Also Like
            </h2>
            <p className="mt-1 text-base text-slate-600">Similar products based on this item</p>
          </div>
          <Link href="/catalogues" className="text-base font-medium text-blue-600 hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => {
            const badgeColor =
              product.badge === 'BESTSELLER'
                ? 'bg-emerald-500'
                : product.badge?.includes('%')
                  ? 'bg-rose-500'
                  : 'bg-slate-600';

            return (
              <article
                key={product.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="relative h-48 bg-slate-100">
                  <div className="h-full w-full bg-gradient-to-tr from-slate-200 via-slate-100 to-slate-300" />
                  {product.badge && (
                    <span
                      className={`absolute left-3 top-3 rounded-md ${badgeColor} px-2.5 py-1 text-xs font-semibold text-white`}
                    >
                      {product.badge}
                    </span>
                  )}
                  <button
                    type="button"
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-400 shadow-sm hover:text-rose-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex-1 p-4 space-y-2">
                  <p className="text-sm font-medium text-slate-500">{product.brand}</p>
                  <h3 className="text-base font-semibold text-slate-900 leading-tight">{product.title}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-slate-800">({product.rating})</span>
                  </div>
                </div>

                <div className="px-4 pb-4 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-slate-900">${product.price}</span>
                    {product.oldPrice && (
                      <span className="text-sm text-slate-400 line-through">${product.oldPrice}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={addingItems[product.id]}
                    className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110 hover:shadow-lg active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingItems[product.id] ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
