import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, User, FileText } from 'lucide-react';

const StepOneInfo = ({ formData, setFormData, warehouses, suppliers, errors }) => {
    return (
        <Card className="border-violet-100 shadow-sm">
            <CardHeader className="bg-violet-50 border-b border-violet-100">
                <CardTitle className="text-lg flex items-center gap-2 text-violet-700">
                    <Building2 className="w-5 h-5" />
                    Thông tin phiếu nhập
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {/* Warehouse Selection */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-violet-500" />
                        Kho nhập hàng <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.warehouseId}
                        onValueChange={(val) => setFormData({ ...formData, warehouseId: val })}
                    >
                        <SelectTrigger className={errors.warehouseId ? "border-red-500" : ""}>
                            <SelectValue placeholder="Chọn kho nhập hàng" />
                        </SelectTrigger>
                        <SelectContent>
                            {warehouses.map(wh => (
                                <SelectItem key={wh.id} value={String(wh.id)}>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{wh.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            ({wh.isCentral ? 'Kho tổng' : 'Kho cửa hàng'})
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.warehouseId && (
                        <p className="text-xs text-red-500">{errors.warehouseId}</p>
                    )}
                </div>

                {/* Supplier Selection */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-violet-500" />
                        Nhà cung cấp
                    </Label>
                    <Select
                        value={formData.supplierId || "none"} // Sửa ở đây
                        onValueChange={(val) => setFormData({ ...formData, supplierId: val === "none" ? "" : val })} // Sửa ở đây
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn nhà cung cấp (không bắt buộc)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">-- Không chọn --</SelectItem> {/* Sửa ở đây */}
                            {suppliers.map(sup => (
                                <SelectItem key={sup.id} value={String(sup.id)}>
                                    {sup.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Note */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4 text-violet-500" />
                        Ghi chú
                    </Label>
                    <Textarea
                        placeholder="Nhập ghi chú cho phiếu nhập kho..."
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
