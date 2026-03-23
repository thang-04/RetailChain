import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const InventoryFilter = ({ filters, onChange }) => {
  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="relative w-full sm:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <Input
          className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-50 dark:bg-[#1a2c2e] text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-primary shadow-none"
          placeholder="Tìm kiếm theo tên sản phẩm, SKU hoặc phiên bản..."
          value={filters?.search ?? ""}
          onChange={(e) => onChange?.({ search: e.target.value })}
        />
      </div>
    </div>
  );
};

export default InventoryFilter;
