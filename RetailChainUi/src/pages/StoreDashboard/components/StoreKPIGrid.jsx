import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const StoreKPIGrid = ({ data }) => {
  // Default values or destructuring from data
  const { totalProductVariants = 0, totalStockQuantity = 0, lowStockCount = 0, activeStaff = 0 } = data || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Stock Items Card */}
      <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <Badge variant="secondary" className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full border-none shadow-none">
              Còn hàng
            </Badge>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tổng số lượng hàng hóa</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-primary transition-colors">{totalStockQuantity.toLocaleString()}</h3>
        </CardContent>
      </Card>

      {/* Product Variants Card */}
      <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              <span className="material-symbols-outlined">category</span>
            </div>
            <Badge variant="secondary" className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full border-none shadow-none">
              Phiên bản
            </Badge>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sản phẩm khác nhau</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors">{totalProductVariants.toLocaleString()}</h3>
        </CardContent>
      </Card>

      {/* Low Stock Card */}
      <Card className="bg-surface-light dark:bg-surface-dark border border-orange-200 dark:border-orange-900/50 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1 bg-orange-500"></div>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
              <span className="material-symbols-outlined">inventory</span>
            </div>
            <Badge variant="secondary" className="flex items-center text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-full border-none shadow-none">
              Cần chú ý
            </Badge>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Mặt hàng sắp hết</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{lowStockCount}</h3>
        </CardContent>
      </Card>

      {/* Active Staff Card */}
      <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <span className="text-xs font-medium text-slate-500 px-2 py-1">Đang làm việc</span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nhân sự hoạt động</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {activeStaff}
            {data?.totalStaff !== undefined && <span className="text-lg text-slate-400 font-normal">/{data.totalStaff}</span>}
          </h3>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreKPIGrid;

