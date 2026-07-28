import { LayoutGrid, Table } from "lucide-react";

export default function ViewToggle({ mode, onChange }) {
  return (
    <div className="inline-flex rounded-xl bg-slate-50 border border-slate-200/70 overflow-hidden">
      <button
        type="button"
        className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
          mode === "table"
            ? "bg-blue-600 text-white"
            : "text-slate-600 hover:bg-white transition-colors"
        }`}
        onClick={() => onChange("table")}
      >
        <Table className="h-4 w-4" />
        Table View
      </button>
      <button
        type="button"
        className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
          mode === "grid"
            ? "bg-blue-600 text-white"
            : "text-slate-600 hover:bg-white transition-colors"
        }`}
        onClick={() => onChange("grid")}
      >
        <LayoutGrid className="h-4 w-4" />
        Grid View
      </button>
    </div>
  );
}
