import React from "react";
import { Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const InventoryHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Global Inventory Overview
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time stock levels across all active locations
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="h-9 px-4 gap-2 text-slate-700 dark:text-slate-300">
          <Calendar className="w-[18px] h-[18px]" />
          <span>This Month</span>
        </Button>
        <Button className="h-9 px-4 gap-2 bg-primary hover:bg-primary/90 text-white">
          <Download className="w-[18px] h-[18px]" />
          <span>Export Report</span>
        </Button>
      </div>
    </div>
  );
};

export default InventoryHeader;
