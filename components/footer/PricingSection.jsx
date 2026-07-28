import { Check } from 'lucide-react';

function Button({ variant = 'primary', children, className = '', ...props }) {
  const base =
    'rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[2.75rem]';
  const variants = {
    primary: 'bg-blue-600 text-white hover:brightness-110 hover:shadow-md',
    light: 'bg-white text-blue-700 hover:brightness-110 hover:shadow-md',
    subtle: 'bg-slate-100 text-slate-900 hover:brightness-105 hover:shadow-md',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default function PricingSection({ heading, subheading, plans }) {
  return (
    <section
      className="bg-slate-50 border-t border-slate-200"
      aria-labelledby="pricing"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24">
        <header className="text-center mb-10 sm:mb-12">
          <h2
            id="pricing"
            className="text-3xl font-semibold text-slate-900 leading-tight"
          >
            {heading}
          </h2>
          <p className="text-base font-normal text-slate-600 leading-relaxed mt-2">
            {subheading}
          </p>
        </header>

        {/* SEO: Pricing structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'Chocotraill',
              offers: plans.map((p) => ({
                '@type': 'Offer',
                name: p.name,
                price: p.price === 'Custom' ? undefined : p.price.replace('$', ''),
                priceCurrency: p.price === 'Custom' ? undefined : 'USD',
                description: p.subtitle,
              })),
            }),
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={[
                'relative rounded-lg shadow-md border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
                plan.highlighted ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white border-blue-500 ring-2 ring-blue-400/60' : '',
              ].join(' ')}
            >
              {plan.badge ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-amber-400 text-slate-900 px-4 py-1 text-sm font-medium shadow-md">
                    {plan.badge}
                  </span>
                </div>
              ) : null}

              <div className="text-center">
                <h3 className={`text-lg font-medium leading-tight ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>

                <div className="mt-3 flex items-baseline justify-center gap-2">
                  <span className={`text-3xl font-semibold leading-tight ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  {plan.cadence ? (
                    <span className={`text-base ${plan.highlighted ? 'text-blue-100' : 'text-slate-600'}`}>
                      {plan.cadence}
                    </span>
                  ) : null}
                </div>

                <p className={`text-sm leading-relaxed mt-2 ${plan.highlighted ? 'text-blue-100' : 'text-slate-600'}`}>
                  {plan.subtitle}
                </p>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span
                      className={[
                        'mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full',
                        plan.highlighted ? 'bg-white/15' : 'bg-emerald-50',
                      ].join(' ')}
                      aria-hidden="true"
                    >
                      <Check className={plan.highlighted ? 'h-4 w-4 text-white' : 'h-4 w-4 text-emerald-600'} />
                    </span>
                    <span className={`text-sm leading-relaxed ${plan.highlighted ? 'text-white' : 'text-slate-700'}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {plan.highlighted ? (
                  <Button variant="light" className="w-full">{plan.cta}</Button>
                ) : (
                  <Button variant="subtle" className="w-full">{plan.cta}</Button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
