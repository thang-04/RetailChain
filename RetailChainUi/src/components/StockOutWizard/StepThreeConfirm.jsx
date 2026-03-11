import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Store, FileText, Package } from 'lucide-react';

const StepThreeConfirm = ({ formData, items, centralWarehouses, storeWarehouses }) => {
    const selectedSourceWarehouse = centralWarehouses.find(wh => String(wh.id) === formData.sourceWarehouseId);
    const selectedTargetWarehouse = storeWarehouses.find(wh => String(wh.id) === formData.targetWarehouseId);
    
    const validItems = items.filter(item => item.variantId && item.quantity > 0);
    const totalQuantity = validItems.reduce((sum, item) => sum + parseInt(item.quantity), 0);

    return (
        <div className="space-y-6">
            <Card className="border-amber-100 shadow-sm">
                <CardHeader className="bg-amber-50 border-b border-amber-100">
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                        <Building2 className="w-5 h-5" />
                        Thông tin kho
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-amber-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Building2 className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-medium text-amber-800">Kho xuất (Kho tổng)</span>
                            </div>
                            <p className="font-medium text-amber-900">{selectedSourceWarehouse?.name || 'N/A'}</p>
                            {selectedSourceWarehouse?.address && (
                                <p className="text-sm text-muted-foreground mt-1">{selectedSourceWarehouse.address}</p>
                            )}
                        </div>
                        
                        <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Store className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">Kho nhận (Kho cửa hàng)</span>
                            </div>
                            <p className="font-medium text-green-900">{selectedTargetWarehouse?.name || 'N/A'}</p>
                            {selectedTargetWarehouse?.address && (
                                <p className="text-sm text-muted-foreground mt-1">{selectedTargetWarehouse.address}</p>
                            )}
                        </div>
                    </div>
                    
                    {formData.note && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-800">Ghi chú</span>
                            </div>
                            <p className="text-sm text-gray-600">{formData.note}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-amber-100 shadow-sm">
                <CardHeader className="bg-amber-50 border-b border-amber-100">
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                        <Package className="w-5 h-5" />
                        Danh sách sản phẩm xuất
                    </CardTitle>
                    <CardDescription>
                        {validItems.length} sản phẩm
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="font-medium">STT</TableHead>
                                <TableHead className="font-medium">Sản phẩm</TableHead>
                                <TableHead className="font-medium">SKU</TableHead>
                                <TableHead className="font-medium">Thông tin</TableHead>
                                <TableHead className="text-right font-medium">Số lượng</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {validItems.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{idx + 1}</TableCell>
                                    <TableCell className="font-medium">{item.productName || item.name}</TableCell>
                                    <TableCell>{item.sku}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {item.size} / {item.color}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-amber-600">
                                        {item.quantity}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                    <div className="mt-6 p-4 bg-amber-50 rounded-lg flex justify-between items-center">
                        <span className="font-medium text-amber-800">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-amber-600">{totalQuantity}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StepThreeConfirm;
