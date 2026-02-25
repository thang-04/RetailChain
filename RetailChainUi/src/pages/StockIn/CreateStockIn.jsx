import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import ConfirmModal from "@/components/ui/confirmModal";
import { ArrowLeft, Save, Trash2, Plus, Loader2, Warehouse } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import inventoryService from '@/services/inventory.service';
import supplierService from '@/services/supplier.service';

// Skeleton component for loading state
const SkeletonRow = () => (
    <TableRow>
        <TableCell><div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></TableCell>
        <TableCell><div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></TableCell>
        <TableCell><div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></TableCell>
    </TableRow>
);

const CreateStockIn = () => {
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState([]);
    const [productVariants, setProductVariants] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        supplierId: '',
        warehouseId: '',
        note: ''
    });
    const [items, setItems] = useState([
        { id: Date.now(), variantId: '', quantity: 1, unitPrice: '' }
    ]);
        { id: Date.now(), variantId: '', quantity: 1 }
    ]);
    const [submitting, setSubmitting] = useState(false);
    
    // Confirmation dialog state
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    
    // Validation errors state
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [warehouseRes, productRes, supplierRes] = await Promise.all([
                    inventoryService.getAllWarehouses(),
                    inventoryService.getAllProducts(),
                    supplierService.getAllSuppliers()
                ]);

                if (warehouseRes.data) {
                    setWarehouses(warehouseRes.data);
                    const centralWarehouse = warehouseRes.data.find(wh => wh.warehouseLevel === 1);
                    if (centralWarehouse) {
                        setFormData(prev => ({ ...prev, warehouseId: String(centralWarehouse.id) }));
                    }
                }

                if (supplierRes.data) {
                    setSuppliers(supplierRes.data);
                }

                if (productRes.data) {
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
                toast.error("Không thể tải dữ liệu. Vui lòng刷新 trang.");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), variantId: '', quantity: 1, unitPrice: '' }]);
    };
        setItems([...items, { id: Date.now(), variantId: '', quantity: 1 }]);
    };

    const handleRemoveItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
            // Clear error for removed item
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[`item_${id}`];
                return newErrors;
            });
        }
    };

    const handleItemChange = (id, field, value) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
        // Clear error when user changes value
        if (field === 'variantId' || field === 'quantity') {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[`item_${id}_${field}`];
                return newErrors;
            });
        }
    };

    // Validate form and return errors
    const validateForm = () => {
        const newErrors = {};
        
        // Validate items
        items.forEach((item, index) => {
            if (!item.variantId) {
                newErrors[`item_${item.id}_variantId`] = `Vui lòng chọn sản phẩm`;
            }
            if (!item.quantity || Number(item.quantity) <= 0) {
                newErrors[`item_${item.id}_quantity`] = `Số lượng phải > 0`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isFormInvalid = useMemo(() => {
        if (!formData.warehouseId) return true;
        if (items.length === 0) return true;
        const hasInvalidItem = items.some(item => !item.variantId || !item.quantity || Number(item.quantity) <= 0);
        if (hasInvalidItem) return true;
        return false;
    }, [items, formData.warehouseId]);

    const handleSubmitClick = () => {
        if (!validateForm()) {
            toast.error("Vui lòng điền đầy đủ thông tin sản phẩm và số lượng hợp lệ.");
            return;
        }
        setShowConfirmDialog(true);
    };

    const handleConfirmSubmit = async () => {
        setShowConfirmDialog(false);
        try {
            setSubmitting(true);

            const payload = {
                warehouseId: Number(formData.warehouseId),
                supplierId: formData.supplierId ? Number(formData.supplierId) : null,
                note: formData.note,
                items: items.map(item => ({
                    variantId: Number(item.variantId),
                    quantity: Number(item.quantity),
                    unitPrice: item.unitPrice ? Number(item.unitPrice) : null,
                    note: ""
                }))
            };
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
            toast.success("Tạo phiếu nhập kho thành công!");
            navigate('/stock-in');
        } catch (error) {
            console.error("Failed to create stock in:", error);
            toast.error("Đã có lỗi xảy ra khi tạo phiếu nhập. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    // Render loading skeleton
    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-7 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-4 w-96 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1 h-fit">
                        <CardHeader>
                            <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
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
                                    <SkeletonRow />
                                    <SkeletonRow />
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

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

                        {/* Kho nhập hàng */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kho Nhập Hàng</label>
                            <Select
                                value={formData.warehouseId}
                                onValueChange={(val) => setFormData({ ...formData, warehouseId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn kho" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.length > 0 ? (
                                        warehouses.map(wh => (
                                            <SelectItem key={wh.id} value={String(wh.id)}>
                                                <div className="flex items-center gap-2">
                                                    <Warehouse className="w-4 h-4" />
                                                    <span>{wh.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        ({wh.warehouseLevel === 1 ? 'Kho Tổng' : 'Kho Con'})
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="loading" disabled>Đang tải danh sách...</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        </div>

                        <div className="space-y-2">

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
                                    <TableHead className="w-[35%]">Sản Phẩm (SKU)</TableHead>
                                    <TableHead className="w-[20%]">Số Lượng</TableHead>
                                    <TableHead className="w-[20%]">Đơn Giá</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
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
                                                <SelectTrigger className={errors[`item_${item.id}_variantId`] ? "border-red-500" : ""}>
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
                                            {errors[`item_${item.id}_variantId`] && (
                                                <p className="text-xs text-red-500 mt-1">{errors[`item_${item.id}_variantId`]}</p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                                className={errors[`item_${item.id}_quantity`] ? "border-red-500" : ""}
                                            />
                                            {errors[`item_${item.id}_quantity`] && (
                                                <p className="text-xs text-red-500 mt-1">{errors[`item_${item.id}_quantity`]}</p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="1000"
                                                placeholder="Đơn giá"
                                                value={item.unitPrice}
                                                onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
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
                            <Button onClick={handleSubmitClick} disabled={submitting || isFormInvalid}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Lưu Phiếu Nhập
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmModal
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleConfirmSubmit}
                title="Xác Nhận Tạo Phiếu Nhập Kho"
                message={`Bạn có chắc chắn muốn tạo phiếu nhập kho với ${items.length} sản phẩm?`}
                confirmText="Xác Nhận"
                cancelText="Hủy"
                variant="info"
            />
        </div>
    );
};

export default CreateStockIn;
