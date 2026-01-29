import React, { useState, useEffect } from 'react';
import inventoryService from '../../services/inventory.service';
import { Button } from '../../components/ui/button';
import CreateWarehouseModal from './CreateWarehouseModal';
import StockViewModal from './StockViewModal';

const WarehouseListPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getAllWarehouses();
      // API returns { code: 200, desc: "...", data: [...] }
      if (response && response.data) {
        setWarehouses(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch warehouses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleCreateSuccess = () => {
    fetchWarehouses();
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách Kho</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          + Tạo Kho Mới
        </Button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b text-left">Mã Kho</th>
                <th className="py-2 px-4 border-b text-left">Tên Kho</th>
                <th className="py-2 px-4 border-b text-left">Loại</th>
                <th className="py-2 px-4 border-b text-left">Trạng thái</th>
                <th className="py-2 px-4 border-b text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((wh) => (
                <tr key={wh.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{wh.code}</td>
                  <td className="py-2 px-4 border-b">{wh.name}</td>
                  <td className="py-2 px-4 border-b">
                    {wh.warehouseType === 1 ? 'Kho Tổng' : 'Kho Cửa Hàng'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {wh.status === 1 ? 'Hoạt động' : 'Ngưng'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Button variant="outline" size="sm" onClick={() => setSelectedWarehouseId(wh.id)}>
                      Xem Tồn Kho
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isCreateModalOpen && (
        <CreateWarehouseModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={handleCreateSuccess} 
        />
      )}

      {selectedWarehouseId && (
        <StockViewModal 
          warehouseId={selectedWarehouseId} 
          onClose={() => setSelectedWarehouseId(null)} 
        />
      )}
    </div>
  );
};

export default WarehouseListPage;
