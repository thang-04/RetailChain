import React, { useEffect, useState, useCallback } from "react";
import InventoryHeader from "./components/InventoryHeader";
import InventoryStats from "./components/InventoryStats";
import InventoryFilter from "./components/InventoryFilter";
import InventoryTable from "./components/InventoryTable";
import inventoryService from "../../services/inventory.service";

const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getInventoryHistoryRecords();
      setInventoryData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch inventory history:", err);
      setError(err?.message || "Không tải được dữ liệu lịch sử tồn kho.");
      setInventoryData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <InventoryHeader />
      <InventoryStats />
      
      {/* Main Table Section */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col flex-1">
        <InventoryFilter />
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
            onFetchDetail={inventoryService.getInventoryHistoryRecordById}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
