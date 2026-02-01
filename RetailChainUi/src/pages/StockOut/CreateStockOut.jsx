import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import inventoryService from '@/services/inventory.service';

const CreateStockOut = () => {
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState([]);
    const [productVariants, setProductVariants] = useState([]); // Real product variants
    const [formData, setFormData] = useState({
        sourceWarehouseId: '', // Was warehouseId
        targetWarehouseId: '', // New field for Store Destination
        note: ''
    });
    const [items, setItems] = useState([
        { id: Date.now(), variantId: '', quantity: 1 }
    ]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Parallel fetch: Warehouses + Products
                const [warehouseRes, productRes] = await Promise.all([
                    inventoryService.getAllWarehouses(),
                    inventoryService.getAllProducts() // Use inventoryService instead of productService
                ]);

                if (warehouseRes.data) {
                    setWarehouses(warehouseRes.data);
                    // Automatically select the first Central Warehouse (Type 1) as Source
                    const centralWarehouse = warehouseRes.data.find(wh => wh.warehouseType === 1);
                    if (centralWarehouse) {
                        setFormData(prev => ({ ...prev, sourceWarehouseId: String(centralWarehouse.id) }));
                    }
                }

                if (productRes.data) {
                    // Flatten the product structure to get a list of variants
                    // API returns: [{ id, name, ..., variants: [{ id, sku, size, color, ... }] }]
                    const variantsList = [];
                    productRes.data.forEach(product => {
                        if (product.variants && product.variants.length > 0) {
                            product.variants.forEach(variant => {
                                variantsList.push({
                                    id: variant.id,
                                    name: `${product.name} - ${variant.sku} (${variant.color}/${variant.size})`,
                                    sku: variant.sku,
                                    productName: product.name
                                });
                            });
                        }
                    });
                    setProductVariants(variantsList);
                }
            } catch (error) {
                console.error("Failed to load initial data", error);
                setError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối server.");
            }
        };
        fetchInitialData();
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
            setError(null); // Clear previous errors

            // Validation check
            if (!formData.sourceWarehouseId || !formData.targetWarehouseId) {
                throw new Error("Vui lòng chọn kho xuất và kho nhận.");
            }
            if (items.length === 0) {
                throw new Error("Vui lòng thêm ít nhất một sản phẩm.");
            }
            const hasInvalidItem = items.some(item => !item.variantId || !item.quantity || Number(item.quantity) <= 0);
            if (hasInvalidItem) {
                throw new Error("Vui lòng chọn sản phẩm và nhập số lượng hợp lệ.");
            }

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

            // Call Transfer API
            await inventoryService.transferStock(payload);
            navigate('/stock-out'); // Navigate back to stock out list
        } catch (error) {
            console.error("Failed to create stock out/transfer:", error);
            // Show error to user
            const errorMessage = error.response?.data?.desc || error.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
            setError(errorMessage);
            alert("Lỗi: " + errorMessage); // Show alert for now
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

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <span className="font-bold">Lỗi:</span>
                    <span>{error}</span>
                </div>
            )}

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
                                                {productVariants.length > 0 ? (
                                                    productVariants.map(p => (
                                                        <SelectItem key={p.id} value={String(p.id)}>
                                                            {p.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="loading" disabled>Đang tải sản phẩm...</SelectItem>
                                                )}
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
