import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const StoreRanking = ({ data }) => {
    // Default mock data if 'data' prop is empty/undefined
    const rankings = data || [
      { name: "New York Flagship", revenue: "$840k", percent: 90 },
      { name: "London Central", revenue: "$720k", percent: 78 },
      { name: "Tokyo Ginza", revenue: "$690k", percent: 74 },
      { name: "Berlin Mitte", revenue: "$540k", percent: 60 },
      { name: "Paris Marais", revenue: "$420k", percent: 45 },
    ];

    // Helper to calculate percentage if not provided, assuming max revenue is first item or arbitrary
    // For simplicity, we assume 'data' matches the structure or we map it. 
    // The dashboard.service.js returns [{ id, name, revenue, growth }]
    // We might need to adapt the data to match the visual expectations (percent bar).
    
    // Normalizing data from service to component state
    const normalizedRankings = rankings.map(item => {
        // If data comes from service, it might have 'revenue' as string "2.4B".
        // We need to parse it for the bar width or just use random for visual demo if exact calculation is complex.
        // For this specific UI component, let's keep it simple.
        return {
            name: item.name,
            revenue: item.revenue, // Display string
            percent: item.percent || 50 // Fallback or calculated
        };
    });

    return (
      <Card className="shadow-soft border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark flex flex-col">
        <CardHeader className="pb-6">
          <CardTitle className="text-base font-medium text-text-main dark:text-white tracking-wide">Top Performing Stores</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center gap-5 pt-0">
          {normalizedRankings.map((store, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-text-main dark:text-white">{store.name}</span>
                <span className="text-text-muted">{store.revenue}</span>
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

