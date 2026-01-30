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
import { Upload, Plus, Eye, Edit, Trash2, MoreHorizontal, Search, FileText } from 'lucide-react';

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

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this record?')) {
            // Delete logic stub
            console.log('Delete', id);
        }
    };

    // Reset pagination
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, dateFilter]);

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-[1400px] mx-auto flex flex-col gap-6 min-h-full">

                    {/* Page Title & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Stock In Management
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">Manage incoming shipments and receipts efficiently.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2 shadow-sm">
                                <Upload className="w-4 h-4" />
                                Import Excel
                            </Button>
                            <Link to="/stock-in/create">
                                <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                    <Plus className="w-5 h-5" />
                                    <span>New Receipt</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4 relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-4 h-4" />
                            <Input
                                className="w-full pl-10 bg-white dark:bg-[#1a262a] border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20 focus-visible:border-primary"
                                placeholder="Search ID, Supplier..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full bg-white dark:bg-[#1a262a] border-slate-200 dark:border-slate-700">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Statuses</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-3">
                            <Input
                                type="date"
                                className="bg-white dark:bg-[#1a262a] border-slate-200 dark:border-slate-700"
                                value={dateFilter.start}
                                onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <Input
                                type="date"
                                className="bg-white dark:bg-[#1a262a] border-slate-200 dark:border-slate-700"
                                value={dateFilter.end}
                                onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                            />
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
                        <div className="bg-white dark:bg-[#1a262a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                    <TableRow>
                                        <TableHead className="w-[60px] text-center">#</TableHead>
                                        <TableHead>Receipt ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Destination</TableHead>
                                        <TableHead className="text-right">Items</TableHead>
                                        <TableHead className="text-right">Total Value</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
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
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleViewDetail(record)}>
                                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(record.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination Footer */}
                            <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    Showing <span className="font-semibold text-slate-900 dark:text-white">
                                        {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredRecords.length)}
                                    </span> of <span className="font-semibold text-slate-900 dark:text-white">{filteredRecords.length}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={itemsPerPage.toString()}
                                        onValueChange={(val) => {
                                            setItemsPerPage(Number(val));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="w-[70px] h-8 bg-white border-slate-200">
                                            <SelectValue placeholder="10" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            &lt;
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                        >
                                            &gt;
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
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Stock In Receipt Detail</DialogTitle>
                        <DialogDescription>
                            Receipt ID: <span className="font-bold text-primary">{selectedRecord?.documentCode}</span>
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRecord && (
                        <div className="space-y-6">
                            {/* Meta Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Date Created</p>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">{new Date(selectedRecord.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Supplier</p>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">{selectedRecord.supplier || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Destination</p>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">{selectedRecord.targetWarehouseName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                                    <Badge className="mt-1">{selectedRecord.status}</Badge>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Note</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{selectedRecord.note || 'No notes provided.'}</p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                    <span className="bg-primary w-1 h-4 rounded-full"></span>
                                    Item Details
                                </h4>
                                <div className="border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                            <TableRow>
                                                <TableHead>Product Name</TableHead>
                                                <TableHead className="text-right">Quantity</TableHead>
                                                <TableHead className="text-right">Unit Price</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedRecord.items?.length > 0 ? (
                                                selectedRecord.items.map((item, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell>{item.productName || `Product Item #${idx + 1}`}</TableCell>
                                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                                        <TableCell className="text-right">--</TableCell>
                                                        <TableCell className="text-right">--</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <>
                                                    <TableRow>
                                                        <TableCell>Premium Milk (Mock)</TableCell>
                                                        <TableCell className="text-right">50</TableCell>
                                                        <TableCell className="text-right">24,000</TableCell>
                                                        <TableCell className="text-right">1,200,000</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Chocolate Bar (Mock)</TableCell>
                                                        <TableCell className="text-right">100</TableCell>
                                                        <TableCell className="text-right">15,000</TableCell>
                                                        <TableCell className="text-right">1,500,000</TableCell>
                                                    </TableRow>
                                                </>
                                            )}
                                            <TableRow className="bg-slate-50 dark:bg-slate-800 font-bold">
                                                <TableCell colSpan={3} className="text-right">Total Value:</TableCell>
                                                <TableCell className="text-right">{(selectedRecord.totalValue || 2700000).toLocaleString()} VND</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close</Button>
                        <Button>Print Receipt</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StockInList;
