'use client';

import {
  ShoppingCart,
  CheckCircle,
  Truck,
  Shield,
  Headphones,
} from 'lucide-react';
import { useState } from 'react';
import { useAddToCart } from '../../../hooks/useCart';
import toast from 'react-hot-toast';

export default function ProductInfo({ product, itemId, catalogueId }) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = useAddToCart();

  /* ================= STOCK LOGIC ================= */
  const availableUnits = product.availableUnits ?? 0;
  const isOutOfStock = availableUnits <= 0;
  /* =============================================== */

  const handleAddToCart = async () => {
    if (!itemId || isOutOfStock) return;

    setIsAdding(true);
    try {
      await addToCart.mutateAsync({
        catalogueItemId: itemId,
        quantity,
        name: product.title,
        priceAtAdd: Number(String(product.price || '').replace(/[₹,$]/g, '').replace(/,/g, '')) || 0,
        image: product.image,
      });

      toast.success('Item added to cart');

      if (typeof window !== 'undefined' && catalogueId) {
        const mapping = JSON.parse(
          localStorage.getItem('cartItemCatalogueMap') || '{}'
        );
        mapping[itemId] = catalogueId;
        localStorage.setItem(
          'cartItemCatalogueMap',
          JSON.stringify(mapping)
        );
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const badges = product.badges || [];
  const colors = product.colors || [];
  const storageOptions = product.storageOptions || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <span
              key={index}
              className="rounded-md bg-slate-700 px-3 py-1 text-sm font-semibold text-white"
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}

      {/* Brand */}
      {product.brand && <p className="text-sm font-medium text-[#7A625A]">{product.brand}</p>}

      {/* Title */}
      <h1 className="brand-serif text-4xl font-bold text-[#2E1A14]">
        {product.title}
      </h1>

      {/* Description */}
      <p className="text-base leading-7 text-[#7A625A]">
        {product.description}
      </p>

      {/* Price */}
      <div className="border-y border-[#E8D8CC] py-4">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-[#2E1A14]">
            {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-xl line-through text-slate-400">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Color</h3>
          <div className="flex gap-2">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(index)}
                className={`h-10 w-10 rounded-full border-2 ${
                  selectedColor === index
                    ? 'border-[#D85C6B]'
                    : 'border-[#E8D8CC]'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Storage */}
      {storageOptions.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Storage</h3>
          <div className="flex gap-2">
            {storageOptions.map((opt, index) => (
              <button
                key={index}
                onClick={() => setSelectedStorage(index)}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  selectedStorage === index
                    ? 'border-[#D85C6B] bg-[#E9B8B0]/45'
                    : 'border-[#E8D8CC]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <h3 className="font-semibold">Quantity</h3>

          {isOutOfStock ? (
            <span className="font-semibold text-[#D95C5C]">
              Out of Stock
            </span>
          ) : (
            <span className="text-[#6D9B72]">
              Available: {availableUnits}
            </span>
          )}
        </div>

        <div className="inline-flex items-center rounded-lg border border-[#E8D8CC] bg-[#FFFCF8]">
          <button
            disabled={isOutOfStock}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="cursor-pointer px-4 py-2 disabled:opacity-40"
          >
            −
          </button>

          <input
            type="number"
            value={quantity}
            disabled={isOutOfStock}
            onChange={(e) =>
              setQuantity(
                Math.min(
                  availableUnits,
                  Math.max(1, Number(e.target.value))
                )
              )
            }
            className="w-16 border-x border-[#E8D8CC] bg-transparent text-center disabled:bg-[#F6ECDD]"
          />

          <button
            disabled={isOutOfStock}
            onClick={() =>
              setQuantity((q) => Math.min(availableUnits, q + 1))
            }
            className="px-4 py-2 cursor-pointer disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <div>
        {isOutOfStock ? (
          <button
            disabled
            className="w-full rounded-lg bg-[#E8D8CC] py-3 font-semibold text-[#7A625A]"
          >
            Out of Stock
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#D85C6B] py-3 font-semibold text-white hover:bg-[#4A2318]"
          >
            <ShoppingCart className="h-5 w-5" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        )}
      </div>

      {/* Stock Status */}
      <div
        className={`flex items-center gap-3 rounded-lg border p-3 ${
          isOutOfStock
            ? 'border-[#D95C5C]/30 bg-[#FFF0F0]'
            : 'border-[#6D9B72]/30 bg-[#EDF7EE]'
        }`}
      >
        <CheckCircle
          className={`h-5 w-5 ${
            isOutOfStock ? 'text-[#D95C5C]' : 'text-[#6D9B72]'
          }`}
        />
        <div>
          <p className="font-semibold">
            {isOutOfStock ? 'Out of Stock' : 'In Stock'}
          </p>
          {!isOutOfStock && (
            <p className="text-xs text-[#7A625A]">
              Ships within 24–48 hours
            </p>
          )}
        </div>
      </div>

      {/* Extra Info */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        <div className="flex flex-col items-center gap-1 rounded-lg bg-[#F6ECDD] p-3">
          <Shield className="h-6 w-6 text-[#C98A78]" />
          <p className="text-center text-xs">Premium Quality</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-lg bg-[#F6ECDD] p-3">
          <Truck className="h-6 w-6 text-[#C98A78]" />
          <p className="text-center text-xs">Fast Delivery</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-lg bg-[#F6ECDD] p-3">
          <Headphones className="h-6 w-6 text-[#C98A78]" />
          <p className="text-center text-xs">Quick Support</p>
        </div>
      </div>
    </div>
  );
}
