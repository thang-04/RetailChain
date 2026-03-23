import React, { useEffect, useMemo, useState, useCallback } from "react";
import InventoryHeader from "./components/InventoryHeader";
import InventoryStats from "./components/InventoryStats";
import InventoryFilter from "./components/InventoryFilter";
import InventoryTable from "./components/InventoryTable";
import inventoryService from "../../services/inventory.service";
import useAuth from "../../contexts/AuthContext/useAuth";
import { axiosPrivate } from "../../services/api/axiosClient";

const InventoryPage = () => {
  const { user, hasPermission, isSuperAdmin, isStoreManager } = useAuth();

  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [overview, setOverview] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canEditInventory =
    hasPermission("INVENTORY_UPDATE") || isSuperAdmin() || isStoreManager();
  const canChangeStore = isSuperAdmin();

  const filteredInventory = useMemo(() => {
    if (!search) return inventoryData;
    const keyword = search.toLowerCase();
    return inventoryData.filter((item) => {
      const product = item.productName?.toLowerCase() || "";
      const sku = item.sku?.toLowerCase() || "";
      const variant = item.variantName?.toLowerCase() || "";
      return (
        product.includes(keyword) ||
        sku.includes(keyword) ||
        variant.includes(keyword)
      );
    });
  }, [inventoryData, search]);

  const total = filteredInventory.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(from + pageSize, total);
  const pageData = filteredInventory.slice(from, to);

  const loadStores = useCallback(async () => {
    try {
      const raw = await axiosPrivate.get("/stores");
      const res = typeof raw === "string" ? JSON.parse(raw) : raw;
      const data = res?.data || res || [];
      const list = Array.isArray(data) ? data : [];
      setStores(list);

      if (isSuperAdmin()) {
        if (!selectedStoreId && list.length > 0) {
          setSelectedStoreId(list[0].id);
        }
      } else if (user?.storeId) {
        setSelectedStoreId(user.storeId);
      }
    } catch (err) {
      console.error("Không tải được danh sách cửa hàng:", err);
    }
  }, [isSuperAdmin, selectedStoreId, user?.storeId]);

  const fetchInventory = useCallback(async () => {
    if (!selectedStoreId) {
      setInventoryData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [stocks, overviewData] = await Promise.all([
        inventoryService.getInventoryByStore(selectedStoreId),
        inventoryService.getInventoryOverview(),
      ]);
      setInventoryData(Array.isArray(stocks) ? stocks : []);
      setOverview(overviewData);
    } catch (err) {
      console.error("Failed to fetch inventory stock:", err);
      setError(err?.message || "Không tải được dữ liệu tồn kho.");
      setInventoryData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedStoreId]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleFilterChange = (partial) => {
    if (partial.search !== undefined) {
      setSearch(partial.search);
      setPage(1);
    }
  };

  const handleStoreChange = (value) => {
    setSelectedStoreId(value ? Number(value) : null);
    setPage(1);
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <InventoryHeader
        stores={stores}
        selectedStoreId={selectedStoreId}
        onStoreChange={handleStoreChange}
        canChangeStore={canChangeStore}
      />
      <InventoryStats overview={overview} />

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col flex-1">
        <InventoryFilter
          filters={{ search }}
          onChange={handleFilterChange}
        />
        {error && (
          <div className="p-4 mx-4 mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Đang tải tồn kho cửa hàng...
          </div>
        ) : (
          <InventoryTable
            inventoryData={pageData}
            page={currentPage}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
