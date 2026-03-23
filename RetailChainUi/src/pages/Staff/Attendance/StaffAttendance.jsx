// src/pages/Staff/Attendance/StaffAttendance.jsx
// Trang Dashboard chấm công cho Manager/Admin

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import attendanceService from "@/services/attendance.service";
import storeService from "@/services/store.service";
import useAuth from "@/contexts/AuthContext/useAuth";

const StaffAttendance = () => {
    const { user, isSuperAdmin, isStoreManager } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState(null);
    const [attendanceList, setAttendanceList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedStoreId, setSelectedStoreId] = useState(null);
    const [stores, setStores] = useState([]);

    const storeId = user?.storeId;

    const fetchDashboard = useCallback(async () => {
        if (!storeId && !isSuperAdmin()) return;
        
        try {
            setLoading(true);
            let dashRes, listRes;
            
            if (isSuperAdmin() && !selectedStoreId) {
                dashRes = await attendanceService.getAllDashboard();
                listRes = { code: 200, data: [] };
            } else {
                const targetStoreId = isSuperAdmin() ? selectedStoreId : storeId;
                [dashRes, listRes] = await Promise.all([
                    attendanceService.getDashboard(targetStoreId, selectedDate),
                    attendanceService.getStoreAttendance(targetStoreId, selectedDate, statusFilter === 'all' ? '' : statusFilter)
                ]);
            }
            
            if (dashRes.code === 200) {
                setDashboard(dashRes.data);
            }
            if (listRes.code === 200) {
                setAttendanceList(listRes.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
            toast.error('Không tải được dữ liệu chấm công');
        } finally {
            setLoading(false);
        }
    }, [storeId, selectedDate, statusFilter, isSuperAdmin, selectedStoreId]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    useEffect(() => {
        if (isSuperAdmin() || isStoreManager()) {
            storeService.getAllStores()
                .then(data => setStores(data))
                .catch(err => console.error('Failed to load stores:', err));
        }
    }, [isSuperAdmin, isStoreManager]);

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

    if (!storeId && !isSuperAdmin()) {
        return (
            <div className="p-6 text-center">
                <p className="text-[#677c83]">Bạn không được phân công cửa hàng</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#121617] dark:text-white">
                        Chấm công & Hiệu suất
                    </h2>
                    <p className="text-[#677c83] dark:text-gray-400">Theo dõi chấm công vào và giờ làm hằng ngày</p>
                </div>
                <div className="flex gap-2 items-center">
                    {/* Store selector for Super Admin */}
                    {isSuperAdmin() && (
                        <Select 
                            value={selectedStoreId || 'all'} 
                            onValueChange={(val) => setSelectedStoreId(val === 'all' ? null : val)}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Chọn cửa hàng" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả cửa hàng</SelectItem>
                                {stores.map(store => (
                                    <SelectItem key={store.id} value={store.dbId}>
                                        {store.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {/* Store name for Store Manager */}
                    {isStoreManager() && user?.storeId && (
                        <div className="text-sm text-muted-foreground">
                            Cửa hàng: {stores.find(s => s.dbId === user.storeId)?.name || 'Đang tải...'}
                        </div>
                    )}
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-auto"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="ONTIME">Đúng giờ</SelectItem>
                            <SelectItem value="LATE">Muộn</SelectItem>
                            <SelectItem value="EARLY_LEAVE">Về sớm</SelectItem>
                            <SelectItem value="FORGOT">Quên chấm công ra</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border border-[#e2e8f0] dark:border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#677c83]">Có mặt hôm nay</CardTitle>
                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dashboard?.presentToday || 0} / {dashboard?.totalStaff || 0}
                        </div>
                        <p className="text-xs text-[#677c83]">
                            {dashboard?.totalStaff ? Math.round((dashboard.presentToday / dashboard.totalStaff) * 100) : 0}% tổng nhân viên
                        </p>
                    </CardContent>
                </Card>
                <Card className="border border-[#e2e8f0] dark:border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#677c83]">Đã chấm công ra</CardTitle>
                        <span className="material-symbols-outlined text-blue-500">logout</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboard?.completedToday || 0}</div>
                        <p className="text-xs text-[#677c83]">
                            Hoàn thành ca làm
                        </p>
                    </CardContent>
                </Card>
                <Card className="border border-[#e2e8f0] dark:border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#677c83]">Đến muộn</CardTitle>
                        <span className="material-symbols-outlined text-yellow-500">schedule</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{dashboard?.lateArrivals || 0}</div>
                        <p className="text-xs text-[#677c83]">
                            {dashboard?.lateArrivals > 0 ? 'Cần theo dõi' : 'Không có'}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border border-[#e2e8f0] dark:border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-[#677c83]">TB Giờ làm</CardTitle>
                        <span className="material-symbols-outlined text-[#24748f]">timelapse</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboard?.avgWorkHours || 0}h</div>
                        <p className="text-xs text-[#677c83]">Trung bình/ngày</p>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Table */}
            <Card className="border border-[#e2e8f0] dark:border-gray-700">
                <CardHeader>
                    <CardTitle>Lịch sử chấm công - {formatDate(selectedDate)}</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-[#677c83]">Đang tải...</div>
                    ) : attendanceList.length === 0 ? (
                        <div className="text-center py-8 text-[#677c83]">Không có dữ liệu</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nhân viên</TableHead>
                                    <TableHead>Ca làm</TableHead>
                                    <TableHead>Ngày</TableHead>
                                    <TableHead>Chấm công vào</TableHead>
                                    <TableHead>Chấm công ra</TableHead>
                                    <TableHead>Giờ làm</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendanceList.map((record, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{record.userName || 'Chưa có'}</TableCell>
                                        <TableCell>{record.shiftName || 'Chưa có'}</TableCell>
                                        <TableCell>{formatDate(record.date)}</TableCell>
                                        <TableCell>{record.checkInTime || '--:--'}</TableCell>
                                        <TableCell>{record.checkOutTime || '--:--'}</TableCell>
                                        <TableCell>{record.workHours ? `${record.workHours}h` : '--'}</TableCell>
                                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffAttendance;
