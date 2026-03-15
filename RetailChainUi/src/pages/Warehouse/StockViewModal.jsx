import React, { useState, useEffect } from 'react';
import inventoryService from '../../services/inventory.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Card, CardContent } from '../../components/ui/card';
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
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const StockViewModal = ({ warehouseId, onClose }) => {
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
    if (quantity === 0) return { variant: 'destructive', text: 'Hết hàng' };
    if (quantity < 10) return { variant: 'warning', text: 'Sắp hết' };
    return { variant: 'secondary', text: 'Còn hàng' };
  };

  return (
    <Dialog open={!!warehouseId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh]">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Package2 className="w-5 h-5 text-blue-600" />
            Tồn Kho Chi Tiết
            <Badge variant="outline" className="ml-2">
              Kho #{warehouseId}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Tổng SKU</p>
                      <p className="text-2xl font-bold text-blue-700">{totalItems}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-300" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Tổng Số Lượng</p>
                      <p className="text-2xl font-bold text-green-700">{totalQuantity.toLocaleString('vi-VN')}</p>
                    </div>
                    <Package className="w-8 h-8 text-green-300" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên sản phẩm hoặc SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Table */}
            {filteredStocks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>{searchTerm ? 'Không tìm thấy sản phẩm nào.' : 'Kho này chưa có hàng hóa nào.'}</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[50px]">STT</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" /> Sản Phẩm
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Barcode className="w-3 h-3" /> SKU
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          Số Lượng
                        </div>
                      </TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Cập Nhật
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStocks.map((item, index) => {
                      const qtyBadge = getQuantityBadge(item.quantity);
                      return (
                        <TableRow key={index} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <span className="font-medium">{item.productName}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {item.sku}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`font-bold ${item.quantity === 0 ? 'text-red-500' : item.quantity < 10 ? 'text-orange-500' : 'text-green-600'}`}>
                              {item.quantity?.toLocaleString('vi-VN') || 0}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={qtyBadge.variant}>
                              {qtyBadge.text}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDate(item.lastUpdated)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-sm text-muted-foreground">
                Hiển thị {filteredStocks.length} / {totalItems} sản phẩm
              </div>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4 mr-1" /> Đóng
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StockViewModal;
