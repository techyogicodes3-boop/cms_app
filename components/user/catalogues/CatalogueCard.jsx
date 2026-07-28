import { ArrowRight, Gift } from 'lucide-react';
import Link from 'next/link';
export default function CatalogueCard({ catalogue }) {
  const slug = catalogue.uuid || catalogue._id;
  const image = catalogue.image || catalogue.imageUrl || catalogue.coverImage || catalogue.thumbnail || catalogue.imageUrls?.[0];

  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      <div className="relative h-40 overflow-hidden bg-[#FFF9F3] sm:h-44">
        {image ? (
          <img
            src={image}
            alt={catalogue.name || catalogue.catalogueName || 'Catalogue'}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F6ECDD] text-[#C89A4B]">
            <Gift className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex-1 p-6 space-y-3.5">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 leading-tight">{catalogue.name}</h3>
          <p className="mt-1.5 text-base text-slate-600 leading-relaxed line-clamp-3">
            {catalogue.description || 'No description available'}
          </p>
        </div>
      </div>
      <div className="px-6 pb-6">
        <Link
          href={`/catalogues/${slug}`}
          className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-md hover:brightness-110 hover:shadow-lg active:scale-[0.98] transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Browse Items
          <ArrowRight className="ml-1.5 h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
