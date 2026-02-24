import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InventoryFilter = ({ filters, onChange }) => {
  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <Input 
          className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-50 dark:bg-[#1a2c2e] text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-primary shadow-none" 
          placeholder="Search by document, warehouse or variant..." 
          value={filters?.search ?? ""}
          onChange={(e) => onChange?.({ search: e.target.value })}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <Select
          value={filters?.action ?? "all"}
          onValueChange={(value) => onChange?.({ action: value })}
        >
          <SelectTrigger className="w-[140px] border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2c2e]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="IN">IN</SelectItem>
            <SelectItem value="OUT">OUT</SelectItem>
            <SelectItem value="TRANSFER">TRANSFER</SelectItem>
          </SelectContent>
        </Select>

        <Select disabled defaultValue="all">
          <SelectTrigger className="w-[140px] border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2c2e]">
            <SelectValue placeholder="Store Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary">
          <Filter className="w-[18px] h-[18px] mr-2" />
          More Filters
        </Button>
      </div>
    </div>
  );
};

export default InventoryFilter;
