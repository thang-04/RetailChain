import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StoreFilter from "./components/StoreFilter";
import StoreList from "./components/StoreList";
import AddStoreModal from "./components/AddStoreModal";
import storeService from "../../services/store.service";

const StorePage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await storeService.getAllStores();
        setStores(data);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6 min-h-full">
          {/* Page Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Store Management
              </h2>
            </div>
            <Button
              className="gap-2 shadow-sm shadow-primary/30 hover:translate-y-[-1px] transition-all"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
              <span>Add Store</span>
            </Button>
          </div>

          {/* Filter Bar */}
          <StoreFilter />

          {/* Store List */}
          {loading ? (
            <div className="text-center py-10">Loading stores...</div>
          ) : (
            <StoreList stores={stores} />
          )}

          {/* Pagination - Pushed to bottom with mt-auto */}
          <div className="mt-auto bg-white dark:bg-[#1a262a] rounded-xl border border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-900 dark:text-white">1-{stores.length}</span> of <span className="font-semibold text-slate-900 dark:text-white">{stores.length}</span> stores
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled className="h-9 px-4 text-slate-500">
                Previous
              </Button>
              <div className="flex items-center gap-1">
                <Button className="size-9 p-0 bg-primary text-white font-bold" variant="default">1</Button>
                <Button className="size-9 p-0 text-slate-600 dark:text-slate-400 font-medium" variant="ghost">2</Button>
                <Button className="size-9 p-0 text-slate-600 dark:text-slate-400 font-medium" variant="ghost">3</Button>
                <span className="px-1 text-slate-400">...</span>
                <Button className="size-9 p-0 text-slate-600 dark:text-slate-400 font-medium" variant="ghost">9</Button>
              </div>
              <Button variant="outline" className="h-9 px-4 text-slate-600 dark:text-slate-300">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Store Modal */}
      <AddStoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default StorePage;
