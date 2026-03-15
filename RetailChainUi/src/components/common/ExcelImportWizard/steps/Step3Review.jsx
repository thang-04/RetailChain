import { FileSpreadsheet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "../components/DataTable";

const Step3Review = ({
  file,
  data,
  rowStates,
  stats,
  suppliers,
  categories,
  onRowToggle,
  onSelectAll,
  onRowEdit,
  onBulkSupplierChange,
  onBulkCategoryChange,
  onChangeFile,
  onImport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  canImport,
  importButtonText,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          <span className="font-medium">{file.name}</span>
        </div>
        <Button variant="outline" size="sm" onClick={onChangeFile}>
          <X className="w-4 h-4 mr-1" />
          Chọn file khác
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="font-medium">Tổng:</span>
          <span>{stats.total} dòng</span>
        </div>
        <div className="flex items-center gap-1 text-green-600">
          <span>Hợp lệ: {stats.valid}</span>
        </div>
        <div className="flex items-center gap-1 text-red-500">
          <span>Lỗi: {stats.invalid}</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-600">
          <span>Sẽ tạo mới: {stats.newProduct}</span>
        </div>
      </div>

      <DataTable
        data={data}
        rowStates={rowStates}
        stats={stats}
        suppliers={suppliers}
        categories={categories}
        onRowToggle={onRowToggle}
        onSelectAll={onSelectAll}
        onRowEdit={onRowEdit}
        onBulkSupplierChange={onBulkSupplierChange}
        onBulkCategoryChange={onBulkCategoryChange}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline">Hủy</Button>
        <Button onClick={onImport} disabled={!canImport}>
          {importButtonText}
        </Button>
      </div>
    </div>
  );
};

export default Step3Review;
