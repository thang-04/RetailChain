import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, CheckCircle2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import storeService from '@/services/store.service';
import InventoryItemModal from './components/InventoryItemModal';

const ITEMS_PER_PAGE = 10;

const StoreInventoryDetail = () => {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const data = await storeService.getStoreById(id);
                setStore(data);
            } catch (error) {
                console.error("Fetch store error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, [id]);

    // Reset về trang 1 khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    if (loading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
    if (!store) return <div className="p-10 text-center">Không tìm thấy cửa hàng</div>;

    const inventory = store.inventory || [];

    // KPI stats
    const totalStock = inventory.reduce((sum, item) => sum + (item.stock || 0), 0);
    const inStockCount = inventory.filter(item => item.status === 'In Stock' && item.stock > 0).length;
    const lowStockAlerts = inventory.filter(item => item.status === 'Low Stock' || (item.stock > 0 && item.stock < 10)).length;
    const outOfStock = inventory.filter(item => item.stock === 0).length;

    // Filter logic - search theo name, sku, category
    const filtered = inventory.filter(item => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = q === "" || [item.name, item.sku, item.category]
            .some(val => val != null && String(val).toLowerCase().includes(q));
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "in_stock" && item.status === "In Stock") ||
            (statusFilter === "low_stock" && item.status === "Low Stock") ||
            (statusFilter === "out_of_stock" && (item.stock === 0 || item.status === "Out of Stock"));
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const getStatusBadge = (status) => {
        switch (status) {
            case "In Stock":
                return <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-none flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" />Còn hàng</Badge>;
            case "Low Stock":
                return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-none flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" />Sắp hết</Badge>;
            case "Out of Stock":
                return <Badge variant="secondary" className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-none flex items-center gap-1 w-fit"><Package className="w-3 h-3" />Hết hàng</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const STATUS_FILTERS = [
        { key: "all", label: "Tất cả" },
        { key: "in_stock", label: "Còn hàng" },
        { key: "low_stock", label: "Sắp hết" },
        { key: "out_of_stock", label: "Hết hàng" },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tồn kho cửa hàng: {store.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{store.address}</p>
            </div>

            {/* KPI Cards - 4 thẻ */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground font-medium">Tổng tồn kho</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{totalStock.toLocaleString()}</div><p className="text-xs text-slate-400 mt-1">{inventory.length} mặt hàng</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground font-medium">Số lượng còn hàng</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-emerald-500">{inStockCount}</div><p className="text-xs text-slate-400 mt-1">mặt hàng đang có</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground font-medium">Cảnh báo sắp hết</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-amber-500">{lowStockAlerts}</div><p className="text-xs text-slate-400 mt-1">cần nhập thêm</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground font-medium">Đã hết hàng</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-rose-500">{outOfStock}</div><p className="text-xs text-slate-400 mt-1">cần bổ sung gấp</p></CardContent>
                </Card>
            </div>

            {/* Table Card */}
            <Card>
                <CardHeader className="pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-bold">Danh sách tồn kho ({filtered.length})</CardTitle>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                className="pl-9 h-9"
                                placeholder="Tìm theo tên, SKU, danh mục..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Status Filter Chips */}
                    <div className="flex items-center gap-2 pt-3 pb-1 flex-wrap">
                        {STATUS_FILTERS.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setStatusFilter(f.key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                                    statusFilter === f.key
                                        ? 'bg-primary text-white shadow-sm shadow-primary/30'
                                        : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50 hover:text-primary'
                                }`}
                            >
                                {statusFilter === f.key && <CheckCircle2 className="w-3 h-3" />}
                                {f.label}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="px-4 py-3 w-12 text-xs uppercase text-slate-500 font-semibold">#</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-slate-500 font-semibold">SKU</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-slate-500 font-semibold">Tên sản phẩm</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-slate-500 font-semibold">Danh mục</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-slate-500 font-semibold text-right">Tồn kho</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-slate-500 font-semibold text-right">Giá</TableHead>
                                <TableHead className="px-4 py-3 text-xs uppercase text-slate-500 font-semibold">Trạng thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedItems.length > 0 ? paginatedItems.map((item, index) => (
                                <TableRow key={item.id} onClick={() => setSelectedItem(item)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 cursor-pointer">
                                    <TableCell className="px-4 py-3 text-sm text-slate-400">{startIndex + index + 1}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm font-mono text-slate-500 dark:text-slate-400">{item.sku}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">{item.name}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.category}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-white text-right">{item.stock}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-right">{item.price}</TableCell>
                                    <TableCell className="px-4 py-3">{getStatusBadge(item.status)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">Không tìm thấy sản phẩm nào.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {filtered.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Hiển thị <span className="font-semibold text-slate-900 dark:text-white">{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}</span> trên <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span> sản phẩm
                            </p>
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .reduce((acc, p, idx, arr) => {
                                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, i) =>
                                        p === '...' ? (
                                            <span key={`ellipsis-${i}`} className="px-1 text-slate-400 text-sm">...</span>
                                        ) : (
                                            <Button
                                                key={p}
                                                variant={currentPage === p ? "default" : "ghost"}
                                                size="sm"
                                                className={`h-8 w-8 p-0 rounded-lg font-semibold ${currentPage === p ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'text-slate-600 dark:text-slate-400'}`}
                                                onClick={() => setCurrentPage(p)}
                                            >
                                                {p}
                                            </Button>
                                        )
                                    )
                                }
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal chi tiết sản phẩm */}
            <InventoryItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
    );
};

export default StoreInventoryDetail;
