import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
      {
        path: "/",
        label: "Dashboard (Chain)",
        icon: "dashboard",
        filledIcon: true 
      },
      {
        path: "/store",
        label: "Stores",
        icon: "storefront"
      },
      {
        path: "/warehouse",
        label: "Central Warehouse",
        icon: "warehouse"
      },
      {
        path: "/products", 
        label: "Products",
        icon: "inventory_2"
      },
      {
        path: "/inventory",
        label: "Inventory",
        icon: "inventory"
      },
      {
        path: "/stock-in",
        label: "Stock In",
        icon: "input_circle"
      },
      {
        path: "/inventory/ledger",
        label: "Stock Ledger",
        icon: "history"
      },
      {
        path: "/reports",
        label: "Chain Reports",
        icon: "bar_chart"
      },
      {
        path: "/staff",
        label: "Human Resources",
        icon: "badge"
      }
    ];

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
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                asChild
                className={cn(
                  "w-full justify-start gap-3 px-3 py-6",
                  isActive 
                    ? "bg-primary/10 text-primary dark:text-primary-400 hover:bg-primary/20 hover:text-primary" 
                    : "text-text-muted hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-text-main"
                )}
              >
                <Link to={item.path}>
                  <span 
                    className={cn("material-symbols-outlined w-6 h-6", !isActive && "group-hover:text-primary")}
                    style={isActive && item.filledIcon ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span className={cn("text-sm", isActive ? "font-semibold" : "font-medium")}>
                    {item.label}
                  </span>
                </Link>
              </Button>
            );
          })}
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
