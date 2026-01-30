import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import inventoryService from '@/services/inventory.service';

// Temporary Mock Products until Product API is ready
const MOCK_PRODUCTS = [
    { id: 1, name: "Produce Edge (XL/Red)", sku: "SKU-36912022" },
    { id: 2, name: "Produce Edge (M/White)", sku: "SKU-13311507" },
    { id: 3, name: "Produce Edge (L/White)", sku: "SKU-41949529" },
    { id: 4, name: "Certainly City (S/Blue)", sku: "SKU-99937039" },
    { id: 5, name: "Certainly City (M/White)", sku: "SKU-96779126" },
    { id: 6, name: "Certainly City (L/White)", sku: "SKU-14524825" },
    { id: 7, name: "Just Assume (XL/Red)", sku: "SKU-3523729" },
    { id: 8, name: "Just Assume (L/Black)", sku: "SKU-88227303" }
];

const CreateStockOut = () => {
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState([]);
    const [formData, setFormData] = useState({
        sourceWarehouseId: '', // Was warehouseId
        targetWarehouseId: '', // New field for Store Destination
        note: ''
    });
    const [items, setItems] = useState([
        { id: Date.now(), variantId: '', quantity: 1 }
    ]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const res = await inventoryService.getAllWarehouses();
                if (res.data) {
                    setWarehouses(res.data);
                    // Automatically select the first Central Warehouse (Type 1) as Source
                    const centralWarehouse = res.data.find(wh => wh.warehouseType === 1);
                    if (centralWarehouse) {
                        setFormData(prev => ({ ...prev, sourceWarehouseId: String(centralWarehouse.id) }));
                    }
                }
            } catch (error) {
                console.error("Failed to load warehouses", error);
            }
        };
        fetchWarehouses();
    }, []);

    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), variantId: '', quantity: 1 }]);
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

            // Use Transfer Payload Structure
            const payload = {
                sourceWarehouseId: Number(formData.sourceWarehouseId),
                targetWarehouseId: Number(formData.targetWarehouseId),
                note: formData.note,
                items: items.map(item => ({
                    variantId: Number(item.variantId),
                    quantity: Number(item.quantity)
                }))
            };

            // Call Transfer API instead of Export API
            await inventoryService.transferStock(payload);
            navigate('/stock-out'); // Or navigate to transfer list? User might expect to stay in Stock Out list
        } catch (error) {
            console.error("Failed to create stock out/transfer:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/stock-out">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Xuất Kho Đến Cửa Hàng</h2>
                    <p className="text-muted-foreground">Tạo phiếu xuất hàng từ Kho Tổng đến các Kho Cửa Hàng.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* General Info */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Thông Tin Chung</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">




                        {/* Hidden Source Warehouse (Central) - Implied BUT VISIBLE as Read-only */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kho Xuất (Kho Tổng)</label>
                            <Input
                                disabled
                                value={warehouses.find(w => String(w.id) === formData.sourceWarehouseId)?.name || "Đang tải..."}
                                className="bg-muted"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Xuất Kho Đến Cửa Hàng (Kho Đích)</label>
                            <Select
                                value={formData.targetWarehouseId}
                                onValueChange={(val) => setFormData({ ...formData, targetWarehouseId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn kho cửa hàng nhận hàng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses
                                        .filter(wh => wh.warehouseType === 2) // Target must be Store Warehouse
                                        .map(wh => (
                                            <SelectItem key={wh.id} value={String(wh.id)}>
                                                {wh.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ghi Chú Xuất Kho</label>
                            <Textarea
                                placeholder="Nhập ghi chú xuất hàng..."
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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
                                    <TableHead className="w-[40%]">Sản Phẩm (SKU)</TableHead>
                                    <TableHead>Số Lượng</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Select
                                                value={String(item.variantId)}
                                                onValueChange={(val) => handleItemChange(item.id, 'variantId', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn sản phẩm" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {MOCK_PRODUCTS.map(p => (
                                                        <SelectItem key={p.id} value={String(p.id)}>
                                                            {p.name} - {p.sku}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                            <Link to="/stock-out">
                                <Button variant="outline">Hủy Bỏ</Button>
                            </Link>
                            <Button onClick={handleSubmit} disabled={submitting || !formData.sourceWarehouseId || !formData.targetWarehouseId}>
                                {submitting ? "Đang xử lý..." : "Lưu Phiếu Xuất"}
                                <Save className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateStockOut;
