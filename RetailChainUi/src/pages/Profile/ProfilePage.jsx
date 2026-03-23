import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import authService from "../../services/auth.service";

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authService.getCurrentUser();
                if (response.data?.data) {
                    setProfile(response.data.data);
                } else if (response.data) {
                    setProfile(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError("Không thể tải dữ liệu hồ sơ.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[80vh] items-center justify-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold tracking-tight mb-6 text-gray-900 dark:text-gray-100">Hồ sơ cá nhân</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-sm border-gray-200 dark:border-gray-800">
                    <CardHeader className="flex flex-col items-center justify-center text-center space-y-4 pb-4">
                        <Avatar className="h-28 w-28 border-4 border-gray-50 dark:border-gray-900 shadow-sm">
                            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                                {(profile.fullName || profile.username || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <CardTitle className="text-2xl">{profile.fullName || 'No Name'}</CardTitle>
                            <p className="text-sm font-medium text-text-muted">@{profile.username}</p>
                        </div>
                        <Badge variant={profile.status === 1 ? 'default' : 'secondary'} className="mt-2 text-sm px-4 py-1.5 font-semibold">
                            {profile.status === 1 ? 'Đang hoạt động' : (profile.status === 0 ? 'Ngừng hoạt động' : 'Đã khóa')}
                        </Badge>
                    </CardHeader>
                    <CardContent className="text-center pt-2 pb-6">
                        <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Vai trò hệ thống</p>
                        <p className="font-semibold text-primary">{profile.roles?.join(', ') || 'N/A'}</p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 shadow-sm border-gray-200 dark:border-gray-800">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <CardTitle className="text-xl">Thông tin chi tiết</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">badge</span>
                                    Họ và Tên
                                </label>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{profile.fullName || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">account_box</span>
                                    Tên đăng nhập
                                </label>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{profile.username || 'N/A'}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">mail</span>
                                    Email liên hệ
                                </label>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{profile.email || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">call</span>
                                    Số điện thoại
                                </label>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{profile.phoneNumber || 'Chưa cập nhật'}</p>
                            </div>
                            {profile.storeCode && (
                                <div className="space-y-2 sm:col-span-2 border-t border-gray-100 dark:border-gray-800 pt-6 mt-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">store</span>
                                        Cửa hàng trực thuộc quản lý (Store)
                                    </label>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        <span className="text-primary">{profile.storeCode}</span> {profile.storeName ? `- ${profile.storeName}` : ''}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="md:col-span-1 shadow-sm border-gray-200 dark:border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <span className="material-symbols-outlined">security</span>
                            Bảo mật
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-text-muted">
                            Bạn nên thay đổi mật khẩu định kỳ để bảo vệ tài khoản của mình.
                        </p>
                        <Button 
                            variant="outline" 
                            className="w-full justify-start gap-2"
                            onClick={() => window.location.href = '/change-password'}
                        >
                            <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                            Đổi mật khẩu
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;
