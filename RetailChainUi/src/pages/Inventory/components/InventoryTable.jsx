// src/pages/Inventory/components/InventoryTable.jsx
import React, { useState } from "react";
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

/** Format datetime từ API (ISO string hoặc object) sang hiển thị */
const formatOccurredAt = (value) => {
  if (!value) return "—";
  const str = typeof value === "string" ? value : value?.toString?.() ?? "";
  if (!str) return "—";
  try {
    const d = new Date(str);
    return Number.isNaN(d.getTime()) ? str : d.toLocaleString("vi-VN");
  } catch {
    return str;
  }
};

/** Hiển thị action dạng badge (IN, OUT, ADJUST, ...) */
const ActionBadge = ({ action }) => {
  const a = (action && typeof action === "string" ? action : action?.toString?.() ?? "").toUpperCase();
  const variant = a === "IN" ? "default" : a === "OUT" ? "destructive" : "secondary";
  return <Badge variant={variant}>{a || "—"}</Badge>;
};

const InventoryTable = ({
  inventoryData = [],
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onFetchDetail,
}) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const handleRowClick = async (id) => {
    if (!onFetchDetail || !id) return;
    setDetailOpen(true);
    setDetail(null);
    setDetailError(null);
    setLoadingDetail(true);
    try {
      const data = await onFetchDetail(id);
      setDetail(data);
    } catch (err) {
      setDetailError(err?.message || "Không tải được chi tiết.");
    } finally {
      setLoadingDetail(false);
    }
  };

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
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs w-12">STT</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Document</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Kho</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Variant</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Hành động</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Số lượng</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Tồn sau</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Thời gian</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs w-20">Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="px-6 py-12 text-center text-slate-500">
                    Chưa có bản ghi lịch sử tồn kho.
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className="group hover:bg-slate-50 dark:hover:bg-white/5 border-b border-slate-100 dark:border-slate-800"
                  >
                    <TableCell className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {from + index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 text-right">
                      {item.documentName ?? item.documentId ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 text-right">
                      {item.warehouseName ?? item.warehouseId ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 text-right">
                      {item.variantName ?? item.variantId ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <ActionBadge action={item.action} />
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 text-right">
                      {item.quantity ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 text-right">
                      {item.balanceAfter ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-500 text-right">
                      {formatOccurredAt(item.occurredAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(item.id);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
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

      {/* Modal chi tiết bản ghi - GET /api/inventory-history/record/{id} */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch sử tồn kho</DialogTitle>
          </DialogHeader>
          {loadingDetail && (
            <div className="py-8 text-center text-slate-500">Đang tải...</div>
          )}
          {detailError && (
            <div className="py-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
              {detailError}
            </div>
          )}
          {!loadingDetail && !detailError && detail && (
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <div><dt className="text-slate-500">Phiếu</dt><dd>{detail.documentName ?? detail.documentId ?? "—"}</dd></div>
              <div><dt className="text-slate-500">Kho</dt><dd>{detail.warehouseName ?? detail.warehouseId ?? "—"}</dd></div>
              <div><dt className="text-slate-500">Biến thể sản phẩm</dt><dd>{detail.variantName ?? detail.variantId ?? "—"}</dd></div>
              <div><dt className="text-slate-500">Hành động</dt><dd><ActionBadge action={detail.action} /></dd></div>
              <div><dt className="text-slate-500">Số lượng</dt><dd>{detail.quantity ?? "—"}</dd></div>
              <div><dt className="text-slate-500">Tồn sau</dt><dd>{detail.balanceAfter ?? "—"}</dd></div>
              <div><dt className="text-slate-500">Thời gian</dt><dd>{formatOccurredAt(detail.occurredAt)}</dd></div>
              <div><dt className="text-slate-500">Người thực hiện</dt><dd>{detail.actorUserName ?? detail.actorUserId ?? "—"}</dd></div>
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryTable;
