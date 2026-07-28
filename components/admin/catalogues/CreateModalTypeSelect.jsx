import { useState, useEffect } from "react";
import { getAllCatalogueTypes } from "../../../services/catalogue.service";

export default function CreateModalTypeSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      setLoading(true);
      try {
        const { data } = await getAllCatalogueTypes();
        setTypes(data);
      } catch (err) {
        console.error("Failed to fetch types", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  const handleSelect = (typeObj) => {
    onChange(typeObj.uuid);
    setOpen(false);
  };

  // Find the selected type name for display
  const selectedType = types.find(t => t.uuid === value);
  const displayValue = selectedType ? selectedType.name : (placeholder || "Select Type");

  // old code for options rendering
  /*
  const handleSelectOriginal = (opt) => {
    onChange(opt);
    setOpen(false);
  };

  const displayValueOriginal = value === placeholder ? placeholder : value;
  */

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer w-full inline-flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-left text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <span className={!selectedType ? "text-slate-400" : ""}>
          {displayValue}
        </span>
        <span className="text-slate-400 shrink-0">▼</span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 z-100 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg py-1 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-2 text-sm text-slate-500">Loading...</div>
          ) : (
            types.map((type) => (
              <button
                key={type.uuid}
                type="button"
                onClick={() => handleSelect(type)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${type.uuid === value
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {type.name}
              </button>
            ))
          )}

          {/* old code for Options Rendering */}
          {/* 
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                opt === value
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt}
            </button>
          ))} 
          */}
        </div>
      )}
    </div>
  );
}
