import StoreKPIGrid from "./components/StoreKPIGrid";
import StoreRevenueChart from "./components/StoreRevenueChart";
import RecentOrdersTable from "./components/RecentOrdersTable";
import LowInventoryTable from "./components/LowInventoryTable";
import { Button } from "@/components/ui/button";

const StoreDashboardPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Heading & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Here's what's happening at Store A today.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-1 shadow-sm">
            <button className="px-3 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm transition-all">Today</button>
            <button className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">Week</button>
            <button className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">Month</button>
          </div>
          <Button variant="outline" className="h-9 gap-2 bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span>Oct 24, 2023</span>
          </Button>
          <Button size="icon" className="h-9 w-9 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-sm shadow-primary/30">
            <span className="material-symbols-outlined text-[20px]">download</span>
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <StoreKPIGrid />

      {/* Main Chart Section */}
      <StoreRevenueChart />

      {/* Split Layout: Tables */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Recent Sales Orders (60%) */}
        <div className="lg:w-3/5 flex flex-col gap-4">
          <RecentOrdersTable />
        </div>
        {/* Low Inventory Products (40%) */}
        <div className="lg:w-2/5 flex flex-col gap-4">
          <LowInventoryTable />
        </div>
      </div>
      
      <div className="pb-10"></div>
    </div>
  );
};

export default StoreDashboardPage;
