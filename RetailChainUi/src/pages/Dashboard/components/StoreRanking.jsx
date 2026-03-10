import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const StoreRanking = ({ data }) => {
    const rankings = Array.isArray(data) ? data : [];
    const max = Math.max(0, ...rankings.map((s) => (typeof s?.stockQuantity === "number" ? s.stockQuantity : 0)));
    const formatNumber = (n) => (typeof n === "number" ? new Intl.NumberFormat("vi-VN").format(n) : "---");

    const normalizedRankings = rankings.map((item) => {
      const qty = typeof item?.stockQuantity === "number" ? item.stockQuantity : 0;
      const percent = max > 0 ? Math.round((qty / max) * 100) : 0;
      return {
        name: item.storeName || item.storeCode || "N/A",
        value: formatNumber(qty),
        percent,
      };
    });

    return (
      <Card className="shadow-soft border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark flex flex-col">
        <CardHeader className="pb-6">
          <CardTitle className="text-base font-medium text-text-main dark:text-white tracking-wide">Top cửa hàng theo tồn kho</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center gap-5 pt-0">
          {normalizedRankings.map((store, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-text-main dark:text-white">{store.name}</span>
                <span className="text-text-muted">{store.value}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-2 rounded-full group-hover:bg-primary-dark transition-all duration-300"
                  style={{ width: `${store.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };
  
  export default StoreRanking;

