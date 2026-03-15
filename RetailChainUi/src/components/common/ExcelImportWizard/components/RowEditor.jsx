import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import { SIZES, COLORS } from "@/hooks/useExcelParser";

const RowEditor = ({ row, suppliers, categories, onSave, onCancel, isNew }) => {
  const [editedRow, setEditedRow] = useState(row);

  useEffect(() => {
    setEditedRow(row);
  }, [row]);

  const handleChange = (field, value) => {
    setEditedRow((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedRow);
  };

  return (
    <div className="bg-muted/30 p-4 space-y-4 border-l-4 border-primary">
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium mb-1 block">SKU</label>
          <Input
            value={editedRow.sku || ""}
            onChange={(e) => handleChange("sku", e.target.value)}
            placeholder="SKU"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium mb-1 block">Tên sản phẩm</label>
          <Input
            value={editedRow.productName || ""}
            onChange={(e) => handleChange("productName", e.target.value)}
            placeholder="Tên sản phẩm"
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Nhà cung cấp</label>
          <Select
            value={editedRow.supplierId ? String(editedRow.supplierId) : ""}
            onValueChange={(value) => handleChange("supplierId", Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn NCC..." />
            </SelectTrigger>
            <SelectContent>
              {suppliers?.map((supplier) => (
                <SelectItem key={supplier.supplierId || supplier.id} value={String(supplier.supplierId || supplier.id)}>
                  {supplier.supplierName || supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium mb-1 block">Danh mục</label>
          <Select
            value={editedRow.categoryId ? String(editedRow.categoryId) : ""}
            onValueChange={(value) => handleChange("categoryId", Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.categoryId || cat.id} value={String(cat.categoryId || cat.id)}>
                  {cat.categoryName || cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Size</label>
          <Select
            value={editedRow.size || ""}
            onValueChange={(value) => handleChange("size", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Màu</label>
          <Select
            value={editedRow.color || ""}
            onValueChange={(value) => handleChange("color", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Màu" />
            </SelectTrigger>
            <SelectContent>
              {COLORS.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Số lượng</label>
          <Input
            type="number"
            value={editedRow.quantity || ""}
            onChange={(e) => handleChange("quantity", e.target.value)}
            placeholder="Số lượng"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium mb-1 block">Đơn giá</label>
          <Input
            type="number"
            value={editedRow.unitPrice || ""}
            onChange={(e) => handleChange("unitPrice", e.target.value)}
            placeholder="Đơn giá"
          />
        </div>
        <div className="col-span-3">
          <label className="text-xs font-medium mb-1 block">Ghi chú</label>
          <Input
            value={editedRow.note || ""}
            onChange={(e) => handleChange("note", e.target.value)}
            placeholder="Ghi chú"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" />
          Hủy
        </Button>
        <Button size="sm" onClick={handleSave}>
          <Check className="w-4 h-4 mr-1" />
          Lưu
        </Button>
      </div>
    </div>
  );
};

export default RowEditor;
