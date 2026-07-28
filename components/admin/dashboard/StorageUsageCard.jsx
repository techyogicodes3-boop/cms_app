"use client";

import React from "react";
import { Database } from "lucide-react";
import { cardShell } from "./ui";

export default function StorageUsageCard() {
  const used = 68;
  const total = 100;
  const percentage = (used / total) * 100;

  return (
    <div className={`${cardShell} p-6`}>
      <div className="flex items-start justify-between">
        <div className="text-base font-semibold text-slate-900">Storage Usage</div>
        <Database className="h-5 w-5 text-slate-400" aria-hidden="true" />
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold tracking-tight text-slate-900">
          {used} <span className="text-lg font-normal text-slate-500">/ {total} GB</span>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="text-sm font-semibold text-blue-700 hover:text-blue-800 underline"
        >
          Upgrade Storage
        </button>
      </div>
    </div>
  );
}
