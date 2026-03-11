import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Building2, User, FileText, Package, Calendar, CheckCircle } from 'lucide-react';

const StepThreeConfirm = ({ formData, items, productVariants, suppliers, warehouses }) => {
    const selectedWarehouse = warehouses.find(w => w.id === Number(formData.warehouseId));
    const selectedSupplier = suppliers.find(s => s.id === Number(formData.supplierId));

    const getVariantInfo = (variantId) => {
        return productVariants.find(v => v.id === Number(variantId));
    };

    const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const validItems = items.filter(i => i.variantId && i.quantity > 0);

    return (
        <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Warehouse Info */}
                <Card className="border-violet-100 shadow-sm">
                    <CardHeader className="bg-violet-50 border-b border-violet-100 py-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-violet-700">
                            <Building2 className="w-4 h-4" />
                            Kho nhập hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <p className="font-medium text-lg">{selectedWarehouse?.name || 'Chưa chọn'}</p>
                        <p className="text-sm text-muted-foreground">
                            {selectedWarehouse?.isCentral ? 'Kho tổng' : 'Kho cửa hàng'}
                        </p>
                    </CardContent>
                </Card>

                {/* Supplier Info */}
                <Card className="border-violet-100 shadow-sm">
                    <CardHeader className="bg-violet-50 border-b border-violet-100 py-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-violet-700">
                            <User className="w-4 h-4" />
                            Nhà cung cấp
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <p className="font-medium text-lg">{selectedSupplier?.name || 'Không chọn'}</p>
                        {selectedSupplier?.contact && (
                            <p className="text-sm text-muted-foreground">{selectedSupplier.contact}</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Note */}
            {formData.note && (
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
                            <FileText className="w-4 h-4" />
                            Ghi chú
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <p className="text-sm">{formData.note}</p>
                    </CardContent>
                </Card>
            )}

            {/* Products List */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50 border-b border-violet-100">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-700">
                        <Package className="w-5 h-5" />
                        Danh sách sản phẩm
                        <Badge variant="secondary" className="ml-2 bg-violet-100 text-violet-700">
                            {validItems.length} sản phẩm
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="font-medium">STT</TableHead>
                                <TableHead className="font-medium">Sản phẩm</TableHead>
                                <TableHead className="font-medium">SKU</TableHead>
                                <TableHead className="font-medium">Size/Màu</TableHead>
                                <TableHead className="font-medium text-right">Số lượng</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {validItems.map((item, index) => {
                                const variantInfo = getVariantInfo(item.variantId);
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium text-muted-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">{variantInfo?.productName || variantInfo?.name}</p>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {variantInfo?.sku}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {variantInfo?.size}
                                                </Badge>
                                                <span className="text-muted-foreground">/</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {variantInfo?.color}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {item.quantity}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Summary */}
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-violet-600" />
                        <div>
                            <p className="font-medium text-violet-700">Sẵn sàng tạo phiếu nhập kho</p>
                            <p className="text-sm text-muted-foreground">
                                Tổng cộng {validItems.length} dòng sản phẩm với {totalQuantity} đơn vị
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Ngày tạo</p>
                        <p className="font-medium">{new Date().toLocaleDateString('vi-VN')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepThreeConfirm;
