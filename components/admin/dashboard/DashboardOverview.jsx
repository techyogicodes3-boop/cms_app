"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Download, FileText, MessageSquare, Package, Users } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/axios";
import { downloadAuthenticatedFile } from "@/utils/downloadFile";

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
  const [commerce, setCommerce] = useState({ orders: [], inquiries: [] });
  const [downloading, setDownloading] = useState(null);

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

  useEffect(() => {
    let mounted = true;
    api.get('/api/v1/admin/commerce/activity')
      .then((response) => {
        if (mounted && response.data?.success) setCommerce(response.data.data || { orders: [], inquiries: [] });
      })
      .catch(() => {
        // Catalogue/user dashboard remains usable if commerce data cannot load.
      });
    return () => { mounted = false; };
  }, []);

  const parents = useMemo(() => summary.catalogues || [], [summary.catalogues]);
  const children = useMemo(() => summary.items || [], [summary.items]);
  const users = useMemo(() => summary.users || [], [summary.users]);

  const handleDownload = async (type) => {
    if (downloading) return;
    setDownloading(type);
    try {
      const isOrders = type === 'orders';
      await downloadAuthenticatedFile(
        `/api/v1/admin/reports/${isOrders ? 'orders' : 'inquiries'}.xls`,
        `chocotraill-${isOrders ? 'orders' : 'inquiries'}.xls`
      );
      toast.success(`${isOrders ? 'Orders' : 'Inquiries'} report downloaded`);
    } catch (error) {
      const status = error?.response?.status;
      const message = status === 404
        ? 'Report API is not deployed on the backend yet.'
        : status === 403
          ? 'Only administrators can download reports.'
          : error?.message || 'Could not download the report.';
      toast.error(message);
    } finally {
      setDownloading(null);
    }
  };

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

      <section className="overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] shadow-[0_10px_30px_rgba(43,20,14,0.08)]">
        <div className="flex flex-col gap-4 border-b border-[#E8D8CC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="brand-serif text-2xl font-bold text-[#2E1A14]">Orders & inquiries</h2>
            <p className="mt-1 text-sm text-[#7A625A]">Latest forms saved before customers continue to WhatsApp.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => handleDownload('inquiries')} disabled={Boolean(downloading)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#C98A78] px-3 text-sm font-bold text-[#4A2318] hover:bg-[#F6ECDD] disabled:cursor-not-allowed disabled:opacity-60"><Download className="h-4 w-4" /> {downloading === 'inquiries' ? 'Downloading…' : 'Inquiries Excel'}</button>
            <button type="button" onClick={() => handleDownload('orders')} disabled={Boolean(downloading)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#D85C6B] px-3 text-sm font-bold text-white hover:bg-[#4A2318] disabled:cursor-not-allowed disabled:opacity-60"><Download className="h-4 w-4" /> {downloading === 'orders' ? 'Downloading…' : 'Orders Excel'}</button>
          </div>
        </div>
        <div className="grid lg:grid-cols-2">
          <div className="border-b border-[#E8D8CC] p-5 lg:border-b-0 lg:border-r">
            <h3 className="flex items-center gap-2 font-bold"><FileText className="h-4 w-4 text-[#D85C6B]" /> Latest orders ({commerce.orders?.length || 0})</h3>
            <div className="mt-3 space-y-2">
              {(commerce.orders || []).slice(0, 5).map((order) => <div key={order.uuid} className="flex items-center justify-between gap-3 rounded-lg bg-[#FFF9F3] p-3 text-sm"><div className="min-w-0"><p className="truncate font-semibold">{order.customer?.name || 'Customer'}</p><p className="truncate text-xs text-[#7A625A]">{order.items?.map((item) => item.name).join(', ')}</p></div><div className="shrink-0 text-right"><p className="font-bold">₹{Number(order.total || 0).toLocaleString('en-IN')}</p><p className="text-xs text-[#7A625A]">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p></div></div>)}
              {!commerce.orders?.length && <p className="py-3 text-sm text-[#7A625A]">No checkout forms submitted yet.</p>}
            </div>
          </div>
          <div className="p-5">
            <h3 className="flex items-center gap-2 font-bold"><MessageSquare className="h-4 w-4 text-[#D85C6B]" /> Latest inquiries ({commerce.inquiries?.length || 0})</h3>
            <div className="mt-3 space-y-2">
              {(commerce.inquiries || []).slice(0, 5).map((inquiry) => <div key={inquiry.uuid} className="flex items-center justify-between gap-3 rounded-lg bg-[#FFF9F3] p-3 text-sm"><div className="min-w-0"><p className="truncate font-semibold">{inquiry.name}</p><p className="truncate text-xs text-[#7A625A]">{inquiry.email} · {inquiry.mobile}</p></div><div className="shrink-0 text-right"><p className="max-w-36 truncate text-xs font-semibold">{inquiry.subject}</p><p className="text-xs text-[#7A625A]">{new Date(inquiry.createdAt).toLocaleDateString('en-IN')}</p></div></div>)}
              {!commerce.inquiries?.length && <p className="py-3 text-sm text-[#7A625A]">No contact forms submitted yet.</p>}
            </div>
          </div>
        </div>
      </section>

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
