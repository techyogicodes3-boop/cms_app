'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'How does WhatsApp checkout work?',
    answer:
      "Your cart details open in WhatsApp with product names, quantities, prices, and total amount already filled in.",
  },
  {
    question: 'Can I change my delivery address after sharing my cart?',
    answer:
      "Yes. Share the updated address in the same WhatsApp conversation before the team confirms delivery.",
  },
  {
    question: 'Will I be charged online?',
    answer:
      "No online charge is collected in this checkout. The team will confirm the next steps directly on WhatsApp.",
  },
  {
    question: 'How long will delivery take?',
    answer:
      "Standard delivery takes 5-7 business days. Express options can be confirmed with support based on your location.",
  },
  {
    question: 'Do you ship internationally?',
    answer:
      "Yes, we ship to over 100 countries worldwide. International shipping costs and delivery times vary by destination. All applicable customs duties and taxes are the responsibility of the customer.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="bg-white py-12 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="mt-2 text-base text-slate-600">Quick answers to common checkout questions</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-base font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-slate-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
