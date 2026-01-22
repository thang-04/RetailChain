import React from "react";
import { Plus } from "lucide-react";
import StoreCard from "./StoreCard";

const StoreList = ({ stores }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
      
      {/* Add New Location Card */}
      <div className="bg-white/40 dark:bg-white/5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:border-primary/50 transition-all min-h-[300px]">
        <div className="size-14 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all mb-4">
          <Plus className="w-8 h-8" />
        </div>
        <h3 className="text-slate-900 dark:text-white font-bold">Add New Location</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
          Expand your retail reach with a new store profile
        </p>
      </div>
    </div>
  );
};

export default StoreList;
