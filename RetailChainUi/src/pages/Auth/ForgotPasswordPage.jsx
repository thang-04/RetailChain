import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import authService from '@/services/auth.service';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Key, ShieldCheck, RefreshCw, Check, X } from 'lucide-react';
import { getPasswordError, isValidPassword } from '@/utils/validators';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [timer, setTimer] = useState(0);
    const [passwordError, setPasswordError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        if (newPassword) {
            setPasswordError(getPasswordError(newPassword));
        } else {
            setPasswordError(null);
        }
    }, [newPassword]);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authService.forgotPassword(email);
            if (response.code === 200) {
                toast.success('Mã OTP đã được gửi đến email của bạn.');
                setStep(2);
                setTimer(60);
            } else {
                toast.error(response.desc || 'Email không tồn tại trong hệ thống.');
            }
        } catch (error) {
            toast.error(error.response?.data?.desc || 'Không thể gửi yêu cầu. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        setIsLoading(true);
        try {
            await authService.forgotPassword(email);
            toast.success('Mã OTP đã được gửi lại.');
            setTimer(60);
        } catch (error) {
            toast.error('Không thể gửi lại OTP. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authService.verifyOtp(email, otp);
            if (response.code === 200) {
                toast.success('Xác thực OTP thành công.');
                setStep(3);
            } else {
                toast.error(response.desc || 'Mã OTP không chính xác.');
            }
        } catch (error) {
            toast.error(error.response?.data?.desc || 'Đã có lỗi xảy ra khi xác thực OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        const error = getPasswordError(newPassword);
        if (error) {
            toast.error(error);
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await authService.confirmPassword({
                email,
                otp,
                newPassword
            });
            if (response.code === 200) {
                toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
                navigate('/login');
            } else {
                toast.error(response.desc || 'Đổi mật khẩu thất bại.');
            }
        } catch (error) {
            toast.error(error.response?.data?.desc || 'Mã OTP không chính xác hoặc đã hết hạn.');
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

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <form onSubmit={handleRequestOtp} className="space-y-4 animate-in fade-in duration-500">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email tài khoản</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="example@retailchain.com" 
                                    className="pl-10"
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Đang gửi..." : "Tiếp tục"}
                        </Button>
                    </form>
                );
            case 2:
                return (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2">
                            <Label htmlFor="otp">Mã xác thực OTP</Label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="otp" 
                                    type="text" 
                                    placeholder="Nhập 6 ký tự OTP" 
                                    className="pl-10 tracking-widest font-bold"
                                    required 
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                Mã OTP đã được gửi đến <strong>{email}</strong>
                            </p>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Đang xác thực..." : "Xác nhận OTP"}
                        </Button>
                        <div className="text-center">
                            <Button 
                                type="button" 
                                variant="link" 
                                size="sm" 
                                className="text-xs"
                                disabled={timer > 0 || isLoading}
                                onClick={handleResendOtp}
                            >
                                <RefreshCw className={`mr-2 h-3 w-3 ${isLoading && 'animate-spin'}`} />
                                {timer > 0 ? `Gửi lại OTP sau ${timer}s` : "Gửi lại mã OTP"}
                            </Button>
                        </div>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            className="w-full text-xs" 
                            onClick={() => setStep(1)}
                        >
                            Thay đổi email
                        </Button>
                    </form>
                );
            case 3:
                return (
                    <form onSubmit={handleResetPassword} className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Mật khẩu mới</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="newPassword" 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••" 
                                    className={`pl-10 ${newPassword && passwordError ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                                    required 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </button>
                            </div>
                            {newPassword && <PasswordRequirements password={newPassword} />}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="confirmPassword" 
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••" 
                                    className="pl-10"
                                    required 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={isLoading || (newPassword && !isValidPassword(newPassword))}
                        >
                            {isLoading ? "Đang cập nhật..." : "Đổi mật khẩu"}
                        </Button>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                <CardHeader className="space-y-2 text-center pb-2">
                    <CardTitle className="text-2xl font-bold tracking-tight">Quên mật khẩu</CardTitle>
                    <CardDescription>
                        {step === 1 && "Nhập email của bạn để bắt đầu khôi phục"}
                        {step === 2 && "Nhập mã OTP đã được gửi qua email"}
                        {step === 3 && "Thiết lập mật khẩu mới cho tài khoản của bạn"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    {renderStep()}
                </CardContent>
                <CardFooter className="flex justify-center border-t py-4">
                    <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                        Quay lại đăng nhập
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;
