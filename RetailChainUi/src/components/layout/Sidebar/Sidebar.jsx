import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import useAuth from "../../../contexts/AuthContext/useAuth";

const Sidebar = () => {
  const location = useLocation();
  const { user, isSuperAdmin, isStoreManager, isStaff, hasRole, hasPermission } = useAuth();

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: "dashboard",
      filledIcon: true,
      show: true, // everyone
    },
    {
      path: isSuperAdmin() ? "/store" : (user?.storeCode ? `/store/${user.storeCode}` : (user?.storeId ? `/store/${user.storeId}` : "#")),
      label: isSuperAdmin() ? "Stores" : "My Store",
      icon: "storefront",
      show: hasPermission('STORE_VIEW') || isStoreManager(),
    },
    {
      path: "/warehouse",
      label: "Central Warehouse",
      icon: "warehouse",
      show: hasPermission('WAREHOUSE_VIEW'),
    },
    {
      path: "/products",
      label: "Products",
      icon: "inventory_2",
      show: hasPermission('PRODUCT_VIEW') || isStoreManager() || isStaff(), // Defaulting to true for now since previous was true, but enforcing permission
    },
    {
      path: "/inventory",
      label: "Inventory",
      icon: "inventory",
      show: hasPermission('INVENTORY_VIEW') || isStoreManager() || isStaff(),
    },
    {
      path: "/stock-in",
      label: "Stock In",
      icon: "input_circle",
      show: hasPermission('INVENTORY_CREATE'),
    },
    {
      path: "/stock-out",
      label: "Stock Out",
      icon: "output_circle",
      show: hasPermission('INVENTORY_CREATE'),
    },
    {
      path: "/reports",
      label: "Reports",
      icon: "bar_chart",
      show: hasPermission('REPORT_SYSTEM_VIEW') || hasPermission('REPORT_STORE_VIEW') || isStoreManager(),
    },
    {
      path: "/staff",
      label: "Human Resources",
      icon: "badge",
      show: hasPermission('STAFF_VIEW'),
    },
    {
      path: "/roles",
      label: "Roles & Permissions",
      icon: "admin_panel_settings",
      show: hasPermission('ROLE_VIEW'),
    },
    {
      path: "/users",
      label: "User Management",
      icon: "manage_accounts",
      show: hasPermission('STAFF_VIEW'),
    },
    {
      path: "/staff/shifts",
      label: "Staff Shifts",
      icon: "calendar_month",
      filledIcon: true,
        show: isSuperAdmin() || isStoreManager(),
    }
  ];

  const visibleMenuItems = menuItems.filter(item => item.show);

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
        {visibleMenuItems.map((item) => {
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
    </aside>
  );
};

export default Sidebar;
