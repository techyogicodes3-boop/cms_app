import { BookOpen, Package, Users, Star } from 'lucide-react';

const iconMap = {
  catalogues: BookOpen,
  products: Package,
  users: Users,
  reviews: Star,
};

export default function StatsStrip({ stats }) {
  return (
    <section className="-mt-10 pb-10 sm:-mt-14 sm:pb-12 lg:-mt-16 lg:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {stats.map((item) => {
            const Icon = iconMap[item.type] || BookOpen;
            return (
              <article
                key={item.label}
                className="flex cursor-pointer flex-col rounded-lg border border-[#C9963A] bg-[#FFF8ED] px-5 py-4 shadow-md shadow-[#3A211E]/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3A211E] hover:text-[#FFF8ED] hover:shadow-lg sm:px-6 sm:py-5"
              >
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#C9963A] sm:text-sm">
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </span>
                  <span>{item.delta}</span>
                </div>
                <div className="mt-1 text-2xl font-semibold sm:text-3xl">
                  {item.value}
                </div>
                <p className="mt-1 text-xs sm:text-sm">{item.caption}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
