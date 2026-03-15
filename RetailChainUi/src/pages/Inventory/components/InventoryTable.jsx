// src/pages/Inventory/components/InventoryTable.jsx
import React, { memo } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const StatusBadge = ({ quantity }) => {
  const q = typeof quantity === "number" ? quantity : Number(quantity || 0);
  let label = "Out of Stock";
  let variant = "destructive";

  if (q > 10) {
    label = "Còn hàng";
    variant = "default";
  } else if (q > 0) {
    label = "Sắp hết ";
    variant = "secondary";
  }

  return <Badge variant={variant}>{label}</Badge>;
};

function InventoryTable({
  inventoryData = [],
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  canEdit = false,
}) {
  const navigate = useNavigate();

  const from = (page - 1) * pageSize;
  const to = Math.min(from + pageSize, total);
  const pageData = inventoryData;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <div className="bg-white dark:bg-[#1a2c2e] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-white/5">
              <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs w-12 text-center">STT</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-left">SKU</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-left">Sản phẩm</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-left">Phiên bản</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-center">Số lượng</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-center">Trạng thái</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs w-32 text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Chưa có dữ liệu tồn kho cho cửa hàng này.
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((item, index) => (
                  <TableRow
                    key={item.inventoryId || `${item.warehouseId}-${item.variantId}-${index}`}
                    className="group hover:bg-slate-50 dark:hover:bg-white/5 border-b border-slate-100 dark:border-slate-800"
                  >
                    <TableCell className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                      {from + index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 text-left">
                      {item.sku ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200 text-left">
                      {item.productName ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 text-left">
                      {item.variantName ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 text-center">
                      {item.quantity ?? 0}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <StatusBadge quantity={item.quantity} />
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => {
                          if (!item.inventoryId && item.warehouseId && item.variantId) {
                            const invId = `${item.warehouseId}-${item.variantId}`;
                            navigate(`/inventory/${encodeURIComponent(invId)}`);
                          } else if (item.inventoryId) {
                            navigate(`/inventory/${encodeURIComponent(item.inventoryId)}`);
                          }
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </Button>
                      {canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => {
                            if (!item.inventoryId && item.warehouseId && item.variantId) {
                              const invId = `${item.warehouseId}-${item.variantId}`;
                              navigate(`/inventory/${encodeURIComponent(invId)}`);
                            } else if (item.inventoryId) {
                              navigate(`/inventory/${encodeURIComponent(item.inventoryId)}`);
                            }
                          }}
                        >
                          Sửa
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Hiển thị {total === 0 ? 0 : from + 1} đến {to} trong tổng {total} bản ghi
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={page <= 1}
              onClick={() => onPageChange?.(Math.max(1, page - 1))}
            >
              <ChevronLeft className="w-[18px] h-[18px]" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2))
              .map((p, idx, arr) => (
                <React.Fragment key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="flex items-center justify-center text-slate-400 w-8">…</span>
                  )}
                  <Button
                    variant={p === page ? "default" : "ghost"}
                    size="icon"
                    className={`size-8 ${p === page ? "bg-primary text-white" : "border border-slate-200 dark:border-slate-700"}`}
                    onClick={() => onPageChange?.(p)}
                  >
                    {p}
                  </Button>
                </React.Fragment>
              ))}
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
            >
              <ChevronRight className="w-[18px] h-[18px]" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(InventoryTable);
