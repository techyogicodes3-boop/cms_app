'use client';

import { Truck, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { useCheckout } from '../../../contexts/CheckoutContext';

export default function DeliveryInformationForm({ onSubmit }) {
  const { address, setAddress } = useCheckout();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone: allow only numbers and max 10 digits
    if (name === 'phoneNo') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setAddress((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setAddress((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validate = () => {
    const newErrors = {};

    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phoneNo',
      'streetAddress',
      'city',
      'state',
      'zipcode',
    ];

    requiredFields.forEach((field) => {
      if (!address[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    // Strong Email Validation (must end with .com)
    if (
      address.email &&
      !/^[^\s@]+@[^\s@]+\.com$/i.test(address.email)
    ) {
      newErrors.email =
        'Email must be valid and end with .com (example@gmail.com)';
    }

    // Strong Phone Validation (exactly 10 digits)
    if (address.phoneNo && !/^\d{10}$/.test(address.phoneNo)) {
      newErrors.phoneNo =
        'Phone number must be exactly 10 digits';
    }

    // ZIP Code Validation (exactly 6 digits)
    if (address.zipcode && !/^\d{6}$/.test(address.zipcode)) {
      newErrors.zipcode =
        'ZIP code must be exactly 6 digits';
    }

    // Special instruction max 100 chars
    if (
      address.specialInstruction &&
      address.specialInstruction.length > 100
    ) {
      newErrors.specialInstruction =
        'Maximum 100 characters allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.(address);
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

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
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
                className={`w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 ${
                  errors[name]
                    ? 'border-rose-500'
                    : 'border-slate-300'
                }`}
              />
              {errors[name] && (
                <p className="mt-1 text-xs text-rose-600">
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
              className={`w-full rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 border ${
                errors.email
                  ? 'border-rose-500'
                  : 'border-slate-300'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-rose-600">
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
              className={`w-full rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 border ${
                errors.phoneNo
                  ? 'border-rose-500'
                  : 'border-slate-300'
              }`}
            />
          </div>
          {errors.phoneNo && (
            <p className="mt-1 text-xs text-rose-600">
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
            className={`w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 ${
              errors.streetAddress
                ? 'border-rose-500'
                : 'border-slate-300'
            }`}
          />
          {errors.streetAddress && (
            <p className="mt-1 text-xs text-rose-600">
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
            className={`w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 ${
              errors.city
                ? 'border-rose-500'
                : 'border-slate-300'
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-xs text-rose-600">
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
            className={`w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 ${
              errors.zipcode
                ? 'border-rose-500'
                : 'border-slate-300'
            }`}
          />
          {errors.zipcode && (
            <p className="mt-1 text-xs text-rose-600">
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
            className={`w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 ${
              errors.state
                ? 'border-rose-500'
                : 'border-slate-300'
            }`}
          >
            <option value="">Select State</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>
          {errors.state && (
            <p className="mt-1 text-xs text-rose-600">
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
            maxLength={100}
            rows={3}
            value={address.specialInstruction || ''}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="mt-1 text-xs text-slate-500 text-right">
            {(address.specialInstruction?.length || 0)}/100
          </div>
        </div>
      </form>
    </div>
  );
}
