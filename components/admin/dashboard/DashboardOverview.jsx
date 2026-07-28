"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, CheckCircle2, Package, PauseCircle, Users } from "lucide-react";
import api from "@/utils/axios";

const SUMMARY_URL = "/api/v1/admin/dashboard/summary";

function isActive(row) {
  return row?.status === "Active" || row?.isActive === true || row?.isPublished === true || row?.active === true;
}

function StatusBadge({ active }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
      active ? "bg-[#EDF7EE] text-[#6D9B72]" : "bg-[#FFF0F0] text-[#D95C5C]"
    }`}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function MetricCard({ icon: Icon, label, value, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full cursor-pointer rounded-lg border bg-[#FFFCF8] p-5 text-left shadow-[0_10px_30px_rgba(43,20,14,0.08)] transition hover:shadow-[0_16px_40px_rgba(43,20,14,0.12)] ${
        active ? "border-[#D85C6B] ring-2 ring-[#E9B8B0]/45" : "border-[#E8D8CC]"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E9B8B0]/45 text-[#D85C6B]">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#7A625A]">{label}</p>
          <p className="brand-serif mt-1 text-4xl font-bold leading-none text-[#2E1A14]">{value}</p>
        </div>
      </div>
    </button>
  );
}

function ActivityTable({ title, rows, columns, empty }) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] shadow-[0_10px_30px_rgba(43,20,14,0.08)]">
      <div className="border-b border-[#E8D8CC] px-5 py-4">
        <h2 className="brand-serif text-2xl font-bold text-[#2E1A14]">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F6ECDD] text-left text-xs font-bold uppercase tracking-wide text-[#7A625A]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8D8CC]">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-[#7A625A]" colSpan={columns.length}>{empty}</td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id || row.uuid || row.email || index} className="hover:bg-[#FFF9F3]">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-[#2E1A14]">
                      {column.render ? column.render(row) : row[column.key] || "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function DashboardOverview() {
  const [summary, setSummary] = useState({ catalogues: [], items: [], users: [], counts: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("users");

  useEffect(() => {
    let mounted = true;
    const loadSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(SUMMARY_URL);
        const json = res.data || {};
        if (!json.success) throw new Error(json?.message || json?.error || "Failed to load dashboard.");
        if (mounted) setSummary(json.data || {});
      } catch (err) {
        if (mounted) setError(err?.message || "Failed to load dashboard.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadSummary();
    return () => {
      mounted = false;
    };
  }, []);

  const parents = useMemo(() => summary.catalogues || [], [summary.catalogues]);
  const children = useMemo(() => summary.items || [], [summary.items]);
  const users = useMemo(() => summary.users || [], [summary.users]);

  const metrics = useMemo(() => [
    { id: "users", icon: Users, label: "Active Users", value: users.filter((user) => isActive(user) || !user.status).length },
    { id: "parents", icon: Package, label: "Active Parent Components", value: parents.filter(isActive).length },
    { id: "children", icon: Box, label: "Active Child Components", value: children.filter(isActive).length },
  ], [parents, children, users]);

  const activeCount = parents.filter(isActive).length + children.filter(isActive).length;
  const inactiveCount = parents.length + children.length - activeCount;

  const selectedTable = useMemo(() => {
    if (selectedMetric === "parents") {
      return {
        title: "Active Parent Components",
        rows: parents.filter(isActive).slice(0, 8),
        empty: "No active parent components found.",
        columns: [
          { key: "name", label: "Parent Name", render: (row) => row.name || row.catalogueName || "—" },
          { key: "type", label: "Description", render: (row) => row.description || row.type || "—" },
          { key: "itemsCount", label: "Child Count", render: (row) => row.itemsCount ?? row.items?.length ?? 0 },
          { key: "status", label: "Status", render: (row) => <StatusBadge active={isActive(row)} /> },
        ],
      };
    }

    if (selectedMetric === "children") {
      return {
        title: "Active Child Components",
        rows: children.filter(isActive).slice(0, 8),
        empty: "No active child components found.",
        columns: [
          { key: "name", label: "Child Name" },
          { key: "catalogueName", label: "Parent Name" },
          { key: "price", label: "Price", render: (row) => `₹${Number(row.price || 0).toLocaleString("en-IN")}` },
          { key: "status", label: "Status", render: (row) => <StatusBadge active={isActive(row)} /> },
        ],
      };
    }

    return {
      title: "Active Users",
      rows: users.filter((user) => isActive(user) || !user.status).slice(0, 8),
      empty: "No active users found.",
      columns: [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "status", label: "Status", render: (row) => <StatusBadge active={isActive(row) || !row.status} /> },
      ],
    };
  }, [selectedMetric, parents, children, users]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-[#D95C5C]/30 bg-[#FFF0F0] px-4 py-3 text-sm font-semibold text-[#D95C5C]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            {...metric}
            value={loading ? "..." : metric.value}
            active={selectedMetric === metric.id}
            onClick={() => setSelectedMetric(metric.id)}
          />
        ))}
      </div>

      <div className="">
        <ActivityTable
          title={selectedTable.title}
          rows={selectedTable.rows}
          empty={selectedTable.empty}
          columns={selectedTable.columns}
        />

        {/* <section className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.08)]">
          <h2 className="brand-serif text-2xl font-bold text-[#2E1A14]">Active vs Inactive</h2>
          <div className="mt-6 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[#2E1A14]">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#6D9B72]" /> Active</span>
                <span>{activeCount}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#F6ECDD]">
                <div className="h-full bg-[#6D9B72]" style={{ width: `${activeCount + inactiveCount ? (activeCount / (activeCount + inactiveCount)) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[#2E1A14]">
                <span className="inline-flex items-center gap-2"><PauseCircle className="h-4 w-4 text-[#D95C5C]" /> Inactive</span>
                <span>{inactiveCount}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#F6ECDD]">
                <div className="h-full bg-[#D95C5C]" style={{ width: `${activeCount + inactiveCount ? (inactiveCount / (activeCount + inactiveCount)) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </section> */}
      </div>

    </div>
  );
}
