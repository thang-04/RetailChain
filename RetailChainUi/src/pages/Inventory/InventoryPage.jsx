import React from "react";
import InventoryHeader from "./components/InventoryHeader";
import InventoryStats from "./components/InventoryStats";
import InventoryFilter from "./components/InventoryFilter";
import InventoryTable from "./components/InventoryTable";

// Mock Data from template
const MOCK_INVENTORY = [
  {
    id: 1,
    region: "NY",
    storeName: "Store A - Downtown",
    storeId: "ST-1001",
    skuCount: "1,240",
    totalStock: "15,400",
    healthScore: 98,
    lowItems: "2",
    status: "Healthy",
    lastUpdated: "2 min ago"
  },
  {
    id: 2,
    region: "CA",
    storeName: "Store B - Westside Mall",
    storeId: "ST-2045",
    skuCount: "3,500",
    totalStock: "42,150",
    healthScore: 60,
    lowItems: "23",
    status: "Warning",
    lastUpdated: "1 hr ago"
  },
  {
    id: 3,
    region: "TX",
    storeName: "Store C - Austin Flagship",
    storeId: "ST-3301",
    skuCount: "850",
    totalStock: "2,300",
    healthScore: 25,
    lowItems: "140",
    status: "Critical",
    lastUpdated: "Just now"
  },
  {
    id: 4,
    region: "WA",
    storeName: "Store D - Seattle North",
    storeId: "ST-4102",
    skuCount: "2,100",
    totalStock: "18,900",
    healthScore: 88,
    lowItems: "12",
    status: "Healthy",
    lastUpdated: "5 hrs ago"
  },
  {
    id: 5,
    region: "FL",
    storeName: "Store E - Miami Bayside",
    storeId: "ST-5509",
    skuCount: "1,800",
    totalStock: "12,500",
    healthScore: 55,
    lowItems: "45",
    status: "Warning",
    lastUpdated: "12 hrs ago"
  }
];

const InventoryPage = () => {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <InventoryHeader />
      <InventoryStats />
      
      {/* Main Table Section */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col flex-1">
        <InventoryFilter />
        <InventoryTable inventoryData={MOCK_INVENTORY} />
      </div>
    </div>
  );
};

export default InventoryPage;
