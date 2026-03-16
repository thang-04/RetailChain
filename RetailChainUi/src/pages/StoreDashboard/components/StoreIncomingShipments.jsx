import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Package, Truck, Search, CheckCircle2, Clock,
  ArrowRight, Eye, Calendar
} from "lucide-react";
import inventoryService from "@/services/inventory.service";

const StoreIncomingShipments = ({ storeId }) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [confirming, setConfirming] = useState(false);

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

      {/* Shipment List */}
      {shipments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Không có phiếu nhận hàng nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {shipments.map((shipment) => (
            <Card 
              key={shipment.id} 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => {
                setSelectedShipment(shipment);
                setShowDetail(true);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Truck className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{shipment.documentCode}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(shipment.createdAt)}
                        <span className="mx-1">•</span>
                        <Package className="w-3 h-3" />
                        {shipment.totalItems || 0} sản phẩm
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(shipment.status)}
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                
                {/* Source Warehouse */}
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-xs uppercase tracking-wider">Kho nguồn:</span>
                  <span className="font-medium text-foreground">{shipment.sourceWarehouseName || '-'}</span>
                  <ArrowRight className="w-3 h-3" />
                  <span className="font-medium text-foreground">{shipment.targetWarehouseName || 'Cửa hàng'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
