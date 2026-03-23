import React from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductFilter = ({ filters, onFilterChange, categories }) => {
  const handleInputChange = (e) => {
    onFilterChange("search", e.target.value);
  };

  const handleCategoryChange = (value) => {
    onFilterChange("category", value);
  };

  const handleStatusChange = (value) => {
    onFilterChange("status", value);
  };

  return (
    <div className="bg-white dark:bg-[#1a262a] rounded-xl border border-slate-200 dark:border-slate-800 p-1 shadow-sm flex flex-col md:flex-row gap-2">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          className="w-full h-12 pl-12 pr-4 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-0 text-base font-normal shadow-none"
          placeholder="Tìm sản phẩm theo tên hoặc mã..."
          value={filters.search}
          onChange={handleInputChange}
        />
      </div>

      <div className="hidden md:block w-px bg-slate-200 dark:bg-slate-700 my-2"></div>

      {/* Category Filter */}
      <div className="relative w-full md:w-64">
        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full h-12 pl-12 pr-4 bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 text-sm font-medium shadow-none">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories && categories.map(cat => (
              <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden md:block w-px bg-slate-200 dark:bg-slate-700 my-2"></div>

      {/* Status Filter */}
      <div className="relative w-full md:w-48">
        <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full h-12 pl-12 pr-4 bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 text-sm font-medium shadow-none">
            <SelectValue placeholder="Trạng thái: Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Trạng thái: Tất cả</SelectItem>
            <SelectItem value="active">Đang kinh doanh</SelectItem>
            <SelectItem value="inactive">Ngừng kinh doanh</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductFilter;
