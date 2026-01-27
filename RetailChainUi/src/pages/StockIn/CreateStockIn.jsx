import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import inventoryService from '@/services/inventory.service';

const CreateStockIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        supplier: '',
        warehouse: 'Central Warehouse',
        note: ''
    });
    const [items, setItems] = useState([
        { id: 1, product: '', quantity: 1, unit: 'pcs' }
    ]);
    const [submitting, setSubmitting] = useState(false);

    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), product: '', quantity: 1, unit: 'pcs' }]);
    };

    const handleRemoveItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleItemChange = (id, field, value) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const totalItems = items.reduce((sum, item) => sum + Number(item.quantity), 0);
            const totalValue = totalItems * 45000; // Mock calculation for import value
            
            await inventoryService.createStockIn({
                ...formData,
                items,
                totalItems,
                totalValue
            });
            
            navigate('/stock-in');
        } catch (error) {
            console.error("Failed to create stock in:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/stock-in">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tạo Phiếu Nhập Kho</h2>
                    <p className="text-muted-foreground">Điền thông tin để tạo phiếu nhập kho mới từ nhà cung cấp.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* General Info */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Thông Tin Chung</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kho Nhập</label>
                            <Select 
                                value={formData.warehouse} 
                                onValueChange={(val) => setFormData({...formData, warehouse: val})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn kho nhập" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Central Warehouse">Central Warehouse</SelectItem>
                                    <SelectItem value="Store A">Store A</SelectItem>
                                    <SelectItem value="Store B">Store B</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nhà Cung Cấp</label>
                            <Select 
                                value={formData.supplier} 
                                onValueChange={(val) => setFormData({...formData, supplier: val})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhà cung cấp" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Vinamilk Corp">Vinamilk Corp</SelectItem>
                                    <SelectItem value="Unilever VN">Unilever VN</SelectItem>
                                    <SelectItem value="Coca-Cola">Coca-Cola</SelectItem>
                                    <SelectItem value="Nestle">Nestle</SelectItem>
                                    <SelectItem value="P&G Vietnam">P&G Vietnam</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ghi Chú</label>
                            <Textarea 
                                placeholder="Nhập ghi chú nhập kho..." 
                                value={formData.note}
                                onChange={(e) => setFormData({...formData, note: e.target.value})}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Items List */}
                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Danh Sách Hàng Hóa</CardTitle>
                        <Button variant="outline" size="sm" onClick={handleAddItem} className="gap-2">
                            <Plus className="w-4 h-4" /> Thêm Sản Phẩm
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Sản Phẩm</TableHead>
                                    <TableHead>Đơn Vị</TableHead>
                                    <TableHead>Số Lượng</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Select 
                                                value={item.product} 
                                                onValueChange={(val) => handleItemChange(item.id, 'product', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn sản phẩm" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Milk 1L">Fresh Milk 1L</SelectItem>
                                                    <SelectItem value="Orange Juice">Orange Juice</SelectItem>
                                                    <SelectItem value="Shampoo">Shampoo 500ml</SelectItem>
                                                    <SelectItem value="Rice 5kg">Rice 5kg</SelectItem>
                                                    <SelectItem value="Cooking Oil">Cooking Oil 2L</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                value={item.unit} 
                                                disabled 
                                                className="bg-muted"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                type="number" 
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6 flex justify-end gap-2">
                            <Link to="/stock-in">
                                <Button variant="outline">Hủy Bỏ</Button>
                            </Link>
                            <Button onClick={handleSubmit} disabled={submitting || !formData.supplier}>
                                {submitting ? "Đang xử lý..." : "Lưu Phiếu Nhập"}
                                <Save className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateStockIn;
