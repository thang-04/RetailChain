import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StoreKPIGrid from "./components/StoreKPIGrid";
import StoreRevenueChart from "./components/StoreRevenueChart";
import StoreInventoryTable from "./components/StoreInventoryTable";
import StoreStaffWidget from "./components/StoreStaffWidget";
import EditStoreModal from "./components/EditStoreModal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Edit, CalendarIcon } from "lucide-react";
import storeService from "../../services/store.service";

const StoreDashboardPage = () => {
  const { id } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date());
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const data = await storeService.getStoreById(id);
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{storeData.name} - Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Edit Store Button */}
          <Button
            variant="outline"
            className="h-9 gap-2 bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="w-4 h-4" />
            <span>Edit Store</span>
          </Button>

          <div className="flex items-center bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-1 shadow-sm">
            <button className="px-3 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm transition-all">Today</button>
            <button className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">Week</button>
            <button className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">Month</button>
          </div>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 gap-2 bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm">
                <CalendarIcon className="w-4 h-4" />
                <span>{selectedDate.toLocaleDateString()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 flex flex-col gap-3" align="end">
              <Calendar
                mode="single"
                selected={tempSelectedDate}
                onSelect={(date) => date && setTempSelectedDate(date)}
                initialFocus
              />
              <div className="flex items-center justify-end border-t border-slate-100 dark:border-slate-800 pt-3">
                <Button
                  size="sm"
                  className="h-8 px-4"
                  onClick={() => {
                    setSelectedDate(tempSelectedDate);
                    setIsPopoverOpen(false);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </PopoverContent>
          </Popover>
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
          <StoreStaffWidget staff={storeData.staff} />
        </div>
      </div>

      <div className="pb-10"></div>

      {/* Edit Store Modal */}
      <EditStoreModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        storeData={storeData}
      />
    </div>
  );
};

export default StoreDashboardPage;

