'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { buildWhatsAppInquiryUrl } from '../../../utils/whatsappCheckout';
import api from '../../../utils/axios';
import { firstValidationMessage, validateInquiryForm } from '../../../utils/formValidation';

const initialForm = {
  company: '',
  name: '',
  mobile: '',
  email: '',
  message: '',
};

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
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'mobile' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setForm((current) => ({ ...current, [name]: nextValue }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitted(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateInquiryForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error(firstValidationMessage(nextErrors));
      return;
    }

    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        company: form.company.trim(),
        name: form.name.trim(),
        mobile: form.mobile,
        email: form.email.trim(),
        subject,
        message: form.message.trim(),
      };
      const response = await api.post('/api/v1/inquiries', payload);
      if (!response.data?.success) throw new Error(response.data?.message || 'Inquiry could not be saved.');

      const companyLine = payload.company ? `Company: ${payload.company}\n` : '';
      const whatsappUrl = buildWhatsAppInquiryUrl({
        name: payload.name,
        phone: payload.mobile,
        subject,
        message: `${companyLine}Email: ${payload.email}\n${payload.message || 'Please schedule a meeting for more details.'}`,
      });
      setSubmitted(true);
      setForm(initialForm);
      window.location.assign(whatsappUrl);
    } catch (error) {
      const message = error?.response?.status === 404
        ? 'Inquiry service is currently unavailable. Please try again shortly.'
        : error?.response?.data?.message || error.message || 'Could not save your inquiry. Please try again.';
      toast.error(message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.08)] sm:p-6">
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
              maxLength={name === 'mobile' ? 10 : name === 'company' ? 150 : name === 'name' ? 120 : 254}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className={`h-12 w-full rounded-lg border bg-[#FFF9F3] px-4 text-sm text-[#2E1A14] outline-none transition placeholder:text-[#7A625A]/75 focus:ring-2 focus:ring-[#E9B8B0]/45 ${
                errors[name] ? 'border-[#D95C5C]' : 'border-[#E8D8CC] focus:border-[#C98A78]'
              }`}
            />
            {errors[name] && <span id={`${name}-error`} className="mt-1.5 block text-xs font-medium text-[#D95C5C]" role="alert">{errors[name]}</span>}
          </label>
        ))}
      </div>

      <label className="mt-3 block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message *"
          rows={5}
          maxLength={2000}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`w-full resize-none rounded-lg border bg-[#FFF9F3] px-4 py-3 text-sm text-[#2E1A14] outline-none transition placeholder:text-[#7A625A]/75 focus:ring-2 focus:ring-[#E9B8B0]/45 ${errors.message ? 'border-[#D95C5C]' : 'border-[#E8D8CC] focus:border-[#C98A78]'}`}
        />
        <div className="mt-1 flex justify-between gap-3 text-xs">
          <span id="message-error" className="font-medium text-[#D95C5C]" role={errors.message ? 'alert' : undefined}>{errors.message || ''}</span>
          <span className="text-[#7A625A]">{form.message.length}/2000</span>
        </div>
      </label>

      <button type="submit" disabled={submitting} className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#D85C6B] px-5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_12px_28px_rgba(216,92,107,0.25)] hover:bg-[#4A2318] disabled:cursor-not-allowed disabled:opacity-60">
        <Send className="h-4 w-4" aria-hidden="true" />
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
