'use client';

import { MessageCircle, Receipt, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { redirectToWhatsAppCheckout } from '../../../utils/whatsappCheckout';

export default function OrderSummary({ subtotal, shipping, tax, discount, total, itemCount, cartItems = [] }) {
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Check if cart is empty
  const isCartEmpty = !cartItems || cartItems.length === 0 || itemCount === 0 || total === '0' || parseFloat(total) === 0;

  const handleProceedToCheckout = () => {
    // Validate cart has items
    if (isCartEmpty) {
      return;
    }
    const nextErrors = {};
    if (!customer.name.trim()) nextErrors.name = 'Customer name is required.';
    if (!customer.phone.trim()) {
      nextErrors.phone = 'Customer phone is required.';
    } else if (!/^\d{10}$/.test(customer.phone)) {
      nextErrors.phone = 'Enter a valid 10-digit phone number.';
    }
    if (!customer.address.trim()) nextErrors.address = 'Customer address is required.';

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError('Please complete the required customer details.');
      return;
    }
    setFieldErrors({});
    setError('');
    redirectToWhatsAppCheckout(cartItems, total, customer);
  };

  const updateCustomerField = (field, value) => {
    const nextValue = field === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setCustomer((current) => ({ ...current, [field]: nextValue }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setError('');
  };

  const formatAmount = (value) => {
    const numberValue = Number(value) || 0;
    return numberValue.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <aside className="rounded-lg border border-[#E8D8CC] bg-[#F6ECDD] p-6 shadow-[0_10px_30px_rgba(43,20,14,0.08)] lg:sticky lg:top-28">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#E8D8CC] pb-4">
        <Receipt className="h-5 w-5 text-[#C89A4B]" aria-hidden="true" />
        <h2 className="brand-serif text-2xl font-bold text-[#2E1A14]">Cart Totals</h2>
      </div>

      {/* Summary Items */}
      {isCartEmpty ? (
        <div className="py-4">
          <div className="text-center text-sm text-text-muted">
            No items in cart
          </div>
        </div>
      ) : (
      <div className="space-y-3 py-4">
        <div className="flex items-center justify-between text-base">
          <span className="text-[#7A625A]">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-semibold text-[#2E1A14]">₹{formatAmount(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-base">
          <span className="text-[#7A625A]">Delivery note</span>
          <span className="font-semibold text-[#6D9B72]">{shipping === 0 ? 'Confirm on WhatsApp' : `₹${shipping}`}</span>
        </div>

        {Number(discount) > 0 && (
          <div className="flex items-center justify-between text-base">
            <span className="text-[#7A625A]">Discount</span>
            <span className="font-semibold text-[#6D9B72]">-₹{formatAmount(discount)}</span>
          </div>
        )}
      </div>
      )}

      {/* Total */}
      <div className="border-t border-[#E8D8CC] pt-4">
        {isCartEmpty ? (
          /* Empty Cart Message */
          <div className="text-center py-6">
            <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-[#C89A4B]" aria-hidden="true" />
            <h3 className="mb-1 text-lg font-semibold text-[#2E1A14]">Your cart is empty</h3>
            <p className="mb-4 text-sm text-[#7A625A]">Add some items to your cart to order on WhatsApp.</p>
          </div>
        ) : (
          <>
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-lg font-semibold text-[#2E1A14]">Order Total</span>
            <div className="mt-0.5 text-xs text-[#7A625A]">INR</div>
          </div>
          <div className="text-3xl font-bold text-[#2E1A14]">₹{formatAmount(total)}</div>
        </div>

        <div className="mb-4 rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#2E1A14]">Customer Details</h3>
          <div className="mt-3 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#7A625A]">Customer name *</span>
              <input
                type="text"
                value={customer.name}
                onChange={(event) => updateCustomerField('name', event.target.value)}
                placeholder="Enter customer name"
                className={`h-11 w-full rounded-lg border bg-[#FFF9F3] px-3 text-sm text-[#2E1A14] outline-none focus:border-[#D85C6B] focus:ring-2 focus:ring-[#E9B8B0]/40 ${
                  fieldErrors.name ? 'border-[#D95C5C]' : 'border-[#E8D8CC]'
                }`}
              />
              {fieldErrors.name && <p className="mt-1 text-xs font-semibold text-[#D95C5C]">{fieldErrors.name}</p>}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#7A625A]">Customer phone *</span>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                value={customer.phone}
                onChange={(event) => updateCustomerField('phone', event.target.value)}
                placeholder="10-digit mobile number"
                className={`h-11 w-full rounded-lg border bg-[#FFF9F3] px-3 text-sm text-[#2E1A14] outline-none focus:border-[#D85C6B] focus:ring-2 focus:ring-[#E9B8B0]/40 ${
                  fieldErrors.phone ? 'border-[#D95C5C]' : 'border-[#E8D8CC]'
                }`}
              />
              {fieldErrors.phone && <p className="mt-1 text-xs font-semibold text-[#D95C5C]">{fieldErrors.phone}</p>}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#7A625A]">Customer address *</span>
              <textarea
                rows={2}
                value={customer.address}
                onChange={(event) => updateCustomerField('address', event.target.value)}
                placeholder="House number, street, city, pincode"
                className={`w-full resize-none rounded-lg border bg-[#FFF9F3] px-3 py-2 text-sm text-[#2E1A14] outline-none focus:border-[#D85C6B] focus:ring-2 focus:ring-[#E9B8B0]/40 ${
                  fieldErrors.address ? 'border-[#D95C5C]' : 'border-[#E8D8CC]'
                }`}
              />
              {fieldErrors.address && <p className="mt-1 text-xs font-semibold text-[#D95C5C]">{fieldErrors.address}</p>}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#7A625A]">Optional message</span>
              <textarea
                rows={2}
                value={customer.message}
                onChange={(event) => updateCustomerField('message', event.target.value)}
                placeholder="Delivery note or gifting message"
                className="w-full resize-none rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] px-3 py-2 text-sm text-[#2E1A14] outline-none focus:border-[#D85C6B] focus:ring-2 focus:ring-[#E9B8B0]/40"
              />
            </label>
          </div>
          {error && <p className="mt-3 text-xs font-semibold text-[#D95C5C]">{error}</p>}
        </div>

        {/* WhatsApp Button */}
        <button
          type="button"
              onClick={handleProceedToCheckout}
              disabled={isCartEmpty}
              className="ui-btn-primary w-full px-6 py-3.5 text-base disabled:opacity-50"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span>Order on WhatsApp</span>
        </button>
          </>
        )}
      </div>
    </aside>
  );
}
