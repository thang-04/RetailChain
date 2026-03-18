# UI Changes Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thực hiện 3 thay đổi UI: (1) StockIn/StockOut - click row để xem chi tiết, (2) Store Dashboard - tab hàng đến làm mặc định cho Store Manager + bảng + filter, (3) Yêu cầu xuất hàng - cho phép chọn nhiều variant

**Architecture:** Frontend React changes - không cần backend. Sử dụng shadcn/ui components có sẵn.

**Tech Stack:** React, Tailwind CSS, shadcn/ui

---

## File Structure

| File | Thay đổi |
|------|----------|
| `RetailChainUi/src/pages/StockIn/StockInList.jsx` | Xóa dropdown, thêm click-to-view |
| `RetailChainUi/src/pages/StockOut/StockOutList.jsx` | Xóa dropdown, thêm click-to-view |
| `RetailChainUi/src/pages/StoreDashboard/StoreDashboardPage.jsx` | Đổi tab mặc định cho Store Manager |
| `RetailChainUi/src/pages/StoreDashboard/components/StoreIncomingShipments.jsx` | Thêm bảng + filter |

---

## Chunk 1: StockInList - Click row to view detail

### Task 1.1: StockInList - Xóa dropdown menu

**Files:**
- Modify: `RetailChainUi/src/pages/StockIn/StockInList.jsx`

- [ ] **Step 1: Đọc file để xác định vị trí code cần sửa**

Run: Đọc file `StockInList.jsx`, tìm các dòng:
- Import DropdownMenu (dòng 21)
- Component DropdownMenu (dòng 673-694)
- Cột "Thao tác" trong TableHeader

- [ ] **Step 2: Xóa import DropdownMenu**

```jsx
// XÓA dòng 21:
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
```

- [ ] **Step 3: Xóa import Eye, Edit, Trash2, MoreHorizontal nếu không còn dùng**

```jsx
// KIỂM TRA và XÓA nếu trong import (dòng 27) có:
// - Eye, Edit, Trash2, MoreHorizontal
// Chỉ giữ lại các icon còn dùng
```

- [ ] **Step 4: Xóa component DropdownMenu trong TableCell**

Tìm và xóa đoạn code (khoảng dòng 673-694):
```jsx
<DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-44 rounded-xl">
        <DropdownMenuItem onClick={() => handleViewDetail(record)} className="gap-2">
            <Eye className="h-4 w-4" />
            <span>Xem chi tiết</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
            <Edit className="h-4 w-4" />
            <span>Chỉnh sửa</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
            onClick={() => handleDelete(record.id)}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
            <Trash2 className="h-4 w-4" />
            <span>Xóa phiếu</span>
        </DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>
```

- [ ] **Step 5: Xóa cột "Thao tác" trong TableHeader**

Tìm và xóa đoạn:
```jsx
<TableHead className="text-center">Thao tác</TableHead>
```

- [ ] **Step 6: Thêm onClick vào TableRow để mở modal xem chi tiết**

Tìm `TableRow` và thêm:
```jsx
<TableRow
    key={record.id}
    className="cursor-pointer hover:bg-muted/50"
    onClick={() => handleViewDetail(record)}
>
```

- [ ] **Step 7: Commit**

```bash
git add RetailChainUi/src/pages/StockIn/StockInList.jsx
git commit -m "refactor: remove dropdown, add click-to-view in StockInList"
```

---

### Task 1.2: StockOutList - Xóa dropdown menu

**Files:**
- Modify: `RetailChainUi/src/pages/StockOut/StockOutList.jsx`

- [ ] **Step 1: Đọc file để xác định vị trí code cần sửa**

Run: Đọc file `StockOutList.jsx`, tìm các dòng:
- Import DropdownMenu (dòng 22)
- Component DropdownMenu (dòng 687-708)
- Cột "Thao tác" trong TableHeader

- [ ] **Step 2: Xóa import DropdownMenu**

```jsx
// XÓA dòng 22:
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
```

- [ ] **Step 3: Xóa import Eye, Edit, Trash2, MoreHorizontal nếu không còn dùng**

- [ ] **Step 4: Xóa component DropdownMenu trong TableCell**

- [ ] **Step 5: Xóa cột "Thao tác" trong TableHeader**

- [ ] **Step 6: Thêm onClick vào TableRow để mở modal xem chi tiết**

```jsx
<TableRow
    key={record.id}
    className="cursor-pointer hover:bg-muted/50"
    onClick={() => handleViewDetail(record)}
>
```

- [ ] **Step 7: Commit**

```bash
git add RetailChainUi/src/pages/StockOut/StockOutList.jsx
git commit -m "refactor: remove dropdown, add click-to-view in StockOutList"
```

---

## Chunk 2: Store Dashboard - Tab Hàng đến

### Task 2.1: StoreDashboardPage - Đổi tab mặc định cho Store Manager

**Files:**
- Modify: `RetailChainUi/src/pages/StoreDashboard/StoreDashboardPage.jsx`

- [ ] **Step 1: Đọc file để xem cấu trúc tabs hiện tại**

Run: Đọc file, tìm:
- Dòng khai báo `activeTab` state (dòng 22)
- Logic kiểm tra role/permission

- [ ] **Step 2: Sửa state activeTab mặc định**

```jsx
// TÌM (dòng 22):
const [activeTab, setActiveTab] = useState("overview");

// SỬA THÀNH:
// Kiểm tra xem user có phải là Store Manager không
const { hasRole } = useAuth();
const isStoreManager = hasRole('STORE_MANAGER');
const [activeTab, setActiveTab] = useState(isStoreManager ? "incoming" : "overview");
```

- [ ] **Step 3: Commit**

```bash
git add RetailChainUi/src/pages/StoreDashboard/StoreDashboardPage.jsx
git commit -m "feat: set incoming tab as default for Store Manager"
```

---

### Task 2.2: StoreIncomingShipments - Chuyển từ card list sang bảng + filter

**Files:**
- Modify: `RetailChainUi/src/pages/StoreDashboard/components/StoreIncomingShipments.jsx`

- [ ] **Step 1: Đọc file để hiểu cấu trúc hiện tại**

Run: Đọc file `StoreIncomingShipments.jsx` để xem:
- State hiện tại
- Logic hiển thị shipments
- Components đang dùng

- [ ] **Step 2: Thêm state cho filters**

```jsx
// THÊM vào phần khai báo state (sau dòng 20):
const [dateFrom, setDateFrom] = useState("");
const [dateTo, setDateTo] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
```

- [ ] **Step 3: Thêm logic filter**

```jsx
// THÊM sau hàm fetchShipments:
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
```

- [ ] **Step 4: Thêm UI filter controls**

Tìm phần Header hiện tại và THAY THẾ bằng:

```jsx
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
```

- [ ] **Step 5: Thay đổi hiển thị từ card list sang bảng**

Tìm phần `shipments.map` hiện tại và THAY THẾ bằng:

```jsx
{/* Table View */}
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
        {filteredShipments.length === 0 ? (
            <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Không có phiếu nào
                </TableCell>
            </TableRow>
        ) : (
            filteredShipments.map((shipment, index) => (
                <TableRow key={shipment.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">{shipment.code || shipment.id}</TableCell>
                    <TableCell>{formatDate(shipment.createdAt)}</TableCell>
                    <TableCell>{shipment.fromWarehouse?.name || '-'}</TableCell>
                    <TableCell className="text-center">{shipment.items?.length || 0}</TableCell>
                    <TableCell className="text-center">
                        {shipment.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
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
            ))
        )}
    </TableBody>
</Table>
```

- [ ] **Step 6: Thêm import cần thiết**

```jsx
// Thêm vào import:
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { RotateCcw, Eye } from "lucide-react";
```

- [ ] **Step 7: Import useMemo**

```jsx
// Thêm vào import react:
import { useState, useEffect, useMemo } from "react";
```

- [ ] **Step 8: Commit**

```bash
git add RetailChainUi/src/pages/StoreDashboard/components/StoreIncomingShipments.jsx
git commit -m "feat: convert incoming shipments to table view with filters"
```

---

## Chunk 3: Yêu cầu xuất hàng - Cho phép chọn nhiều variant

### Task 3.1: CreateStockRequestModal - Sửa logic chọn variant

**Files:**
- Modify: `RetailChainUi/src/pages/StoreDashboard/components/CreateStockRequestModal.jsx`

- [ ] **Step 1: Đọc file để xem logic hiện tại**

Run: Đọc file, tìm:
- Hàm `handleQuickAdd` (dòng 98-113)
- Logic kiểm tra exists (dòng 129-136)

- [ ] **Step 2: Tìm và xem logic hiện tại**

```jsx
// Tìm đoạn này (khoảng dòng 295-300):
const exists = items.find(i =>
    i.variantId === product.id ||
    product.variants?.some(v => v.id === i.variantId)
);

if (exists) {
    toast.warning("Sản phẩm đã được thêm");
    return;
}
```

- [ ] **Step 3: Sửa logic để cho phép chọn nhiều variant**

```jsx
// THAY THẾ đoạn trên thành:
// Chỉ kiểm tra trùng variantId, không kiểm tra trùng product.id
const exists = items.find(i => i.variantId === product.id);

if (exists) {
    // Nếu đã có product (variant đầu tiên), cho phép thêm các variant khác
    // Nhưng đã có variant cụ thể thì không thêm lại
    const variantExists = product.variants?.some(v =>
        items.some(i => i.variantId === v.id)
    );
    if (variantExists) {
        toast.warning("Các variant của sản phẩm này đã được thêm hết");
        return;
    }
}
```

- [ ] **Step 4: Kiểm tra logic handleVariantSelect**

Xem hàm `handleVariantSelect` (dòng 114-128) để đảm bảo không có logic block thêm variant:

```jsx
const handleVariantSelect = (variant) => {
    // Kiểm tra đã tồn tại variant này chưa
    const variantExists = items.find(i => i.variantId === variant.id);
    if (variantExists) {
        toast.warning("Variant này đã được thêm");
        return;
    }

    setItems([...items, {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productImage: getProductImage(selectedProduct),
        variantId: variant.id,
        sku: variant.sku || selectedProduct.code,
        variantInfo: `${variant.color || ''} / ${variant.size || ''}`.trim(),
        quantity: quickAddQty || 1,
    }]);
    setShowVariantDialog(false);
    setQuickAddQty(1);
};
```

Logic này đã đúng - chỉ block khi variantId trùng. Cần đảm bảo không có logic block ở chỗ khác.

- [ ] **Step 5: Commit**

```bash
git add RetailChainUi/src/pages/StoreDashboard/components/CreateStockRequestModal.jsx
git commit -m "feat: allow selecting multiple variants in stock request"
```

---

## Tổng kết

| Chunk | Task | Mô tả |
|-------|------|-------|
| 1 | 1.1 | StockInList - click row to view |
| 1 | 1.2 | StockOutList - click row to view |
| 2 | 2.1 | StoreDashboard - tab mặc định |
| 2 | 2.2 | StoreIncomingShipments - bảng + filter |
| 3 | 3.1 | CreateStockRequestModal - multi variant |

---

## Testing Checklist

- [ ] StockInList: Click vào row bất kỳ -> mở modal xem chi tiết
- [ ] StockOutList: Click vào row bất kỳ -> mở modal xem chi tiết
- [ ] StoreDashboard: Login bằng Store Manager -> tab "hàng đến" là mặc định
- [ ] StoreDashboard: Login bằng role khác -> tab "overview" là mặc định
- [ ] StoreIncomingShipments: Filter theo ngày hoạt động
- [ ] StoreIncomingShipments: Filter theo trạng thái hoạt động
- [ ] CreateStockRequestModal: Thêm product có 2 variant khác nhau -> cả 2 đều được thêm vào danh sách
