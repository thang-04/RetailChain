import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import authService from '@/services/auth.service';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, ShieldCheck, Check, X } from 'lucide-react';
import { getPasswordError, isValidPassword } from '@/utils/validators';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(null);

    useEffect(() => {
        if (formData.newPassword) {
            setPasswordError(getPasswordError(formData.newPassword));
        } else {
            setPasswordError(null);
        }
    }, [formData.newPassword]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const error = getPasswordError(formData.newPassword);
        if (error) {
            toast.error(error);
            return;
        }

        if (formData.newPassword === formData.oldPassword) {
            toast.error('Mật khẩu mới không được trùng với mật khẩu cũ.');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.changePassword(formData);
            if (response.code === 200) {
                toast.success('Đổi mật khẩu thành công!');
                setFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                toast.error(response.desc || 'Không thể đổi mật khẩu.');
            }
        } catch (error) {
            toast.error(error.response?.data?.desc || 'Mật khẩu hiện tại không chính xác.');
        } finally {
            setIsLoading(false);
        }
    };

    const PasswordRequirements = ({ password }) => {
        const requirements = [
            { label: 'Ít nhất 8 ký tự', met: password.length >= 8 },
            { label: 'Chữ hoa (A-Z)', met: /[A-Z]/.test(password) },
            { label: 'Chữ thường (a-z)', met: /[a-z]/.test(password) },
            { label: 'Số (0-9)', met: /[0-9]/.test(password) },
            { label: 'Ký tự đặc biệt (@, #, $...)', met: /[@#$%^&+=!]/.test(password) }
        ];

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 p-3 bg-muted/30 rounded-lg border border-dashed">
                {requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        {req.met ? (
                            <Check className="h-3 w-3 text-green-500" />
                        ) : (
                            <X className="h-3 w-3 text-red-400" />
                        )}
                        <span className={req.met ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                            {req.label}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex w-full justify-center p-4">
            <Card className="w-full max-w-lg shadow-sm border-t-2 border-t-primary">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl font-bold">Thay đổi mật khẩu</CardTitle>
                    </div>
                    <CardDescription>
                        Cập nhật mật khẩu giúp bảo vệ tài khoản của bạn an toàn hơn.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="oldPassword" 
                                    type={showOldPassword ? "text" : "password"}
                                    placeholder="••••••••" 
                                    className="pl-10 pr-10"
                                    required 
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showOldPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="newPassword" 
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="••••••••" 
                                        className={`pl-10 pr-10 ${passwordError && formData.newPassword ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                                        required 
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                    >
                                        {showNewPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    </button>
                                </div>
                                {formData.newPassword && (
                                    <div className="space-y-2">
                                        {formData.newPassword === formData.oldPassword && (
                                            <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                                                <X className="h-3 w-3" /> Mật khẩu mới không được giống mật khẩu cũ
                                            </p>
                                        )}
                                        <PasswordRequirements password={formData.newPassword} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="confirmPassword" 
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••" 
                                        className="pl-10 pr-10"
                                        required 
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button 
                                type="submit" 
                                disabled={
                                    isLoading || 
                                    (formData.newPassword && !isValidPassword(formData.newPassword)) ||
                                    (formData.newPassword && formData.newPassword === formData.oldPassword)
                                } 
                                className="w-full sm:w-auto h-11 px-8 font-semibold shadow-md active:scale-95 transition-all"
                            >
                                {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChangePassword;
