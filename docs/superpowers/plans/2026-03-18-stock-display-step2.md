# Hiển thị tồn kho tại Step 2 - Stock Out Wizard

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hiển thị số lượng tồn kho của sản phẩm tại bước chọn sản phẩm (Step 2) trong wizard tạo phiếu xuất kho. Thêm cảnh báo màu sắc khi sản phẩm hết hàng hoặc sắp hết hàng.

**Architecture:** Gọi API `getStockByWarehouse(warehouseId)` khi người dùng chọn kho nguồn ở Step 1. Map dữ liệu tồn kho vào danh sách sản phẩm. Hiển thị cột "Tồn kho" với màu sắc cảnh báo. Disable nút thêm nếu sản phẩm đã hết hàng.

**Tech Stack:** React, Tailwind CSS, shadcn/ui, API service

---

## File Structure

| File | Responsibility |
|------|----------------|
| `RetailChainUi/src/components/StockOutWizard/StockOutWizard.jsx` | Quản lý state stockData, gọi API khi chọn kho nguồn |
| `RetailChainUi/src/components/StockOutWizard/StepTwoProducts.jsx` | Hiển thị cột tồn kho, màu sắc cảnh báo, disable nút |
| `RetailChainUi/src/services/inventory.service.js` | Đã có sẵn method `getStockByWarehouse` |

---

## Task 1: Cập nhật StockOutWizard - Thêm state và gọi API

**Files:**
- Modify: `RetailChainUi/src/components/StockOutWizard/StockOutWizard.jsx`

- [ ] **Step 1: Thêm stockData state và fetchStockData function**

Mở file `StockOutWizard.jsx`, tìm đến dòng 22-36 (sau `const [categories, setCategories] = useState([]);`):

```javascript
// Thêm sau dòng 25
const [stockData, setStockData] = useState([]);
```

- [ ] **Step 2: Thêm hàm fetchStockData**

Thêm hàm mới sau `validateStep`:

```javascript
const fetchStockData = async (warehouseId) => {
    try {
        const response = await inventoryService.getStockByWarehouse(warehouseId);
        if (response?.data) {
            setStockData(response.data);
        }
    } catch (error) {
        console.error("Failed to fetch stock data:", error);
    }
};
```

- [ ] **Step 3: Gọi fetchStockData khi sourceWarehouseId thay đổi**

Tìm `useEffect` hiện tại (dòng 38-90), thêm vào cuối useEffect:

```javascript
// Thêm vào cuối useEffect, trước dòng cuối });
if (formData.sourceWarehouseId) {
    fetchStockData(formData.sourceWarehouseId);
}
```

- [ ] **Step 4: Pass stockData xuống StepTwoProducts**

Tìm nơi gọi `StepTwoProducts` (dòng 164-172), thêm prop `stockData`:

```javascript
// Code hiện tại:
<StepTwoProducts 
    formData={formData}
    items={items}
    setItems={setItems}
    productVariants={productVariants}
    categories={categories}
    errors={errors}
/>

// Sửa thành:
<StepTwoProducts 
    formData={formData}
    items={items}
    setItems={setItems}
    productVariants={productVariants}
    categories={categories}
    errors={errors}
    stockData={stockData}
/>
```

- [ ] **Step 5: Commit**

```bash
git add RetailChainUi/src/components/StockOutWizard/StockOutWizard.jsx
git commit -m "feat: add stockData state and fetchStockData in StockOutWizard"
```

---

## Task 2: Cập nhật StepTwoProducts - Hiển thị tồn kho và cảnh báo

**Files:**
- Modify: `RetailChainUi/src/components/StockOutWizard/StepTwoProducts.jsx`

- [ ] **Step 1: Thêm props stockData vào component**

Tìm dòng 10:

```javascript
// Code hiện tại:
const StepTwoProducts = ({ items, setItems, productVariants, categories, errors }) => {

// Sửa thành:
const StepTwoProducts = ({ items, setItems, productVariants, categories, errors, stockData = [] }) => {
```

- [ ] **Step 2: Tạo helper function getStockInfo**

Thêm sau dòng imports (khoảng dòng 8):

```javascript
const getStockInfo = (variantId) => {
    const stock = stockData.find(s => s.variantId === variantId);
    const quantity = stock?.quantity || 0;
    
    if (quantity === 0) {
        return { quantity: 0, status: 'out', color: 'text-red-600', bg: 'bg-red-50', label: 'Hết hàng' };
    }
    if (quantity <= 10) {
        return { quantity, status: 'low', color: 'text-amber-600', bg: 'bg-amber-50', label: 'Sắp hết' };
    }
    return { quantity, status: 'ok', color: 'text-green-600', bg: 'bg-green-50', label: 'Còn hàng' };
};
```

- [ ] **Step 3: Cập nhật table header - thêm cột Tồn kho**

Tìm dòng 113-117 (TableHeader):

```javascript
// Code hiện tại:
<TableRow>
    <TableHead className="h-9 font-medium text-sm">Sản phẩm</TableHead>
    <TableHead className="h-9 font-medium text-sm w-20">Thao tác</TableHead>
</TableRow>

// Sửa thành:
<TableRow>
    <TableHead className="h-9 font-medium text-sm">Sản phẩm</TableHead>
    <TableHead className="h-9 font-medium text-sm w-24 text-center">Tồn kho</TableHead>
    <TableHead className="h-9 font-medium text-sm w-20">Thao tác</TableHead>
</TableRow>
```

- [ ] **Step 4: Cập nhật table body - hiển thị tồn kho**

Tìm dòng 121-138 (map variant):

```javascript
// Code hiện tại:
{paginatedProducts.map((variant) => (
    <TableRow key={variant.id} className="h-11">
        <TableCell className="py-2">
            <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate max-w-[300px]">{variant.productName}</span>
                <span className="text-xs text-muted-foreground shrink-0">{variant.sku}</span>
            </div>
        </TableCell>
        <TableCell className="py-2">
            <Button 
                size="icon" 
                variant="ghost"
                onClick={() => handleAddItem(variant)}
                className="h-7 w-7 text-primary hover:bg-primary/10"
            >
                <Plus className="w-4 h-4" />
            </Button>
        </TableCell>
    </TableRow>
))}

// Sửa thành:
{paginatedProducts.map((variant) => {
    const stockInfo = getStockInfo(variant.id);
    const isDisabled = stockInfo.status === 'out';
    
    return (
    <TableRow key={variant.id} className="h-11">
        <TableCell className="py-2">
            <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate max-w-[300px]">{variant.productName}</span>
                <span className="text-xs text-muted-foreground shrink-0">{variant.sku}</span>
            </div>
        </TableCell>
        <TableCell className="py-2 text-center">
            <div className={`inline-flex items-center px-2 py-1 rounded-md ${stockInfo.bg} ${stockInfo.color} text-sm font-medium`}>
                {isDisabled && <AlertCircle className="w-3 h-3 mr-1" />}
                {stockInfo.quantity}
            </div>
        </TableCell>
        <TableCell className="py-2">
            <Button 
                size="icon" 
                variant="ghost"
                onClick={() => handleAddItem(variant)}
                disabled={isDisabled}
                className={isDisabled 
                    ? "h-7 w-7 text-muted-foreground cursor-not-allowed" 
                    : "h-7 w-7 text-primary hover:bg-primary/10"}
            >
                <Plus className="w-4 h-4" />
            </Button>
        </TableCell>
    </TableRow>
    );
})}
```

- [ ] **Step 5: Import AlertCircle icon**

Kiểm tra imports ở đầu file, thêm AlertCircle:

```javascript
import { Search, Plus, Trash2, Package, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
```

- [ ] **Step 6: Commit**

```bash
git add RetailChainUi/src/components/StockOutWizard/StepTwoProducts.jsx
git commit -m "feat: display stock quantity with warning colors in StepTwoProducts"
```

---

## Task 3: Verification

- [ ] **Step 1: Chạy npm run dev**

```bash
cd RetailChainUi && npm run dev
```

- [ ] **Step 2: Truy cập http://localhost:5173/stock-out/create**

- [ ] **Step 3: Kiểm tra Step 1**
- Chọn kho nguồn (Kho Tổng)
- Bấm Tiếp theo

- [ ] **Step 4: Kiểm tra Step 2**
- ✅ Hiển thị cột "Tồn kho"
- ✅ Sản phẩm còn hàng (>10): màu xanh lá
- ✅ Sản phẩm sắp hết (1-10): màu vàng, hiển thị "Sắp hết"
- ✅ Sản phẩm hết hàng (0): màu đỏ, hiển thị "Hết hàng", nút [+] bị disable
- ✅ Click [+] ở sản phẩm hết hàng không có tác dụng

---

## Summary

| Task | Mô tả | Files |
|------|--------|-------|
| Task 1 | Thêm state stockData, gọi API getStockByWarehouse | StockOutWizard.jsx |
| Task 2 | Hiển thị cột tồn kho + màu sắc cảnh báo | StepTwoProducts.jsx |
| Task 3 | Verify manual | - |

## API Reference

```javascript
// GET /inventory/stock/{warehouseId}
// Response:
[
    {
        "warehouseId": 1,
        "warehouseName": "Kho Tổng Miền Bắc",
        "variantId": 1,
        "sku": "AT001",
        "productName": "Áo Thun Classic",
        "quantity": 150,
        "lastUpdated": "2026-03-18T10:30:00"
    },
    ...
]
```
