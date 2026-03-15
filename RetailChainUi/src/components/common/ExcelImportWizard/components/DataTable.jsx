import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertCircle, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import FilterTabs from "./FilterTabs";
import BulkActions from "./BulkActions";
import RowEditor from "./RowEditor";

const ITEMS_PER_PAGE = 50;

const DataTable = ({
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
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.filter((_, index) => {
      const state = rowStates[index];
      switch (activeTab) {
        case "valid":
          return state?.isValid;
        case "invalid":
          return state && !state.isValid;
        case "new":
          return state?.skuExists === false;
        default:
          return true;
      }
    });
  }, [data, rowStates, activeTab]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleRowEdit = (index, updatedRow) => {
    onRowEdit(startIndex + index, updatedRow);
    setEditingRowIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FilterTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          stats={stats}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
          >
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
          >
            Redo
          </Button>
          <BulkActions
            suppliers={suppliers}
            categories={categories}
            onBulkSupplierChange={onBulkSupplierChange}
            onBulkCategoryChange={onBulkCategoryChange}
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-auto max-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={stats.selected === stats.valid && stats.valid > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4"
                />
              </TableHead>
              <TableHead>STT</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Nhà cung cấp</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Màu</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Đơn giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => {
              const state = rowStates[startIndex + index];
              const isValid = state?.isValid;
              const isSelected = state?.selected;
              const skuExists = state?.skuExists;
              const isChecking = state?.isChecking;
              const isEditing = editingRowIndex === startIndex + index;

              return (
                <>
                  <TableRow
                    key={index}
                    className={cn(
                      !isValid && "bg-red-50",
                      isValid && !isSelected && "opacity-50"
                    )}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isSelected || false}
                        disabled={!isValid}
                        onChange={() => onRowToggle(startIndex + index)}
                        className="w-4 h-4"
                      />
                    </TableCell>
                    <TableCell>{row.stt}</TableCell>
                    <TableCell className="font-mono text-xs">{row.sku}</TableCell>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell className="text-xs">
                      {row.supplierName || (row.supplierId ? "Đã chọn" : "Chưa chọn")}
                      {!row.supplierId && row.supplierName && (
                        <p className="text-xs text-red-500">Không tìm thấy</p>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {row.categoryId ? "Đã chọn" : "Chưa chọn"}
                    </TableCell>
                    <TableCell className="text-xs">{row.size || "-"}</TableCell>
                    <TableCell className="text-xs">{row.color || "-"}</TableCell>
                    <TableCell className="text-xs">{row.quantity}</TableCell>
                    <TableCell className="text-xs">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(row.unitPrice)}
                    </TableCell>
                    <TableCell>
                      {isChecking ? (
                        <span className="text-muted-foreground text-xs">Đang kiểm tra...</span>
                      ) : !isValid ? (
                        <div className="flex items-center gap-1 text-red-500 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{state?.errors?.[0] || "Lỗi"}</span>
                        </div>
                      ) : skuExists === false ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                          <Plus className="w-3 h-3" />
                          Mới
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                          <Check className="w-3 h-3" />
                          Tồn tại
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingRowIndex(isEditing ? null : startIndex + index)}
                      >
                        {isEditing ? "Đóng" : "Sửa"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {isEditing && (
                    <TableRow>
                      <TableCell colSpan={12} className="p-0">
                        <RowEditor
                          row={row}
                          suppliers={suppliers}
                          categories={categories}
                          onSave={(updatedRow) => handleRowEdit(index, updatedRow)}
                          onCancel={() => setEditingRowIndex(null)}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Trang {currentPage}/{totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
