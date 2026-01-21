import React from "react";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
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

const InventoryTable = ({ inventoryData }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Healthy":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 border-none">
            Healthy
          </Badge>
        );
      case "Warning":
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 border-none">
            Warning
          </Badge>
        );
      case "Critical":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 border-none gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Critical
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressColor = (percent) => {
    if (percent >= 80) return "bg-emerald-500";
    if (percent >= 50) return "bg-amber-400";
    return "bg-red-500";
  };

  return (
    <div className="bg-white dark:bg-[#1a2c2e] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col flex-1 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-white/5">
            <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="w-1/4 px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Store Name</TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">SKU Count</TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Total Stock</TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Stock Health</TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Status</TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
            {inventoryData.map((item) => (
              <TableRow 
                key={item.id} 
                className={`group hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 ${item.status === 'Critical' ? 'bg-red-50/30 dark:bg-red-900/5' : ''}`}
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded flex items-center justify-center text-xs font-bold ${item.status === 'Critical' ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                      {item.region}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{item.storeName}</p>
                      <p className="text-xs text-slate-500">ID: {item.storeId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.skuCount}</span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.totalStock}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 w-24 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${getProgressColor(item.healthScore)}`} style={{ width: `${item.healthScore}%` }}></div>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{item.healthScore}%</span>
                  </div>
                  <p className={`text-xs mt-1 font-medium ${item.status === 'Critical' ? 'text-red-600 dark:text-red-400 font-bold' : item.status === 'Warning' ? 'text-amber-600 dark:text-amber-500' : 'text-slate-400'}`}>
                    {item.lowItems} Low items
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className="text-sm text-slate-500">{item.lastUpdated}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">Showing 1 to 5 of 45 stores</span>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="size-8" disabled>
            <ChevronLeft className="w-[18px] h-[18px]" />
          </Button>
          <Button variant="default" size="icon" className="size-8 bg-primary text-white text-sm font-medium">1</Button>
          <Button variant="ghost" size="icon" className="size-8 border border-slate-200 dark:border-slate-700">2</Button>
          <Button variant="ghost" size="icon" className="size-8 border border-slate-200 dark:border-slate-700">3</Button>
          <span className="flex items-center justify-center text-slate-400 w-8">...</span>
          <Button variant="ghost" size="icon" className="size-8 border border-slate-200 dark:border-slate-700">
            <ChevronRight className="w-[18px] h-[18px]" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
