import KPIGrid from "./components/KPIGrid";
import RevenueChart from "./components/RevenueChart";
import StoreRanking from "./components/StoreRanking";
import StoreTable from "./components/StoreTable";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">Chain Overview</h2>
          <p className="text-text-muted dark:text-gray-400 mt-1">Real-time performance across 24 locations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-600 text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export
          </Button>
          <Button className="gap-2 bg-primary text-white hover:bg-primary-dark shadow-sm shadow-primary/30">
            <span className="material-symbols-outlined text-[20px]">assessment</span>
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <KPIGrid />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <StoreRanking />
      </div>

      {/* Table Section */}
      <StoreTable />
      
      <div className="pb-10"></div>
    </div>
  );
};

export default DashboardPage;
