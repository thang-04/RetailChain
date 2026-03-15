import React from "react";
import { Download, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const formatRangeLabel = (range) => {
  if (!range?.from && !range?.to) return "All time";
  const format = (d) =>
    d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (range.from && range.to) {
    return `${format(range.from)} - ${format(range.to)}`;
  }
  if (range.from) {
    return `Từ ${format(range.from)}`;
  }
  if (range.to) {
    return `Đến ${format(range.to)}`;
  }
  return "All time";
};

const InventoryHeader = ({ onExport, dateRange, onDateChange, canExport }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Tổng quan tồn kho toàn hệ thống
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
           Mức tồn kho theo thời gian thực tại tất cả các địa điểm đang hoạt động
        </p>
      </div>
      <div className="flex gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-9 px-4 gap-2 text-slate-700 dark:text-slate-300 justify-start",
                !dateRange?.from && !dateRange?.to && "text-slate-400",
              )}
            >
              <CalendarIcon className="w-[18px] h-[18px]" />
              <span className="truncate max-w-[180px] text-left">
                {formatRangeLabel(dateRange)}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(value) => onDateChange?.(value || { from: null, to: null })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button
          className="h-9 px-4 gap-2 bg-primary hover:bg-primary/90 text-white disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={onExport}
          disabled={!canExport}
        >
          <Download className="w-[18px] h-[18px]" />
          <span>Xuất báo cáo</span>
        </Button>
      </div>
    </div>
  );
};

export default InventoryHeader;
