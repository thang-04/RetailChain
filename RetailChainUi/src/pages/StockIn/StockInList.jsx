import { useState, useEffect, useMemo } from 'react';
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
import { Link } from 'react-router-dom';
import inventoryService from '@/services/inventory.service';
import {
    Upload, Plus, Eye, Edit, Trash2, MoreHorizontal,
    Search, FileText, Filter, RotateCcw, Calendar,
    CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

const StockInList = () => {
    const [originalRecords, setOriginalRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtering State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Modal State
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

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

            const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;

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

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa phiếu nhập kho này?')) {
            try {
                await inventoryService.deleteDocument(id);
                setOriginalRecords(prevRecords => prevRecords.filter(record => record.id !== id));
            } catch (error) {
                console.error("Failed to delete stock in record:", error);
            }
        }
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('ALL');
        setDateFilter({ start: '', end: '' });
    };

    // Reset pagination
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, dateFilter]);

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-[1400px] mx-auto flex flex-col gap-6 min-h-full">

                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                                <FileText className="w-7 h-7 text-primary" />
                            </div>
                            <div className="space-y-0.5">
                                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    Quản Lý Nhập Kho
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Theo dõi và quản lý các phiếu nhập hàng vào hệ thống.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="gap-2 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                <Upload className="w-4 h-4" />
                                <span>Nhập Excel</span>
                            </Button>
                            <Link to="/stock-in/create">
                                <Button className="gap-2 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 px-6">
                                    <Plus className="w-5 h-5" />
                                    <span className="font-semibold">Tạo Phiếu Mới</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Filter Bar - Modern Style */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Filter className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Bộ lọc thông minh</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
                            {/* Search Input */}
                            <div className="lg:col-span-4 relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all duration-300 w-4 h-4" />
                                <Input
                                    className="w-full h-12 pl-11 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20 focus-visible:border-primary rounded-2xl transition-all duration-300"
                                    placeholder="Tìm theo mã phiếu, nhà cung cấp, kho..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="lg:col-span-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full h-12 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-primary/20">
                                        <SelectValue placeholder="Trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800">
                                        <SelectItem value="ALL" className="rounded-xl">Tất cả trạng thái</SelectItem>
                                        <SelectItem value="Pending" className="rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-amber-500" />
                                                <span>Chờ duyệt</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Completed" className="rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                <span>Hoàn thành</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Cancelled" className="rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="w-4 h-4 text-rose-500" />
                                                <span>Đã hủy</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date Range Filters */}
                            <div className="lg:col-span-2 relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="date"
                                    className="w-full h-12 pl-11 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-2xl focus-visible:ring-primary/20 transition-all font-medium"
                                    value={dateFilter.start}
                                    onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                                />
                            </div>

                            <div className="lg:col-span-2 relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="date"
                                    className="w-full h-12 pl-11 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-2xl focus-visible:ring-primary/20 transition-all font-medium"
                                    value={dateFilter.end}
                                    onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                                />
                            </div>

                            {/* Reset Button */}
                            <div className="lg:col-span-2">
                                <Button
                                    variant="outline"
                                    onClick={handleResetFilters}
                                    className="w-full h-12 gap-2 rounded-2xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all active:scale-[0.98] group"
                                >
                                    <RotateCcw className="w-4 h-4 transition-transform group-hover:rotate-[-45deg]" />
                                    <span className="font-medium">Làm mới</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Data List / Table */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="text-lg font-medium text-slate-500 dark:text-slate-400">Loading records...</div>
                        </div>
                    ) : filteredRecords.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1a262a] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 group hover:border-primary/50 transition-all duration-300">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                                <FileText className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Records Found</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm px-4">
                                There are no stock in receipts matching your criteria.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#1a262a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden transition-all duration-300">
                            <Table>
                                <TableHeader className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                    <TableRow>
                                        <TableHead className="w-[70px] text-center font-bold text-slate-700 dark:text-slate-300">STT</TableHead>
                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">Mã Phiếu</TableHead>
                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">Ngày Nhập</TableHead>
                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">Nhà Cung Cấp</TableHead>
                                        <TableHead className="font-bold text-slate-700 dark:text-slate-300">Kho Đích</TableHead>
                                        <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300">Sản Phẩm</TableHead>
                                        <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300">Giá Trị</TableHead>
                                        <TableHead className="text-center font-bold text-slate-700 dark:text-slate-300">Trạng Thái</TableHead>
                                        <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300">Thao Tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedRecords.map((record, index) => (
                                        <TableRow key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <TableCell className="text-center font-medium text-slate-500">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell className="font-semibold text-primary">{record.documentCode}</TableCell>
                                            <TableCell>{new Date(record.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                            <TableCell className="font-medium text-slate-700 dark:text-slate-300">{record.supplier || 'N/A'}</TableCell>
                                            <TableCell>{record.targetWarehouseName}</TableCell>
                                            <TableCell className="text-right font-medium">{record.totalItems}</TableCell>
                                            <TableCell className="text-right font-bold text-slate-700 dark:text-slate-200">
                                                {(record.totalValue || 0).toLocaleString()} VND
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={
                                                    record.status === 'Completed' ? 'default' :
                                                        record.status === 'Pending' ? 'secondary' : 'outline'
                                                } className="capitalize shadow-sm">
                                                    {record.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl">
                                                        <DropdownMenuLabel className="text-xs uppercase tracking-widest text-slate-500">Thao Tác</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleViewDetail(record)} className="rounded-xl cursor-pointer">
                                                            <Eye className="mr-2 h-4 w-4" /> Xem Chi Tiết
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4" /> Chỉnh Sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                                                        <DropdownMenuItem
                                                            className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-900/20 rounded-xl cursor-pointer"
                                                            onClick={() => handleDelete(record.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Xóa Phiếu
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination Footer */}
                            <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    Hiển thị <span className="text-slate-900 dark:text-white font-bold">
                                        {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredRecords.length)}
                                    </span> trong <span className="text-slate-900 dark:text-white font-bold">{filteredRecords.length}</span> phiếu nhập
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400 font-semibold uppercase">Hiển thị:</span>
                                        <Select
                                            value={itemsPerPage.toString()}
                                            onValueChange={(val) => {
                                                setItemsPerPage(Number(val));
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <SelectTrigger className="w-[70px] h-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl">
                                                <SelectValue placeholder="10" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-200">
                                                <SelectItem value="5">5</SelectItem>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="20">20</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-700 hover:text-primary transition-all active:scale-95"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-sm font-bold min-w-[80px] text-center">
                                            {currentPage} / {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-700 hover:text-primary transition-all active:scale-95"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                        >
                                            <ChevronRight className="h-4 w-4" />
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
        </div>
    );
};

export default StockInList;
