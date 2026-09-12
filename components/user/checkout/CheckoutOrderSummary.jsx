'use client';

import { MessageCircle, Receipt } from 'lucide-react';

export default function CheckoutOrderSummary({ items, subtotal, shipping, tax, discount, total, onConfirm, isSubmitting = false }) {
  const itemCount = items ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
        <Receipt className="h-5 w-5 text-blue-600" aria-hidden="true" />
        <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
      </div>

      {/* Order Items */}
      {items && items.length > 0 && (
        <div className="py-4 space-y-4 border-b border-slate-200">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              {/* Product Image with Quantity Badge */}
              <div className="relative h-16 w-16 flex-shrink-0 rounded-lg bg-slate-100 overflow-hidden">
                <img
                  src={item.image || 'https://via.placeholder.com/64'}
                  alt={item.title}
                  className="h-full w-full object-contain p-1"
                />
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                  {item.quantity}
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{item.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{item.variant}</p>
                <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <div className="text-base font-bold text-slate-900">
                ₹{(() => {
                    // Handle both string and number prices
                    const priceValue = typeof item.price === 'string' 
                      ? parseFloat(item.price.replace(/[₹, $]/g, '').replace(/,/g, '')) || 0
                      : typeof item.price === 'number' 
                        ? item.price 
                        : 0;
                    const total = priceValue * (item.quantity || 1);
                    return total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                  })()}
                </div>
                {item.quantity > 1 && (
                  <div className="text-xs text-slate-500 mt-0.5">
                    ₹{(() => {
                      const priceValue = typeof item.price === 'string' 
                        ? parseFloat(item.price.replace(/[₹, $]/g, '').replace(/,/g, '')) || 0
                        : typeof item.price === 'number' 
                          ? item.price 
                          : 0;
                      return priceValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    })()} each
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Items */}
      <div className="space-y-3 py-4">
        <div className="flex items-center justify-between text-base">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-semibold text-slate-900">₹{subtotal}</span>
        </div>

        <div className="flex items-center justify-between text-base">
          <span className="text-slate-600">Shipping</span>
          <span className="font-semibold text-emerald-600">{shipping === 0 || shipping === '0' ? 'FREE' : `₹${shipping}`}</span>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-end justify-between mb-1">
          <div>
            <span className="text-lg font-semibold text-slate-900">Total</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-0.5">INR</div>
            <div className="text-3xl font-bold text-slate-900">₹{total}</div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:brightness-110 hover:shadow-lg active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span>{isSubmitting ? 'Saving order…' : 'Place Order'}</span>
        </button>

        {/* Return to Cart Link */}
        <a
          href="/cart"
          className="w-full mt-3 inline-flex items-center justify-center gap-1 text-sm text-blue-600 hover:underline transition-colors"
        >
          <span>←</span>
          <span>Return to Cart</span>
        </a>
      </div>
    </div>
  );
}
