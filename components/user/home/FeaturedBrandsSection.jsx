export default function FeaturedBrandsSection({ heading, subtitle, brands }) {
  return (
    <section className="border-t border-[#C9963A] bg-[#FFF8ED]" aria-labelledby="featured-brands">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="mb-6 text-center">
          <h2
            id="featured-brands"
            className="text-xl font-semibold leading-tight text-[#3A211E] sm:text-2xl"
          >
            {heading}
          </h2>
          <p className="mt-1 text-sm text-[#3A211E]">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
          {brands.map((brand) => (
            <div
              key={brand}
              className="flex cursor-pointer items-center justify-center rounded-lg border border-[#C9963A] bg-[#FFF8ED] px-4 py-3 text-sm font-semibold text-[#3A211E] shadow-sm shadow-[#3A211E]/10 transition-all hover:-translate-y-0.5 hover:bg-[#3A211E] hover:text-[#FFF8ED] hover:shadow-md"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
