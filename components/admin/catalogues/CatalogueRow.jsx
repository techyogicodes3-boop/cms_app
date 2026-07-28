import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusToggle from "./StatusToggle";

export default function CatalogueRow({ cat, onToggleStatus, onEdit, onView, onDelete }) {
  const description = cat.subtitle || cat.type || "—";

  return (
    <tr className="border-t border-[#E8D8CC] transition-colors hover:bg-[#FFF9F3]">
      <td className="px-4 py-4">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#E8D8CC] bg-[#F6ECDD] text-[#C98A78]">
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
            <span className={`text-lg ${cat.image ? "hidden" : ""}`}>{cat.icon}</span>
          </div>
      </td>
      <td className="px-4 py-4 text-sm font-semibold text-[#2E1A14]">{cat.name}</td>
      <td className="w-56 max-w-56 px-4 py-4 text-sm text-[#7A625A]">
        <div className="max-w-48 truncate" title={description}>
          {description}
        </div>
      </td>
      <td className="px-4 py-4 text-sm font-semibold text-[#2E1A14]">{cat.items}</td>
      <td className="px-4 py-4">
        <StatusToggle active={cat.active} onToggle={onToggleStatus} />
      </td>
      <td className="px-4 py-4 text-sm text-[#7A625A]">{cat.created}</td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2 text-[#4A2318]">
          <button
            type="button"
            className="cursor-pointer rounded-md p-1.5 text-[#C98A78] hover:bg-[#F6ECDD]"
            aria-label="Edit"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onEdit?.();
            }}
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="cursor-pointer rounded-md p-1.5 text-[#4A2318] hover:bg-[#F6ECDD]"
            aria-label="View items"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onView?.(cat);
            }}
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md p-1.5 text-[#D95C5C] hover:bg-[#FFF0F0]"
            aria-label="Delete"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete?.(cat);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
