# Cải thiện giao diện theo Role cho Staff

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cập nhật giao diện để hiển thị/ẩn các thành phần theo đúng role của user (STAFF chỉ xem, STORE_MANAGER+ có thể thao tác)

**Architecture:** Sử dụng hasPermission từ AuthContext để ẩn/hiện các nút và chức năng không phù hợp với role

**Tech Stack:** React, Context API, shadcn/ui

---

## File Structure

```
RetailChainUi/src/
├── pages/
│   ├── Dashboard/DashboardPage.jsx              # Cần điều chỉnh cho STAFF
│   ├── Product/ProductPage.jsx                   # Thêm kiểm tra quyền
│   ├── Inventory/InventoryPage.jsx              # Thêm kiểm tra quyền
│   └── StoreDashboard/StoreDashboardPage.jsx    # Ẩn nút Edit cho STAFF
├── components/
│   └── common/ProtectedRoute.jsx               # Đã cập nhật
└── configs/
    └── roleRoutes.config.js                     # Đã tạo
```

---

## Chunk 1: Cập nhật DashboardPage cho STAFF

### Task 1: Điều chỉnh DashboardPage cho từng role

**Files:**
- Modify: `RetailChainUi/src/pages/Dashboard/DashboardPage.jsx`

- [ ] **Step 1: Đọc DashboardPage hiện tại**

Xem cấu trúc và các thành phần của DashboardPage

- [ ] **Step 2: Thêm import useAuth và kiểm tra role**

```jsx
import useAuth from "../../contexts/AuthContext/useAuth";

// Trong component
const { hasRole, hasPermission } = useAuth();
const isStaff = hasRole('STAFF');
const canViewAllStores = hasPermission('STORE_VIEW_ALL') || hasRole('SUPER_ADMIN') || hasRole('STORE_MANAGER');
```

- [ ] **Step 3: Điều chỉnh giao diện theo role**

- Nếu là STAFF: Hiển thị "Store Dashboard" thay vì "Chain Overview"
- Ẩn nút "Export" và "Generate Report" nếu không có quyền
- Hiển thị KPI của cửa hàng thay vì toàn chain

- [ ] **Step 4: Commit**

```bash
git add RetailChainUi/src/pages/Dashboard/DashboardPage.jsx
git commit -m "feat: update DashboardPage to show role-specific view"
```

---

## Chunk 2: Cập nhật ProductPage

### Task 2: Thêm kiểm tra quyền cho ProductPage

**Files:**
- Modify: `RetailChainUi/src/pages/Product/ProductPage.jsx`

- [ ] **Step 1: Đọc ProductPage**

- [ ] **Step 2: Thêm import và kiểm tra quyền**

```jsx
import useAuth from "../../contexts/AuthContext/useAuth";

// Trong component
const { hasPermission } = useAuth();
const canCreateProduct = hasPermission('PRODUCT_CREATE');
const canEditProduct = hasPermission('PRODUCT_UPDATE');
```

- [ ] **Step 3: Ẩn nút "Tạo sản phẩm" cho STAFF**

Tìm và thay đổi:
```jsx
// Thay đổi dòng
<ProductHeader onAddClick={handleCreate} />

// Thành
<ProductHeader 
  onAddClick={canCreateProduct ? handleCreate : null} 
  canCreate={canCreateProduct}
/>
```

- [ ] **Step 4: Cập nhật ProductHeader để nhận prop canCreate**

Đọc file `ProductHeader.jsx` và thêm logic ẩn nút

- [ ] **Step 5: Commit**

```bash
git add RetailChainUi/src/pages/Product/ProductPage.jsx
git add RetailChainUi/src/pages/Product/components/ProductHeader/
git commit -m "feat: add permission check to ProductPage"
```

---

## Chunk 3: Cập nhật InventoryPage

### Task 3: Thêm kiểm tra quyền cho InventoryPage

**Files:**
- Modify: `RetailChainUi/src/pages/Inventory/InventoryPage.jsx`

- [ ] **Step 1: Đọc InventoryPage**

- [ ] **Step 2: Thêm import và kiểm tra quyền**

```jsx
import useAuth from "../../contexts/AuthContext/useAuth";

// Trong component
const { hasPermission } = useAuth();
const canImport = hasPermission('STOCKIN_CREATE');
const canExport = hasPermission('STOCKOUT_CREATE');
const canTransfer = hasPermission('INVENTORY_TRANSFER');
```

- [ ] **Step 3: Ẩn các nút thao tác cho STAFF**

- Ẩn nút "Nhập kho" nếu không có STOCKIN_CREATE
- Ẩn nút "Xuất kho" nếu không có STOCKOUT_CREATE
- Ẩn nút "Chuyển kho" nếu không có INVENTORY_TRANSFER

- [ ] **Step 4: Commit**

```bash
git add RetailChainUi/src/pages/Inventory/InventoryPage.jsx
git commit -m "feat: add permission check to InventoryPage"
```

---

## Chunk 4: Cập nhật StoreDashboardPage

### Task 4: Ẩn nút Edit cho STAFF trong StoreDashboardPage

**Files:**
- Modify: `RetailChainUi/src/pages/StoreDashboard/StoreDashboardPage.jsx`

- [ ] **Step 1: Đọc StoreDashboardPage**

- [ ] **Step 2: Thêm import và kiểm tra quyền**

```jsx
import useAuth from "../../contexts/AuthContext/useAuth";

// Trong component
const { hasPermission } = useAuth();
const canEditStore = hasPermission('STORE_UPDATE') || hasRole('SUPER_ADMIN') || hasRole('STORE_MANAGER');
```

- [ ] **Step 3: Ẩn nút Edit Store cho STAFF**

```jsx
{/* Thay đổi dòng 49-56 */}
{canEditStore && (
  <Button
    variant="outline"
    onClick={() => setIsEditModalOpen(true)}
  >
    <Edit className="w-4 h-4" />
    <span>Edit Store</span>
  </Button>
)}
```

- [ ] **Step 4: Commit**

```bash
git add RetailChainUi/src/pages/StoreDashboard/StoreDashboardPage.jsx
git commit -m "feat: hide Edit Store button for STAFF role"
```

---

## Chunk 5: Test và Verify

### Task 5: Build và verify

- [ ] **Step 1: Chạy build**

```bash
cd RetailChainUi && npm run build
```

Expected: Build thành công

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "fix: complete role-based UI improvements"
```

- [ ] **Step 3: Push to remote**

```bash
git push
```

---

## Tổng kết

| Task | Mô tả | Files |
|------|-------|-------|
| 1 | DashboardPage - hiển thị theo role | DashboardPage.jsx |
| 2 | ProductPage - ẩn nút tạo/sửa cho STAFF | ProductPage.jsx, ProductHeader.jsx |
| 3 | InventoryPage - ẩn nút thao tác cho STAFF | InventoryPage.jsx |
| 4 | StoreDashboardPage - ẩn nút Edit cho STAFF | StoreDashboardPage.jsx |
| 5 | Build và verify | - |

**Approach:** Sử dụng hasPermission() từ AuthContext để kiểm tra quyền và ẩn/hiện các thành phần UI tương ứng
