import React from "react";
import { Store, MapPin, Package, Settings, RefreshCcw, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const StoreCard = ({ store }) => {
  // Map status to badge styles
  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50";
      case "Inactive":
        return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50";
      case "Maintenance":
        return "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case "Active": return "bg-emerald-500";
      case "Inactive": return "bg-amber-500";
      case "Maintenance": return "bg-gray-400";
      default: return "bg-slate-400";
    }
  };

  return (
    <Card className="flex flex-col group transition-all hover:shadow-lg hover:border-primary/30 overflow-hidden">
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  {store.name}
                </h3>
                <span className="text-[10px] font-mono bg-slate-100 dark:bg-white/5 text-slate-500 px-1.5 py-0.5 rounded">
                  #{store.id}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {store.type}
              </span>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={cn("gap-1.5 px-2.5 py-1 rounded-full font-medium border", getStatusStyle(store.status))}
          >
            <span className={cn("size-1.5 rounded-full", getStatusDotColor(store.status))}></span>
            {store.status}
          </Badge>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
              {store.address}
              <br />
              <span className="text-xs">{store.city}</span>
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Package className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Warehouse: <span className="font-medium text-slate-900 dark:text-slate-200">{store.warehouse}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
        <Button className="w-full gap-2 font-bold" variant="default">
          <Settings className="w-4 h-4" />
          Manage Store
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <RefreshCcw className="w-4 h-4" />
            Update Status
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Activity className="w-4 h-4" />
            Performance
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StoreCard;
