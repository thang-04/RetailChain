import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BulkActions = ({ suppliers, categories, onBulkSupplierChange, onBulkCategoryChange }) => {
  return (
    <div className="flex gap-4">
      <Select onValueChange={onBulkSupplierChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Bulk NCC..." />
        </SelectTrigger>
        <SelectContent>
          {suppliers?.map((supplier) => (
            <SelectItem key={supplier.supplierId || supplier.id} value={String(supplier.supplierId || supplier.id)}>
              {supplier.supplierName || supplier.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={onBulkCategoryChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Bulk Danh mục..." />
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
  );
};

export default BulkActions;
