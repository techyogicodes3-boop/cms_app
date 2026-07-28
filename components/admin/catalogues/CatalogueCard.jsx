import { Eye, Pencil, Trash2 } from "lucide-react";
import { cardShell } from "@/components/admin/dashboard/ui";
import StatusToggle from "./StatusToggle";
import { typeTone } from "./catalogueUtils";

export default function CatalogueCard({ cat, onToggleStatus, onEdit, onView, onDelete }) {
  const tone = typeTone[cat.type] ?? "bg-slate-50 text-slate-700";

  return (
    <div className={`${cardShell} p-4 hover:shadow-lg transition-all group relative overflow-hidden`}>
      {/* Header with checkbox and actions */}
      <div className="flex items-center justify-end mb-3">
        {/* <input
          type="checkbox"
          className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600"
        /> */}
        <div className="flex items-center gap-1.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            className="cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="cursor-pointer p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            aria-label="View items"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(cat);
            }}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="cursor-pointer p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(cat);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Icon and name */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${cat.iconBg} flex-shrink-0 overflow-hidden border border-slate-100`}>
          {cat.image ? (
            <img
              src={cat.image}
              alt={cat.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const next = e.currentTarget.nextElementSibling;
                if (next) next.classList.remove("hidden");
              }}
            />
          ) : null}
          <span className={`text-xl ${cat.image ? "hidden" : ""}`}>{cat.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 truncate">{cat.name}</h3>
          <p className="text-xs text-slate-500 truncate">{cat.subtitle || 'No description'}</p>
        </div>
      </div>

      {/* Type badge and status */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${tone}`}>
          {cat.type}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-slate-500">
            {cat.active ? 'Published' : 'Draft'}
          </span>
          <StatusToggle active={cat.active} onToggle={onToggleStatus} />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <div className="h-6 w-6 rounded-md bg-slate-50 flex items-center justify-center">
            <span className="text-xs">📦</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900">{cat.items || 0}</div>
            <div className="text-[10px] text-slate-500">Items</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400">Created</div>
          <div className="text-xs font-medium text-slate-600">{cat.created}</div>
        </div>
      </div>
    </div>
  );
}
