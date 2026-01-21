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

const ProductFilter = () => {
  return (
    <div className="bg-white dark:bg-[#1a262a] rounded-xl border border-slate-200 dark:border-slate-800 p-1 shadow-sm flex flex-col md:flex-row gap-2">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input 
          className="w-full h-12 pl-12 pr-4 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-0 text-base font-normal shadow-none" 
          placeholder="Search products by name, SKU or tag..." 
        />
      </div>

      <div className="hidden md:block w-px bg-slate-200 dark:bg-slate-700 my-2"></div>

      {/* Category Filter */}
      <div className="relative w-full md:w-64">
        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Select defaultValue="all">
          <SelectTrigger className="w-full h-12 pl-12 pr-4 bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 text-sm font-medium shadow-none">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="dairy">Dairy Alternatives</SelectItem>
            <SelectItem value="beverages">Beverages</SelectItem>
            <SelectItem value="bakery">Bakery</SelectItem>
            <SelectItem value="pantry">Pantry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="hidden md:block w-px bg-slate-200 dark:bg-slate-700 my-2"></div>

      {/* Status Filter */}
      <div className="relative w-full md:w-48">
        <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Select defaultValue="all">
          <SelectTrigger className="w-full h-12 pl-12 pr-4 bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 text-sm font-medium shadow-none">
            <SelectValue placeholder="Status: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status: All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductFilter;
