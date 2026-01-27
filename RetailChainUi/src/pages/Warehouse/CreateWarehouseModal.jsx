import React, { useState } from 'react';
import inventoryService from '../../services/inventory.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const CreateWarehouseModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    warehouseType: '1', // Default to Main Warehouse
    storeId: ''
  });
  const [loading, setLoading] = useState(false);

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
        warehouseType: parseInt(formData.warehouseType),
        storeId: formData.storeId ? parseInt(formData.storeId) : null
      };
      await inventoryService.createWarehouse(payload);
      onSuccess();
    } catch (error) {
      console.error("Error creating warehouse:", error);
      alert("Lỗi khi tạo kho: " + (error.response?.data?.desc || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo Kho Mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">Mã Kho</Label>
            <Input id="code" name="code" value={formData.code} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Tên Kho</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="warehouseType" className="text-right">Loại Kho</Label>
            <Select onValueChange={(val) => handleSelectChange('warehouseType', val)} defaultValue={formData.warehouseType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn loại kho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Kho Tổng</SelectItem>
                <SelectItem value="2">Kho Cửa Hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.warehouseType === '2' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="storeId" className="text-right">Store ID</Label>
              <Input id="storeId" name="storeId" type="number" value={formData.storeId} onChange={handleChange} className="col-span-3" required placeholder="Nhập ID Cửa hàng" />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Đang tạo...' : 'Lưu'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWarehouseModal;
