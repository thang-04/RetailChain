import React from "react";
import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductHeader = ({ onAddClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight">
          Global Product Catalog
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
          Manage master product data across 14 store locations
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="h-11 px-5 gap-2 font-bold text-slate-900 dark:text-slate-200 border-slate-300 dark:border-slate-700">
          <Upload className="w-5 h-5" />
          <span>Import</span>
        </Button>
        {onAddClick && (
          <Button
            className="h-11 px-5 gap-2 font-bold shadow-md shadow-primary/20"
            onClick={onAddClick}
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductHeader;
