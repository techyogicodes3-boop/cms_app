'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useAddToCart } from '../../../hooks/useCart';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function FrequentlyBoughtTogether({ products }) {
  const addToCart = useAddToCart();
  const [addingId, setAddingId] = useState(null);

  const handleAddToCart = async (product) => {
    if (!product?.id) return;
    setAddingId(product.id);
    try {
      await addToCart.mutateAsync({ catalogueItemId: product.id, quantity: 1 });
      toast.success('Item added to cart');

      if (typeof window !== 'undefined' && product.catalogueId) {
        const mapping = JSON.parse(
          localStorage.getItem('cartItemCatalogueMap') || '{}'
        );
        mapping[product.id] = product.catalogueId;
        localStorage.setItem(
          'cartItemCatalogueMap',
          JSON.stringify(mapping)
        );
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to add to cart');
    } finally {
      setAddingId(null);
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section
      className="bg-white py-10 sm:py-12"
      aria-labelledby="frequently-bought"
    >
      <div className="ui-container">
        <div className="mb-6">
          <h2
            id="frequently-bought"
            className="text-2xl font-bold text-text-primary sm:text-3xl"
          >
            Frequently Bought Together
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            Complete your purchase with these popular items
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => {
            const badgeColor =
              product.badge === 'BESTSELLER'
                ? 'bg-success'
                : product.badge?.includes('%')
                ? 'bg-error'
                : 'bg-brand-cocoa';

            const productLink =
              product.catalogueId && product.id
                ? `/catalogues/${product.catalogueId}/items/${product.id}`
                : null;

            return (
              <article
                key={product.id}
                className="ui-card-interactive flex cursor-pointer flex-col overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-soft">
                  <div
                    className="absolute inset-0 bg-surface-soft"
                    aria-hidden="true"
                  />
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="absolute inset-0 h-full w-full object-contain p-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  {product.badge && (
                    <span
                      className={`absolute left-3 top-3 rounded-md ${badgeColor} px-2.5 py-1 text-xs font-semibold text-white`}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4 space-y-2">
                  {productLink ? (
                    <Link href={productLink} className="block group">
                      <h3 className="line-clamp-2 text-base font-semibold leading-tight text-text-primary group-hover:text-brand-cocoa">
                        {product.title}
                      </h3>
                    </Link>
                  ) : (
                    <h3 className="line-clamp-2 text-base font-semibold leading-tight text-text-primary">
                      {product.title}
                    </h3>
                  )}

                  {product.description && (
                    <p className="line-clamp-2 text-sm leading-snug text-text-secondary">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 pb-4 space-y-3">
                  <div className="text-xl font-bold text-brand-cocoa">
                    ₹{product.price}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={addingId === product.id}
                    className="ui-btn-primary w-full rounded-full px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                    {addingId === product.id ? 'Adding...' : 'Add to Cart'}
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
