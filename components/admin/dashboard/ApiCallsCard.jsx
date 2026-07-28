"use client";

import React from "react";
import { Plug } from "lucide-react";
import { cardShell } from "./ui";

export default function ApiCallsCard() {
  const used = 8.4;
  const total = 10;
  const percentage = (used / total) * 100;

  return (
    <div className={`${cardShell} p-6`}>
      <div className="flex items-start justify-between">
        <div className="text-base font-semibold text-slate-900">API Calls</div>
        <Plug className="h-5 w-5 text-slate-400" aria-hidden="true" />
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold tracking-tight text-slate-900">
          {used}K <span className="text-lg font-normal text-slate-500">/ {total}K</span>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-amber-500 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-xs text-slate-500">Resets in 12 days</div>
      </div>
    </div>
  );
}
