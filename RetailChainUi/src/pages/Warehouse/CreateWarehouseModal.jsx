import React, { useState, useEffect } from 'react';
import inventoryService from '../../services/inventory.service';
import storeService from '../../services/store.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const CreateWarehouseModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    warehouseType: '2', // Fixed to Store Warehouse (Child)
    storeId: ''
  });
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to generate unique code
  const generateWarehouseCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `WH-${timestamp}-${random}`;
  };

  useEffect(() => {
    // Fetch Stores
    const fetchStores = async () => {
      try {
        const data = await storeService.getAllStores();
        setStores(data);
      } catch (err) {
        console.error("Failed to load stores", err);
      }
    };
    fetchStores();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code, // Keep existing code for reference if needed, but not editable
        name: initialData.name || '',
        warehouseType: '2',
        storeId: initialData.storeId ? String(initialData.storeId) : ''
      });
    } else {
      setFormData({
        name: '',
        warehouseType: '2',
        storeId: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        code: initialData ? initialData.code : generateWarehouseCode(), // Auto-generate if new
        warehouseType: 2, // Always 2
        storeId: formData.storeId ? parseInt(formData.storeId) : null
      };

      if (initialData) {
        // Edit Mode
        await inventoryService.updateWarehouse(initialData.id, payload);
      } else {
        // Create Mode
        await inventoryService.createWarehouse(payload);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving warehouse:", error);
      alert("Lỗi: " + (error.response?.data?.desc || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Cập Nhật Kho Cửa Hàng' : 'Tạo Kho Cửa Hàng Mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Code is auto-generated */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Tên Kho</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
          </div>

          {/* Hidden Type Input (Implicitly Type 2) */}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="storeId" className="text-right">Chọn Cửa Hàng</Label>
            <Select onValueChange={(val) => handleSelectChange('storeId', val)} value={formData.storeId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn cửa hàng liên kết" />
              </SelectTrigger>
              <SelectContent>
                {stores.map(store => (
                  <SelectItem key={store.dbId} value={String(store.dbId)}>
                    {store.name} ({store.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Đang xử lý...' : (initialData ? 'Cập Nhật' : 'Tạo Mới')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWarehouseModal;
