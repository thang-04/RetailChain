import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const KPIGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <Card className="shadow-soft border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-md text-primary">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <Badge variant="secondary" className="flex items-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border-none shadow-none">
                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +5%
              </Badge>
            </div>
            <p className="text-text-muted dark:text-gray-400 text-sm font-medium">Total Chain Revenue</p>
            <p className="text-2xl font-bold text-primary mt-1">$4,250,000</p>
          </CardContent>
        </Card>
  
        {/* Card 2: Orders */}
        <Card className="shadow-soft border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-600">
                <span className="material-symbols-outlined">shopping_cart</span>
              </div>
              <Badge variant="secondary" className="flex items-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border-none shadow-none">
                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +2%
              </Badge>
            </div>
            <p className="text-text-muted dark:text-gray-400 text-sm font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-text-main dark:text-white mt-1">12,403</p>
          </CardContent>
        </Card>
  
        {/* Card 3: Active Stores */}
        <Card className="shadow-soft border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md text-purple-600">
                <span className="material-symbols-outlined">store</span>
              </div>
              <Badge variant="secondary" className="flex items-center text-xs font-bold text-text-muted bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full border-none shadow-none">
                0%
              </Badge>
            </div>
            <p className="text-text-muted dark:text-gray-400 text-sm font-medium">Active Stores</p>
            <p className="text-2xl font-bold text-text-main dark:text-white mt-1">24<span className="text-lg text-text-muted font-normal">/25</span></p>
          </CardContent>
        </Card>
  
        {/* Card 4: Low Stock */}
        <Card className="shadow-soft border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-md text-orange-600">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <Badge variant="secondary" className="flex items-center text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full border-none shadow-none">
                +1 item
              </Badge>
            </div>
            <p className="text-text-muted dark:text-gray-400 text-sm font-medium">Low Stock Alerts</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-bold text-text-main dark:text-white">8</p>
              <p className="text-sm font-bold text-orange-600">Action Needed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default KPIGrid;
