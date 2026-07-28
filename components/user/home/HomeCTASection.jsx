import { ArrowRight, Gift } from 'lucide-react';
import Link from 'next/link';

export default function HomeCTASection({ stats }) {
  const displayStats = Array.isArray(stats) ? stats.filter(Boolean) : [];

  return (
    <section 
      className="relative overflow-hidden bg-brand-espresso text-brand-ivory"
      aria-labelledby="home-cta"
    >
      <div className="ui-container relative py-8 text-center sm:py-12 lg:py-14">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-lg border border-brand-gold bg-brand-ivory px-4 py-1.5 text-sm font-semibold text-brand-espresso">
          <Gift className="h-4 w-4" aria-hidden="true" />
          <span>Curated gifting</span>
        </div>

        {/* Main Heading */}
        <h2
          id="home-cta"
          className="mt-4 text-3xl font-bold leading-tight text-brand-ivory sm:text-4xl md:text-5xl"
        >
          Start Your Shopping Journey Today
        </h2>
        
        {/* Subheading */}
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-brand-ivory sm:text-lg">
          Discover thoughtful gift boxes, chocolates, and curated collections for every occasion.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          
          <Link
            href="/catalogues"
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-brand-gold px-6 py-3 text-base font-semibold text-brand-ivory shadow-md transition-all hover:bg-brand-gold hover:text-brand-espresso hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-espresso"
          >
            Browse Catalogues
          </Link>
        </div>

        {/* Statistics */}
        {displayStats.length > 0 && (
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayStats.map((stat, index) => (
              <div key={index} className="flex cursor-pointer flex-col items-center rounded-lg border border-brand-gold bg-brand-ivory px-4 py-5 text-brand-espresso transition hover:bg-brand-gold">
                <div className="text-3xl font-bold sm:text-4xl">{stat.value}</div>
                <div className="mt-0.5 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
