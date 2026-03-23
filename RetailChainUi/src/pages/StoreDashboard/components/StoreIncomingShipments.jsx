import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Package, Truck, Search, CheckCircle2, Clock, RotateCcw,
  ArrowRight, Eye, Calendar
} from "lucide-react";
import inventoryService from "@/services/inventory.service";

const StoreIncomingShipments = ({ storeId }) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (storeId) {
      fetchShipments();
    }
  }, [storeId]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getExportDocumentsByStore(storeId);
      setShipments(data?.data || data || []);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async (shipmentId) => {
    try {
      setConfirming(true);
      await inventoryService.confirmReceipt(shipmentId);
      toast.success("Xác nhận thành công!");
      fetchShipments();
      setShowDetail(false);
    } catch (error) {
      console.error("Error confirming receipt:", error);
      toast.error(error.response?.data?.desc || "Lỗi khi xác nhận");
    } finally {
      setConfirming(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'PENDING': { label: 'Chờ xác nhận', class: 'bg-amber-100 text-amber-700 border-amber-200' },
      'COMPLETED': { label: 'Hoàn thành', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    };
    const c = config[status] || config['PENDING'];
    return <Badge className={`${c.class} border font-medium`}>{c.label}</Badge>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const filteredShipments = useMemo(() => {
    let result = shipments;

    // Filter by date
    if (dateFrom) {
      result = result.filter(s => new Date(s.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter(s => new Date(s.createdAt) <= new Date(dateTo));
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(s => s.status === statusFilter);
    }

    return result;
  }, [shipments, dateFrom, dateTo, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Hàng đến</h2>
            <p className="text-sm text-muted-foreground">Danh sách phiếu xuất kho gửi đến cửa hàng</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {shipments.length} phiếu
        </Badge>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-3 p-4 bg-muted/30 rounded-lg">
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">Từ ngày</Label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-[160px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">Đến ngày</Label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-[160px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">Trạng thái</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
              <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setDateFrom("");
            setDateTo("");
            setStatusFilter("all");
          }}
          className="gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          Xóa lọc
        </Button>
      </div>

      {/* Table View */}
      {filteredShipments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Không có phiếu nhận hàng nào</p>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">STT</TableHead>
              <TableHead>Mã phiếu</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Kho gửi</TableHead>
              <TableHead className="text-center">Số SP</TableHead>
              <TableHead className="text-center">Tổng SL</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.map((shipment, index) => (
              <TableRow key={shipment.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="font-medium">{shipment.documentCode || shipment.id}</TableCell>
                <TableCell>{formatDate(shipment.createdAt)}</TableCell>
                <TableCell>{shipment.sourceWarehouseName || '-'}</TableCell>
                <TableCell className="text-center">{shipment.totalItems || 0}</TableCell>
                <TableCell className="text-center">
                  {shipment.totalQuantity || 0}
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(shipment.status)}</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm" onClick={() => {
                    setSelectedShipment(shipment);
                    setShowDetail(true);
                  }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết phiếu nhận hàng</DialogTitle>
            <DialogDescription>
              {selectedShipment?.documentCode}
            </DialogDescription>
          </DialogHeader>
          
          {selectedShipment && (
            <div className="space-y-4">
              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">{formatDate(selectedShipment.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Trạng thái</p>
                  <div className="mt-1">{getStatusBadge(selectedShipment.status)}</div>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Kho nguồn</p>
                  <p className="font-medium">{selectedShipment.sourceWarehouseName || '-'}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Danh sách sản phẩm</p>
                <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                  {selectedShipment.items?.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.variantName || 'Sản phẩm #' + item.variantId}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              {selectedShipment.status === 'PENDING' && (
                <Button 
                  className="w-full" 
                  onClick={() => handleConfirmReceipt(selectedShipment.id)}
                  disabled={confirming}
                >
                  {confirming ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Đang xác nhận...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Xác nhận đã nhận hàng
                    </>
                  )}
                </Button>
              )}

              {selectedShipment.status === 'COMPLETED' && (
                <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Đã xác nhận</span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreIncomingShipments;
