import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Send } from "lucide-react";
import stockRequestService from "@/services/stockRequest.service";
import inventoryService from "@/services/inventory.service";

const CreateStockRequestModal = ({ isOpen, onClose, storeId, storeWarehouseId, onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [note, setNote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [centralWarehouse, setCentralWarehouse] = useState(null);

  useEffect(() => {
    if (isOpen && storeId) {
      loadData();
    }
  }, [isOpen, storeId]);

  const loadData = async () => {
    try {
      const [productData, centralWh] = await Promise.all([
        inventoryService.getAllProducts(),
        inventoryService.getCentralWarehouse()
      ]);
      setProducts(productData.data || productData || []);
      if (centralWh?.data) {
        setCentralWarehouse(centralWh.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (product) => {
    if (items.find(item => item.variantId === product.id)) return;
    setItems([...items, {
      variantId: product.id,
      productName: product.name,
      sku: product.code,
      quantity: 1,
      note: ""
    }]);
    setSearchTerm("");
  };

  const removeItem = (variantId) => {
    setItems(items.filter(item => item.variantId !== variantId));
  };

  const updateItemQuantity = (variantId, quantity) => {
    setItems(items.map(item => 
      item.variantId === variantId ? { ...item, quantity: parseInt(quantity) || 0 } : item
    ));
  };

  const handleSubmit = async () => {
    if (!centralWarehouse || items.length === 0) {
      alert("Vui lòng thêm sản phẩm");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        storeId: parseInt(storeId),
        sourceWarehouseId: centralWarehouse.id,
        targetWarehouseId: parseInt(storeWarehouseId),
        note: note,
        priority: "NORMAL",
        items: items.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
          note: item.note
        }))
      };

      await stockRequestService.createRequest(requestData);
      alert("Gửi yêu cầu thành công!");
      setItems([]);
      setNote("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating request:", error);
      alert(error.response?.data?.message || "Lỗi khi gửi yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Gửi yêu cầu xuất hàng</DialogTitle>
          <DialogDescription>
            Gửi yêu cầu xuất hàng từ kho tổng về cửa hàng của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label className="text-sm font-medium">Thêm sản phẩm *</Label>
            <div className="mt-1 relative">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2"
              />
              {searchTerm && filteredProducts.length > 0 && (
                <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredProducts.slice(0, 10).map(product => (
                    <div
                      key={product.id}
                      className="px-3 py-2 hover:bg-slate-100 cursor-pointer flex items-center justify-between"
                      onClick={() => addItem(product)}
                    >
                      <span>{product.name}</span>
                      <Badge variant="outline" className="text-xs">{product.code}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Danh sách sản phẩm</Label>
              <div className="mt-1 space-y-2">
                {items.map(item => (
                  <div key={item.variantId} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">{item.sku}</p>
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.variantId, e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeItem(item.variantId)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium">Ghi chú</Label>
            <Input
              placeholder="Thêm ghi chú..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !centralWarehouse || items.length === 0}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStockRequestModal;
