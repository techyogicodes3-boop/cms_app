import { ArrowRight, CalendarDays, CheckCircle2 } from 'lucide-react';

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

export default function CTASection({ heading, subheading, buttons, benefits }) {

  const [primaryButton = [], secondaryButton = []] = buttons || [];
  
  return (
    <section className="border-t border-slate-200" aria-labelledby="cta">
      <div className="relative overflow-hidden">
        {/* Background gradient + soft glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-500" aria-hidden="true" />
        <div className="absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-500/40 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24 text-center">
          <h2 id="cta" className="text-3xl md:text-4xl font-semibold text-white leading-tight">
            {heading}
          </h2>
          <p className="text-base font-normal text-white/90 leading-relaxed mt-3">
            {subheading}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
            {primaryButton && primaryButton.length > 0 && (
              <Button
                variant={primaryButton[3] || 'light'}
                className="w-full sm:w-auto px-6"
                aria-label={primaryButton[1] || ''}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {primaryButton[0] || ''}
                  {primaryButton[2] === 'arrow' ? (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
              </Button>
            )}

            {secondaryButton && secondaryButton.length > 0 && (
              <Button
                variant={secondaryButton[3] || 'primary'}
                className="w-full sm:w-auto px-6 bg-white/10 text-white border border-white/30 hover:brightness-110 hover:shadow-md"
                aria-label={secondaryButton[1] || ''}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {secondaryButton[0] || ''}
                  {secondaryButton[2] === 'arrow' ? (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
              </Button>
            )}
          </div>

          <ul className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-white/90">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
