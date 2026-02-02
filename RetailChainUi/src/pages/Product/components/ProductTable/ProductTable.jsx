import React, { useState } from "react";
import { MoreVertical, ChevronLeft, ChevronRight, Eye } from "lucide-react";
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

const ProductTable = ({ products, onEditClick, onViewClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate generic pagination
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const currentProducts = products.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const getStatusBadge = (status) => {
    // API returns 1 (Active) or 0 (Inactive)
    if (status === 1 || status === "ACTIVE" || status === "Active") {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
          Active
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
          Inactive
        </Badge>
      );
    }
  };

  // Helper to map category ID to name
  const getCategoryName = (id) => {
    switch (id) {
      case 1: return "Fashion";
      case 2: return "Shirts";
      case 3: return "Pants";
      case 4: return "Bags";
      default: return "Unknown";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a262a] shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="w-[10%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Code</TableHead>
              <TableHead className="w-[10%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Image</TableHead>
              <TableHead className="w-[20%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Product Name</TableHead>
              <TableHead className="w-[10%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Category</TableHead>
              <TableHead className="w-[10%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Gender</TableHead>
              <TableHead className="w-[20%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Description</TableHead>
              <TableHead className="w-[10%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-center">Status</TableHead>
              <TableHead className="w-[10%] px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-200 dark:divide-slate-800">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <TableRow key={product.id || product.code} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group border-b border-slate-200 dark:border-slate-800">
                  <TableCell className="px-6 py-4 text-sm text-slate-900 dark:text-white font-mono font-bold">
                    {product.code}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div
                      className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 overflow-hidden"
                    >
                      {product.image ? (
                        <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                      ) : "NO IMG"}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-slate-900 dark:text-white text-sm font-bold group-hover:text-primary transition-colors cursor-pointer" onClick={() => onEditClick(product)}>
                      {product.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    <Badge variant="outline" className="font-normal text-slate-600 dark:text-slate-400 border-slate-300">
                      {getCategoryName(product.categoryId)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {product.gender}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-slate-900 dark:text-white truncate max-w-[200px]">
                    {product.description}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    {getStatusBadge(product.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => onViewClick(product)}
                        title="View Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={() => onEditClick(product)}
                        title="Edit"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-bold text-slate-900 dark:text-white">{totalItems > 0 ? startIndex + 1 : 0}-{endIndex}</span> of <span className="font-bold text-slate-900 dark:text-white">{totalItems}</span> products
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-9"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Simple Page Indicator */}
          <div className="flex items-center gap-1 mx-2">
            <span className="text-sm font-medium">Page {currentPage} of {totalPages || 1}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="size-9"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};


export default ProductTable;
