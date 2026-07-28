"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cardShell } from "./ui";
import api from "@/utils/axios";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-md px-3 py-2 shadow-md">
      <div className="text-xs text-slate-500">{payload[0].payload.day}</div>
      <div className="text-sm font-semibold text-slate-900">{payload[0].value} purchases</div>
    </div>
  );
}

export default function PurchasePatternsCard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const getLast7Days = () => {
  const days = [];
  const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatter.format(d)); // Mon, Tue, etc.
  }

  return days;
};

  useEffect(() => {
    const fetchWeeklyPurchases = async () => {
      try {
        const res = await api.get("/api/v1/admin/dashboard/weekly-purchases");
        const json = res.data || {};
        if (json.success && Array.isArray(json.data)) {
  const last7Days = getLast7Days();
  // Convert API data to lookup map
  const apiMap = json.data.reduce((acc, item) => {
    acc[item.day] = item.value;
    return acc;
  }, {});

  const normalizedData = last7Days.map(day => ({
    day,
    value: apiMap[day] || 0,
  }));

  setData(normalizedData);
}
      } catch (error) {
        console.error("Error fetching weekly purchases:", error);
        // Set default empty data on error
        setData([
          { day: "Mon", value: 0 },
          { day: "Tue", value: 0 },
          { day: "Wed", value: 0 },
          { day: "Thu", value: 0 },
          { day: "Fri", value: 0 },
          { day: "Sat", value: 0 },
          { day: "Sun", value: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyPurchases();
  }, []);

  return (
    <div className={`${cardShell} p-6`}>
      <div className="text-base font-semibold text-slate-900 mb-4">Purchase Patterns</div>
      <div className="h-[320px] rounded-2xl border border-slate-200/70 bg-white/60 backdrop-blur-md hover:border-slate-300/80 transition-colors p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">Loading purchase data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#C9963A" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: "#3A211E", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#3A211E", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#C9963A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
