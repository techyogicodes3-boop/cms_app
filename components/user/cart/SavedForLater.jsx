export default function SavedForLater({ items, onMoveToCart, onRemove }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Some New Items</h2>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-4 mt-6">
        {items.map((item) => (
          <article key={item.id} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
            {/* Product Image */}
            <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-slate-100 overflow-hidden">
              <img
                src={item.image || 'https://via.placeholder.com/80'}
                alt={item.title}
                className="h-full w-full object-contain p-1"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-slate-900 truncate">{item.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{item.variant}</p>
              <div className="text-lg font-bold text-slate-900 mt-2">₹{item.price}</div>
            </div>

            {/* Actions */}
            {/* <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onMoveToCart && onMoveToCart(item.id)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Move to Cart
              </button>
              <button
                type="button"
                onClick={() => onRemove && onRemove(item.id)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                Remove
              </button>
            </div> */}
          </article>
        ))}
      </div>
    </div>
  );
}
