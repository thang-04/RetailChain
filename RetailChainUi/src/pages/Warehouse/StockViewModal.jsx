import React, { useState, useEffect } from 'react';
import inventoryService from '../../services/inventory.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Package, 
  Search, 
  Barcode, 
  Calendar, 
  Package2,
  X,
  RefreshCw,
  Warehouse,
  MapPin,
  User,
  Phone,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Home,
  Building2,
  Contact,
  Mail
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const StockViewModal = ({ warehouseId, onClose, warehouseData }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (warehouseId) {
      const fetchStock = async () => {
        try {
          setLoading(true);
          const response = await inventoryService.getStockByWarehouse(warehouseId);
          if (response && response.data) {
            setStocks(response.data);
          }
        } catch (error) {
          console.error("Error fetching stock:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchStock();
    }
  }, [warehouseId]);

  // Filter stocks based on search
  const filteredStocks = stocks.filter(item => 
    item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals
  const totalItems = stocks.length;
  const totalQuantity = stocks.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const outOfStock = stocks.filter(item => item.quantity === 0).length;
  const lowStock = stocks.filter(item => item.quantity > 0 && item.quantity < 10).length;
  const inStock = stocks.filter(item => item.quantity >= 10).length;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get badge color based on quantity
  const getQuantityBadge = (quantity) => {
    if (quantity === 0) return { variant: 'destructive', text: 'Hết hàng', icon: XCircle };
    if (quantity < 10) return { variant: 'warning', text: 'Sắp hết', icon: AlertCircle };
    return { variant: 'secondary', text: 'Còn hàng', icon: CheckCircle2 };
  };

  // Build full address
  const fullAddress = warehouseData ? [
    warehouseData.address,
    warehouseData.ward,
    warehouseData.district,
    warehouseData.province
  ].filter(Boolean).join(', ') : '';

  return (
    <Dialog open={!!warehouseId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 flex flex-col bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800" showClose={false}>
        {/* Header với gradient - cố định */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-6 text-white shrink-0">
          <DialogHeader className="text-white">
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Warehouse className="w-6 h-6" />
              </div>
              <span>Chi Tiết Kho Hàng</span>
            </DialogTitle>
          </DialogHeader>
          
          {/* Warehouse Info Pills */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm text-sm">
              <Package className="w-4 h-4" />
              <span>Kho #{warehouseId}</span>
            </div>
            {warehouseData?.name && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm text-sm">
                <Warehouse className="w-4 h-4" />
                <span>{warehouseData.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm text-sm">
              <Clock className="w-4 h-4" />
              <span>Cập nhật: {new Date().toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>

        {/* Thông tin kho chi tiết */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Loại kho */}
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Loại kho</p>
                <p className="font-semibold text-sm">
                  {warehouseData?.warehouseLevel === 1 ? 'Kho Tổng' : 'Kho Con'}
                </p>
              </div>
            </div>

            {/* Kho cha - chỉ hiển thị khi là kho con */}
            {warehouseData?.warehouseLevel !== 1 && (
              <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Home className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Kho cha</p>
                  <p className="font-semibold text-sm">
                    {warehouseData?.parentWarehouseName || '-'}
                  </p>
                </div>
              </div>
            )}

            {/* Cửa hàng liên kết */}
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Store className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cửa hàng liên kết</p>
                <p className="font-semibold text-sm">
                  {warehouseData?.storeName || '-'}
                </p>
              </div>
            </div>

            {/* Trạng thái */}
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
              <div className={`p-2 rounded-lg ${warehouseData?.status === 1 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                <CheckCircle2 className={`w-5 h-5 ${warehouseData?.status === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Trạng thái</p>
                <p className={`font-semibold text-sm ${warehouseData?.status === 1 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {warehouseData?.status === 1 ? 'Hoạt động' : 'Đã khóa'}
                </p>
              </div>
            </div>
          </div>

          {/* Địa chỉ & Liên hệ */}
          {(fullAddress || warehouseData?.contactName || warehouseData?.contactPhone) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Địa chỉ */}
              {fullAddress && (
                <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Địa chỉ</p>
                    <p className="font-semibold text-sm">{fullAddress}</p>
                  </div>
                </div>
              )}

              {/* Thông tin liên hệ */}
              {(warehouseData?.contactName || warehouseData?.contactPhone) && (
                <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                  <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                    <Contact className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Liên hệ</p>
                    <p className="font-semibold text-sm">{warehouseData?.contactName || '-'}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {warehouseData?.contactPhone || '-'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-muted-foreground">Đang tải dữ liệu tồn kho...</span>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Stats Cards - Glassmorphism Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Tổng SKU */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/30 p-4 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium">Tổng SKU</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalItems}</p>
                  </div>
                </div>
              </div>

              {/* Tổng Số Lượng */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border border-green-200/50 dark:border-green-800/30 p-4 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-green-600/70 dark:text-green-400/70 font-medium">Tổng SL</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{totalQuantity.toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              </div>

              {/* Còn hàng */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 p-4 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium">Còn hàng</p>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{inStock}</p>
                  </div>
                </div>
              </div>

              {/* Cảnh báo */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border border-orange-200/50 dark:border-orange-800/30 p-4 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-orange-600/70 dark:text-orange-400/70 font-medium">Cảnh báo</p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{outOfStock + lowStock}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search với style đẹp hơn */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="🔍 Tìm kiếm theo tên sản phẩm hoặc mã SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-transparent focus:border-blue-400 rounded-lg shadow-sm transition-all duration-200"
                />
              </div>
            </div>

            {/* Table với style mới */}
            {filteredStocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    <Package className="w-10 h-10 opacity-50" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    {totalItems}
                  </div>
                </div>
                <p className="text-lg font-medium">
                  {searchTerm ? 'Không tìm thấy sản phẩm nào phù hợp' : 'Kho này chưa có hàng hóa nào'}
                </p>
                <p className="text-sm opacity-70 mt-1">
                  {searchTerm ? 'Thử từ khóa tìm kiếm khác' : 'Hãy thêm sản phẩm vào kho để hiển thị tại đây'}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[60px] font-bold text-slate-700 dark:text-slate-200">STT</TableHead>
                      <TableHead className="font-bold text-slate-700 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-500" /> 
                          <span>Sản Phẩm</span>
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-700 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <Barcode className="w-4 h-4 text-indigo-500" /> 
                          <span>Mã SKU</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-right font-bold text-slate-700 dark:text-slate-200">
                        <div className="flex items-center justify-end gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" /> 
                          <span>Số Lượng</span>
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-700 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-500" /> 
                          <span>Trạng Thái</span>
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-700 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-500" /> 
                          <span>Cập Nhật</span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStocks.map((item, index) => {
                      const qtyBadge = getQuantityBadge(item.quantity);
                      const BadgeIcon = qtyBadge.icon;
                      return (
                        <TableRow 
                          key={index} 
                          className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors duration-150 cursor-pointer"
                        >
                          <TableCell className="font-semibold text-slate-500">{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-800 dark:text-slate-100">{item.productName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                              {item.sku}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold">
                              <span className={`${
                                item.quantity === 0 ? 'text-red-600 bg-red-50 dark:bg-red-950/30' : 
                                item.quantity < 10 ? 'text-orange-600 bg-orange-50 dark:bg-orange-950/30' : 
                                'text-green-600 bg-green-50 dark:bg-green-950/30'
                              }`}>
                                {item.quantity?.toLocaleString('vi-VN') || 0}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={qtyBadge.variant}
                              className={`flex items-center gap-1.5 w-fit ${
                                item.quantity === 0 ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 hover:bg-red-200' :
                                item.quantity < 10 ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 hover:bg-orange-200' :
                                'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-200'
                              }`}
                            >
                              <BadgeIcon className="w-3.5 h-3.5" />
                              {qtyBadge.text}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(item.lastUpdated)}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
        </div>

        {/* Footer - Cố định bên dưới */}
        {loading ? null : (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-slate-700 dark:text-slate-300">{filteredStocks.length}</span> / {totalItems} sản phẩm
              </div>
              {searchTerm && (
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30">
                  Đang lọc: "{searchTerm}"
                </Badge>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" /> Đóng
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Helper component for Store icon
const Store = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

export default StockViewModal;
