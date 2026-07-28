"use client";

import React, { useMemo } from "react";
import { cardShell } from "./ui";
import { Settings } from "lucide-react";

const BAR_COLORS = ["#3A211E", "#C9963A", "#3A211E", "#C9963A", "#3A211E"];

function BarRow({ item }) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200/70 flex items-center justify-center overflow-hidden">
        <div className="h-12 w-12 rounded-lg bg-slate-100 shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-400">
              <Settings className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">{item.name}</div>
            <div className="text-xs text-slate-500">{item.units} units sold</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-900">{item.revenue}</div>
            <div className={`text-xs font-semibold ${item.delta.startsWith("-") ? "text-red-600" : "text-emerald-700"}`}>
              {item.delta}
            </div>
          </div>
        </div>

        <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${item.pct}%`, backgroundColor: item.color }}
          />
        </div>
      </div>
    </div>
  );
}

export default function TopSellingItemsCard({ items: apiItems, loading }) {
  // Format revenue with ₹ and commas
  const formatRevenue = (revenue) => {
    if (!revenue) return "₹0";
    return "₹" + revenue.toLocaleString();
  };

  const items = useMemo(() => {
    if (!apiItems || apiItems.length === 0) {
      return [
        { name: "No data", units: 0, revenue: "$0", pct: 0, delta: "0%", color: "#C9963A" },
      ];
    }

    // Find max units for percentage calculation
    const maxUnits = Math.max(...apiItems.map(item => item.unitsSold));

    return apiItems.map((item, index) => ({
      name: item.name,
      units: item.unitsSold,
      image: item.image,
      revenue: formatRevenue(item.totalSales),
      pct: maxUnits > 0 ? Math.round((item.unitsSold / maxUnits) * 100) : 0,
      delta: "", // Delta not provided by API, could calculate if historical data available
      color: BAR_COLORS[index % BAR_COLORS.length],
    }));
  }, [apiItems]);

  if (loading) {
    return (
      <div className={`${cardShell} p-6`}>
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold text-slate-900">Top Selling Items</div>
        </div>
        <div className="mt-5 text-center py-8 text-slate-600">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardShell} p-6`}>
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold text-slate-900">Top Selling Items</div>
        {/* <button type="button" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
          View All
        </button> */}
      </div>
      <div className="mt-5 space-y-5">
        {items.map((i, index) => (
          <BarRow key={`${i.name}-${index}`} item={i} />
        ))}
      </div>
    </div>
  );
}
