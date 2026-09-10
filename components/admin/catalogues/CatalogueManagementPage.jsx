"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Package, PauseCircle } from "lucide-react";
import { cardShell } from "@/components/admin/dashboard/ui";
import { useCatalogueActions } from "@/app/admin/layout/CatalogueContext";
import { createImageEntries } from "@/utils/imageEntries";

// Components
import ViewToggle from "./ViewToggle";
import FilterSelect from "./FilterSelect";
import CatalogueRow from "./CatalogueRow";
import CatalogueCard from "./CatalogueCard";
import EditCatalogueModal from "./EditCatalogueModal";
import CreateCatalogueModal from "./CreateCatalogueModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

import { useCatalogues } from "./useCatalogues";

export default function CatalogueManagementPage() {
  const router = useRouter();
  const catalogueActions = useCatalogueActions();
  
  // View and filter state
  const [viewMode, setViewMode] = useState("table");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [summaryFilter, setSummaryFilter] = useState("all");
  
  // Catalogues data and operations
  const {
    rows,
    loading,
    loadError,
    availableTypes,
    toggleStatus,
    deleteCatalogue,
    updateCatalogue,
    createCatalogue,
  } = useCatalogues();
  
  // Edit modal state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    images: [],
    published: true,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  
  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    images: [],
    shouldAutoPublish: false,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  
  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Filter catalogues
  const filteredRows = (() => {
    let filtered = rows;

    if (summaryFilter === "active") {
      filtered = filtered.filter((r) => r.active === true);
    } else if (summaryFilter === "inactive") {
      filtered = filtered.filter((r) => r.active === false);
    }
    
    if (typeFilter !== "All Types") {
      filtered = filtered.filter((r) => r.type === typeFilter);
    }
    
    if (statusFilter === "Public") {
      filtered = filtered.filter((r) => r.active === true);
    } else if (statusFilter === "Drafts") {
      filtered = filtered.filter((r) => r.active === false);
    }
    
    return filtered;
  })();

  // Edit operations
  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditError(null);
    setEditForm({
      name: cat.name || "",
      description: cat.subtitle || "",
      images: createImageEntries(cat.imageUrls, cat.imagePublicIds, {
        imageUrl: cat.image,
        imagePublicId: cat.imagePublicId,
      }),
      published: !!cat.active,
    });
  };

  const closeEditModal = () => {
    setEditingId(null);
    setEditError(null);
  };

  const saveChanges = async () => {
    const id = editingId;
    if (id == null) return;
    const name = (editForm.name || "").trim();
    if (!name) {
      setEditError("Catalogue name is required.");
      return;
    }
    setEditLoading(true);
    setEditError(null);
    try {
      await updateCatalogue(id, editForm);
      closeEditModal();
    } catch (err) {
      setEditError(err?.message || "Failed to update catalogue.");
    } finally {
      setEditLoading(false);
    }
  };

  // Create operations
  const openCreateModal = () => {
    setCreateForm({
      name: "",
      description: "",
      images: [],
      shouldAutoPublish: false,
    });
    setCreateError(null);
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setCreateError(null);
  };

  const handleCreate = async () => {
    const name = (createForm.name || "").trim();

    if (!name) {
      setCreateError("Catalogue Name is required.");
      return;
    }

    setCreateLoading(true);
    setCreateError(null);
    try {
      await createCatalogue(createForm);
      closeCreateModal();
    } catch (err) {
      setCreateError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  // Delete operations
  const handleDelete = async (id) => {
    setDeleteError(null);
    setDeleteLoading(true);
    try {
      await deleteCatalogue(id);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err?.message || "Failed to delete catalogue.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Register create catalogue action
  useEffect(() => {
    if (!catalogueActions?.setOnOpenCreateCatalogue) return;
    catalogueActions.setOnOpenCreateCatalogue(openCreateModal);
  }, [catalogueActions]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          { id: "all", label: "All Parents", value: rows.length, icon: Package, iconBg: "bg-[#E9B8B0]/45", iconColor: "text-[#D85C6B]" },
          { id: "active", label: "Active Parents", value: rows.filter((row) => row.active).length, icon: CheckCircle, iconBg: "bg-[#EDF7EE]", iconColor: "text-[#6D9B72]" },
          { id: "inactive", label: "Inactive Parents", value: rows.filter((row) => !row.active).length, icon: PauseCircle, iconBg: "bg-[#FFF0F0]", iconColor: "text-[#D95C5C]" },
        ].map((card) => {
          const Icon = card.icon;
          const active = summaryFilter === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setSummaryFilter(card.id)}
              className={`cursor-pointer rounded-lg border bg-[#FFFCF8] p-4 text-left shadow-[0_10px_30px_rgba(43,20,14,0.08)] transition hover:shadow-[0_16px_40px_rgba(43,20,14,0.12)] ${active ? "border-[#D85C6B] ring-2 ring-[#E9B8B0]/45" : "border-[#E8D8CC]"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`${card.iconBg} rounded-lg p-2`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} aria-hidden="true" />
                </div>
                <p className="brand-serif text-3xl font-bold leading-none text-[#2E1A14]">{card.value}</p>
              </div>
              <p className="mt-3 text-xs font-semibold text-[#7A625A]">{card.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters / view row */}
      <div className="relative z-10 flex flex-col gap-3 rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-3 shadow-[0_10px_30px_rgba(43,20,14,0.08)] sm:flex-row sm:flex-wrap sm:items-center sm:p-4">
        <ViewToggle mode={viewMode} onChange={setViewMode} />
        <div className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto">
          {/* <FilterSelect
            label="All Types"
            options={availableTypes}
            value={typeFilter}
            onChange={setTypeFilter}
          /> */}

          {/* <FilterSelect
            label="All Status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          /> */}

          {/* <button
            type="button"
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            More Filters
          </button>
          <button
            type="button"
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button> */}
        </div>
      </div>

      {/* Table or Grid view */}
      {viewMode === "table" ? (
        <div className="overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] shadow-[0_10px_30px_rgba(43,20,14,0.08)]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F6ECDD]">
                <tr className="cursor-pointer text-left text-[#2E1A14]">
                  
                  <th className="cursor-pointer px-4 py-3 font-semibold">Image</th>
                  <th className="cursor-pointer px-4 py-3 font-semibold">Parent Name</th>
                  <th className="w-56 max-w-56 cursor-pointer px-4 py-3 font-semibold">Description</th>
                  <th className="cursor-pointer px-4 py-3 font-semibold">Child Count</th>
                  <th className="cursor-pointer px-4 py-3 font-semibold">Status</th>
                  <th className="cursor-pointer px-4 py-3 font-semibold">Updated On</th>
                  <th className="cursor-pointer px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadError ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-sm text-[#D95C5C]">
                      {loadError}
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-[#7A625A]">
                      Loading parents...
                    </td>
                  </tr>
                ) : filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-[#7A625A]">
                      No parent components found
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((cat, index) => (
                    <CatalogueRow
                      key={cat.id ?? `catalogue-row-${index}`}
                      cat={cat}
                      onToggleStatus={() => toggleStatus(cat.id)}
                      onEdit={() => startEdit(cat)}
                      onView={(c) => router.push(`/admin/items?catalogueId=${encodeURIComponent(c.id)}&catalogueName=${encodeURIComponent(c.name || "")}`)}
                      onDelete={setDeleteTarget}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="flex flex-col gap-3 border-t border-[#E8D8CC] bg-[#FFFCF8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="text-xs text-[#7A625A]">
              Showing <span className="font-semibold">{filteredRows.length}</span> of <span className="font-semibold">{rows.length}</span> parents
            </div>
            <div className="flex flex-wrap items-center gap-1 text-sm">
              {[1].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    n === 1 ? "bg-[#D85C6B] text-white" : "bg-white text-[#2E1A14] border border-[#E8D8CC] hover:bg-[#F6ECDD]"
                  }`}
                >
                  {n}
                </button>
               
              ))}
              
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Grid view */}
          {loadError ? (
            <div className={`${cardShell} p-6 text-center text-sm text-red-600`}>
              {loadError}
            </div>
          ) : loading ? (
            <div className={`${cardShell} p-6 text-center text-slate-500`}>
              Loading catalogues...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className={`${cardShell} p-6 text-center text-slate-500`}>
              No catalogues found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredRows.map((cat, index) => (
                  <CatalogueCard
                    key={cat.id ?? `catalogue-card-${index}`}
                    cat={cat}
                    onToggleStatus={() => toggleStatus(cat.id)}
                    onEdit={() => startEdit(cat)}
                    onView={(c) => router.push(`/admin/items?catalogueId=${encodeURIComponent(c.id)}&catalogueName=${encodeURIComponent(c.name || "")}`)}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>

              {/* Pagination footer for grid */}
              <div className={`${cardShell} mt-4 flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6`}>
                <div className="text-xs text-slate-500">
                  Showing <span className="font-semibold">{filteredRows.length}</span> of <span className="font-semibold">{rows.length}</span> catalogues
                </div>
                <div className="flex flex-wrap items-center gap-1 text-sm">
                  {[1].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        n === 1 ? "bg-blue-600 text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Modals */}
      {editingId != null && (
        <EditCatalogueModal
          open
          editForm={editForm}
          editError={editError}
          editLoading={editLoading}
          onClose={closeEditModal}
          onSave={saveChanges}
          onFormChange={setEditForm}
        />
      )}

      {isCreateOpen && (
        <CreateCatalogueModal
          open
          createForm={createForm}
          createError={createError}
          createLoading={createLoading}
          onClose={closeCreateModal}
          onCreate={handleCreate}
          onFormChange={setCreateForm}
        />
      )}

      <DeleteConfirmModal
        open={!!deleteTarget}
        deleteTarget={deleteTarget}
        deleteError={deleteError}
        deleteLoading={deleteLoading}
        onClose={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
        onConfirm={() => handleDelete(deleteTarget.id)}
      />
    </div>
  );
}
