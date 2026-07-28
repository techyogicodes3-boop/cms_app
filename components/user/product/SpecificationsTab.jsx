import { Smartphone, Camera, Cpu, Battery, Wifi, Package } from 'lucide-react';

// Icon mapping for categories
const categoryIcons = {
  Display: Smartphone,
  'Camera System': Camera,
  Performance: Cpu,
  'Battery & Charging': Battery,
  Connectivity: Wifi,
  Physical: Package,
};

export default function SpecificationsTab({ categories }) {
  // categories array: [{ name: 'Display', icon: 'Display', specs: [{ label: 'Size', value: '6.8 inches' }, ...] }, ...]
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Technical Specifications</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {categories.map((category, catIndex) => {
          const Icon = categoryIcons[category.icon] || Smartphone;
          
          return (
            <div key={catIndex} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
              </div>

              {/* Specs Table */}
              <div className="space-y-2">
                {category.specs.map((spec, specIndex) => (
                  <div
                    key={specIndex}
                    className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-sm font-medium text-slate-600">{spec.label}</span>
                    <span className="text-sm text-slate-900 text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
