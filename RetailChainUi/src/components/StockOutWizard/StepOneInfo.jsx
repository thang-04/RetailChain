import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2, Store, AlertCircle } from 'lucide-react';

const StepOneInfo = ({ formData, setFormData, centralWarehouses, storeWarehouses, errors }) => {
    const selectedSourceWarehouse = centralWarehouses.find(wh => String(wh.id) === formData.sourceWarehouseId);
    const selectedTargetWarehouse = storeWarehouses.find(wh => String(wh.id) === formData.targetWarehouseId);

    return (
        <Card className="border-amber-100 shadow-sm">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                    <Building2 className="w-5 h-5" />
                    Thông tin kho xuất - nhận
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {/* Source Warehouse - ReadOnly */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-500" />
                        Kho xuất (Kho tổng) <span className="text-red-500">*</span>
                    </Label>
                    {selectedSourceWarehouse ? (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-amber-900">{selectedSourceWarehouse.name}</span>
                                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded">(Kho tổng)</span>
                            </div>
                            {selectedSourceWarehouse.address && (
                                <p className="text-sm text-muted-foreground mt-1">{selectedSourceWarehouse.address}</p>
                            )}
                        </div>
                    ) : (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span>Không tìm thấy kho tổng. Vui lòng liên hệ quản trị viên.</span>
                        </div>
                    )}
                </div>

                {/* Target Warehouse Selection */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Store className="w-4 h-4 text-amber-500" />
                        Kho nhận (Kho cửa hàng) <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.targetWarehouseId}
                        onValueChange={(val) => setFormData({ ...formData, targetWarehouseId: val })}
                    >
                        <SelectTrigger className={errors.targetWarehouseId ? "border-red-500" : ""}>
                            <SelectValue placeholder="Chọn kho cửa hàng nhận hàng" />
                        </SelectTrigger>
                        <SelectContent>
                            {storeWarehouses.map(wh => (
                                <SelectItem key={wh.id} value={String(wh.id)}>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{wh.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {wh.address || 'Chưa có địa chỉ'}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.targetWarehouseId && (
                        <p className="text-xs text-red-500">{errors.targetWarehouseId}</p>
                    )}
                </div>

                {/* Note */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Ghi chú
                    </Label>
                    <Textarea
                        placeholder="Nhập ghi chú (nếu có)"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        rows={3}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default StepOneInfo;
