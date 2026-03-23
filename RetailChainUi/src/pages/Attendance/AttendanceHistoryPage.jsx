// src/pages/Attendance/AttendanceHistoryPage.jsx
// Trang lịch sử chấm công cá nhân

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import attendanceService from '@/services/attendance.service';

const AttendanceHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, limit: 30, total: 0, totalPages: 0 });
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getMyHistory(fromDate, toDate, pagination.page, pagination.limit);
      
      if (response.code === 200) {
        setHistory(response.data.data || []);
        setPagination(prev => ({
          ...prev,
          page: response.data.pagination?.page || 0,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0
        }));
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('Không tải được lịch sử chấm công');
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getStatusBadge = (status) => {
    const statusMap = {
      'ONTIME': { variant: 'default', label: 'Đúng giờ', className: 'bg-green-500' },
      'LATE': { variant: 'destructive', label: 'Muộn', className: 'bg-yellow-500' },
      'EARLY_LEAVE': { variant: 'outline', label: 'Về sớm', className: 'bg-orange-500 text-orange-700' },
      'FORGOT': { variant: 'secondary', label: 'Quên chấm công ra', className: 'bg-red-500' }
    };
    const config = statusMap[status] || { variant: 'secondary', label: status || 'Chưa xác định' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#121617] dark:text-white">Lịch sử chấm công</h1>
          <p className="text-[#677c83] dark:text-gray-400">Xem lịch sử chấm công vào và chấm công ra của bạn</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/attendance">Quay lại</Link>
        </Button>
      </div>

      {/* Filter Card */}
      <Card className="border border-[#e2e8f0] dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Lọc theo ngày</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="fromDate" className="text-sm text-[#677c83]">Từ ngày</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="toDate" className="text-sm text-[#677c83]">Đến ngày</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={() => setPagination(prev => ({ ...prev, page: 0 }))} className="bg-[#24748f] hover:bg-[#1a566b]">
              Lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border border-[#e2e8f0] dark:border-gray-700">
          <CardContent className="pt-4">
            <p className="text-sm text-[#677c83] dark:text-gray-400">Tổng ngày</p>
            <p className="text-2xl font-bold">{pagination.total}</p>
          </CardContent>
        </Card>
        <Card className="border border-[#e2e8f0] dark:border-gray-700">
          <CardContent className="pt-4">
            <p className="text-sm text-[#677c83] dark:text-gray-400">Đúng giờ</p>
            <p className="text-2xl font-bold text-green-600">
              {history.filter(h => h.status === 'ONTIME').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-[#e2e8f0] dark:border-gray-700">
          <CardContent className="pt-4">
            <p className="text-sm text-[#677c83] dark:text-gray-400">Muộn</p>
            <p className="text-2xl font-bold text-yellow-600">
              {history.filter(h => h.status === 'LATE').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-[#e2e8f0] dark:border-gray-700">
          <CardContent className="pt-4">
            <p className="text-sm text-[#677c83] dark:text-gray-400">TB giờ/ngày</p>
            <p className="text-2xl font-bold">
              {history.length > 0 
                ? (history.reduce((acc, h) => acc + (h.workHours || 0), 0) / history.length).toFixed(1)
                : 0}h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className="border border-[#e2e8f0] dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Danh sách chấm công</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-[#677c83]">Đang tải...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-[#677c83]">Không có dữ liệu</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Chấm công vào</TableHead>
                  <TableHead>Chấm công ra</TableHead>
                  <TableHead>Giờ làm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
                    <TableCell>{record.checkInTime || '--:--'}</TableCell>
                    <TableCell>{record.checkOutTime || '--:--'}</TableCell>
                    <TableCell>{record.workHours ? `${record.workHours}h` : '--'}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e2e8f0]">
              <p className="text-sm text-[#677c83]">
                Trang {pagination.page + 1} / {pagination.totalPages} ({pagination.total} bản ghi)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 0}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages - 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceHistoryPage;
