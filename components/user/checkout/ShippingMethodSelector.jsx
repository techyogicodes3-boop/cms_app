'use client';

import { Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCheckout } from '../../../contexts/CheckoutContext';

const shippingOptions = [
  {
    id: 'standard',
    name: 'Free Standard Shipping',
    badge: 'RECOMMENDED',
    badgeColor: 'bg-emerald-500',
    description: 'Delivery in 5-7 business days',
    price: 0,
    priceLabel: 'FREE',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    badge: null,
    description: 'Delivery in 2-3 business days',
    price: 400,
    priceLabel: '400',
  },
  {
    id: 'overnight',
    name: 'Overnight Delivery',
    badge: 'FASTEST',
    badgeColor: 'bg-amber-500',
    description: 'Next business day delivery',
    price: 1000,
    priceLabel: '1000',
  },
];

export default function ShippingMethodSelector({ selectedMethod, onMethodChange }) {
  const { shippingMethod, setShippingMethod } = useCheckout();

  const [selected, setSelected] = useState(
    selectedMethod || shippingMethod || 'standard'
  );

  // 🔄 Keep local + context in sync
  useEffect(() => {
    setSelected(shippingMethod);
  }, [shippingMethod]);

  const handleChange = (methodId) => {
    console.log("SHipping method : ",shippingMethod);
    setSelected(methodId);
    setShippingMethod(methodId); // ✅ STORE IN CONTEXT

    if (onMethodChange) {
      const method = shippingOptions.find((opt) => opt.id === methodId);
      onMethodChange(method);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
          <Truck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Shipping Method</h2>
          <p className="text-sm text-slate-600">Choose your preferred delivery option</p>
        </div>
      </div>

      {/* Shipping Options — UI UNCHANGED */}
      <div className="mt-6 space-y-3">
        {shippingOptions.map((option) => (
          <label
            key={option.id}
            className={`flex items-center justify-between gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selected === option.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3 flex-1">
              <input
                type="radio"
                name="shipping-method"
                value={option.id}
                checked={selected === option.id}
                onChange={() => handleChange(option.id)}
                className="mt-1 h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-slate-900">
                    {option.name}
                  </span>
                  {option.badge && (
                    <span
                      className={`inline-flex items-center rounded-md ${option.badgeColor} px-2 py-0.5 text-xs font-semibold text-white`}
                    >
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  {option.description}
                </p>
              </div>
            </div>

            <div
              className={`text-lg font-bold flex-shrink-0 ${
                option.price === 0 ? 'text-emerald-600' : 'text-slate-900'
              }`}
            >
              ₹{option.priceLabel}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
