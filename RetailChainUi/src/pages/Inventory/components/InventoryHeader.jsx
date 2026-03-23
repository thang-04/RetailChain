import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InventoryHeader = ({ stores, selectedStoreId, onStoreChange, canChangeStore }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Tồn kho theo cửa hàng
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Xem nhanh tồn kho hiện tại của từng cửa hàng trong chuỗi
        </p>
      </div>
      <div className="flex gap-3 items-center">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Cửa hàng
        </span>
        <Select
          value={selectedStoreId ? String(selectedStoreId) : ""}
          onValueChange={onStoreChange}
          disabled={!canChangeStore}
        >
          <SelectTrigger className="w-[220px] border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2c2e]">
            <SelectValue placeholder="Chọn cửa hàng" />
          </SelectTrigger>
          <SelectContent>
            {stores.map((store) => (
              <SelectItem key={store.id} value={String(store.id)}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default InventoryHeader;
