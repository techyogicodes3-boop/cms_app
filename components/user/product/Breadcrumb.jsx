import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  const safeItems = items
  .map((item) => ({
    ...item,
    label: item?.label?.trim(),
  }))
  .filter((item) => item.label);


  if (safeItems.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          {safeItems.map((item, index) => {
            const isLast = index === safeItems.length - 1;

            return (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight
                    className="h-4 w-4 text-slate-400"
                    aria-hidden="true"
                  />
                )}

                {isLast || !item.href ? (
                  <span className="text-slate-900 font-medium truncate">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-blue-600 hover:underline truncate"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
