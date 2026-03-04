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
import supplierService from '@/services/supplier.service';

const CreateStockIn = () => {
    const navigate = useNavigate();
    // const { toast } = useToast();
    const [warehouses, setWarehouses] = useState([]);
    const [productVariants, setProductVariants] = useState([]); // State for real product variants
    const [suppliers, setSuppliers] = useState([]); // State for suppliers
    const [formData, setFormData] = useState({
        supplierId: '', // Changed to ID
        warehouseId: '',
        note: ''
    });
    const [items, setItems] = useState([
        { id: Date.now(), variantId: '', quantity: 1 }
    ]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Parallel fetch: Warehouses + Products + Suppliers
                const [warehouseRes, productRes, supplierRes] = await Promise.all([
                    inventoryService.getAllWarehouses(),
                    inventoryService.getAllProducts(),
                    supplierService.getAllSuppliers()
                ]);

                if (warehouseRes.data) {
                    setWarehouses(warehouseRes.data);
                    // Automatically select the first Central Warehouse (Type 1)
                    const centralWarehouse = warehouseRes.data.find(wh => wh.warehouseType === 1);
                    if (centralWarehouse) {
                        setFormData(prev => ({ ...prev, warehouseId: String(centralWarehouse.id) }));
                    }
                }

                if (supplierRes.data) {
                    setSuppliers(supplierRes.data);
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


    const isFormInvalid = useMemo(() => {
        if (!formData.warehouseId) return true;
        if (items.length === 0) return true;
        const hasInvalidItem = items.some(item => !item.variantId || !item.quantity || Number(item.quantity) <= 0);
        if (hasInvalidItem) return true;
        return false;
    }, [items, formData.warehouseId]);

    const handleSubmit = async () => {
        // Validation check
        if (isFormInvalid) {
            // TODO: Replace with a proper toast notification
            alert("Vui lòng điền đầy đủ thông tin sản phẩm và số lượng hợp lệ.");
            return;
        }

        try {
            setSubmitting(true);

            // Format payload for backend
            const payload = {
                warehouseId: Number(formData.warehouseId),
                supplierId: formData.supplierId ? Number(formData.supplierId) : null,
                note: formData.note,
                items: items.map(item => ({
                    variantId: Number(item.variantId),
                    quantity: Number(item.quantity),
                    note: ""
                }))
            };

            await inventoryService.importStock(payload);
            navigate('/stock-in');
        } catch (error) {
            console.error("Failed to create stock in:", error);
            // TODO: Replace with a proper toast notification
            alert("Đã có lỗi xảy ra khi tạo phiếu nhập. Vui lòng thử lại.");
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
                            <label className="text-sm font-medium">Nhà Cung Cấp</label>
                            <Select
                                value={formData.supplierId}
                                onValueChange={(val) => setFormData({ ...formData, supplierId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhà cung cấp" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.length > 0 ? (
                                        suppliers.map(sup => (
                                            <SelectItem key={sup.id} value={String(sup.id)}>
                                                {sup.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="loading" disabled>Đang tải danh sách...</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ghi Chú</label>
                            <Textarea
                                placeholder="Nhập ghi chú nhập kho..."
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
                                                        productVariants.map(v => (
                                                            <SelectItem key={v.id} value={String(v.id)}>
                                                                {v.name}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="loading" disabled>Đang tải danh sách...</SelectItem>
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
                            <Link to="/stock-in">
                                <Button variant="outline">Hủy Bỏ</Button>
                            </Link>
                            <Button onClick={handleSubmit} disabled={submitting || isFormInvalid}>
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
