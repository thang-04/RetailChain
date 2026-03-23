import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../contexts/AuthContext/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 8) {
            toast.error('Mật khẩu phải có ít nhất 8 ký tự.');
            return;
        }
        setIsSubmitting(true);
        try {
            const data = await login(email, password);
            if (data.requireChangePassword) {
                toast.info('Đây là lần đầu bạn đăng nhập. Vui lòng đổi mật khẩu.');
                navigate('/force-change-password', { state: { tempToken: data.tempToken, email: email } });
                return;
            }
            toast.success('Đăng nhập thành công!');
            navigate('/');
        } catch (err) {
            toast.error(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-primary">RetailChain</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Chào mừng bạn quay lại. Đăng nhập để tiếp tục.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ten@retailchain.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-primary hover:underline hover:text-primary/90"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-background pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full mt-2 py-6 text-base font-semibold transition-all hover:scale-[1.01]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center">
                    <div className="text-sm text-muted-foreground">
                        RetailChain © 2026
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
