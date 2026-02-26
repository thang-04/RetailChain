import React, { useState, useEffect } from 'react';
import inventoryService from '../../services/inventory.service';
import storeService from '../../services/store.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CreateWarehouseModal from './CreateWarehouseModal';
import StockViewModal from './StockViewModal';
import { Plus, Search, Edit, Trash2, Box, Grid3X3, List, MapPin, Phone, User, Calendar, Building2, Warehouse } from 'lucide-react';

const WarehouseListPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [viewStockId, setViewStockId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  // View mode: 'table' or 'grid'
  const [viewMode, setViewMode] = useState('table');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterStore, setFilterStore] = useState('ALL');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'grid' ? 12 : 10;

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getAllWarehouses();
      if (response && response.data) {
        setWarehouses(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch warehouses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
    const fetchStores = async () => {
      try {
        const data = await storeService.getAllStores();
        setStores(data);
      } catch (err) {
        console.error("Failed to load stores", err);
      }
    };
    fetchStores();
  }, []);

  // Calculate statistics
  const stats = {
    total: warehouses.length,
    central: warehouses.filter(w => w.warehouseType === 1).length,
    store: warehouses.filter(w => w.warehouseType === 2).length,
    active: warehouses.filter(w => w.status === 1).length,
  };

  const handleCreate = () => {
    setEditingWarehouse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (wh) => {
    setEditingWarehouse(wh);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        await inventoryService.deleteWarehouse(deleteConfirmId);
        fetchWarehouses();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Xóa thất bại: " + (error.response?.data?.desc || error.message));
      } finally {
        setDeleteConfirmId(null);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingWarehouse(null);
  };

  const handleModalSuccess = () => {
    fetchWarehouses();
    handleModalClose();
  };

  // Filter Logic
  const filteredWarehouses = warehouses.filter(wh => {
    const matchesSearch = wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wh.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' ? true : String(wh.warehouseType) === filterType;
    const matchesStatus = filterStatus === 'ALL' ? true : String(wh.status) === filterStatus;
    const matchesStore = filterStore === 'ALL' ? true : String(wh.storeId) === filterStore;

    return matchesSearch && matchesType && matchesStatus && matchesStore;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredWarehouses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWarehouses = filteredWarehouses.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterStatus, filterStore, viewMode]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Get store name by ID
  const getStoreName = (storeId) => {
    if (!storeId) return '-';
    const store = stores.find(s => s.dbId === storeId);
    return store ? store.name : `Store #${storeId}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản Lý Kho</h1>
          <p className="text-muted-foreground">Quản lý danh sách kho tổng và kho con (cửa hàng).</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Tạo Kho Mới
        </Button>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex">
              <div items-center justify-between>
                <p className="text-sm text-blue-600 font-medium">Tổng Số Kho</p>
                <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <Warehouse className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Kho Tổng</p>
                <p className="text-3xl font-bold text-purple-700">{stats.central}</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Kho Cửa Hàng</p>
                <p className="text-3xl font-bold text-green-700">{stats.store}</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <Box className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Đang Hoạt Động</p>
                <p className="text-3xl font-bold text-emerald-700">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                <List className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & View Toggle */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search */}
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, mã kho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Status Filter */}
              <div className="w-[180px]">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả Trạng thái</SelectItem>
                    <SelectItem value="1">Đang hoạt động</SelectItem>
                    <SelectItem value="0">Đã khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="w-[160px]">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Loại kho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả Loại</SelectItem>
                    <SelectItem value="1">Kho Tổng</SelectItem>
                    <SelectItem value="2">Kho Cửa Hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Store Filter */}
              <div className="w-[220px]">
                <Select value={filterStore} onValueChange={setFilterStore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cửa hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả Cửa hàng</SelectItem>
                    {stores.map(store => (
                      <SelectItem key={store.dbId} value={String(store.dbId)}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('table')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Đang tải dữ liệu...</div>
          ) : filteredWarehouses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Không tìm thấy kho nào phù hợp.</div>
          ) : viewMode === 'table' ? (
            // Table View
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">STT</TableHead>
                    <TableHead>Mã Kho</TableHead>
                    <TableHead>Tên Kho</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Cửa Hàng</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>Ngày Tạo</TableHead>
                    <TableHead className="text-right">Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentWarehouses.map((wh, index) => (
                    <TableRow key={wh.id}>
                      <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                      <TableCell className="font-medium">{wh.code}</TableCell>
                      <TableCell>{wh.name}</TableCell>
                      <TableCell>
                        <Badge variant={wh.warehouseType === 1 ? "default" : "secondary"}>
                          {wh.warehouseType === 1 ? 'Kho Tổng' : 'Kho Cửa Hàng'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {wh.storeId ? getStoreName(wh.storeId) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={wh.status === 1 ? "outline" : "destructive"}>
                          {wh.status === 1 ? 'Hoạt động' : 'Đã khóa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(wh.createdAt)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Xem Tồn Kho"
                          onClick={() => setViewStockId(wh.id)}
                        >
                          <Box className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Chỉnh sửa"
                          onClick={() => handleEdit(wh)}
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Xóa"
                          onClick={() => handleDeleteClick(wh.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentWarehouses.map((wh) => (
                <Card key={wh.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground font-mono">{wh.code}</p>
                        <CardTitle className="text-lg truncate">{wh.name}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Badge variant={wh.warehouseType === 1 ? "default" : "secondary"} className="text-xs">
                          {wh.warehouseType === 1 ? 'Kho Tổng' : 'Kho Cửa Hàng'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Store */}
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">
                        {wh.storeId ? getStoreName(wh.storeId) : 'Không có cửa hàng'}
                      </span>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <Badge variant={wh.status === 1 ? "outline" : "destructive"}>
                        {wh.status === 1 ? 'Hoạt động' : 'Đã khóa'}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(wh.createdAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Xem Tồn Kho"
                        onClick={(e) => { e.stopPropagation(); setViewStockId(wh.id); }}
                      >
                        <Box className="w-4 h-4 mr-1" /> Tồn kho
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Chỉnh sửa"
                        onClick={(e) => { e.stopPropagation(); handleEdit(wh); }}
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Xóa"
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(wh.id); }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredWarehouses.length)} / {filteredWarehouses.length} kho
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                <div className="text-sm font-medium">
                  Trang {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <CreateWarehouseModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          initialData={editingWarehouse}
        />
      )}

      {/* Modal Stock View */}
      {viewStockId && (
        <StockViewModal
          warehouseId={viewStockId}
          onClose={() => setViewStockId(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn kho này khỏi hệ thống.
              Nếu kho đã có lịch sử tồn kho hoặc giao dịch, việc xóa có thể bị từ chối.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Xóa Vĩnh Viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WarehouseListPage;
