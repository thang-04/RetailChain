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

const StoreFilter = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Search Input */}
      <div className="md:col-span-6 relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-4 h-4" />
        <Input 
          className="w-full pl-10 bg-white dark:bg-[#1a262a] border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20 focus-visible:border-primary" 
          placeholder="Search stores by name, ID or city..." 
        />
      </div>

      {/* Status Select */}
      <div className="md:col-span-3">
        <Select defaultValue="all">
          <SelectTrigger className="w-full bg-white dark:bg-[#1a262a] border-slate-200 dark:border-slate-700">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Warehouse Select */}
      <div className="md:col-span-3">
        <Select defaultValue="all">
          <SelectTrigger className="w-full bg-white dark:bg-[#1a262a] border-slate-200 dark:border-slate-700">
            <SelectValue placeholder="All Warehouses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            <SelectItem value="north-1">North-1 Distribution</SelectItem>
            <SelectItem value="west-2">West-2 Hub</SelectItem>
            <SelectItem value="east-coast">East Coast Center</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StoreFilter;
