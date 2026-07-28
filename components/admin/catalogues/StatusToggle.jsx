export default function StatusToggle({ active, onToggle, variant = "success" }) {
  const activeColor = variant === "danger" ? "bg-[#D95C5C] border-[#D95C5C]" : "bg-[#6D9B72] border-[#6D9B72]";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full border transition-colors ${active ? activeColor : "bg-[#E8D8CC] border-[#B8A59A]"
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${active ? "translate-x-4" : "translate-x-0.5"
          }`}
      />
    </button>
  );
}
