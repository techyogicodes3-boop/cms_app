"use client";

import React, { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cardShell } from "./ui";

const toneMap = {
  blue: {
    iconBg: "bg-blue-100",
    iconFg: "text-blue-700",
    chipBg: "bg-emerald-50",
    chipFg: "text-emerald-700",
    line: "#3A211E",
    fill: "#FFF8ED",
  },
  green: {
    iconBg: "bg-emerald-100",
    iconFg: "text-emerald-700",
    chipBg: "bg-emerald-50",
    chipFg: "text-emerald-700",
    line: "#C9963A",
    fill: "#FFF8ED",
  },
  amber: {
    iconBg: "bg-amber-100",
    iconFg: "text-amber-700",
    chipBg: "bg-emerald-50",
    chipFg: "text-emerald-700",
    line: "#C9963A",
    fill: "#FFF8ED",
  },
  red: {
    iconBg: "bg-red-100",
    iconFg: "text-red-600",
    chipBg: "bg-red-50",
    chipFg: "text-red-600",
    line: "#3A211E",
    fill: "#FFF8ED",
  },
};

export default function KpiCard({ kpi }) {
  const tone = toneMap[kpi.tone] ?? toneMap.blue;
  const Icon = kpi.icon;

  const data = useMemo(
    () => (kpi.spark ?? []).map((v, i) => ({ i, v })),
    [kpi.spark]
  );

  return (
    <div className={`${cardShell} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className={`h-10 w-10 rounded-xl ${tone.iconBg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${tone.iconFg}`} aria-hidden="true" />
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tone.chipBg} ${tone.chipFg}`}>
          {kpi.deltaLabel}
        </span>
      </div>

      <div className="mt-4">
        <div className="text-3xl font-bold tracking-tight text-slate-900">
          {kpi.value}
        </div>
        <div className="text-sm text-slate-500 mt-1">{kpi.label}</div>
      </div>

      <div className="mt-4 h-14">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 6, bottom: 0 }}>
            <Area
              type="monotone"
              dataKey="v"
              stroke={tone.line}
              strokeWidth={2}
              fill={tone.fill}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
