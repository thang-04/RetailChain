import React from "react";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
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

const ProductTable = ({ products }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
            Active
          </Badge>
        );
      case "Low Stock":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
            Low Stock
          </Badge>
        );
      case "Discontinued":
        return (
          <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
            Discontinued
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a262a] shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="w-[35%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Product Name</TableHead>
              <TableHead className="w-[20%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Category</TableHead>
              <TableHead className="w-[15%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Unit</TableHead>
              <TableHead className="w-[15%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Base Price</TableHead>
              <TableHead className="w-[10%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-center">Status</TableHead>
              <TableHead className="w-[5%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-200 dark:divide-slate-800">
            {products.map((product) => (
              <TableRow key={product.sku} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group border-b border-slate-200 dark:border-slate-800">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 bg-center bg-cover flex-shrink-0"
                      style={{ backgroundImage: `url("${product.image}")` }}
                    ></div>
                    <div className="flex flex-col">
                      <span className="text-slate-900 dark:text-white text-sm font-bold group-hover:text-primary transition-colors cursor-pointer">
                        {product.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">
                        {product.sku}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                  {product.category}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {product.unit}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium font-mono text-right">
                  {product.price}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  {getStatusBadge(product.status)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-bold text-slate-900 dark:text-white">1-5</span> of <span className="font-bold text-slate-900 dark:text-white">1,240</span> products
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="size-9" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="default" size="icon" className="size-9 font-bold bg-primary text-white hover:bg-primary/90">
            1
          </Button>
          <Button variant="ghost" size="icon" className="size-9 font-medium text-slate-600 dark:text-slate-400">
            2
          </Button>
          <Button variant="ghost" size="icon" className="size-9 font-medium text-slate-600 dark:text-slate-400">
            3
          </Button>
          <span className="text-slate-400 px-1">...</span>
          <Button variant="ghost" size="icon" className="size-9 font-medium text-slate-600 dark:text-slate-400">
            24
          </Button>
          <Button variant="outline" size="icon" className="size-9">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
