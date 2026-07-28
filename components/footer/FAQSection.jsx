'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection({ heading, subheading, faqs }) {
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  return (
    <section className="bg-slate-50 border-t border-slate-200" aria-labelledby="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24">
        <header className="text-center mb-10 sm:mb-12">
          <h2 id="faq" className="text-3xl font-semibold text-slate-900 leading-tight">
            {heading}
          </h2>
          <p className="text-base font-normal text-slate-600 leading-relaxed mt-2">
            {subheading}
          </p>
        </header>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openFaqIdx === idx;
            const contentId = `faq-panel-${idx}`;
            const buttonId = `faq-button-${idx}`;
            return (
              <div
                key={item.q}
                className="rounded-lg border border-slate-200 bg-white shadow-md overflow-hidden"
              >
                <button
                  id={buttonId}
                  type="button"
                  /* Changed focus utilities to focus-visible to remove border on click */
                  className="w-full flex items-center justify-between gap-4 p-6 text-left rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors duration-200"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => setOpenFaqIdx((cur) => (cur === idx ? -1 : idx))}
                >
                  <span className="text-lg font-medium text-slate-900 leading-tight">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen ? (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-6 pb-6 -mt-2"
                  >
                    <p className="text-base font-normal text-slate-600 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}