import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";

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

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt={user.email} />
                  <AvatarFallback>{user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.fullName || user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.roles && user.roles.length > 0
                      ? (typeof user.roles[0] === 'string' ? user.roles[0] : user.roles[0].name || 'User')
                        .replace('_', ' ')
                      : "User"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/staff/profile/${user.id}`}>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
