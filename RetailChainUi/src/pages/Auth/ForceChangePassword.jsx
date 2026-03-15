// src/pages/Auth/ForceChangePassword.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../contexts/AuthContext/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ForceChangePassword = () => {
    const { firstTimeChangePassword } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { tempToken, email } = location.state || {};

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Password validation logic
    const validations = {
        length: newPassword.length >= 8,
        hasUpper: /[A-Z]/.test(newPassword),
        hasLower: /[a-z]/.test(newPassword),
        hasNumber: /[0-9]/.test(newPassword),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
        match: newPassword === confirmPassword && confirmPassword !== ''
    };

    const isPasswordStrong = Object.values(validations).every(v => v);

    if (!tempToken) {
        navigate('/login');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isPasswordStrong) {
            toast.error('Mật khẩu không đạt yêu cầu bảo mật. Vui lòng kiểm tra lại.');
            return;
        }

        setIsSubmitting(true);
        try {
            await firstTimeChangePassword({
                newPassword: newPassword,
                confirmPassword: confirmPassword
            }, tempToken);
            
            toast.success('Đổi mật khẩu thành công! Bạn đã được đăng nhập.');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const ValidationItem = ({ isValid, text }) => (
        <div className={cn("flex items-center gap-2 text-xs transition-colors", 
            isValid ? "text-green-500" : "text-muted-foreground")}>
            <CheckCircle2 className={cn("h-3 w-3", isValid ? "fill-green-500 text-white" : "text-muted-foreground/30")} />
            <span>{text}</span>
        </div>
    );

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Lock className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Thiết lập mật khẩu</CardTitle>
                    <CardDescription className="text-center">
                        Chào mừng <b>{email}</b>. Vì đây là lần đầu đăng nhập, bạn cần thay đổi mật khẩu mặc định để bảo mật tài khoản.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="newPassword">Mật khẩu mới</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu mới"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg space-y-2 border border-border/50">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Yêu cầu bảo mật:</p>
                            <div className="grid grid-cols-2 gap-y-2">
                                <ValidationItem isValid={validations.length} text="Tối thiểu 8 ký tự" />
                                <ValidationItem isValid={validations.hasUpper} text="Chữ hoa (A-Z)" />
                                <ValidationItem isValid={validations.hasLower} text="Chữ thường (a-z)" />
                                <ValidationItem isValid={validations.hasNumber} text="Chữ số (0-9)" />
                                <ValidationItem isValid={validations.hasSpecial} text="Ký tự đặc biệt" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Nhập lại mật khẩu mới"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={cn(
                                    confirmPassword && !validations.match && "border-red-500 focus-visible:ring-red-500"
                                )}
                            />
                            {confirmPassword && !validations.match && (
                                <p className="text-xs text-red-500">Mật khẩu xác nhận không khớp.</p>
                            )}
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-12 text-base font-semibold"
                            disabled={isSubmitting || !isPasswordStrong}
                        >
                            {isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu & Vào hệ thống"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t py-4 bg-muted/10">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" /> Hệ thống bảo mật 2 lớp bởi RetailChain
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ForceChangePassword;
