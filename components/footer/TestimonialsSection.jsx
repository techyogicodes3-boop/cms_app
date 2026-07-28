import { Star, CheckCircle2 } from 'lucide-react';

function RatingStars({ count = 5, className = '' }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 text-amber-500"
          fill="currentColor"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection({ heading, subheading, testimonials }) {
  return (
    <section
      className="bg-white border-t border-slate-200"
      aria-labelledby="testimonials"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24">
        <header className="text-center mb-10 sm:mb-12">
          <h2 id="testimonials" className="text-3xl font-semibold text-slate-900 leading-tight">
            {heading}
          </h2>
          <p className="text-base font-normal text-slate-600 leading-relaxed mt-2">
            {subheading}
          </p>
        </header>

        {/* SEO: Testimonials structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'Chocotraill',
              review: testimonials.map((t) => ({
                '@type': 'Review',
                reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
                author: { '@type': 'Person', name: t.name },
                reviewBody: t.quote.replace(/^"|"$/g, ''),
              })),
            }),
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className={`${t.tint} rounded-lg shadow-md p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative h-14 w-14 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-white/70 shadow-sm" />
                  <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-slate-700">{t.initials}</span>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="leading-tight">
                    <div className="text-base font-medium text-slate-900 truncate">{t.name}</div>
                    <div className="text-sm text-slate-600">{t.title}</div>
                  </div>

                  <RatingStars className="mt-2" />
                </div>
              </div>

              <p className="mt-6 text-base font-normal text-slate-700 leading-relaxed">
                {t.quote}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
