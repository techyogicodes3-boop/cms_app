import { Camera, Headphones, Leaf } from 'lucide-react';

const iconMap = {
  photography: Camera,
  audio: Headphones,
  eco: Leaf,
};

export default function RecommendationsSection({ heading, subtitle, recommendations }) {
  return (
    <section className="border-t border-[#C9963A] bg-[#FFF8ED]" aria-labelledby="ai-recommendations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="mb-6 sm:mb-8">
          <h2
            id="ai-recommendations"
            className="text-xl font-semibold leading-tight text-[#3A211E] sm:text-2xl"
          >
            {heading}
          </h2>
          <p className="mt-1 text-sm text-[#3A211E]">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {recommendations.map((rec) => {
            const Icon = iconMap[rec.type] || Camera;
            return (
              <article
                key={rec.title}
                className="flex cursor-pointer flex-col rounded-lg border border-[#C9963A] bg-[#FFF8ED] p-5 shadow-md shadow-[#3A211E]/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3A211E] hover:text-[#FFF8ED] hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#C9963A] text-[#3A211E]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{rec.title}</h3>
                    <p className="text-xs">{rec.label}</p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed">
                  {rec.description}
                </p>
                {/* <div className="mt-3 text-xs text-slate-500">
                  <span>{rec.itemsLabel}</span>
                </div> */}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
