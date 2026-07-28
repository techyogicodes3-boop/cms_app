"use client";

import React from "react";
import { Box, CheckCircle, PauseCircle } from "lucide-react";

export default function ItemsSummaryCards({ stats, selected = "all", onSelect }) {
  const cards = [
    {
      id: "all",
      icon: Box,
      iconBg: "bg-[#E9B8B0]/45",
      iconColor: "text-[#D85C6B]",
      label: "All Children",
      value: stats?.totalItems || "0",
    },
    {
      id: "active",
      icon: CheckCircle,
      iconBg: "bg-[#EDF7EE]",
      iconColor: "text-[#6D9B72]",
      label: "Active Children",
      value: stats?.activeItems || "0",
    },
    {
      id: "inactive",
      icon: PauseCircle,
      iconBg: "bg-[#FFF0F0]",
      iconColor: "text-[#D95C5C]",
      label: "Inactive Children",
      value: stats?.inactiveItems || "0",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const active = selected === card.id;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelect?.(card.id)}
            className={`cursor-pointer rounded-lg border bg-[#FFFCF8] p-4 text-left shadow-[0_10px_30px_rgba(43,20,14,0.08)] transition hover:shadow-[0_16px_40px_rgba(43,20,14,0.12)] ${active ? "border-[#D85C6B] ring-2 ring-[#E9B8B0]/45" : "border-[#E8D8CC]"}`}
          >
            <div className="flex items-start justify-between">
              <div className={`${card.iconBg} p-2 rounded-lg`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <p className="brand-serif text-3xl font-bold text-[#2E1A14]">{card.value}</p>
            </div>
            <p className="mt-3 text-xs font-semibold text-[#7A625A]">{card.label}</p>
          </button>
        );
      })}
    </div>
  );
}
