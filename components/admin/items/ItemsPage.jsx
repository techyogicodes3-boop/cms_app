'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import ItemsSummaryCards from './ItemsSummaryCards';
import ItemsFiltersBar from './ItemsFiltersBar';
import ItemsGrid from './ItemsGrid';
import ItemsList from './ItemsList';
import EditItemModal from './EditItemModal';
import ItemDetailsModal from './ItemDetailsModal';
import DeleteItemModal from './DeleteItemModal';
import AddItemModal from './AddItemModal';
import Pagination from './Pagination';
import api from '@/utils/axios';


const CATALOGUE_ITEMS_API_BASE = '/api/v1/admin/catalogues';
const LIST_CATALOGUES_URL = '/api/v1/catalogues';

function formatPrice(value) {
  if (value == null) return '—';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return `₹${num.toLocaleString()}`;
}

function mapApiItemToDisplay(item) {
  const imageUrl = item.imageUrls?.[0] || item.image;
  const imagePublicIds = item.imagePublicIds || (item.imagePublicId ? [item.imagePublicId] : []);

  return {
    ...item,
    isActive: item.isActive,
    id: item.uuid,
    uuid: item.uuid,
    name: item.name ?? '',
    price: formatPrice(item.price),
    priceRaw: item.price,
    validatedDescription: item.validatedDescription ?? '',
    description: item.validatedDescription ?? item.description ?? '',
    stock: item.stock,
    status: item.isActive === false ? 'Inactive' : 'Active',
    image: imageUrl || '/placeholder-item.jpg',
    imagePublicIds,
  };


}

const SAMPLE_STATS = {
  totalItems: '0',
  totalItemsTrend: '+0%',
  activeItems: '0',
  inactiveItems: '0',
};

export default function ItemsPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const catalogueId = searchParams.get('catalogueId');
  const catalogueName = searchParams.get('catalogueName') || '';

  const [viewMode, setViewMode] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [itemsFilter, setItemsFilter] = useState('All Items');
  const [searchTerm, setSearchTerm] = useState('');
  const [parentFilter, setParentFilter] = useState(catalogueId || 'All Parents');
  const [summaryFilter, setSummaryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('Newest First');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [items, setItems] = useState([]);
  const [catalogues, setCatalogues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Header "Add New Item" button sets addItem=1 in URL; open modal and clear param
  useEffect(() => {
    if (searchParams.get('addItem') === '1') {
      setAddModalOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('addItem');
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname);
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    api.get(LIST_CATALOGUES_URL)
      .then((res) => res.data || {})
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCatalogues(json.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setParentFilter(catalogueId || 'All Parents');
  }, [catalogueId]);

  useEffect(() => {
    setLoading(true);
    setLoadError(null);

    if (catalogueId) {
      const url = `${CATALOGUE_ITEMS_API_BASE}/${encodeURIComponent(catalogueId)}/items`;
      api.get(url)
        .then((res) => res.data || {})
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            setItems(json.data.map((item) => ({
              ...mapApiItemToDisplay(item),
              catalogueId,
              catalogueName,
            })));
          } else {
            setItems([]);
            setLoadError(json?.message || json?.error || 'Failed to load items.');
          }
        })
        .catch((err) => {
          setItems([]);
          setLoadError(err?.message || 'Failed to load items.');
        })
        .finally(() => setLoading(false));
      return;
    }

    // No catalogue selected: fetch all catalogues, then all items from each (show all items)
    api.get(LIST_CATALOGUES_URL)
      .then((res) => res.data || {})
      .then((json) => {
        if (!json.success || !Array.isArray(json.data)) {
          setItems([]);
          setLoadError(json?.message || json?.error || 'Failed to load catalogues.');
          setLoading(false);
          return;
        }
        const fetchedCatalogues = json.data;
        setCatalogues(fetchedCatalogues);
        if (fetchedCatalogues.length === 0) {
          setItems([]);
          setLoading(false);
          return;
        }
        return Promise.all(
          fetchedCatalogues.map((cat) => {
            const id = cat.uuid ?? cat.id;
            const url = `${CATALOGUE_ITEMS_API_BASE}/${encodeURIComponent(id)}/items`;
            return api.get(url)
              .then((r) => r.data || {})
              .then((data) => ({
                catalogueId: id,
                catalogueName: cat.catalogueName || cat.name,
                items: data.success && Array.isArray(data.data) ? data.data : [],
              }));
          })
        );
      })
      .then((results) => {
        if (!results) return;
        const merged = results.flatMap(({ catalogueId: cid, catalogueName: cname, items: list }) =>
          list.map((item) => ({
            ...mapApiItemToDisplay(item),
            catalogueId: cid,
            catalogueName: cname,
          }))
        );
        setItems(merged);
      })
      .catch((err) => {
        setItems([]);
        setLoadError(err?.message || 'Failed to load items.');
      })
      .finally(() => setLoading(false));
  }, [catalogueId, catalogueName]);

  const itemsPerPage = 8;
  // Apply sorting based on `sortBy` selected in the filters bar
  const sortedItems = React.useMemo(() => {
    const copy = [...items];
    const key = sortBy || 'Newest First';
    switch (key) {
      case 'Oldest First':
        return copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'Name A-Z':
        return copy.sort((a, b) => {
          const na = (a.name || '').toString().toLowerCase();
          const nb = (b.name || '').toString().toLowerCase();
          return na < nb ? -1 : na > nb ? 1 : 0;
        });
      case 'Price High-Low':
        return copy.sort((a, b) => (Number(b.priceRaw) || 0) - (Number(a.priceRaw) || 0));
      case 'Price Low-High':
        return copy.sort((a, b) => (Number(a.priceRaw) || 0) - (Number(b.priceRaw) || 0));
      case 'Newest First':
      default:
        return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [items, sortBy]);
  const filteredItems = React.useMemo(() => {
    let list = sortedItems;
    if (searchTerm.trim()) {
      const needle = searchTerm.trim().toLowerCase();
      list = list.filter((item) =>
        [item.name, item.id, item.uuid, item.catalogueName]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle))
      );
    }
    if (parentFilter !== 'All Parents') {
      list = list.filter((item) => item.catalogueId === parentFilter || item.catalogueName === parentFilter);
    }
    if (summaryFilter === 'active') {
      list = list.filter((item) => item.status === 'Active');
    } else if (summaryFilter === 'inactive') {
      list = list.filter((item) => item.status === 'Inactive');
    }
    if (statusFilter !== 'All Status') {
      list = list.filter((item) => item.status === statusFilter);
    }
    return list;
  }, [sortedItems, statusFilter, summaryFilter, searchTerm, parentFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [parentFilter, searchTerm, sortBy, statusFilter, summaryFilter]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const stats = {
    ...SAMPLE_STATS,
    totalItems: String(items.length),
    activeItems: String(items.filter((i) => i.status === 'Active').length),
    inactiveItems: String(items.filter((i) => i.status === 'Inactive').length),
  };

  const selectedParentId = parentFilter !== 'All Parents' ? parentFilter : '';
  const modalCatalogueId = catalogueId || selectedParentId;
  const modalCatalogue = catalogues.find((cat) => {
    const id = cat.uuid || cat.id;
    const name = cat.catalogueName || cat.name;
    return id === modalCatalogueId || name === modalCatalogueId;
  });
  const modalCatalogueName = catalogueName || modalCatalogue?.catalogueName || modalCatalogue?.name || '';

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setDetailsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleSaveEdit = (formData) => {
    // Update item in list with API response (formData is the updated item from API)
    console.log('Saving item:', formData);
    try {
      const updated = mapApiItemToDisplay(formData);
      const updatedCatalogue = catalogues.find((cat) => (cat.uuid || cat.id) === updated.catalogueId);
      updated.catalogueName = updatedCatalogue?.catalogueName || updatedCatalogue?.name || updated.catalogueName;
      setItems((prev) => {
        let found = false;
        const next = prev.map((it) => {
          const itId = it.id ?? it.uuid ?? it._id;
          const updatedId = updated.id ?? updated.uuid ?? updated._id;
          if (itId && updatedId && itId === updatedId) {
            found = true;
            return { ...it, ...updated };
          }
          return it;
        });
        if (!found) return [updated, ...prev];
        return next;
      });
    } catch (err) {
      console.error('Error applying saved item:', err);
    }
    setEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleConfirmDelete = (item) => {
    // Delete item via API
    (async () => {
      if (!item) return;
      setDeleteLoading(true);
      setDeleteError(null);
      try {
        const id = item.id ?? item.uuid ?? item._id;
        if (!id) throw new Error('Missing item id');
        const res = await api.delete(`/api/v1/admin/items/${encodeURIComponent(id)}`);
        const json = res.data || {};
        if (json.success) {
          setItems((prev) => prev.filter((i) => (i.id ?? i.uuid ?? i._id) !== id));
          setDeleteModalOpen(false);
          setSelectedItem(null);
        } else {
          setDeleteError(json.message || json.error || 'Failed to delete item.');
        }
      } catch (err) {
        setDeleteError(err?.message || 'Failed to delete item.');
      } finally {
        setDeleteLoading(false);
      }
    })();
  };

  return (
    <div className="space-y-6">
      <ItemsSummaryCards stats={stats} selected={summaryFilter} onSelect={setSummaryFilter} />

      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm" role="alert">
          {loadError}
        </div>
      )}

      {loading && (
        <div className="py-8 text-center text-slate-500">Loading items...</div>
      )}

      {!loading && (
        <>
          <ItemsFiltersBar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            itemsFilter={itemsFilter}
            onItemsFilterChange={setItemsFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            parentFilter={parentFilter}
            onParentFilterChange={setParentFilter}
            catalogues={catalogues}
            onAdvancedFilters={() => console.log('Advanced filters')}
            onExport={() => console.log('Export')}
          />

          {items.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600">
              <p className="font-medium">
                {catalogueId ? 'No items in this catalogue.' : 'No items found.'}
              </p>
              {!catalogueId && (
                <p className="text-sm mt-1">Use the eye icon on a catalogue row to view items for that catalogue.</p>
              )}
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <ItemsGrid
                  items={paginatedItems}
                  onEdit={handleEdit}
                  onView={handleView}
                  onDelete={handleDelete}
                />
              ) : (
                <ItemsList
                  items={paginatedItems}
                  onEdit={handleEdit}
                  onView={handleView}
                  onDelete={handleDelete}
                />
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredItems.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}

          <EditItemModal
            open={editModalOpen}
            item={selectedItem}
            catalogues={catalogues}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedItem(null);
            }}
            onSave={handleSaveEdit}
          />

          <ItemDetailsModal
            open={detailsModalOpen}
            item={selectedItem}
            catalogueId={selectedItem?.catalogueId ?? catalogueId}
            catalogueName={selectedItem?.catalogueName ?? catalogueName}
            onClose={() => {
              setDetailsModalOpen(false);
              setSelectedItem(null);
            }}
            onEdit={(item) => {
              setDetailsModalOpen(false);
              setSelectedItem(item);
              setEditModalOpen(true);
            }}
          />

          <DeleteItemModal
            open={deleteModalOpen}
            item={selectedItem}
            onClose={() => {
              setDeleteModalOpen(false);
              setSelectedItem(null);
            }}
            onConfirm={handleConfirmDelete}
            loading={deleteLoading}
            error={deleteError}
          />

        </>
      )}
      {/* AddItemModal always in tree when ItemsPage is mounted so header "Add New Item" can open it */}
      <AddItemModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        catalogueId={modalCatalogueId}
        catalogueName={modalCatalogueName}
        lockCatalogueSelection={Boolean(catalogueId)}
        catalogues={catalogues}
        onItemAdded={(newItem) => setItems((prev) => [newItem, ...prev])}
      />
    </div>
  );
}
