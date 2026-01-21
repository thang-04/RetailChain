import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
    return (
      <aside className="w-64 h-full bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 transition-all duration-300">
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary aspect-square rounded-lg size-10 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl">grid_view</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-main dark:text-white">RetailOS</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
          {/* Dashboard (Active) */}
          <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-6 bg-primary/10 text-primary dark:text-primary-400 hover:bg-primary/20 hover:text-primary">
            <span className="material-symbols-outlined w-6 h-6" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="text-sm font-semibold">Dashboard (Chain)</span>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-6 text-text-muted hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-text-main">
            <span className="material-symbols-outlined w-6 h-6 group-hover:text-primary">storefront</span>
            <span className="text-sm font-medium">Stores</span>
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-6 text-text-muted hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-text-main">
            <span className="material-symbols-outlined w-6 h-6 group-hover:text-primary">inventory_2</span>
            <span className="text-sm font-medium">Products</span>
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-6 text-text-muted hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-text-main">
            <span className="material-symbols-outlined w-6 h-6 group-hover:text-primary">warehouse</span>
            <span className="text-sm font-medium">Central Warehouse</span>
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-6 text-text-muted hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-text-main">
            <span className="material-symbols-outlined w-6 h-6 group-hover:text-primary">bar_chart</span>
            <span className="text-sm font-medium">Chain Reports</span>
          </Button>
        </nav>
        
        {/* User Profile (Bottom Sidebar) */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <Avatar className="size-9 rounded-full">
              <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdbf2TxRWWjUGEm2z54lsGHvOG-L9OXBhc_2WxceZlYziy1nGWgi52tuTZnefSanrBsk742y5p--5k-rkmcguWrcYDT04sGGMTUeDnc9MhKbYAw67yD-C7-Ufopkjw1DmJs1HGObtxWmIeF3-fiqw9FUyMjlnsLGxi9NGaXhJlTMEjM-a3vhvH9rneywwFJ_Di6CRzOSmLswugDjTwnI--uRsKzl_PZJU4IQAv_C5oJpyQhElWNJjtDwTyQkypAgNMAFXNSkJxgyM" alt="Alex Morgan" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <p className="text-sm font-semibold text-text-main dark:text-white">Alex Morgan</p>
              <p className="text-xs text-text-muted dark:text-gray-400">Head of Operations</p>
            </div>
          </div>
        </div>
      </aside>
    );
  };
  
  export default Sidebar;
