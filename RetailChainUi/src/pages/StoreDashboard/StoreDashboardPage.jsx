import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StoreKPIGrid from "./components/StoreKPIGrid";
import StoreRevenueChart from "./components/StoreRevenueChart";
import StoreInventoryTable from "./components/StoreInventoryTable";
import LowInventoryTable from "./components/LowInventoryTable";
import { Button } from "@/components/ui/button";
import storeService from "../../services/store.service";

const StoreDashboardPage = () => {
  const { id } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const data = await storeService.getStoreById(id || 'S001');
        setStoreData(data);
      } catch (error) {
        console.error("Failed to fetch store dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading store dashboard...</div>;
  if (!storeData) return <div className="p-10 text-center">Store not found</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Heading & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{storeData.name} Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-1 shadow-sm">
            <button className="px-3 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm transition-all">Today</button>
            <button className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">Week</button>
            <button className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">Month</button>
          </div>
          <Button variant="outline" className="h-9 gap-2 bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span>{new Date().toLocaleDateString()}</span>
          </Button>
          <Button size="icon" className="h-9 w-9 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-sm shadow-primary/30">
            <span className="material-symbols-outlined text-[20px]">download</span>
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <StoreKPIGrid data={storeData.kpi} />

      {/* Main Chart Section */}
      <StoreRevenueChart />

      {/* Split Layout: Tables */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Recent Sales Orders (60%) */}
        <div className="lg:w-3/5 flex flex-col gap-4">
          <StoreInventoryTable inventory={storeData.inventory} />
        </div>
        {/* Low Inventory Products (40%) */}
        <div className="lg:w-2/5 flex flex-col gap-4">
          <LowInventoryTable items={storeData.lowStock} />
        </div>
      </div>

      <div className="pb-10"></div>
    </div>
  );
};

export default StoreDashboardPage;

