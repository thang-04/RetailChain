import React from "react";
import { TrendingUp, Layers, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

const InventoryStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Chain Value */}
      <Card className="p-5 border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            +2.4%
          </span>
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Chain Value</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">$12.5M</p>
      </Card>

      {/* Total Stock Quantity */}
      <Card className="p-5 border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Stock Quantity</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
          45,200 <span className="text-sm font-normal text-slate-400 ml-1">units</span>
        </p>
      </Card>

      {/* Critical Alerts */}
      <Card className="p-5 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
          <AlertTriangle className="w-24 h-24 text-red-500" />
        </div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
            Needs Attention
          </span>
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 relative z-10">Critical Alerts</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1 relative z-10">5 Stores</p>
      </Card>
    </div>
  );
};

export default InventoryStats;
