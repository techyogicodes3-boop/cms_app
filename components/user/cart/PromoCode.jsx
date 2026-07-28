'use client';

import { Tag } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function PromoCode({ onApply }) {
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (!code.trim()) {
      toast.error('Please enter a promo code.');
      return;
    }
    
    if (onApply) {
      // Call parent handler (it will show toast)
      onApply(code.trim());
      setCode('');
    } else {
      // Fallback if onApply is not provided
      toast.error('Promo code feature is not available at the moment.');
    }
  };

  return (
    <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-6 shadow-md">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white flex-shrink-0">
          <Tag className="h-8 w-8" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-900">Have a Promo Code?</h3>
          <p className="text-sm text-slate-600 mt-1">Enter your code to get special discounts</p>

          {/* Input Row */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter promo code"
              className="flex-1 rounded-xl border-2 border-amber-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={handleApply}
              disabled={!code.trim()}
              className="mt-4 sm:mt-0 rounded-xl bg-amber-500 px-6 py-3 text-base font-semibold text-white shadow-md hover:brightness-110 hover:shadow-lg active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
