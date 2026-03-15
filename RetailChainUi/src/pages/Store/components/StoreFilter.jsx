import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StoreFilter = ({ search, onSearchChange, status, onStatusChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Search Input */}
      <div className="md:col-span-9 relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-4 h-4" />
        <Input 
          className="w-full pl-10 bg-white dark:bg-[#1a262a] border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20 focus-visible:border-primary" 
          placeholder="Tìm kiếm cửa hàng theo tên, mã hoặc quản lý..." 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Status Select */}
      <div className="md:col-span-3">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full bg-white dark:bg-[#1a262a] border-slate-200 dark:border-slate-700">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="inactive">Tạm dừng</SelectItem>
            <SelectItem value="maintenance">Bảo trì</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StoreFilter;
