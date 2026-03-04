import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import useAuth from "../../../hooks/useAuth";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Helper: Lấy tên vai trò hiển thị
  const getRoleDisplay = (roles) => {
    if (!roles || roles.length === 0) return "User";
    const roleName = typeof roles[0] === 'string' ? roles[0] : roles[0].name || roles[0];
    const roleMap = {
      SUPER_ADMIN: "Super Admin",
      REGIONAL_ADMIN: "Regional Admin",
      STORE_MANAGER: "Store Manager",
      STAFF: "Staff",
    };
    return roleMap[roleName] || roleName;
  };

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: "dashboard",
      filledIcon: true
      // Tất cả role đều thấy
    },
    {
      path: "/store",
      label: "Stores",
      icon: "storefront",
      allowedRoles: ["SUPER_ADMIN", "REGIONAL_ADMIN"]
    },
    {
      path: "/warehouse",
      label: "Central Warehouse",
      icon: "warehouse",
      allowedRoles: ["SUPER_ADMIN", "REGIONAL_ADMIN"]
    },
    {
      path: "/products",
      label: "Products",
      icon: "inventory_2"
      // Tất cả role đều thấy (PRODUCT_VIEW)
    },
    {
      path: "/inventory",
      label: "Inventory",
      icon: "inventory"
      // Tất cả role đều thấy (INVENTORY_VIEW)
    },
    {
      path: "/stock-in",
      label: "Stock In",
      icon: "input_circle",
      allowedRoles: ["SUPER_ADMIN", "REGIONAL_ADMIN", "STORE_MANAGER"]
    },
    {
      path: "/stock-out",
      label: "Stock Out",
      icon: "output_circle",
      allowedRoles: ["SUPER_ADMIN", "REGIONAL_ADMIN", "STORE_MANAGER"]
    },
    {
      path: "/inventory/ledger",
      label: "Stock Ledger",
      icon: "history",
      allowedRoles: ["SUPER_ADMIN", "REGIONAL_ADMIN", "STORE_MANAGER"]
    },
    {
      path: "/reports",
      label: "Reports",
      icon: "bar_chart",
      allowedRoles: ["SUPER_ADMIN", "REGIONAL_ADMIN", "STORE_MANAGER"]
    },
    {
      path: "/staff",
      label: "Human Resources",
      icon: "badge",
      allowedRoles: ["SUPER_ADMIN", "REGIONAL_ADMIN", "STORE_MANAGER"]
    },
    {
      path: "/roles",
      label: "Roles & Permissions",
      icon: "admin_panel_settings",
      allowedRoles: ["SUPER_ADMIN"]
    },
    {
      path: "/users",
      label: "User Management",
      icon: "manage_accounts",
      allowedRoles: ["SUPER_ADMIN", "REGIONAL_ADMIN", "STORE_MANAGER"]
    },
    {
      path: "/staff/shifts",
      label: "Staff Shifts",
      icon: "calendar_month",
      filledIcon: true
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
        {menuItems
          .filter((item) => {
            // Không có allowedRoles → hiển thị cho tất cả
            if (!item.allowedRoles) return true;
            if (!user?.roles) return false;
            // Kiểm tra user có ít nhất 1 role nằm trong allowedRoles
            return user.roles.some((r) => {
              const roleName = typeof r === 'string' ? r : r.name || r.code;
              return item.allowedRoles.includes(roleName);
            });
          })
          .map((item) => {
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

      {/* User Profile (Bottom Sidebar) - Hiển thị thông tin người dùng đăng nhập */}
      {user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link to={`/staff/profile/${user.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <Avatar className="size-9 rounded-full">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName || user.email}`} alt={user.fullName || user.email} />
              <AvatarFallback>{(user.fullName || user.email || '').substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left overflow-hidden">
              <p className="text-sm font-semibold text-text-main dark:text-white truncate">{user.fullName || user.email}</p>
              <p className="text-xs text-text-muted dark:text-gray-400">{getRoleDisplay(user.roles)}</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

