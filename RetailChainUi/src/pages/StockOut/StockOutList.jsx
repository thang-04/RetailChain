import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import inventoryService from '@/services/inventory.service';
import stockRequestService from '@/services/stockRequest.service';
import {
    Upload, Plus, Eye, Edit, Trash2, MoreHorizontal,
    Search, FileText, RotateCcw, Calendar,
    Truck, Package, Clock, CheckCircle2,
    ClipboardList, DollarSign, Filter, X,
    TrendingUp, AlertCircle, PackageCheck, Bell
} from 'lucide-react';

const detectTimeframe = (startDate, endDate) => {
    if (!startDate || !endDate) return 'current-month';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = (end - start) / (1000 * 60 * 60 * 24);
    
    if (diffDays >= 25 && diffDays <= 35) return 'month';
    if (diffDays >= 85 && diffDays <= 95) return 'quarter';
    if (diffDays >= 350 && diffDays <= 380) return 'year';
    
    return 'custom';
};

const getBaselineRange = (timeframe, currentStart) => {
    const start = new Date(currentStart);
    
    switch (timeframe) {
        case 'month':
            const prevMonthStart = new Date(start.getFullYear(), start.getMonth() - 1, 1);
            const prevMonthEnd = new Date(start.getFullYear(), start.getMonth(), 0);
            return { start: prevMonthStart, end: prevMonthEnd };
        case 'quarter':
            const quarter = Math.floor(start.getMonth() / 3);
            const prevQuarterStart = new Date(start.getFullYear(), (quarter - 1) * 3, 1);
            const prevQuarterEnd = new Date(start.getFullYear(), quarter * 3, 0);
            return { start: prevQuarterStart, end: prevQuarterEnd };
        case 'year':
            return { 
                start: new Date(start.getFullYear() - 1, 0, 1), 
                end: new Date(start.getFullYear() - 1, 11, 31) 
            };
        default:
            return null;
    }
};

const formatCompactCurrency = (value) => {
    if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
    return value.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + 'đ';
};

const StatCard = ({ title, value, subtitle, icon: IconProp, variant = "default", trend }) => {
    const Icon = IconProp;
    const variants = {
        default: {
            bg: "bg-gradient-to-br from-primary/5 to-primary/10",
            border: "border-primary/20",
            iconBg: "bg-primary/15",
            iconColor: "text-primary",
            valueColor: "text-primary",
        },
        success: {
            bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
            border: "border-emerald-200/50",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            valueColor: "text-emerald-700",
        },
        warning: {
            bg: "bg-gradient-to-br from-amber-50 to-orange-50",
            border: "border-amber-200/50",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            valueColor: "text-amber-700",
        },
        danger: {
            bg: "bg-gradient-to-br from-red-50 to-rose-50",
            border: "border-red-200/50",
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            valueColor: "text-red-700",
        },
        info: {
            bg: "bg-gradient-to-br from-sky-50 to-blue-50",
            border: "border-sky-200/50",
            iconBg: "bg-sky-100",
            iconColor: "text-sky-600",
            valueColor: "text-sky-700",
        }
    };
    
    const style = variants[variant] || variants.default;

    return (
        <Card className={`relative overflow-hidden border ${style.border} ${style.bg} hover:shadow-lg transition-all duration-300 group`}>
            <CardContent className="p-5 relative z-10">
                <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">{title}</p>
                        <p className={`text-3xl font-extrabold tracking-tight ${style.valueColor}`}>
                            {value}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                {trend && (
                                    <span className={trend > 0 ? 'text-emerald-600' : 'text-red-600'}>
                                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                                    </span>
                                )}
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl ${style.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${style.iconColor}`} />
                    </div>
                </div>
                <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full ${style.iconBg} opacity-30`} />
            </CardContent>
        </Card>
    );
};

const FilterPill = ({ label, value, onRemove }) => (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
        <span className="text-xs uppercase tracking-wider opacity-70">{label}:</span>
        <span className="font-semibold">{value}</span>
        {onRemove && (
            <button 
                onClick={onRemove}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            >
                <X className="w-3 h-3" />
            </button>
        )}
    </div>
);

const StockOutList = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('stock-out');
    const [pendingRequests, setPendingRequests] = useState([]);
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getStockOutRecords();
            setRecords(data || []);
        } catch (error) {
            console.error("Failed to fetch stock out records:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            setRequestsLoading(true);
            const data = await stockRequestService.getPendingRequests();
            const response = data?.data || data;
            setPendingRequests(response || []);
        } catch (error) {
            console.error("Failed to fetch pending requests:", error);
        } finally {
            setRequestsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (activeTab === 'pending-requests') {
            fetchPendingRequests();
        }
    }, [activeTab]);

    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            const matchesSearch =
                (record.documentCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (record.sourceWarehouseName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (record.note?.toLowerCase() || '').includes(searchTerm.toLowerCase());

            let matchesDate = true;
            if (dateFilter.start) {
                matchesDate = matchesDate && new Date(record.createdAt) >= new Date(dateFilter.start);
            }
            if (dateFilter.end) {
                matchesDate = matchesDate && new Date(record.createdAt) <= new Date(dateFilter.end + 'T23:59:59');
            }

            let matchesStatus = true;
            if (statusFilter && statusFilter !== 'all') {
                matchesStatus = record.status === statusFilter;
            }

            return matchesSearch && matchesDate && matchesStatus;
        });
    }, [records, searchTerm, dateFilter, statusFilter]);

    const stats = useMemo(() => {
        const now = new Date();
        const hasDateFilter = dateFilter.start && dateFilter.end;
        
        let currentStart, currentEnd;
        
        if (hasDateFilter) {
            currentStart = new Date(dateFilter.start);
            currentEnd = new Date(dateFilter.end + 'T23:59:59');
        } else {
            currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
            currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        }
        
        const timeframe = detectTimeframe(dateFilter.start, dateFilter.end);
        const baselineRange = getBaselineRange(timeframe, currentStart);
        
        const currentRecords = records.filter(r => {
            if (!r.createdAt) return false;
            const d = new Date(r.createdAt);
            return d >= currentStart && d <= currentEnd;
        });
        
        let previousRecords = [];
        if (baselineRange && timeframe !== 'custom') {
            previousRecords = records.filter(r => {
                if (!r.createdAt) return false;
                const d = new Date(r.createdAt);
                return d >= baselineRange.start && d <= baselineRange.end;
            });
        }
        
        const total = currentRecords.length;
        const completed = currentRecords.filter(r => r.status === 'Completed').length;
        const pending = currentRecords.filter(r => r.status === 'Pending').length;
        const cancelled = currentRecords.filter(r => r.status === 'Cancelled').length;
        const totalValue = currentRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
        const totalItems = currentRecords.reduce((sum, r) => sum + (r.totalItems || 0), 0);
        
        const prevTotal = previousRecords.length;
        const prevValue = previousRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
        
        const showTrend = baselineRange !== null && (prevTotal > 0 || prevValue > 0);
        const totalTrend = showTrend && prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : null;
        const valueTrend = showTrend && prevValue > 0 ? Math.round(((totalValue - prevValue) / prevValue) * 100) : null;
        
        const displayValue = totalValue >= 1e9 || totalValue >= 1e6 
            ? formatCompactCurrency(totalValue) 
            : totalValue.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + 'đ';
        
        return { 
            total, completed, pending, cancelled, 
            totalValue: displayValue, 
            totalItems: totalItems.toLocaleString('vi-VN'),
            totalTrend, valueTrend, 
            hasPreviousData: showTrend
        };
    }, [records, dateFilter]);

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
    const paginatedRecords = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRecords.slice(start, start + itemsPerPage);
    }, [filteredRecords, currentPage, itemsPerPage]);

    const handleViewDetail = (record) => {
        setSelectedRecord(record);
        setIsDetailOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa phiếu xuất kho này?')) {
            try {
                await inventoryService.deleteDocument(id);
                setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
            } catch (error) {
                console.error("Failed to delete stock out record:", error);
            }
        }
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setDateFilter({ start: '', end: '' });
        setStatusFilter('all');
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, dateFilter, statusFilter]);

    const hasActiveFilters = searchTerm || dateFilter.start || dateFilter.end || (statusFilter && statusFilter !== 'all');

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Completed': { label: 'Hoàn thành', class: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
            'Pending': { label: 'Chờ duyệt', class: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100' },
            'Cancelled': { label: 'Đã hủy', class: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100' },
        };
        const config = statusConfig[status] || statusConfig['Pending'];
        return <Badge className={`${config.class} border font-medium px-2.5 py-0.5`}>{config.label}</Badge>;
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto p-6 lg:p-8 flex flex-col gap-6 min-h-full">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                                <Truck className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                                    Xuất Kho
                                </h1>
                                <p className="text-muted-foreground text-base font-medium">Quản lý và theo dõi các phiếu xuất hàng</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="outline" 
                                className="gap-2 rounded-xl border-dashed hover:border-primary hover:bg-primary/5"
                            >
                                <Upload className="w-4 h-4" />
                                <span className="hidden sm:inline">Nhập Excel</span>
                            </Button>
                            <Link to="/stock-out/create">
                                <Button className="gap-2 px-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 font-semibold">
                                    <Plus className="w-5 h-5" />
                                    <span>Tạo phiếu mới</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 border-b border-border">
                        <button
                            onClick={() => setActiveTab('stock-out')}
                            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                                activeTab === 'stock-out'
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Phiếu xuất kho
                            {activeTab === 'stock-out' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('pending-requests')}
                            className={`px-4 py-2 font-medium text-sm transition-colors relative flex items-center gap-2 ${
                                activeTab === 'pending-requests'
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Yêu cầu chờ duyệt
                            {pendingRequests.length > 0 && (
                                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {pendingRequests.length}
                                </span>
                            )}
                            {activeTab === 'pending-requests' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`px-4 py-2 font-medium text-sm transition-colors relative flex items-center gap-2 ${
                                activeTab === 'notifications'
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Bell className="w-4 h-4" />
                            Thông báo
                            {activeTab === 'notifications' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    </div>

                    {/* Content based on active tab */}
                    {activeTab === 'stock-out' && (
                        <>
                    {!loading && records.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <StatCard
                                title="Tổng phiếu"
                                value={stats.total}
                                subtitle="Phiếu xuất kho"
                                icon={ClipboardList}
                                variant="default"
                                trend={stats.hasPreviousData ? stats.totalTrend : undefined}
                            />
                            <StatCard
                                title="Chờ duyệt"
                                value={stats.pending}
                                subtitle="Đang xử lý"
                                icon={Clock}
                                variant="warning"
                            />
                            <StatCard
                                title="Hoàn thành"
                                value={stats.completed}
                                subtitle="Đã xuất kho"
                                icon={CheckCircle2}
                                variant="success"
                            />
                            <StatCard
                                title="Đã hủy"
                                value={stats.cancelled}
                                subtitle="Bị từ chối"
                                icon={AlertCircle}
                                variant="danger"
                            />
                            <StatCard
                                title="Giá trị"
                                value={stats.totalValue}
                                subtitle={`${stats.totalItems} sản phẩm`}
                                icon={DollarSign}
                                variant="info"
                                trend={stats.hasPreviousData ? stats.valueTrend : undefined}
                            />
                        </div>
                    )}

                    {/* Filter Bar */}
                    <div className="bg-card rounded-2xl border border-border/50 p-4">
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                            {/* Search */}
                            <div className="flex-1 max-w-sm">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                    Tìm kiếm
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        className="pl-10 bg-background border-border h-11"
                                        placeholder="Mã phiếu, kho xuất, ghi chú..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="w-40">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                    Trạng thái
                                </Label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="bg-background border-border h-11">
                                        <SelectValue placeholder="Tất cả" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="Pending">Chờ duyệt</SelectItem>
                                        <SelectItem value="Completed">Hoàn thành</SelectItem>
                                        <SelectItem value="Cancelled">Đã hủy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date From */}
                            <div className="w-40">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                    Từ ngày
                                </Label>
                                <Input
                                    type="date"
                                    className="bg-background border-border h-11"
                                    value={dateFilter.start}
                                    onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                                />
                            </div>

                            {/* Date To */}
                            <div className="w-40">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                    Đến ngày
                                </Label>
                                <Input
                                    type="date"
                                    className="bg-background border-border h-11"
                                    value={dateFilter.end}
                                    onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                                />
                            </div>

                            {/* Clear filters */}
                            {hasActiveFilters && (
                                <Button 
                                    variant="ghost" 
                                    onClick={handleResetFilters}
                                    className="text-muted-foreground hover:text-foreground gap-2 h-11 px-4"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Xóa lọc</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-muted-foreground font-medium">Lọc:</span>
                            {searchTerm && (
                                <FilterPill 
                                    label="Tìm kiếm" 
                                    value={searchTerm} 
                                    onRemove={() => setSearchTerm('')} 
                                />
                            )}
                            {statusFilter && statusFilter !== 'all' && (
                                <FilterPill 
                                    label="Trạng thái" 
                                    value={statusFilter === 'Pending' ? 'Chờ duyệt' : statusFilter === 'Completed' ? 'Hoàn thành' : 'Đã hủy'} 
                                    onRemove={() => setStatusFilter('all')} 
                                />
                            )}
                            {dateFilter.start && (
                                <FilterPill 
                                    label="Từ ngày" 
                                    value={new Date(dateFilter.start).toLocaleDateString('vi-VN')} 
                                    onRemove={() => setDateFilter(prev => ({ ...prev, start: '' }))} 
                                />
                            )}
                            {dateFilter.end && (
                                <FilterPill 
                                    label="Đến ngày" 
                                    value={new Date(dateFilter.end).toLocaleDateString('vi-VN')} 
                                    onRemove={() => setDateFilter(prev => ({ ...prev, end: '' }))} 
                                />
                            )}
                        </div>
                    )}

                    {/* Results Count */}
                    {filteredRecords.length > 0 && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Tìm thấy <span className="font-bold text-foreground">{filteredRecords.length}</span> phiếu xuất kho
                            </span>
                        </div>
                    )}

                    {/* Data Table */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-muted-foreground font-medium">Đang tải dữ liệu...</p>
                        </div>
                    ) : filteredRecords.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-gradient-to-b from-muted/30 to-muted/10 rounded-3xl border-2 border-dashed border-border/60">
                            <div className="w-28 h-28 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/5">
                                <Truck className="w-14 h-14 text-primary/30" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                {hasActiveFilters ? 'Không tìm thấy kết quả' : 'Chưa có phiếu xuất kho'}
                            </h3>
                            <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
                                {hasActiveFilters 
                                    ? 'Thử điều chỉnh bộ lọc để tìm kiếm kết quả khác.'
                                    : 'Tạo phiếu xuất kho đầu tiên để bắt đầu quản lý xuất hàng từ kho tổng đến cửa hàng.'
                                }
                            </p>
                            {hasActiveFilters ? (
                                <Button variant="outline" onClick={handleResetFilters} className="gap-2 rounded-xl px-6">
                                    <RotateCcw className="w-4 h-4" /> Xóa bộ lọc
                                </Button>
                            ) : (
                                <Link to="/stock-out/create">
                                    <Button className="gap-2 rounded-xl px-6 shadow-lg shadow-primary/20">
                                        <Plus className="w-5 h-5" /> Tạo phiếu xuất
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-gradient-to-r from-muted/60 to-muted/40">
                                    <TableRow className="hover:bg-transparent border-border/50">
                                        <TableHead className="w-14 text-center font-bold text-muted-foreground/80">STT</TableHead>
                                        <TableHead className="font-bold text-muted-foreground/80">Mã phiếu</TableHead>
                                        <TableHead className="font-bold text-muted-foreground/80">Ngày xuất</TableHead>
                                        <TableHead className="font-bold text-muted-foreground/80">Kho xuất</TableHead>
                                        <TableHead className="font-bold text-muted-foreground/80">Lý do xuất</TableHead>
                                        <TableHead className="text-right font-bold text-muted-foreground/80">Sản phẩm</TableHead>
                                        <TableHead className="text-right font-bold text-muted-foreground/80">Giá trị</TableHead>
                                        <TableHead className="text-center font-bold text-muted-foreground/80">Trạng thái</TableHead>
                                        <TableHead className="w-14"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedRecords.map((record, index) => (
                                        <TableRow 
                                            key={record.id} 
                                            className="hover:bg-muted/40 transition-colors border-border/30"
                                        >
                                            <TableCell className="text-center text-muted-foreground font-medium">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell className="font-bold text-primary">{record.documentCode}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                                                    {new Date(record.createdAt).toLocaleDateString('vi-VN')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                                                        <Truck className="w-3.5 h-3.5 text-primary" />
                                                    </div>
                                                    <span className="font-medium">{record.sourceWarehouseName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground italic">
                                                {record.note || 'Xuất bán hàng'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
                                                    <Package className="w-3.5 h-3.5 text-muted-foreground/70" />
                                                    <span className="font-semibold">{record.totalItems}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-foreground">
                                                {(record.totalValue || 0).toLocaleString('vi-VN')} đ
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {getStatusBadge(record.status)}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 rounded-xl">
                                                        <DropdownMenuItem onClick={() => handleViewDetail(record)} className="gap-2">
                                                            <Eye className="w-4 h-4" /> Xem chi tiết
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2">
                                                            <Edit className="w-4 h-4" /> Chỉnh sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive gap-2"
                                                            onClick={() => handleDelete(record.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" /> Xóa phiếu
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/20">
                                <div className="text-sm text-muted-foreground">
                                    Hiển thị <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredRecords.length)}</span> / <span className="font-semibold text-foreground">{filteredRecords.length}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Select
                                        value={itemsPerPage.toString()}
                                        onValueChange={(val) => {
                                            setItemsPerPage(Number(val));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="w-18 h-9 bg-background rounded-lg">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5 / trang</SelectItem>
                                            <SelectItem value="10">10 / trang</SelectItem>
                                            <SelectItem value="20">20 / trang</SelectItem>
                                            <SelectItem value="50">50 / trang</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-lg"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </Button>
                                        <div className="px-4 py-1.5 bg-primary text-white font-semibold text-sm rounded-lg min-w-[80px] text-center">
                                            {currentPage} / {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-lg"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    </>)}

                    {/* Pending Requests Tab */}
                    {activeTab === 'pending-requests' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Yêu cầu chờ duyệt</h2>
                                <span className="text-sm text-muted-foreground">
                                    {pendingRequests.length} yêu cầu
                                </span>
                            </div>

                            {requestsLoading ? (
                                <div className="flex flex-col items-center justify-center py-32">
                                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-muted-foreground font-medium">Đang tải dữ liệu...</p>
                                </div>
                            ) : pendingRequests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 bg-gradient-to-b from-muted/30 to-muted/10 rounded-3xl border-2 border-dashed border-border/60">
                                    <div className="w-28 h-28 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/5">
                                        <ClipboardList className="w-14 h-14 text-primary/30" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">
                                        Không có yêu cầu nào
                                    </h3>
                                    <p className="text-muted-foreground text-center max-w-md">
                                        Tất cả yêu cầu từ cửa hàng đã được xử lý.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-gradient-to-r from-muted/60 to-muted/40">
                                            <TableRow className="hover:bg-transparent border-border/50">
                                                <TableHead className="font-bold text-muted-foreground/80">STT</TableHead>
                                                <TableHead className="font-bold text-muted-foreground/80">Mã yêu cầu</TableHead>
                                                <TableHead className="font-bold text-muted-foreground/80">Cửa hàng</TableHead>
                                                <TableHead className="font-bold text-muted-foreground/80">Ngày gửi</TableHead>
                                                <TableHead className="font-bold text-muted-foreground/80">Sản phẩm</TableHead>
                                                <TableHead className="text-center font-bold text-muted-foreground/80">Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pendingRequests.map((request, index) => (
                                                <TableRow key={request.id} className="hover:bg-muted/40 transition-colors border-border/30">
                                                    <TableCell className="text-center text-muted-foreground font-medium">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="font-bold text-primary">{request.requestCode}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                                                                <Truck className="w-3.5 h-3.5 text-primary" />
                                                            </div>
                                                            <span className="font-medium">{request.storeName}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
                                                            <Package className="w-3.5 h-3.5 text-muted-foreground/70" />
                                                            <span className="font-semibold">{request.totalItems}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                                                                onClick={async () => {
                                                                    try {
                                                                        await stockRequestService.approveRequest(request.id);
                                                                        alert('Đã duyệt yêu cầu!');
                                                                        fetchPendingRequests();
                                                                    } catch (error) {
                                                                        alert(error.response?.data?.message || 'Lỗi khi duyệt');
                                                                    }
                                                                }}
                                                            >
                                                                <CheckCircle2 className="w-4 h-4" /> Duyệt
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                className="gap-1"
                                                                onClick={async () => {
                                                                    const reason = prompt('Nhập lý do từ chối:');
                                                                    if (reason) {
                                                                        try {
                                                                            await stockRequestService.rejectRequest(request.id, reason);
                                                                            alert('Đã từ chối yêu cầu!');
                                                                            fetchPendingRequests();
                                                                        } catch (error) {
                                                                            alert(error.response?.data?.message || 'Lỗi khi từ chối');
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                <X className="w-4 h-4" /> Từ chối
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Thông báo</h2>
                            </div>
                            <div className="flex flex-col items-center justify-center py-24 bg-gradient-to-b from-muted/30 to-muted/10 rounded-3xl border-2 border-dashed border-border/60">
                                <div className="w-28 h-28 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/5">
                                    <Bell className="w-14 h-14 text-primary/30" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                    Chưa có thông báo
                                </h3>
                                <p className="text-muted-foreground text-center max-w-md">
                                    Thông báo về các yêu cầu mới và cập nhật sẽ hiển thị tại đây.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-3xl rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-50" />
                        <div className="relative z-10">
                            <DialogTitle className="text-2xl font-bold">Chi Tiết Phiếu Xuất Kho</DialogTitle>
                            <DialogDescription className="text-primary-foreground/90 font-medium mt-1">
                                Mã phiếu: <span className="font-bold border-b-2 border-primary-foreground/30">{selectedRecord?.documentCode}</span>
                            </DialogDescription>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-20">
                            <FileText size={140} />
                        </div>
                    </DialogHeader>

                    {selectedRecord && (
                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Meta Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl border border-border/50">
                                <div className="space-y-2">
                                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Ngày tạo</p>
                                    <div className="flex items-center gap-2 text-foreground">
                                        <Calendar size={14} className="text-primary" />
                                        <p className="font-bold">{new Date(selectedRecord.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Kho xuất</p>
                                    <div className="flex items-center gap-2">
                                        <Truck size={14} className="text-primary" />
                                        <p className="font-bold text-foreground">{selectedRecord.sourceWarehouseName}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Lý do</p>
                                    <p className="font-bold text-foreground">{selectedRecord.note || 'Xuất bán hàng'}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Trạng thái</p>
                                    {selectedRecord && getStatusBadge(selectedRecord.status)}
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4" /> Danh sách mặt hàng
                                </p>
                                <div className="border-2 border-border/50 rounded-xl overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/60">
                                            <TableRow>
                                                <TableHead className="font-bold">Sản phẩm</TableHead>
                                                <TableHead className="text-right font-bold">Số lượng</TableHead>
                                                <TableHead className="text-right font-bold">Đơn giá</TableHead>
                                                <TableHead className="text-right font-bold">Thành tiền</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedRecord.items?.length > 0 ? (
                                                selectedRecord.items.map((item, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell className="font-medium">{item.productName || `Sản phẩm #${idx + 1}`}</TableCell>
                                                        <TableCell className="text-right font-bold text-primary">{item.quantity}</TableCell>
                                                        <TableCell className="text-right">{(item.unitPrice || 0).toLocaleString('vi-VN')} đ</TableCell>
                                                        <TableCell className="text-right font-bold">{(item.totalPrice || 0).toLocaleString('vi-VN')} đ</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Package className="w-8 h-8 opacity-30" />
                                                            <span>Không có dữ liệu mặt hàng</span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            <TableRow className="bg-gradient-to-r from-muted to-muted/50 font-bold border-t-2 border-border/50">
                                                <TableCell colSpan={3} className="text-right">Tổng cộng:</TableCell>
                                                <TableCell className="text-right text-primary text-lg">
                                                    {(selectedRecord.items?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0).toLocaleString('vi-VN')} đ
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="p-6 bg-muted/30 gap-3">
                        <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="rounded-xl px-6 border-border">Đóng</Button>
                        <Button className="rounded-xl px-6 shadow-lg shadow-primary/20 gap-2">
                            <Upload className="w-4 h-4" /> In phiếu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StockOutList;
