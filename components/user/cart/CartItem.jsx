'use client';

import { Trash2, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatPrice } from '../../../utils/priceFormatter';

export default function CartItem({ item, index, onRemove, onQuantityChange }) {
  // Sync local quantity with item prop (from API)
  const [quantity, setQuantity] = useState(item.quantity || 1);

  // Update local quantity when item prop changes (after API update)
  useEffect(() => {
    const itemQuantity = typeof item.quantity === 'number' && item.quantity > 0 
      ? item.quantity 
      : 1;
    const timer = setTimeout(() => setQuantity(itemQuantity), 0);
    return () => clearTimeout(timer);
  }, [item.quantity]);

  const handleQuantityChange = (newQuantity) => {
    const stockLimit = Number.isFinite(Number(item.stock)) && Number(item.stock) > 0 ? Number(item.stock) : null;
    const validQuantity = stockLimit
      ? Math.min(stockLimit, Math.max(1, Math.floor(newQuantity)))
      : Math.max(1, Math.floor(newQuantity));
    // Optimistically update UI
    setQuantity(validQuantity);
    
    if (onQuantityChange) {
      // Use catalogueItemId (UUID) for API calls, not MongoDB _id
      const catalogueItemId = item.catalogueItemId;
      if (!catalogueItemId) {
        // catalogueItemId missing - cannot update quantity
        return;
      }
      onQuantityChange(catalogueItemId, validQuantity);
    }
  };

  const badgeColor =
    item.badge === 'In Stock'
      ? 'bg-success-bg text-success'
      : item.badge === 'Low Stock'
        ? 'bg-warning-bg text-warning'
        : 'bg-surface-soft text-text-secondary';

  const discountBadgeColor = item.discount
    ? item.discount.includes('OFF')
      ? 'bg-error'
      : 'bg-brand-gold'
    : null;

  return (
    <article className="ui-card relative flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
      {/* Numbered Badge */}
      <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-cocoa text-sm font-bold text-white shadow-md">
        {index + 1}
      </div>

      {/* Product Image */}
      <div className="relative h-28 w-full flex-shrink-0 overflow-hidden rounded-[10px] bg-surface-soft sm:h-24 sm:w-24">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-contain p-1"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-soft">
            <span className="text-xs text-text-muted">No Image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="truncate text-lg font-semibold text-text-primary">{item.title}</h3>
            <p className="mt-1 text-sm text-text-secondary">{item.variant}</p>
            
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {item.badge && (
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badgeColor}`}>
                  {item.badge}
                </span>
              )}
              {item.discount && (
                <span
                  className={`inline-flex items-center rounded-full ${discountBadgeColor} px-2.5 py-1 text-xs font-semibold text-white`}
                >
                  {item.discount}
                </span>
              )}
            </div>
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => {
              if (onRemove) {
                const catalogueItemId = item.catalogueItemId;
                if (!catalogueItemId) {
                  return;
                }
                onRemove(catalogueItemId);
              }
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-error-bg hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            aria-label="Remove item"
          >
            <Trash2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Quantity and Actions */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="inline-flex items-center rounded-[10px] border border-border-light bg-white">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => handleQuantityChange(quantity - 1)}
                className="min-h-11 cursor-pointer px-3 py-2 font-semibold text-text-secondary transition-colors hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" aria-hidden="true" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="h-11 w-12 self-center border-x border-border-light px-2 py-2 text-center text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-gold"
                min="1"
                max={item.stock || undefined}
              />
              <button
                type="button"
                disabled={Number.isFinite(Number(item.stock)) && quantity >= Number(item.stock)}
                onClick={() => handleQuantityChange(quantity + 1)}
                className="min-h-11 cursor-pointer px-3 py-2 font-semibold text-text-secondary transition-colors hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            {item.oldPrice && (
              <div className="text-sm text-text-muted line-through">{item.oldPrice}</div>
            )}
            {item.priceNote && (
              <div className="mb-1 text-xs text-text-muted">{item.priceNote}</div>
            )}
            <div className="text-2xl font-bold text-brand-cocoa">
              {(() => {
                // Handle both string and number prices, format as USD
                if (typeof item.price === 'string') {
                  const numPrice = parseFloat(item.price.replace(/[₹,$]/g, '').replace(/,/g, '')) || 0;
                  return formatPrice(numPrice);
                } else if (typeof item.price === 'number') {
                  return formatPrice(item.price);
                }
                return '$0';
              })()}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
