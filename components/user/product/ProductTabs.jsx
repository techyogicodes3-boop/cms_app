'use client';

import { useState } from 'react';

export default function ProductTabs({ children, tabs }) {
  // tabs array: ['Description', 'Specifications', 'Shipping & Returns']
  const [activeTab, setActiveTab] = useState(0);

  const tabsArray = tabs || ['Description'];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex items-center gap-6 overflow-x-auto" aria-label="Product details tabs">
          {tabsArray.map((tab, index) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`whitespace-nowrap pb-4 px-1 text-base font-medium transition-colors border-b-2 ${
                activeTab === index
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {Array.isArray(children) ? children[activeTab] : children}
      </div>
    </div>
  );
}
