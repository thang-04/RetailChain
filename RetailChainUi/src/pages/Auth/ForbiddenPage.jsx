import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ForbiddenPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        shield_lock
                    </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    403 - Truy cập bị từ chối
                </h1>

                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Bạn không có quyền thực hiện hành động hoặc truy cập vào trang này. Hệ thống đã chặn yêu cầu từ Backend.
                </p>

                <Button
                    onClick={() => navigate('/')}
                    className="w-full gap-2"
                >
                    <span className="material-symbols-outlined text-sm">home</span>
                    Trở về Trang Chủ
                </Button>
            </div>
        </div>
    );
};

export default ForbiddenPage;
