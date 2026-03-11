import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "../../../contexts/AuthContext/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 z-10 flex-shrink-0">
            {/* Left: Branding & Context */}
            <div className="flex items-center gap-4">
                <span className="font-bold text-xl text-primary tracking-tight hidden md:block">
                    RetailChain
                </span>
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
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative text-text-muted hover:text-primary hover:bg-transparent"
                    aria-label="Thông báo"
                >
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-text-muted hover:text-primary hover:bg-transparent"
                    aria-label="Cài đặt"
                >
                    <span className="material-symbols-outlined">settings</span>
                </Button>

                <div className="flex items-center gap-3 border-l pl-4 ml-2">
                    <span className="text-sm font-medium hidden md:block cursor-pointer" onClick={() => navigate("/profile")}>
                        {user?.fullName || user?.username || 'User'}
                    </span>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.fullName || 'User'}</p>
                                    <p className="text-xs leading-none text-text-muted mt-1">
                                        {user?.email || `@${user?.username}`}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer py-2 focus:bg-gray-100 dark:focus:bg-gray-800" onClick={() => navigate("/profile")}>
                                <span className="material-symbols-outlined text-[18px] mr-2 text-text-muted">account_circle</span>
                                <span className="font-medium">Hồ sơ cá nhân</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer py-2 text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/50" onClick={() => {
                                if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) logout();
                            }}>
                                <span className="material-symbols-outlined text-[18px] mr-2">logout</span>
                                <span className="font-semibold">Đăng xuất</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Header;
