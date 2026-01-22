import React from "react";
import { Plus, Home, ChevronRight, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import StoreFilter from "./components/StoreFilter";
import StoreList from "./components/StoreList";

// Mock Data
const MOCK_STORES = [
  {
    id: "042",
    name: "Downtown Flagship",
    type: "Retail • Large Format",
    status: "Active",
    address: "123 Main St, Suite 100",
    city: "New York, NY 10001",
    warehouse: "North-1 Dist.",
  },
  {
    id: "043",
    name: "Uptown Boutique",
    type: "Retail • Small Format",
    status: "Active",
    address: "456 Broadway",
    city: "New York, NY 10012",
    warehouse: "North-1 Dist.",
  },
  {
    id: "045",
    name: "Jersey City Outlet",
    type: "Outlet • Standard",
    status: "Inactive",
    address: "789 Oak Lane",
    city: "Jersey City, NJ 07302",
    warehouse: "West-2 Hub",
  },
  {
    id: "048",
    name: "Brooklyn Heights",
    type: "Retail • Standard",
    status: "Active",
    address: "55 Montague St",
    city: "Brooklyn, NY 11201",
    warehouse: "North-1 Dist.",
  },
  {
    id: "052",
    name: "SoHo Pop-up",
    type: "Popup • Temporary",
    status: "Maintenance",
    address: "101 Spring St",
    city: "New York, NY 10012",
    warehouse: "North-1 Dist.",
  },
];

const StorePage = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
     
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          {/* Page Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Store Management
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Monitor performance and manage details for all 45 retail locations.
              </p>
            </div>
            <Button className="gap-2 shadow-sm shadow-primary/30 hover:translate-y-[-1px] transition-all">
              <Plus className="w-5 h-5" />
              <span>Add Store</span>
            </Button>
          </div>

          {/* Filter Bar */}
          <StoreFilter />

          {/* Store List */}
          <StoreList stores={MOCK_STORES} />

          {/* Pagination */}
          <div className="bg-white dark:bg-[#1a262a] rounded-xl border border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-900 dark:text-white">1-5</span> of <span className="font-semibold text-slate-900 dark:text-white">45</span> stores
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
    </div>
  );
};

export default StorePage;
