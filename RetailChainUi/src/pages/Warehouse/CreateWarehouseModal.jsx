import React, { useState, useEffect } from 'react';
import inventoryService from '../../services/inventory.service';
import storeService from '../../services/store.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Building2, MapPin, Phone, User, FileText, Box, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const CreateWarehouseModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    warehouseType: '2',
    storeId: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    contactName: '',
    contactPhone: '',
    description: '',
    status: 1
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
        code: initialData.code || '',
        name: initialData.name || '',
        warehouseType: String(initialData.warehouseType) || '2',
        storeId: initialData.storeId ? String(initialData.storeId) : '',
        address: initialData.address || '',
        province: initialData.province || '',
        district: initialData.district || '',
        ward: initialData.ward || '',
        contactName: initialData.contactName || '',
        contactPhone: initialData.contactPhone || '',
        description: initialData.description || '',
        status: initialData.status || 1
      });
    } else {
      setFormData({
        name: '',
        code: '',
        warehouseType: '2',
        storeId: '',
        address: '',
        province: '',
        district: '',
        ward: '',
        contactName: '',
        contactPhone: '',
        description: '',
        status: 1
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
        code: initialData ? initialData.code : generateWarehouseCode(),
        warehouseType: parseInt(formData.warehouseType),
        storeId: formData.storeId ? parseInt(formData.storeId) : null,
        status: formData.status || 1
      };

      if (initialData) {
        await inventoryService.updateWarehouse(initialData.id, payload);
      } else {
        await inventoryService.createWarehouse(payload);
      }

      toast.success(initialData ? "Cập nhật kho thành công!" : "Tạo kho thành công!");
      onSuccess();
    } catch (error) {
      console.error("Error saving warehouse:", error);
      toast.error("Lỗi: " + (error.response?.data?.desc || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {initialData ? 'Cập Nhật Kho' : 'Tạo Kho Mới'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Mã Kho - Auto generated */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Box className="w-4 h-4" />
              <span>Mã kho tự động: <span className="font-mono font-medium text-foreground">{initialData?.code || 'WH-XXXXXX'}</span></span>
            </div>
          </div>

          {/* Tên Kho & Loại Kho */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Tên Kho <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Nhập tên kho" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Box className="w-3 h-3" /> Loại Kho
              </Label>
              <Select 
                value={formData.warehouseType} 
                onValueChange={(val) => handleSelectChange('warehouseType', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">🏢 Kho Tổng</SelectItem>
                  <SelectItem value="2">🏪 Kho Cửa Hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cửa hàng liên kết (chỉ hiện khi là Kho Cửa Hàng) */}
          {formData.warehouseType === '2' && (
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Cửa Hàng Liên Kết
              </Label>
              <Select 
                value={formData.storeId} 
                onValueChange={(val) => handleSelectChange('storeId', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cửa hàng liên kết" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map(store => (
                    <SelectItem key={store.dbId} value={String(store.dbId)}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Trạng thái (chỉ hiện khi edit) */}
          {initialData && (
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Trạng Thái
              </Label>
              <Select 
                value={String(formData.status)} 
                onValueChange={(val) => handleSelectChange('status', parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">✅ Hoạt động</SelectItem>
                  <SelectItem value="0">❌ Đã khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Địa chỉ */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Địa chỉ
            </Label>
            <Input 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              placeholder="Số nhà, đường, phường/xã" 
            />
          </div>

          {/* Tỉnh/Thành - Quận/Huyện */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province" className="text-xs">Tỉnh/TP</Label>
              <Input 
                id="province" 
                name="province" 
                value={formData.province} 
                onChange={handleChange} 
                placeholder="TP. Hồ Chí Minh" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district" className="text-xs">Quận/Huyện</Label>
              <Input 
                id="district" 
                name="district" 
                value={formData.district} 
                onChange={handleChange} 
                placeholder="Quận 1" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ward" className="text-xs">Phường/Xã</Label>
              <Input 
                id="ward" 
                name="ward" 
                value={formData.ward} 
                onChange={handleChange} 
                placeholder="Phường Bến Nghé" 
              />
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName" className="flex items-center gap-1">
                <User className="w-3 h-3" /> Người liên hệ
              </Label>
              <Input 
                id="contactName" 
                name="contactName" 
                value={formData.contactName} 
                onChange={handleChange} 
                placeholder="Nguyễn Văn A" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> Số điện thoại
              </Label>
              <Input 
                id="contactPhone" 
                name="contactPhone" 
                value={formData.contactPhone} 
                onChange={handleChange} 
                placeholder="0912 345 678" 
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-1">
              <FileText className="w-3 h-3" /> Mô tả
            </Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Mô tả về kho, ghi chú thêm..." 
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-1" /> Hủy
            </Button>
            <Button type="submit" disabled={loading} className="gap-1">
              {loading ? 'Đang xử lý...' : (
                <>
                  <Save className="w-4 h-4" /> {initialData ? 'Cập Nhật' : 'Tạo Mới'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWarehouseModal;
