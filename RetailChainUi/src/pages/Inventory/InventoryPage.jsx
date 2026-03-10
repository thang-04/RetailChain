import React, { useEffect, useState, useCallback } from "react";
import InventoryHeader from "./components/InventoryHeader";
import InventoryStats from "./components/InventoryStats";
import InventoryFilter from "./components/InventoryFilter";
import InventoryTable from "./components/InventoryTable";
import inventoryService from "../../services/inventory.service";
import useAuth from "../../contexts/AuthContext/useAuth";

const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [overview, setOverview] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: startOfMonth, to: endOfMonth };
  });
  const [filters, setFilters] = useState({
    search: "",
    action: "all",
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { hasPermission, hasRole } = useAuth();
  const canImport = hasPermission('STOCKIN_CREATE') || hasRole('SUPER_ADMIN') || hasRole('STORE_MANAGER');
  const canExport = hasPermission('STOCKOUT_CREATE') || hasRole('SUPER_ADMIN') || hasRole('STORE_MANAGER');

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate =
        dateRange?.from &&
        new Date(
          dateRange.from.getFullYear(),
          dateRange.from.getMonth(),
          dateRange.from.getDate(),
          0,
          0,
          0,
          0,
        );
      const endDate =
        dateRange?.to &&
        new Date(
          dateRange.to.getFullYear(),
          dateRange.to.getMonth(),
          dateRange.to.getDate(),
          23,
          59,
          59,
          999,
        );

      const [historyPage, overviewData] = await Promise.all([
        inventoryService.getInventoryHistoryRecords({
          search: filters.search,
          action: filters.action,
          fromDate: startDate,
          toDate: endDate,
          page: page - 1,
          size: pageSize,
        }),
        inventoryService.getInventoryOverview(),
      ]);
      const items = Array.isArray(historyPage?.items) ? historyPage.items : [];
      setInventoryData(items);
      setTotal(historyPage?.totalElements ?? items.length ?? 0);
      setOverview(overviewData);
    } catch (err) {
      console.error("Failed to fetch inventory history:", err);
      setError(err?.message || "Không tải được dữ liệu lịch sử tồn kho.");
      setInventoryData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, dateRange, page]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleFilterChange = (partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  };

  const handleDateChange = (range) => {
    setDateRange(range);
    setPage(1);
  };

  const handleExport = async () => {
    try {
      const startDate =
        dateRange?.from &&
        new Date(
          dateRange.from.getFullYear(),
          dateRange.from.getMonth(),
          dateRange.from.getDate(),
          0,
          0,
          0,
          0,
        );
      const endDate =
        dateRange?.to &&
        new Date(
          dateRange.to.getFullYear(),
          dateRange.to.getMonth(),
          dateRange.to.getDate(),
          23,
          59,
          59,
          999,
        );

      const csvContent = await inventoryService.exportInventoryHistory({
        search: filters.search,
        action: filters.action,
        fromDate: startDate,
        toDate: endDate,
      });

      if (!csvContent) return;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "inventory-history.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export inventory history failed:", err);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <InventoryHeader
        onExport={handleExport}
        dateRange={dateRange}
        onDateChange={handleDateChange}
        canExport={canExport && total > 0}
      />
      <InventoryStats overview={overview} />
      
      {/* Main Table Section */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col flex-1">
        <InventoryFilter filters={filters} onChange={handleFilterChange} />
        {error && (
          <div className="p-4 mx-4 mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        {loading ? (
          <div className="p-10 text-center text-slate-500">Đang tải lịch sử tồn kho...</div>
        ) : (
          <InventoryTable
            inventoryData={inventoryData}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onFetchDetail={inventoryService.getInventoryHistoryRecordById}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
