import { Star } from 'lucide-react';

export default function FeaturesSection({ badge, heading, subheading, features }) {
  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24"
      aria-labelledby="why-choose-Chocotraill"
    >
      {/* Badge */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-100 border border-blue-300">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700 flex-shrink-0" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-medium text-blue-700 whitespace-nowrap">{badge}</span>
        </div>
      </div>

      {/* Main Heading */}
      <h2
        id="why-choose-Chocotraill"
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 text-center leading-tight mb-3 sm:mb-4 px-2 break-words"
      >
        {heading}
      </h2>

      {/* Subheading */}
      <p className="text-sm sm:text-base md:text-lg font-normal text-slate-600 text-center leading-relaxed mb-10 sm:mb-12 md:mb-14 lg:mb-16 max-w-2xl mx-auto px-4 break-words">
        {subheading}
      </p>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <article
              key={feature.id}
              className={`${feature.cardBg} rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg min-h-[200px] sm:min-h-[220px] flex flex-col`}
            >
              {/* Icon */}
              <div className={`${feature.iconBg} w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-md flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0`}>
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" aria-hidden="true" />
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg md:text-xl font-medium text-slate-900 mb-2 sm:mb-3 md:mb-4 leading-tight break-words">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base font-normal text-slate-600 leading-relaxed break-words flex-1">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
