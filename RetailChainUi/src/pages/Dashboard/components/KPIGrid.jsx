import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const KPIGrid = ({ data }) => {
    const navigate = useNavigate();
    const kpis = Array.isArray(data) ? data : [];

    const desiredKeys = ["totalProducts", "activeStores", "inventoryValue", "inventoryDocuments", "totalVariants", "inventoryFlowValue", "totalStockQuantity"];
    const keyToItem = new Map(kpis.map((k) => [k.key, k]));
    const displayKpis = desiredKeys
      .map((key) => keyToItem.get(key))
      .filter(Boolean);

    const keyToRoute = {
      totalProducts: "/products",
      activeStores: "/store",
      inventoryValue: "/inventory",
      inventoryDocuments: "/inventory/ledger",
    };

    const formatNumber = (n) =>
      typeof n === "number" ? new Intl.NumberFormat("vi-VN").format(n) : "---";

    const formatMoney = (n) =>
      typeof n === "number"
        ? new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(n) + " ₫"
        : "---";

    const getIcon = (key) => {
      if (key === "totalProducts") return "inventory_2";
      if (key === "activeStores") return "store";
      if (key === "inventoryValue") return "payments";
      if (key === "inventoryDocuments") return "description";
      return "analytics";
    };

    const getValue = (kpi) => {
      if (!kpi) return "---";
      if (kpi.key === "inventoryValue") return formatMoney(kpi.value);
      return formatNumber(kpi.value);
    };

    const getTrend = (kpi) => {
      if (!kpi || typeof kpi.changePercent !== "number") return null;
      return kpi.changePercent >= 0 ? "up" : "down";
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayKpis.map((kpi, index) => {
          const trend = getTrend(kpi);
          const changeText =
            typeof kpi.changePercent === "number"
              ? `${kpi.changePercent >= 0 ? "+" : ""}${kpi.changePercent}%`
              : null;

          const route = keyToRoute[kpi.key];
          const isClickable = Boolean(route);

          return (
          <Card
            key={index}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={isClickable ? () => navigate(route) : undefined}
            onKeyDown={
              isClickable
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(route);
                    }
                  }
                : undefined
            }
            className={cn(
              "shadow-soft border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark",
              isClickable &&
                "cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            )}
          >
            <CardContent className={cn("p-6", isClickable && "group")}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <span className="material-symbols-outlined">{getIcon(kpi.key)}</span>
                </div>
                {trend && changeText ? (
                  <Badge
                    variant="secondary"
                    className={`flex items-center text-xs font-bold px-2 py-1 rounded-full border-none shadow-none ${
                      trend === "up"
                        ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                        : "text-red-600 bg-red-50 dark:bg-red-900/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px] mr-1">
                      {trend === "up" ? "trending_up" : "trending_down"}
                    </span>{" "}
                    {changeText}
                  </Badge>
                ) : null}
              </div>
              <p className="text-text-muted dark:text-gray-400 text-sm font-medium">{kpi.title}</p>
              <p className="text-2xl font-bold text-primary mt-1 group-hover:text-primary-dark transition-colors">
                {getValue(kpi)}
              </p>
            </CardContent>
          </Card>
        )})}
      </div>
    );
  };
  
  export default KPIGrid;

