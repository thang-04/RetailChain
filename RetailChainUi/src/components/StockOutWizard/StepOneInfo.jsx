import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2, Store, AlertCircle } from 'lucide-react';

const StepOneInfo = ({ formData, setFormData, centralWarehouses, storeWarehouses, errors }) => {
    const selectedSourceWarehouse = centralWarehouses.find(wh => String(wh.id) === formData.sourceWarehouseId);
    const selectedTargetWarehouse = storeWarehouses.find(wh => String(wh.id) === formData.targetWarehouseId);

    return (
        <Card className="border-border shadow-sm">
            <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <Building2 className="w-5 h-5" />
                    Chọn kho xuất và kho nhận
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {/* Source Warehouse - ReadOnly */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        Kho xuất (Kho tổng) <span className="text-destructive">*</span>
                    </Label>
                    {selectedSourceWarehouse ? (
                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{selectedSourceWarehouse.name}</span>
                            </div>
                            {selectedSourceWarehouse.address && (
                                <p className="text-sm text-muted-foreground mt-1">{selectedSourceWarehouse.address}</p>
                            )}
                        </div>
                    ) : (
                        <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-md flex items-center gap-2 text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            <span>Không tìm thấy kho tổng. Vui lòng liên hệ quản trị viên.</span>
                        </div>
                    )}
                </div>

                {/* Target Warehouse Selection */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Store className="w-4 h-4 text-primary" />
                        Kho nhận hàng <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={formData.targetWarehouseId}
                        onValueChange={(val) => setFormData({ ...formData, targetWarehouseId: val })}
                    >
                        <SelectTrigger className={errors.targetWarehouseId ? "border-destructive" : ""}>
                            <SelectValue placeholder="Chọn cửa hàng nhận hàng" />
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
                        <p className="text-xs text-destructive">{errors.targetWarehouseId}</p>
                    )}
                </div>

                {/* Note */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Ghi chú
                    </Label>
                    <Textarea
                        placeholder="Nhập ghi chú cho phiếu xuất kho (không bắt buộc)"
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
