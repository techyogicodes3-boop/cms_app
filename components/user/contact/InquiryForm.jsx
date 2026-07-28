'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { buildWhatsAppInquiryUrl } from '../../../utils/whatsappCheckout';

const initialForm = {
  company: '',
  name: '',
  mobile: '',
  email: '',
  message: '',
};

function validateForm(form) {
  const errors = {};

  if (!form.name.trim()) errors.name = 'Name is required.';
  if (!form.mobile.trim()) {
    errors.mobile = 'Mobile number is required.';
  } else if (!/^\d{10}$/.test(form.mobile)) {
    errors.mobile = 'Enter a valid 10-digit mobile number.';
  }
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
}

export default function InquiryForm({
  title = 'Schedule a Meeting',
  description = 'Share a few details and we will continue the conversation on WhatsApp.',
  subject = 'Chocotraill inquiry',
  submitLabel = "Let's Schedule Meeting",
  successMessage = 'Thanks. Your message was received successfully.',
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'mobile' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setForm((current) => ({ ...current, [name]: nextValue }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    const companyLine = form.company.trim() ? `Company: ${form.company.trim()}\n` : '';
    window.location.href = buildWhatsAppInquiryUrl({
      name: form.name,
      phone: form.mobile,
      subject,
      message: `${companyLine}Email: ${form.email.trim()}\n${form.message.trim() || 'Please schedule a meeting for more details.'}`,
    });
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.08)] sm:p-6">
      <h2 className="brand-serif text-2xl font-bold text-[#4A2318] sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-[#7A625A]">{description}</p>}

      {submitted && (
        <div className="mt-4 rounded-lg border border-[#6D9B72]/30 bg-[#EDF7EE] px-4 py-3 text-sm font-medium text-[#4E8055]">
          {successMessage}
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          ['company', 'Company Name (Optional)', 'text'],
          ['name', 'Name *', 'text'],
          ['mobile', 'Mobile *', 'tel'],
          ['email', 'Email *', 'email'],
        ].map(([name, placeholder, type]) => (
          <label key={name} className="block">
            <span className="sr-only">{placeholder}</span>
            <input
              name={name}
              type={type}
              inputMode={name === 'mobile' ? 'numeric' : undefined}
              pattern={name === 'mobile' ? '[0-9]{10}' : undefined}
              maxLength={name === 'mobile' ? 10 : undefined}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className={`h-12 w-full rounded-lg border bg-[#FFF9F3] px-4 text-sm text-[#2E1A14] outline-none transition placeholder:text-[#7A625A]/75 focus:ring-2 focus:ring-[#E9B8B0]/45 ${
                errors[name] ? 'border-[#D95C5C]' : 'border-[#E8D8CC] focus:border-[#C98A78]'
              }`}
            />
            {errors[name] && <span className="mt-1.5 block text-xs font-medium text-[#D95C5C]">{errors[name]}</span>}
          </label>
        ))}
      </div>

      <label className="mt-3 block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
          rows={5}
          className="w-full resize-none rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] px-4 py-3 text-sm text-[#2E1A14] outline-none transition placeholder:text-[#7A625A]/75 focus:border-[#C98A78] focus:ring-2 focus:ring-[#E9B8B0]/45"
        />
      </label>

      <button type="submit" className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#D85C6B] px-5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_12px_28px_rgba(216,92,107,0.25)] hover:bg-[#4A2318]">
        <Send className="h-4 w-4" aria-hidden="true" />
        {submitLabel}
      </button>
    </form>
  );
}
