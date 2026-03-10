import React, { useEffect, useState } from "react";
import KPIGrid from "./components/KPIGrid";
import RevenueChart from "./components/RevenueChart";
import StoreRanking from "./components/StoreRanking";
import StoreTable from "./components/StoreTable";
import { Button } from "@/components/ui/button";
import dashboardService from "../../services/dashboard.service";

const DashboardPage = () => {
  const [kpiData, setKpiData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [storeRanking, setStoreRanking] = useState([]);
  const [storeTable, setStoreTable] = useState([]);
  const [timeRange, setTimeRange] = useState("30days");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const summary = await dashboardService.getSummary(timeRange);
        setKpiData(summary?.kpis || []);
        setRevenueData(summary?.revenueSeries || []);
        setStoreRanking(summary?.storeRanking || []);
        setStoreTable(summary?.storeTable || []);
      } catch (error) {
        console.error("Không thể tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [timeRange]);

  if (loading) {
    return <div className="p-10 text-center">Đang tải dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight">Tổng quan chuỗi bán lẻ</h2>
          <p className="text-text-muted dark:text-gray-400 mt-1">Hiệu suất thời gian thực</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-600 text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Xuất
          </Button>
          <Button className="gap-2 bg-primary text-white hover:bg-primary-dark shadow-sm shadow-primary/30">
            <span className="material-symbols-outlined text-[20px]">assessment</span>
            Tạo báo cáo
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <KPIGrid data={kpiData} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart data={revenueData} timeRange={timeRange} onTimeRangeChange={setTimeRange} />
        <StoreRanking data={storeRanking} />
      </div>

      {/* Table Section */}
      <StoreTable data={storeTable} />
      
      <div className="pb-10"></div>
    </div>
  );
};

export default DashboardPage;

