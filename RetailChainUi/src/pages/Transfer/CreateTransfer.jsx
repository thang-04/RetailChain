import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Trash2, Plus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import inventoryService from '@/services/inventory.service';

const CreateTransfer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fromWarehouse: 'Central Warehouse',
        toWarehouse: '',
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
            
            await inventoryService.createTransfer({
                from: formData.fromWarehouse,
                to: formData.toWarehouse,
                note: formData.note,
                items,
                totalItems,
                createdBy: "Admin" // Mock user
            });
            
            navigate('/transfers');
        } catch (error) {
            console.error("Failed to create transfer:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/transfers">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tạo Lệnh Điều Chuyển</h2>
                    <p className="text-muted-foreground">Luân chuyển hàng hóa giữa các kho và cửa hàng.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Thông Tin Vận Chuyển</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kho Nguồn (Từ)</label>
                            <Select 
                                value={formData.fromWarehouse} 
                                onValueChange={(val) => setFormData({...formData, fromWarehouse: val})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn kho nguồn" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Central Warehouse">Central Warehouse</SelectItem>
                                    <SelectItem value="Store A">Store A</SelectItem>
                                    <SelectItem value="Store B">Store B</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-center">
                            <ArrowRight className="text-muted-foreground" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kho Đích (Đến)</label>
                            <Select 
                                value={formData.toWarehouse} 
                                onValueChange={(val) => setFormData({...formData, toWarehouse: val})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn kho đích" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Central Warehouse" disabled={formData.fromWarehouse === 'Central Warehouse'}>Central Warehouse</SelectItem>
                                    <SelectItem value="Store A" disabled={formData.fromWarehouse === 'Store A'}>Store A</SelectItem>
                                    <SelectItem value="Store B" disabled={formData.fromWarehouse === 'Store B'}>Store B</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ghi Chú Vận Chuyển</label>
                            <Textarea 
                                placeholder="Nhập ghi chú..." 
                                value={formData.note}
                                onChange={(e) => setFormData({...formData, note: e.target.value})}
                            />
                        </div>
                    </CardContent>
                </Card>

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
                            <Link to="/transfers">
                                <Button variant="outline">Hủy Bỏ</Button>
                            </Link>
                            <Button onClick={handleSubmit} disabled={submitting || !formData.toWarehouse}>
                                {submitting ? "Đang xử lý..." : "Tạo Lệnh Điều Chuyển"}
                                <Save className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateTransfer;
