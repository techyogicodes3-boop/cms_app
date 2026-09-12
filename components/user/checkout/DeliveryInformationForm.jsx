'use client';

import { Truck, Mail, Phone } from 'lucide-react';
import { useCheckout } from '../../../contexts/CheckoutContext';

const indianStates = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export default function DeliveryInformationForm({ validationErrors = {}, onClearError }) {
  const { address, setAddress } = useCheckout();
  const errors = validationErrors;

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericValue = ['phoneNo', 'zipcode'].includes(name)
      ? value.replace(/\D/g, '').slice(0, name === 'zipcode' ? 6 : 10)
      : value;
    setAddress((prev) => ({ ...prev, [name]: numericValue }));
    onClearError?.(name);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
          <Truck className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Delivery Information
          </h2>
          <p className="text-sm text-slate-600">
            Enter your shipping details
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: 'firstName', label: 'First Name' },
            { name: 'lastName', label: 'Last Name' },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                {label} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name={name}
                value={address[name] || ''}
                onChange={handleChange}
                id={`checkout-${name}`}
                maxLength={80}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={errors[name] ? `checkout-${name}-error` : undefined}
                className={`w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 ${
                  errors[name]
                    ? 'border-rose-500'
                    : 'border-slate-300'
                }`}
              />
              {errors[name] && (
                <p id={`checkout-${name}-error`} className="mt-1 text-xs text-rose-600" role="alert">
                  {errors[name]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="email"
              name="email"
              value={address.email || ''}
              onChange={handleChange}
              id="checkout-email"
              maxLength={254}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'checkout-email-error' : undefined}
              className={`w-full rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 border ${
                errors.email
                  ? 'border-rose-500'
                  : 'border-slate-300'
              }`}
            />
          </div>
          {errors.email && (
            <p id="checkout-email-error" className="mt-1 text-xs text-rose-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="tel"
              name="phoneNo"
              maxLength={10}
              value={address.phoneNo || ''}
              onChange={handleChange}
              id="checkout-phoneNo"
              inputMode="numeric"
              aria-invalid={Boolean(errors.phoneNo)}
              aria-describedby={errors.phoneNo ? 'checkout-phoneNo-error' : undefined}
              className={`w-full rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 border ${
                errors.phoneNo
                  ? 'border-rose-500'
                  : 'border-slate-300'
              }`}
            />
          </div>
          {errors.phoneNo && (
            <p id="checkout-phoneNo-error" className="mt-1 text-xs text-rose-600" role="alert">
              {errors.phoneNo}
            </p>
          )}
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Street Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="streetAddress"
            value={address.streetAddress || ''}
            onChange={handleChange}
            id="checkout-streetAddress"
            maxLength={300}
            aria-invalid={Boolean(errors.streetAddress)}
            aria-describedby={errors.streetAddress ? 'checkout-streetAddress-error' : undefined}
            className={`w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 ${
              errors.streetAddress
                ? 'border-rose-500'
                : 'border-slate-300'
            }`}
          />
          {errors.streetAddress && (
            <p id="checkout-streetAddress-error" className="mt-1 text-xs text-rose-600" role="alert">
              {errors.streetAddress}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            City <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={address.city || ''}
            onChange={handleChange}
            id="checkout-city"
            maxLength={100}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? 'checkout-city-error' : undefined}
            className={`w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 ${
              errors.city
                ? 'border-rose-500'
                : 'border-slate-300'
            }`}
          />
          {errors.city && (
            <p id="checkout-city-error" className="mt-1 text-xs text-rose-600" role="alert">
              {errors.city}
            </p>
          )}
        </div>

        {/* ZIP Code */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            ZIP Code <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="zipcode"
            maxLength={6}
            value={address.zipcode || ''}
            onChange={handleChange}
            id="checkout-zipcode"
            inputMode="numeric"
            aria-invalid={Boolean(errors.zipcode)}
            aria-describedby={errors.zipcode ? 'checkout-zipcode-error' : undefined}
            className={`w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 ${
              errors.zipcode
                ? 'border-rose-500'
                : 'border-slate-300'
            }`}
          />
          {errors.zipcode && (
            <p id="checkout-zipcode-error" className="mt-1 text-xs text-rose-600" role="alert">
              {errors.zipcode}
            </p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            State <span className="text-rose-500">*</span>
          </label>
          <select
            name="state"
            value={address.state || ''}
            onChange={handleChange}
            id="checkout-state"
            aria-invalid={Boolean(errors.state)}
            aria-describedby={errors.state ? 'checkout-state-error' : undefined}
            className={`w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 ${
              errors.state
                ? 'border-rose-500'
                : 'border-slate-300'
            }`}
          >
            <option value="">Select State</option>
            {indianStates.map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
          {errors.state && (
            <p id="checkout-state-error" className="mt-1 text-xs text-rose-600" role="alert">
              {errors.state}
            </p>
          )}
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            name="specialInstruction"
            maxLength={500}
            rows={3}
            value={address.specialInstruction || ''}
            onChange={handleChange}
            id="checkout-specialInstruction"
            aria-invalid={Boolean(errors.specialInstruction)}
            aria-describedby={errors.specialInstruction ? 'checkout-specialInstruction-error' : undefined}
            className={`w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 resize-none ${errors.specialInstruction ? 'border-rose-500' : 'border-slate-300'}`}
          />
          <div className="mt-1 flex justify-between gap-3 text-xs">
            <span id="checkout-specialInstruction-error" className="text-rose-600" role={errors.specialInstruction ? 'alert' : undefined}>{errors.specialInstruction || ''}</span>
            <span className="text-slate-500">{(address.specialInstruction?.length || 0)}/500</span>
          </div>
        </div>
      </div>
    </div>
  );
}
