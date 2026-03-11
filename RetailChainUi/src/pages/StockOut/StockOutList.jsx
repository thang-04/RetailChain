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
    Search, FileText, RotateCcw, Calendar,
    Truck
} from 'lucide-react';

const StockOutList = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

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

    useEffect(() => {
        fetchData();
    }, []);

    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            const matchesSearch =
                (record.documentCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (record.targetWarehouseName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (record.note?.toLowerCase() || '').includes(searchTerm.toLowerCase());

            let matchesDate = true;
            if (dateFilter.start) {
                matchesDate = matchesDate && new Date(record.createdAt) >= new Date(dateFilter.start);
            }
            if (dateFilter.end) {
                matchesDate = matchesDate && new Date(record.createdAt) <= new Date(dateFilter.end + 'T23:59:59');
            }

            return matchesSearch && matchesDate;
        });
    }, [records, searchTerm, dateFilter]);

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
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, dateFilter]);

    const hasActiveFilters = searchTerm || dateFilter.start || dateFilter.end;

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto px-6 pt-8 pb-12">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="sr-only">Quản Lý Xuất Kho</h1>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-primary" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-foreground tracking-tight">
                                        Xuất Kho
                                    </h2>
                                </div>
                                <p className="text-muted-foreground">
                                    Theo dõi và quản lý các phiếu xuất kho, lịch sử xuất hàng đến cửa hàng.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                                    <Upload className="w-4 h-4" />
                                    <span>Nhập Excel</span>
                                </Button>
                                <Link to="/stock-out/create">
                                    <Button className="gap-2 px-5">
                                        <Plus className="w-4 h-4" />
                                        <span>Tạo phiếu mới</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                            {/* Search */}
                            <div className="flex-1 max-w-xs">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                    Tìm kiếm
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        className="pl-10 bg-background border-border h-12"
                                        placeholder="Mã phiếu, kho xuất, ghi chú..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Date From */}
                            <div className="w-40">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                    Từ ngày
                                </label>
                                <Input
                                    type="date"
                                    className="bg-background border-border h-12"
                                    value={dateFilter.start}
                                    onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                                />
                            </div>

                            {/* Date To */}
                            <div className="w-40">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                    Đến ngày
                                </label>
                                <Input
                                    type="date"
                                    className="bg-background border-border h-12"
                                    value={dateFilter.end}
                                    onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                                />
                            </div>

                            {/* Clear filters */}
                            {hasActiveFilters && (
                                <Button 
                                    variant="ghost" 
                                    onClick={handleResetFilters}
                                    className="text-muted-foreground hover:text-foreground gap-2 h-12"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Xóa lọc</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Stats Summary */}
                    {filteredRecords.length > 0 && (
                        <div className="mb-6">
                            <span className="text-sm text-muted-foreground">
                                Tìm thấy <span className="font-semibold text-foreground">{filteredRecords.length}</span> phiếu xuất kho
                            </span>
                        </div>
                    )}

                    {/* Data Table */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                        </div>
                    ) : filteredRecords.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                                <Package className="w-10 h-10 text-muted-foreground/60" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                {hasActiveFilters ? 'Không tìm thấy kết quả' : 'Chưa có phiếu xuất kho nào'}
                            </h3>
                            <p className="text-muted-foreground text-center max-w-sm mb-6">
                                {hasActiveFilters 
                                    ? 'Thử điều chỉnh bộ lọc để tìm kiếm kết quả khác.'
                                    : 'Tạo phiếu xuất kho đầu tiên để bắt đầu quản lý.'
                                }
                            </p>
                            {hasActiveFilters ? (
                                <Button variant="outline" onClick={handleResetFilters} className="gap-2">
                                    <RotateCcw className="w-4 h-4" /> Xóa bộ lọc
                                </Button>
                            ) : (
                                <Link to="/stock-out/create">
                                    <Button className="gap-2">
                                        <Plus className="w-4 h-4" /> Tạo phiếu xuất
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="border border-border rounded-2xl overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-16 text-center font-semibold text-muted-foreground">STT</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground">Mã phiếu</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground">Ngày xuất</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground">Kho xuất</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground">Lý do</TableHead>
                                        <TableHead className="text-right font-semibold text-muted-foreground">Sản phẩm</TableHead>
                                        <TableHead className="text-right font-semibold text-muted-foreground">Giá trị</TableHead>
                                        <TableHead className="text-center font-semibold text-muted-foreground">Trạng thái</TableHead>
                                        <TableHead className="w-16"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedRecords.map((record, index) => (
                                        <TableRow key={record.id} className="hover:bg-muted/30">
                                            <TableCell className="text-center text-muted-foreground text-sm">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell className="font-medium text-primary">{record.documentCode}</TableCell>
                                            <TableCell>{new Date(record.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                            <TableCell>{record.sourceWarehouseName}</TableCell>
                                            <TableCell className="text-muted-foreground italic">{record.note || 'Xuất bán hàng'}</TableCell>
                                            <TableCell className="text-right font-medium">{record.totalItems}</TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {(record.totalValue || 0).toLocaleString('vi-VN')} đ
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={
                                                    record.status === 'Completed' ? 'default' :
                                                        record.status === 'Pending' ? 'secondary' : 'outline'
                                                } className="text-xs">
                                                    {record.status === 'Completed' ? 'Hoàn thành' :
                                                        record.status === 'Pending' ? 'Chờ duyệt' : 'Đã hủy'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <DropdownMenuItem onClick={() => handleViewDetail(record)}>
                                                            <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => handleDelete(record.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Xóa phiếu
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
                                <div className="text-sm text-muted-foreground">
                                    Hiển thị <span className="font-medium text-foreground">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredRecords.length)}</span> / <span className="font-medium text-foreground">{filteredRecords.length}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Select
                                        value={itemsPerPage.toString()}
                                        onValueChange={(val) => {
                                            setItemsPerPage(Number(val));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="w-16 h-9 bg-background">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            ←
                                        </Button>
                                        <span className="px-3 py-1.5 bg-primary text-white font-medium text-sm rounded-lg min-w-[60px] text-center">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                        >
                                            →
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
                        <DialogTitle className="text-2xl font-bold">Chi Tiết Phiếu Xuất Kho</DialogTitle>
                        <DialogDescription className="text-primary-foreground/80 font-medium">
                            Mã phiếu: <span className="font-bold border-b border-primary-foreground/40">{selectedRecord?.documentCode}</span>
                        </DialogDescription>
                        <div className="absolute right-0 bottom-0 opacity-10">
                            <FileText size={120} />
                        </div>
                    </DialogHeader>

                    {selectedRecord && (
                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                            {/* Meta Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-muted rounded-3xl border border-border">
                                <div className="space-y-1">
                                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Ngày tạo</p>
                                    <div className="flex items-center gap-2 text-foreground">
                                        <Calendar size={14} className="text-primary" />
                                        <p className="font-bold">{new Date(selectedRecord.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Kho xuất</p>
                                    <p className="font-bold text-foreground">{selectedRecord.sourceWarehouseName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Lý do</p>
                                    <p className="font-bold text-foreground">{selectedRecord.note || 'Xuất bán hàng'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Trạng thái</p>
                                    <Badge variant={
                                        selectedRecord.status === 'Completed' ? 'default' :
                                            selectedRecord.status === 'Pending' ? 'secondary' : 'outline'
                                    } className="rounded-lg px-3 shadow-sm">
                                        {selectedRecord.status === 'Completed' ? 'Hoàn thành' :
                                            selectedRecord.status === 'Pending' ? 'Chờ duyệt' : 'Đã hủy'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-3">Danh sách mặt hàng</p>
                                <div className="border-2 border-border rounded-xl overflow-hidden">
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
                                                    <TableRow key={idx}>
                                                        <TableCell className="font-medium">{item.productName || `Sản phẩm #${idx + 1}`}</TableCell>
                                                        <TableCell className="text-right font-bold text-primary">{item.quantity}</TableCell>
                                                        <TableCell className="text-right">{(item.unitPrice || 0).toLocaleString('vi-VN')} đ</TableCell>
                                                        <TableCell className="text-right font-bold">{(item.totalPrice || 0).toLocaleString('vi-VN')} đ</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                                        Không có dữ liệu mặt hàng
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            <TableRow className="bg-muted font-bold">
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

                    <DialogFooter className="p-8 bg-muted gap-4">
                        <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="rounded-xl px-8 border-border">Đóng</Button>
                        <Button className="rounded-xl px-8 shadow-lg shadow-primary/20">
                            <Upload className="w-4 h-4 mr-2" /> In phiếu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StockOutList;
