"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { cardShell } from "./ui";

const COLORS = ["#3A211E", "#C9963A", "#FFF8ED", "#3A211E", "#C9963A"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-md px-3 py-2 shadow-md">
      <div className="text-xs text-slate-500">{payload[0].name}</div>
      <div className="text-sm font-semibold text-slate-900">{payload[0].value}%</div>
    </div>
  );
}

export default function CustomerDemographicsCard() {
  const data = useMemo(
    () => [
      { name: "25-34", value: 35 },
      { name: "35-44", value: 28 },
      { name: "18-24", value: 15 },
      { name: "45-54", value: 15 },
      { name: "55+", value: 7 },
    ],
    []
  );

  return (
    <div className={`${cardShell} p-6`}>
      <div className="text-base font-semibold text-slate-900 mb-4">Customer Demographics</div>
      <div className="h-[320px] rounded-2xl border border-slate-200/70 bg-white/60 backdrop-blur-md hover:border-slate-300/80 transition-colors p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ value }) => `${value}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="square"
              wrapperStyle={{ paddingLeft: "20px" }}
              formatter={(value) => <span className="text-sm text-slate-700">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
