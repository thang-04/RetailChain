import React, { useState, useEffect } from 'react';
import inventoryService from '../../services/inventory.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

const StockViewModal = ({ warehouseId, onClose }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Dialog open={!!warehouseId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Tồn Kho Chi Tiết (ID: {warehouseId})</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="py-4 text-center">Đang tải dữ liệu tồn kho...</div>
        ) : stocks.length === 0 ? (
          <div className="py-4 text-center text-gray-500">Kho này chưa có hàng hóa nào.</div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">Sản Phẩm</th>
                  <th className="px-4 py-2 text-left">SKU</th>
                  <th className="px-4 py-2 text-right">Số Lượng</th>
                  <th className="px-4 py-2 text-right">Cập Nhật Cuối</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{item.productName}</td>
                    <td className="px-4 py-2">{item.sku}</td>
                    <td className="px-4 py-2 text-right font-medium">{item.quantity}</td>
                    <td className="px-4 py-2 text-right text-gray-500">{item.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StockViewModal;
