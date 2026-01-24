import React, { useEffect, useState } from "react";
import InventoryHeader from "./components/InventoryHeader";
import InventoryStats from "./components/InventoryStats";
import InventoryFilter from "./components/InventoryFilter";
import InventoryTable from "./components/InventoryTable";
import inventoryService from "../../services/inventory.service";

const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you might fetch store inventory or aggregated chain stock.
    // Since inventory.service.js has various methods, let's use what seems appropriate or mock it similarly if needed.
    // Looking at inventory.service.js, it has getStoreInventory, getProductChainStock, etc.
    // The MOCK_INVENTORY in this file looks like a list of stores with inventory summary.
    // Let's assume we fetch something similar or adapt.
    // For now, I'll fetch `getStoreInventory` as a placeholder or better yet,
    // I will mock the list fetch here because inventory.service.js doesn't seem to have a "getAllInventories" method exactly matching this table.
    // Wait, let's check inventory.service.js again.
    // It has: getStockInRecords, getStockLedger, getStoreInventory(storeId), getProductChainStock(productId).
    // It DOES NOT have a "List of all stores with inventory status".
    // However, I must use the service.
    // I will use `inventoryService.getStockLedger()` or similar if appropriate, BUT:
    // The UI shows "Store A", "Store B" etc. which looks like `getAllStores` from StoreService combined with inventory stats.
    // OR it could be a specific inventory report.
    // To strictly follow the plan "use inventory.service.js", I should add a method there or use an existing one.
    // Since I cannot easily modify the service to add new mock data structure matching exactly this table (unless I do so),
    // I will simulate fetching this specific list using a new method I'll add to the service file first?
    // No, I should use what's available or simple extend.
    // Actually, I'll create a local mock function inside the component that CALLS the service if possible, or just add the missing method to the service.
    // Let's add `getAllInventories` to `inventory.service.js` to match this page's needs.
    
    // BUT first, I will implement the fetch call here assuming the method exists, then I will update the service.
    // Actually, I can just define the data in the service.

    const fetchInventory = async () => {
        try {
            // This method doesn't exist yet, I need to add it to inventory.service.js
            const data = await inventoryService.getAllInventories(); 
            setInventoryData(data);
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchInventory();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <InventoryHeader />
      <InventoryStats />
      
      {/* Main Table Section */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col flex-1">
        <InventoryFilter />
        {loading ? (
           <div className="p-10 text-center">Loading inventory data...</div>
        ) : (
           <InventoryTable inventoryData={inventoryData} />
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
