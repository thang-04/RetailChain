import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const KPIGrid = ({ data }) => {
    // If no data, use default/empty state or loading
    const kpis = data || [
      { title: "Total Revenue", value: "---", change: "---", trend: "neutral" },
      { title: "Total Orders", value: "---", change: "---", trend: "neutral" },
      { title: "Active Stores", value: "---", change: "---", trend: "neutral" },
      { title: "Inventory Value", value: "---", change: "---", trend: "neutral" },
    ];

    // Map icons/colors based on title or trend if needed
    const getIcon = (title) => {
      if (title.includes("Revenue")) return "payments";
      if (title.includes("Orders")) return "shopping_cart";
      if (title.includes("Stores")) return "store";
      return "warning"; // Default for inventory/alerts
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="shadow-soft border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <span className="material-symbols-outlined">{getIcon(kpi.title)}</span>
                </div>
                <Badge variant="secondary" className={`flex items-center text-xs font-bold px-2 py-1 rounded-full border-none shadow-none ${kpi.trend === 'up' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
                  <span className="material-symbols-outlined text-[14px] mr-1">{kpi.trend === 'up' ? 'trending_up' : 'trending_down'}</span> {kpi.change}
                </Badge>
              </div>
              <p className="text-text-muted dark:text-gray-400 text-sm font-medium">{kpi.title}</p>
              <p className="text-2xl font-bold text-primary mt-1">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  export default KPIGrid;

