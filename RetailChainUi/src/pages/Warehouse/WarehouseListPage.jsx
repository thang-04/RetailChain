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
import { Plus, Search, Edit, Trash2, Box } from 'lucide-react';

const WarehouseListPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [viewStockId, setViewStockId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterStore, setFilterStore] = useState('ALL');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

    // Store Filter Logic: 
    // If Filter is ALL, show all.
    // If Filter is selected (e.g. storeId 'S001' or DB ID), match against warehouse.storeId?
    // Note: warehouse.storeId is Number (DB ID), while Store Select usually uses DB ID now.
    // Need to ensure filterStore stores the DB ID.
    const matchesStore = filterStore === 'ALL' ? true : String(wh.storeId) === filterStore;

    return matchesSearch && matchesType && matchesStatus && matchesStore;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredWarehouses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWarehouses = filteredWarehouses.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản Lý Kho</h1>
          <p className="text-muted-foreground">Quản lý danh sách kho tổng và kho con (cửa hàng).</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Tạo Kho Mới
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, mã kho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="flex items-center gap-4">
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead>Mã Kho</TableHead>
                  <TableHead>Tên Kho</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Store Link</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : currentWarehouses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy kho nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentWarehouses.map((wh, index) => (
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
                        {wh.storeId ? `Store #${wh.storeId}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={wh.status === 1 ? "outline" : "destructive"}>
                          {wh.status === 1 ? 'Hoạt động' : 'Đã khóa'}
                        </Badge>
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
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
