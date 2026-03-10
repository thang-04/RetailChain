import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useAuth from "../../../contexts/AuthContext/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 z-10 flex-shrink-0">
      {/* Left: Context Switcher */}
      <div className="flex items-center gap-4">
        <label className="relative block min-w-[200px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted pointer-events-none z-10">
            <span className="material-symbols-outlined text-[20px]">domain</span>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:ring-primary focus:ring-offset-0">
              <SelectValue placeholder="Select Store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              <SelectItem value="north">North Region</SelectItem>
              <SelectItem value="south">South Region</SelectItem>
              <SelectItem value="flagship">Flagship Only</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>

      {/* Right: Search & Actions */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted pointer-events-none">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <Input
            className="pl-10 bg-background-light dark:bg-gray-800 border-none shadow-none focus-visible:ring-primary/20"
            placeholder="Search stores, SKUs..."
            type="text"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative text-text-muted hover:text-primary hover:bg-transparent">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
        </Button>
        <Button variant="ghost" size="icon" className="text-text-muted hover:text-primary hover:bg-transparent">
          <span className="material-symbols-outlined">settings</span>
        </Button>

        <div className="flex items-center gap-2 border-l pl-4 ml-2">
          <span className="text-sm font-medium hidden md:block">{user?.fullName || user?.username || 'User'}</span>
          <Avatar className="h-8 w-8 cursor-pointer" onClick={() => {
            if (window.confirm("Are you sure you want to logout?")) logout();
          }} title="Click to logout">
            <AvatarFallback>{(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
