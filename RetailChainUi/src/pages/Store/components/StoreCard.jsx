import React from "react";
import { useNavigate } from "react-router-dom";
import { Store, MapPin, Package, RefreshCcw, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const StoreCard = ({ store }) => {
  const navigate = useNavigate();

  const getStatusLabel = (status) => {
    switch (status) {
      case "Active":
        return "Hoạt động";
      case "Inactive":
        return "Tạm dừng";
      case "Maintenance":
        return "Bảo trì";
      default:
        return status;
    }
  };

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
    <Card
      onClick={() => navigate(`/store/${store.id}`)}
      className="flex flex-col group transition-all hover:shadow-lg hover:border-primary/30 overflow-hidden h-full cursor-pointer"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-start gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                  {store.name}
                </h3>
                <span className="text-[10px] font-mono bg-slate-100 dark:bg-white/5 text-slate-500 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                  #{store.id}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {store.type}
              </span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("gap-1.5 px-2.5 py-1 rounded-full font-medium border shrink-0", getStatusStyle(store.status))}
          >
            <span className={cn("size-1.5 rounded-full", getStatusDotColor(store.status))}></span>
            {getStatusLabel(store.status)}
          </Badge>
        </div>

        <div className="space-y-2.5 pt-3 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
              {store.address}
              {store.city && (
                <>
                  <br />
                  <span className="text-xs">{store.city}</span>
                </>
              )}
            </p>
          </div>
          {store.warehouse && (
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
                Kho: <span className="font-medium text-slate-900 dark:text-slate-200">{store.warehouse}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StoreCard;
