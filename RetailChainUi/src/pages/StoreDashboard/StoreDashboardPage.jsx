import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StoreKPIGrid from "./components/StoreKPIGrid";
import StoreInventoryTable from "./components/StoreInventoryTable";
import StoreStaffWidget from "./components/StoreStaffWidget";
import EditStoreModal from "./components/EditStoreModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, Package, Users } from "lucide-react";
import storeService from "../../services/store.service";
import useAuth from "../../contexts/AuthContext/useAuth";

const StoreDashboardPage = () => {
  const { id } = useParams();
  const { hasPermission, hasRole, loading: authLoading } = useAuth();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Set default tab based on role after auth loads
  useEffect(() => {
    if (!authLoading) {
      const isStoreManager = hasRole('STORE_MANAGER');
      if (isStoreManager) {
        setActiveTab("overview");
      }
    }
  }, [authLoading, hasRole]);

  const canEditStore = hasPermission('STORE_UPDATE') || hasRole('SUPER_ADMIN') || hasRole('STORE_MANAGER');

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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{storeData.name} - Overview</h1>
            {storeData.status && (
              <Badge 
                variant="outline" 
                className={`gap-1 px-2 py-0.5 mt-1 border rounded-full font-medium ${
                  storeData.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                    : storeData.status === 'Inactive'
                    ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                    : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                }`}
              >
                <span className={`size-1.5 rounded-full ${
                  storeData.status === 'Active' ? 'bg-emerald-500' 
                  : storeData.status === 'Inactive' ? 'bg-amber-500' 
                  : 'bg-gray-400'
                }`}></span>
                {storeData.status}
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Edit Store Button - Only for ADMIN/MANAGER */}
          {canEditStore && (
            <Button
              variant="outline"
              className="h-9 gap-2 bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="w-4 h-4" />
              <span>Edit Store</span>
            </Button>
          )}

          <Button size="icon" className="h-9 w-9 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-sm shadow-primary/30">
            <span className="material-symbols-outlined text-[20px]">download</span>
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <StoreKPIGrid data={{ ...storeData.kpi, totalStaff: storeData.staff?.length || 0 }} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <Package className="w-4 h-4" />
            Tồn kho
          </TabsTrigger>
          <TabsTrigger value="staff" className="gap-2">
            <Users className="w-4 h-4" />
            Nhân viên
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {/* Split Layout: Tables */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Inventory Table (60%) */}
            <div className="lg:w-3/5 flex flex-col gap-4">
              <StoreInventoryTable inventory={storeData.inventory} />
            </div>
            {/* Staff Overview (40%) */}
            <div className="lg:w-2/5 flex flex-col gap-4">
              <StoreStaffWidget staff={storeData.staff} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="mt-4">
          <StoreStaffWidget staff={storeData.staff} />
        </TabsContent>
      </Tabs>

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

