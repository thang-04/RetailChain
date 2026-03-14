import { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import inventoryService from '@/services/inventory.service';
import { ExcelPreviewModal } from '@/components/common/ExcelPreviewModal';
import { Upload, Plus, Eye, Edit, Trash2, MoreHorizontal,
    Search, FileText, Filter, RotateCcw, Calendar,
    CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight,
    ClipboardList, DollarSign, AlertCircle, Download, Package, Building2
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
        <div className={`relative overflow-hidden border rounded-xl ${style.border} ${style.bg} hover:shadow-lg transition-all duration-300 group`}>
            <div className="p-5 relative z-10">
                <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">{title}</p>
                        <p className={`text-3xl font-extrabold tracking-tight ${style.valueColor}`}>
                            {value}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                {trend !== null && trend !== undefined && (
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
            </div>
        </div>
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
                <XCircle className="w-3 h-3" />
            </button>
        )}
    </div>
);

const StockInList = () => {
    const [originalRecords, setOriginalRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtering State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Modal State
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Delete Dialog State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Excel Import State
    const [isImporting, setIsImporting] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await inventoryService.getStockInRecords();
                setOriginalRecords(data || []);
            } catch (error) {
                console.error("Failed to fetch stock in records:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter Logic
    const filteredRecords = useMemo(() => {
        return originalRecords.filter(record => {
            const matchesSearch =
                (record.documentCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (record.supplier?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (record.targetWarehouseName?.toLowerCase() || '').includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

            let matchesDate = true;
            if (dateFilter.start) {
                matchesDate = matchesDate && new Date(record.createdAt) >= new Date(dateFilter.start);
            }
            if (dateFilter.end) {
                matchesDate = matchesDate && new Date(record.createdAt) <= new Date(dateFilter.end + 'T23:59:59');
            }

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [originalRecords, searchTerm, statusFilter, dateFilter]);

    // Stats Calculation
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
        
        const currentRecords = originalRecords.filter(r => {
            if (!r.createdAt) return false;
            const d = new Date(r.createdAt);
            return d >= currentStart && d <= currentEnd;
        });
        
        let previousRecords = [];
        if (baselineRange && timeframe !== 'custom') {
            previousRecords = originalRecords.filter(r => {
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
        
        const uniqueSuppliers = new Set(currentRecords.map(r => r.supplier).filter(Boolean)).size;
        
        const prevTotal = previousRecords.length;
        const prevValue = previousRecords.reduce((sum, r) => sum + (r.totalValue || 0), 0);
        
        const showTrend = baselineRange !== null && (prevTotal > 0 || prevValue > 0);
        const totalTrend = showTrend && prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : null;
        const valueTrend = showTrend && prevValue > 0 ? Math.round(((totalValue - prevValue) / prevValue) * 100) : null;
        
        const displayValue = totalValue >= 1e9 || totalValue >= 1e6 
            ? formatCompactCurrency(totalValue) 
            : totalValue.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + 'đ';
        
        return { 
            total, completed, 
            totalProducts: totalItems.toLocaleString('vi-VN'),
            totalSuppliers: uniqueSuppliers,
            totalValue: displayValue, 
            totalTrend, valueTrend, 
            hasPreviousData: showTrend
        };
    }, [originalRecords, dateFilter]);

    // Has Active Filters
    const hasActiveFilters = searchTerm || dateFilter.start || dateFilter.end || (statusFilter && statusFilter !== 'all');

    // Pagination Logic
    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
    const paginatedRecords = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRecords.slice(start, start + itemsPerPage);
    }, [filteredRecords, currentPage, itemsPerPage]);

    // Handlers
    const handleViewDetail = (record) => {
        setSelectedRecord(record);
        setIsDetailOpen(true);
    };

    const handleDeleteClick = (id) => {
        setDeletingId(id);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingId) return;
        setIsDeleting(true);
        try {
            await inventoryService.deleteDocument(deletingId);
            setOriginalRecords(prevRecords => prevRecords.filter(record => record.id !== deletingId));
            toast.success("Xóa thành công", {
                description: "Phiếu nhập kho đã được xóa.",
            });
        } catch (error) {
            console.error("Failed to delete stock in record:", error);
            toast.error("Xóa thất bại", {
                description: error.response?.data?.message || "Đã xảy ra lỗi khi xóa phiếu.",
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteOpen(false);
            setDeletingId(null);
        }
    };

    // Excel Import Handlers
    const handleImportExcel = () => {
        setShowPreviewModal(true);
    };

    const handleExcelImport = async (data) => {
        setIsImporting(true);
        try {
            // Send JSON directly to backend
            await inventoryService.importStockFromExcel(data);

            toast.success("Nhập thành công", {
                description: `Đã nhập ${data.length} sản phẩm từ Excel.`,
            });

            const records = await inventoryService.getStockInRecords();
            setOriginalRecords(records || []);
        } catch (error) {
            console.error("Import Excel error:", error);
            toast.error("Nhập thất bại", {
                description: error.response?.data?.message || "Đã xảy ra lỗi khi nhập file Excel.",
            });
        } finally {
            setIsImporting(false);
        }
    };

    const handleFileChange = async (e) => {
        // Legacy handler - now handled by ExcelPreviewModal
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setDateFilter({ start: '', end: '' });
    };

    // Reset pagination
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, dateFilter]);

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

                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                                <Download className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                                    Nhập Kho
                                </h1>
                                <p className="text-muted-foreground text-base font-medium">Quản lý và theo dõi các phiếu nhập hàng</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="gap-2 rounded-xl border-dashed hover:border-primary hover:bg-primary/5"
                                onClick={handleImportExcel}
                                disabled={isImporting}
                            >
                                <Upload className="w-4 h-4" />
                                <span className="hidden sm:inline">{isImporting ? "Đang nhập..." : "Nhập Excel"}</span>
                            </Button>
                            <Link to="/stock-in/create">
                                <Button className="gap-2 px-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 font-semibold">
                                    <Plus className="w-5 h-5" />
                                    <span>Tạo phiếu mới</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {!loading && originalRecords.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <StatCard
                                title="Tổng phiếu"
                                value={stats.total}
                                subtitle="Phiếu nhập kho"
                                icon={ClipboardList}
                                variant="default"
                                trend={stats.hasPreviousData ? stats.totalTrend : undefined}
                            />
                            <StatCard
                                title="Tổng sản phẩm"
                                value={stats.totalProducts}
                                subtitle="sản phẩm đã nhập"
                                icon={Package}
                                variant="info"
                            />
                            <StatCard
                                title="Hoàn thành"
                                value={stats.completed}
                                subtitle="Đã nhập kho"
                                icon={CheckCircle2}
                                variant="success"
                            />
                            <StatCard
                                title="Nhà cung cấp"
                                value={stats.totalSuppliers}
                                subtitle="nhà cung cấp"
                                icon={Building2}
                                variant="info"
                            />
                            <StatCard
                                title="Giá trị"
                                value={stats.totalValue}
                                subtitle="Tổng giá trị nhập"
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
                                        placeholder="Mã phiếu, NCC, kho đích..."
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
                                        <SelectItem value="Completed">Hoàn thành</SelectItem>
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
                                    value={statusFilter === 'Completed' ? 'Hoàn thành' : statusFilter} 
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
                                Tìm thấy <span className="font-bold text-foreground">{filteredRecords.length}</span> phiếu nhập kho
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
                                <Download className="w-14 h-14 text-primary/30" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                {hasActiveFilters ? 'Không tìm thấy kết quả' : 'Chưa có phiếu nhập kho'}
                            </h3>
                            <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
                                {hasActiveFilters 
                                    ? 'Thử điều chỉnh bộ lọc để tìm kiếm kết quả khác.'
                                    : 'Tạo phiếu nhập kho đầu tiên để bắt đầu quản lý nhập hàng vào kho.'
                                }
                            </p>
                            {hasActiveFilters ? (
                                <Button variant="outline" onClick={handleResetFilters} className="gap-2 rounded-xl px-6">
                                    <RotateCcw className="w-4 h-4" /> Xóa bộ lọc
                                </Button>
                            ) : (
                                <Link to="/stock-in/create">
                                    <Button className="gap-2 rounded-xl px-6 shadow-lg shadow-primary/20">
                                        <Plus className="w-5 h-5" /> Tạo phiếu nhập
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
                                        <TableHead className="font-bold text-muted-foreground/80">Ngày nhập</TableHead>
                                        <TableHead className="font-bold text-muted-foreground/80">Nhà cung cấp</TableHead>
                                        <TableHead className="font-bold text-muted-foreground/80">Kho đích</TableHead>
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
                                                        <Download className="w-3.5 h-3.5 text-primary" />
                                                    </div>
                                                    <span className="font-medium">{record.supplier || 'N/A'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{record.targetWarehouseName}</TableCell>
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
                                                            onClick={() => handleDeleteClick(record.id)}
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

                            {/* Pagination Footer */}
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
                </div>
            </div>

            {/* Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-3xl rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="bg-primary p-8 text-primary-foreground relative">
                        <DialogTitle className="text-2xl font-bold">Chi Tiết Phiếu Nhập Kho</DialogTitle>
                        <DialogDescription className="text-primary-foreground/80 font-medium">
                            Mã phiếu: <span className="font-bold border-b border-primary-foreground/40">{selectedRecord?.documentCode}</span>
                        </DialogDescription>
                        <div className="absolute right-0 bottom-0 opacity-10">
                            <FileText size={120} />
                        </div>
                    </DialogHeader>

                    {selectedRecord && (
                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                            {/* Meta Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-muted rounded-3xl border border-border">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Ngày tạo</p>
                                    <div className="flex items-center gap-2 text-foreground">
                                        <Calendar size={14} className="text-primary" />
                                        <p className="font-bold">{new Date(selectedRecord.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Nhà cung cấp</p>
                                    <p className="font-bold text-foreground">{selectedRecord.supplier || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Kho đích</p>
                                    <p className="font-bold text-foreground">{selectedRecord.targetWarehouseName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Trạng thái</p>
                                    <Badge variant={
                                        selectedRecord.status === 'Completed' ? 'default' :
                                            selectedRecord.status === 'Pending' ? 'secondary' : 'outline'
                                    } className="rounded-lg px-3 shadow-sm">
                                        {selectedRecord.status === 'Completed' ? 'Hoàn thành' :
                                            selectedRecord.status === 'Pending' ? 'Chờ duyệt' : 'Đã hủy'}
                                    </Badge>
                                </div>
<div className="col-span-4 pt-4 border-t border-border mt-2">
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Ghi chú</p>
                                    <p className="text-sm text-muted-foreground font-medium italic">
                                        "{selectedRecord.note || 'Không có ghi chú.'}"
                                    </p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-lg flex items-center gap-2 text-foreground">
                                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                    Danh sách mặt hàng
                                </h4>
                                <div className="border border-border rounded-3xl overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-muted">
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
                                                    <TableRow key={idx} className="hover:bg-primary/5 transition-colors">
                                                        <TableCell className="font-medium">{item.productName || `Sản phẩm #${idx + 1}`}</TableCell>
                                                        <TableCell className="text-right font-bold text-primary">{item.quantity}</TableCell>
                                                        <TableCell className="text-right text-foreground">{(item.unitPrice || 0).toLocaleString('vi-VN')} đ</TableCell>
                                                        <TableCell className="text-right font-bold text-foreground">{(item.totalPrice || 0).toLocaleString('vi-VN')} đ</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic">
                                                        Không có dữ liệu mặt hàng
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            <TableRow className="bg-muted font-extrabold text-lg">
                                                <TableCell colSpan={3} className="text-right text-foreground">Tổng cộng:</TableCell>
                                                <TableCell className="text-right text-primary">
                                                    {(selectedRecord.totalValue || 0).toLocaleString('vi-VN')} đ
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="p-8 bg-muted gap-4">
                        <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="rounded-xl px-8 border-border">Đóng</Button>
                        <Button className="rounded-xl px-8 shadow-lg shadow-primary/20">
                            <Upload className="w-4 h-4 mr-2 rotate-180" /> In Phiếu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-md rounded-3xl border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-rose-600" />
                            </div>
                            Xác nhận xóa
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            Bạn có chắc chắn muốn xóa phiếu nhập kho này? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                            className="rounded-xl flex-1"
                            disabled={isDeleting}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            className="rounded-xl flex-1 bg-rose-600 hover:bg-rose-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Đang xóa..." : "Xóa"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Excel Preview Modal */}
            <ExcelPreviewModal
                open={showPreviewModal}
                onOpenChange={setShowPreviewModal}
                onImport={handleExcelImport}
            />
        </div>
    );
};

export default StockInList;
