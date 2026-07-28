/**
 * Loading skeleton component for catalogue cards
 */
export function CatalogueCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md animate-pulse">
      <div className="h-40 sm:h-44 bg-slate-300" />
      <div className="flex-1 p-6 space-y-3.5">
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded w-20" />
          <div className="h-4 bg-slate-200 rounded w-12" />
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="h-11 bg-slate-200 rounded w-full" />
      </div>
    </div>
  );
}

/**
 * Loading skeleton for item cards
 */
export function ItemCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="h-48 bg-slate-200 rounded-lg mb-4" />
      <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-full mb-2" />
      <div className="h-4 bg-slate-200 rounded w-2/3 mb-4" />
      <div className="h-6 bg-slate-200 rounded w-1/3" />
    </div>
  );
}

/**
 * Loading skeleton for item grid
 */
export function ItemGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ItemCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Loading skeleton for catalogue grid
 */
export function CatalogueGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
      {Array.from({ length: count }).map((_, index) => (
        <CatalogueCardSkeleton key={index} />
      ))}
    </div>
  );
}
