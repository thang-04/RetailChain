import { useState, useEffect, useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  X, Send, Search, Package, Warehouse, ArrowRight, FilePlus,
  ShoppingCart, Check, ChevronDown
} from "lucide-react";
import stockRequestService from "@/services/stockRequest.service";
import inventoryService from "@/services/inventory.service";

const CreateStockRequestModal = ({ isOpen, onClose, storeId, storeWarehouseId, onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [items, setItems] = useState([]);
  const [note, setNote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [centralWarehouse, setCentralWarehouse] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantDialog, setShowVariantDialog] = useState(false);
  const [quickAddQty, setQuickAddQty] = useState(1);

  useEffect(() => {
    if (isOpen && storeId) {
      setInitializing(true);
      loadData();
    }
    if (!isOpen) {
      setItems([]);
      setNote("");
      setSearchTerm("");
      setSelectedCategory("all");
    }
  }, [isOpen, storeId]);

  const loadData = async () => {
    try {
      const [productData, centralWh, categoryData] = await Promise.all([
        inventoryService.getAllProducts(),
        inventoryService.getCentralWarehouse(),
        inventoryService.getAllCategories()
      ]);
      
      const productsList = productData.data || productData || [];
      setProducts(productsList);
      setCategories(categoryData.data || categoryData || []);
      
      if (centralWh?.data) {
        setCentralWarehouse(centralWh.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setInitializing(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter(p => p.categoryId === parseInt(selectedCategory));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(term) ||
        p.code?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [products, selectedCategory, searchTerm]);

  const getProductImage = (product) => {
    if (product.image) return product.image;
    if (product.variants?.[0]?.image) return product.variants[0].image;
    return null;
  };

  const handleQuickAdd = (product) => {
    if (product.variants && product.variants.length > 0) {
      setSelectedProduct(product);
      setQuickAddQty(1);
      setShowVariantDialog(true);
    } else {
      addItem({
        variantId: product.id,
        productName: product.name,
        sku: product.code,
        quantity: 1,
        note: ""
      });
    }
  };

  const handleVariantSelect = (variant) => {
    addItem({
      variantId: variant.id,
      productName: selectedProduct.name,
      sku: variant.sku || selectedProduct.code,
      variantInfo: `${variant.color || ''} / ${variant.size || ''}`.trim(),
      quantity: quickAddQty,
      note: ""
    });
    setShowVariantDialog(false);
    setSelectedProduct(null);
    setQuickAddQty(1);
  };

  const addItem = (item) => {
    const exists = items.find(i => i.variantId === item.variantId);
    if (exists) {
      setItems(items.map(i => 
        i.variantId === item.variantId 
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      ));
    } else {
      setItems([...items, item]);
    }
  };

  const removeItem = (variantId) => {
    setItems(items.filter(item => item.variantId !== variantId));
  };

  const updateItemQuantity = (variantId, delta) => {
    setItems(items.map(item => {
      if (item.variantId === variantId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const canSubmit = storeId && centralWarehouse && items.length > 0 && !loading && !initializing;

  const handleSubmit = async () => {
    console.log("DEBUG handleSubmit - storeId:", storeId, "storeWarehouseId:", storeWarehouseId, "items:", items.length);
    
    if (!canSubmit) {
      toast.warning("Vui lòng chọn ít nhất 1 sản phẩm và đợi dữ liệu tải xong");
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

      console.log("Creating stock request:", requestData);
      
      await stockRequestService.createRequest(requestData);
      
      toast.success("Tạo yêu cầu xuất hàng thành công!");
      setItems([]);
      setNote("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error(error.response?.data?.desc || "Lỗi khi gửi yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-card flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FilePlus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-foreground">
                  Yêu cầu xuất hàng
                </DialogTitle>
                <DialogDescription className="text-muted-foreground mt-1">
                  Bổ sung hàng tồn kho cho cửa hàng
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Warehouse Info Bar */}
          <div className="mt-4 flex items-center gap-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                <Warehouse className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Kho nguồn</p>
                <p className="text-sm font-medium text-foreground">{centralWarehouse?.name || "Đang tải..."}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                <Package className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Kho đích</p>
                <p className="text-sm font-medium text-foreground">Kho cửa hàng</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* Left Panel - Product Selection */}
          <div className="flex-1 flex flex-col border-r border-border overflow-hidden min-h-0">
            {/* Search & Category Tabs */}
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 pl-10 pr-4"
                />
              </div>
              
              {/* Category Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className="shrink-0"
                >
                  Tất cả
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === String(cat.id) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(String(cat.id))}
                    className="shrink-0"
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Package className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Không tìm thấy sản phẩm nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredProducts.map(product => {
                    // Product không có variant: kiểm tra như cũ
                    // Product có variant: luôn enable để có thể thêm nhiều variant
                    const hasNoVariants = !product.variants || product.variants.length === 0;
                    const isAdded = hasNoVariants && items.some(i => i.variantId === product.id);
                    const image = getProductImage(product);

                    return (
                      <button
                        key={product.id}
                        onClick={() => handleQuickAdd(product)}
                        disabled={isAdded}
                        className={`
                          relative flex flex-col p-3 rounded-lg border transition-all text-left
                          ${isAdded 
                            ? 'bg-muted/50 border-border opacity-60 cursor-not-allowed' 
                            : 'bg-card border-border hover:border-primary hover:shadow-md cursor-pointer'}
                        `}
                      >
                        {isAdded && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                        
                        {/* Product Image */}
                        <div className="w-full aspect-square rounded-md bg-muted mb-2 overflow-hidden flex items-center justify-center">
                          {image ? (
                            <img src={image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <p className="font-medium text-sm text-foreground line-clamp-2">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.code}</p>
                        
                        {product.variants?.length > 0 && (
                          <p className="text-xs text-primary mt-1">
                            {product.variants.length} phiên bản
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Selected Items */}
          <div className="w-full lg:w-80 flex flex-col bg-muted/30 overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-foreground">
                  Danh sách yêu cầu
                </Label>
                {items.length > 0 && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {items.length} sản phẩm
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <ShoppingCart className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Chưa có sản phẩm nào</p>
                  <p className="text-xs text-muted-foreground mt-1">Click chọn sản phẩm bên trái</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div 
                      key={item.variantId} 
                      className="bg-card border border-border rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.sku}</p>
                          {item.variantInfo && (
                            <p className="text-xs text-primary mt-0.5">{item.variantInfo}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="p-1 hover:bg-destructive/10 rounded transition-colors"
                          aria-label={`Xóa ${item.productName}`}
                        >
                          <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Số lượng:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateItemQuantity(item.variantId, -1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 rounded border border-input flex items-center justify-center hover:bg-accent disabled:opacity-50"
                            aria-label="Giảm"
                          >
                            <span className="text-xs">-</span>
                          </button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              setItems(items.map(i => 
                                i.variantId === item.variantId ? { ...i, quantity: Math.max(1, val) } : i
                              ));
                            }}
                            className="w-14 h-7 text-center text-sm"
                          />
                          <button
                            onClick={() => updateItemQuantity(item.variantId, 1)}
                            className="w-7 h-7 rounded border border-input flex items-center justify-center hover:bg-accent"
                            aria-label="Tăng"
                          >
                            <span className="text-xs">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Note Section */}
            <div className="p-4 border-t border-border">
              <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Ghi chú
              </Label>
              <Textarea
                placeholder="Thêm ghi chú..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-16 resize-none text-sm"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-4 border-t border-border shrink-0 flex-shrink-0">
          <div className="flex items-center justify-between w-full gap-4">
            <div className="text-sm text-muted-foreground">
              {items.length > 0 ? (
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Đã chọn <strong className="text-foreground">{items.length}</strong> sản phẩm
                </span>
              ) : (
                <span>Vui lòng chọn sản phẩm</span>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="min-w-[140px]"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Gửi yêu cầu {!canSubmit && storeId ? `(Thiếu sản phẩm)` : ''}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Variant Selection Dialog */}
      <Dialog open={showVariantDialog} onOpenChange={setShowVariantDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn phiên bản sản phẩm</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {selectedProduct?.variants?.map(variant => (
              <div
                key={variant.id}
                role="button"
                tabIndex={0}
                onClick={() => handleVariantSelect(variant)}
                onKeyDown={(e) => e.key === 'Enter' && handleVariantSelect(variant)}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <div className="text-left">
                  <p className="font-medium text-foreground">{variant.sku}</p>
                  <p className="text-sm text-muted-foreground">
                    {variant.color && `${variant.color} / `}{variant.size}
                    {variant.price && ` • ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.price)}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="1"
                    value={quickAddQty}
                    onChange={(e) => setQuickAddQty(parseInt(e.target.value) || 1)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-16 h-8 text-center"
                  />
                  <Button 
                    size="sm" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleVariantSelect(variant); 
                    }}
                    aria-label={`Chọn ${variant.sku}`}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default CreateStockRequestModal;
