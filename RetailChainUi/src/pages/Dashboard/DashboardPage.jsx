import React, { useEffect, useState } from "react";
import KPIGrid from "./components/KPIGrid";
import RevenueChart from "./components/RevenueChart";
import StoreRanking from "./components/StoreRanking";
import StoreTable from "./components/StoreTable";
import { Button } from "@/components/ui/button";
import dashboardService from "../../services/dashboard.service";
import useAuth from "../../contexts/AuthContext/useAuth";

const DashboardPage = () => {
  const [kpiData, setKpiData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [storeRanking, setStoreRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { hasRole, hasPermission, user } = useAuth();
  const isStaff = hasRole('STAFF');
  const canViewReports = hasPermission('REPORT_VIEW') || hasRole('SUPER_ADMIN') || hasRole('STORE_MANAGER');
  const canViewAllStores = hasRole('SUPER_ADMIN') || hasRole('STORE_MANAGER');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [kpi, revenue, ranking] = await Promise.all([
          dashboardService.getKPIData(),
          dashboardService.getRevenueData(),
          dashboardService.getStoreRanking()
        ]);
        setKpiData(kpi);
        setRevenueData(revenue);
        setStoreRanking(ranking);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">
            {canViewAllStores ? "Chain Overview" : "Store Dashboard"}
          </h2>
          <p className="text-text-muted dark:text-gray-400 mt-1">
            {canViewAllStores 
              ? "Real-time performance across 24 locations" 
              : `Performance for ${user?.storeName || 'your store'}`}
          </p>
        </div>
        {canViewReports && (
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
        )}
      </div>

      {/* KPI Cards */}
      <KPIGrid data={kpiData} />

      {/* Charts Section - Only for ADMIN/MANAGER */}
      {canViewAllStores && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RevenueChart data={revenueData} />
          <StoreRanking data={storeRanking} />
        </div>
      )}

      {/* Table Section - Only for ADMIN/MANAGER */}
      {canViewAllStores && <StoreTable />}
      
      <div className="pb-10"></div>
    </div>
  );
};

export default DashboardPage;

