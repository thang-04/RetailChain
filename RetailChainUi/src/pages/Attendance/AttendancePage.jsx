// src/pages/Attendance/AttendancePage.jsx
// Trang chấm công cho Staff - Check-in/Check-out

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import attendanceService from '@/services/attendance.service';
import useCurrentLocation from '@/hooks/useCurrentLocation';
import useAuth from '@/contexts/AuthContext/useAuth';

const AttendancePage = () => {
  const { user } = useAuth();
  const { loading: locationLoading, error: locationError, getLocation, clearError } = useCurrentLocation();

  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [note, setNote] = useState('');

  const fetchTodayStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getMyHistory(
        new Date().toISOString().split('T')[0],
        new Date().toISOString().split('T')[0],
        0,
        1
      );
      
      if (response.code === 200 && response.data.data.length > 0) {
        setTodayStatus(response.data.data[0]);
      } else {
        setTodayStatus(null);
      }
    } catch (error) {
      console.error('Failed to fetch today status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayStatus();
  }, [fetchTodayStatus]);

  const handleCheckin = async () => {
    try {
      clearError();
      setChecking(true);
      
      const position = await getLocation();
      if (!position) {
        toast.error('Không lấy được vị trí');
        return;
      }

      const response = await attendanceService.checkin(
        position.latitude,
        position.longitude,
        note
      );

      if (response.code === 200) {
        const data = response.data;
        setTodayStatus({
          date: new Date().toISOString().split('T')[0],
          checkInTime: data.occurredAt?.split(' ')[1]?.substring(0, 5) || '--:--',
          status: data.status
        });
        
        if (data.warning) {
          toast.warning(data.warning);
        } else {
          toast.success(data.message || 'Check-in thành công');
        }
        setNote('');
      } else {
        toast.error(response.desc || response.message || 'Check-in thất bại');
      }
    } catch (error) {
      console.error('Checkin error:', error);
      const errorMsg = error.response?.data?.desc || error.message || 'Check-in thất bại';
      toast.error(errorMsg);
    } finally {
      setChecking(false);
    }
  };

  const handleCheckout = async () => {
    try {
      clearError();
      setChecking(true);
      
      const position = await getLocation();
      if (!position) {
        toast.error('Không lấy được vị trí');
        return;
      }

      const response = await attendanceService.checkout(
        position.latitude,
        position.longitude,
        note
      );

      if (response.code === 200) {
        const data = response.data;
        setTodayStatus(prev => ({
          ...prev,
          checkOutTime: data.occurredAt?.split(' ')[1]?.substring(0, 5) || '--:--',
          workHours: data.workHours || 0,
          status: data.status
        }));
        
        if (data.warning) {
          toast.warning(data.warning);
        } else {
          toast.success(data.message || 'Check-out thành công');
        }
        setNote('');
      } else {
        toast.error(response.desc || response.message || 'Check-out thất bại');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMsg = error.response?.data?.desc || error.message || 'Check-out thất bại';
      toast.error(errorMsg);
    } finally {
      setChecking(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'ONTIME': { variant: 'default', label: 'Đúng giờ', className: 'bg-green-500' },
      'LATE': { variant: 'destructive', label: 'Muộn', className: 'bg-yellow-500' },
      'EARLY_LEAVE': { variant: 'outline', label: 'Về sớm', className: 'bg-orange-500 text-orange-700' },
      'FORGOT': { variant: 'secondary', label: 'Quên checkout', className: 'bg-red-500' }
    };
    const config = statusMap[status] || { variant: 'secondary', label: status || 'Chưa checkin' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const isCheckedIn = todayStatus?.checkInTime && !todayStatus?.checkOutTime;
  const isCompleted = todayStatus?.checkInTime && todayStatus?.checkOutTime;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#121617] dark:text-white">Chấm công</h1>
          <p className="text-[#677c83] dark:text-gray-400">Check-in và Check-out hàng ngày</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/attendance/history">Xem lịch sử</Link>
        </Button>
      </div>

      {/* Today's Status Card */}
      <Card className="border border-[#e2e8f0] dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Hôm nay - {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#f1f5f9] dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-[#677c83] dark:text-gray-400 mb-1">Check-in</p>
              <p className="text-2xl font-semibold">{todayStatus?.checkInTime || '--:--'}</p>
            </div>
            <div className="text-center p-4 bg-[#f1f5f9] dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-[#677c83] dark:text-gray-400 mb-1">Check-out</p>
              <p className="text-2xl font-semibold">{todayStatus?.checkOutTime || '--:--'}</p>
            </div>
            <div className="text-center p-4 bg-[#f1f5f9] dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-[#677c83] dark:text-gray-400 mb-1">Giờ làm</p>
              <p className="text-2xl font-semibold">{todayStatus?.workHours ? `${todayStatus.workHours}h` : '--'}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2">
            {getStatusBadge(todayStatus?.status)}
          </div>
        </CardContent>
      </Card>

      {/* Action Card */}
      {!isCompleted && (
        <Card className="border border-[#e2e8f0] dark:border-gray-700">
          <CardContent className="pt-6">
            {/* Note Input */}
            <div className="mb-4">
              <Label htmlFor="note" className="text-sm text-[#677c83]">Ghi chú (tùy chọn)</Label>
              <Input
                id="note"
                placeholder="Nhập ghi chú..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isCheckedIn ? (
                <Button
                  onClick={handleCheckin}
                  disabled={checking || locationLoading}
                  className="flex-1 bg-[#24748f] hover:bg-[#1a566b] h-14 text-lg"
                >
                  {checking || locationLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Đang lấy vị trí...
                    </span>
                  ) : (
                    '📍 Check-in'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleCheckout}
                  disabled={checking || locationLoading}
                  className="flex-1 bg-[#24748f] hover:bg-[#1a566b] h-14 text-lg"
                >
                  {checking || locationLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Đang lấy vị trí...
                    </span>
                  ) : (
                    '🏁 Check-out'
                  )}
                </Button>
              )}
            </div>

            {/* Error Message */}
            {locationError && (
              <p className="mt-3 text-sm text-red-500 text-center">{locationError}</p>
            )}

            {/* Info Text */}
            <p className="mt-4 text-xs text-center text-[#677c83] dark:text-gray-400">
              Vui lòng bật GPS và cho phép trình duyệt truy cập vị trí để check-in/check-out
            </p>
          </CardContent>
        </Card>
      )}

      {/* Completed Status */}
      {isCompleted && (
        <Card className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Hoàn thành công việc hôm nay</h3>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Bạn đã làm việc {todayStatus?.workHours || 0} giờ
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendancePage;
