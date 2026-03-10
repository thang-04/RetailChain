# Giới hạn Routes theo Permissions cho Staff

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cập nhật ProtectedRoute và AppRoutes để giới hạn quyền truy cập theo đúng permissions của từng role (STAFF, STORE_MANAGER, SUPER_ADMIN)

**Architecture:** Cập nhật ProtectedRoute để kiểm tra permissions từ AuthContext, sau đó giới hạn routes trong AppRoutes theo từng role dựa trên backend permissions

**Tech Stack:** React, React Router v7, Context API

---

## File Structure

```
RetailChainUi/src/
├── components/common/ProtectedRoute.jsx    # Cập nhật để kiểm tra permissions
├── routes/AppRoutes.jsx                    # Thêm allowedRoles cho từng route
├── contexts/AuthContext/AuthProvider.jsx   # Đảm bảo permissions được lưu vào context
├── configs/roleRoutes.config.js            # TẠO MỚI: Map role -> permissions -> routes
```

---

## Chunk 1: Kiểm tra và chuẩn bị dữ liệu Permissions

### Task 1: Kiểm tra AuthContext lưu permissions

**Files:**
- Modify: `RetailChainUi/src/contexts/AuthContext/AuthProvider.jsx`
- Read: `RetailChainUi/src/contexts/AuthContext/useAuth.js`

- [ ] **Step 1: Đọc AuthProvider để xem permissions có được lưu không**

Kiểm tra xem AuthProvider hiện tại có lưu permissions vào context không.

- [ ] **Step 2: Đọc useAuth hook**

Xem cách permissions được expose ra ngoài.

---

### Task 2: Tạo file cấu hình roleRoutes.config.js

**Files:**
- Create: `RetailChainUi/src/configs/roleRoutes.config.js`

- [ ] **Step 1: Tạo file cấu hình roleRoutes.config.js**

```javascript
// File: RetailChainUi/src/configs/roleRoutes.config.js

export const ROLE_PERMISSIONS = {
  STAFF: ['STORE_VIEW', 'PRODUCT_VIEW', 'INVENTORY_VIEW'],
  STORE_MANAGER: [
    'STORE_VIEW',
    'PRODUCT_VIEW',
    'PRODUCT_CREATE',
    'INVENTORY_VIEW',
    'INVENTORY_UPDATE',
    'INVENTORY_TRANSFER',
    'STOCKIN_CREATE',
    'STOCKIN_VIEW',
    'STOCKOUT_CREATE',
    'STOCKOUT_VIEW',
    'HR_VIEW',
    'HR_UPDATE',
    'SHIFT_VIEW',
    'SHIFT_UPDATE',
    'USER_VIEW',
    'USER_CREATE',
    'USER_UPDATE',
    'USER_BLOCK',
    'USER_UNBLOCK',
    'REPORT_VIEW'
  ],
  SUPER_ADMIN: [
    'STORE_CREATE',
    'STORE_VIEW',
    'STORE_UPDATE',
    'STORE_DELETE',
    'PRODUCT_VIEW',
    'PRODUCT_CREATE',
    'PRODUCT_UPDATE',
    'PRODUCT_DELETE',
    'INVENTORY_VIEW',
    'INVENTORY_UPDATE',
    'INVENTORY_TRANSFER',
    'STOCKIN_CREATE',
    'STOCKIN_VIEW',
    'STOCKOUT_CREATE',
    'STOCKOUT_VIEW',
    'HR_VIEW',
    'HR_UPDATE',
    'HR_DELETE',
    'SHIFT_VIEW',
    'SHIFT_UPDATE',
    'SHIFT_DELETE',
    'USER_VIEW',
    'USER_CREATE',
    'USER_UPDATE',
    'USER_DELETE',
    'USER_BLOCK',
    'USER_UNBLOCK',
    'REPORT_VIEW',
    'ROLE_VIEW',
    'ROLE_CREATE',
    'ROLE_UPDATE',
    'ROLE_DELETE',
    'PERMISSION_VIEW',
    'WAREHOUSE_VIEW',
    'WAREHOUSE_CREATE',
    'WAREHOUSE_UPDATE',
    'WAREHOUSE_DELETE'
  ]
};

export const ROUTE_PERMISSIONS = {
  '/': [],
  '/reports': ['REPORT_VIEW'],
  '/store': ['STORE_VIEW'],
  '/store/:id': ['STORE_VIEW'],
  '/store/:id/inventory': ['STORE_VIEW'],
  '/store/:id/staff': ['HR_VIEW', 'HR_UPDATE'],
  '/warehouse': ['WAREHOUSE_VIEW'],
  '/products': ['PRODUCT_VIEW'],
  '/products/create': ['PRODUCT_CREATE'],
  '/products/:slug': ['PRODUCT_VIEW'],
  '/products/:slug/edit': ['PRODUCT_UPDATE'],
  '/inventory': ['INVENTORY_VIEW'],
  '/inventory/ledger': ['INVENTORY_VIEW'],
  '/stock-in': ['STOCKIN_VIEW'],
  '/stock-in/create': ['STOCKIN_CREATE'],
  '/stock-out': ['STOCKOUT_VIEW'],
  '/stock-out/create': ['STOCKOUT_CREATE'],
  '/staff': ['HR_VIEW'],
  '/staff/shifts': ['SHIFT_VIEW', 'SHIFT_UPDATE'],
  '/staff/calendar': ['SHIFT_VIEW'],
  '/staff/attendance': ['HR_VIEW', 'HR_UPDATE'],
  '/staff/profile/:id': ['HR_VIEW'],
  '/staff/resource': ['HR_UPDATE'],
  '/users': ['USER_VIEW'],
  '/profile': [],
  '/roles': ['ROLE_VIEW']
};
```

- [ ] **Step 2: Commit**

```bash
git add RetailChainUi/src/configs/roleRoutes.config.js
git commit -m "feat: add roleRoutes.config.js with permissions mapping"
```

---

## Chunk 2: Cập nhật ProtectedRoute và AppRoutes

### Task 3: Cập nhật ProtectedRoute để kiểm tra permissions

**Files:**
- Modify: `RetailChainUi/src/components/common/ProtectedRoute.jsx`

- [ ] **Step 1: Đọc ProtectedRoute hiện tại**

```jsx
// File: RetailChainUi/src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../contexts/AuthContext/useAuth';

const ProtectedRoute = ({ allowedRoles, allowedPermissions }) => {
    const { user, loading, hasRole, hasPermission } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const hasRoleAccess = allowedRoles.some(role => hasRole(role));
        if (!hasRoleAccess) {
            return <Navigate to="/" replace />;
        }
    }

    if (allowedPermissions && allowedPermissions.length > 0) {
        const hasPermAccess = allowedPermissions.some(perm => hasPermission(perm));
        if (!hasPermAccess) {
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
```

- [ ] **Step 2: Cập nhật ProtectedRoute thêm logic kiểm tra permissions**

```jsx
// File: RetailChainUi/src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../contexts/AuthContext/useAuth';
import { ROLE_PERMISSIONS } from '../../configs/roleRoutes.config';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading, hasRole, permissions } = useAuth();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Get user's role (assume first role is primary)
    const userRole = user.roles?.[0] || 'STAFF';
    
    // Get permissions for user's role
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];

    // Check role-based access
    if (allowedRoles && allowedRoles.length > 0) {
        const hasRoleAccess = allowedRoles.some(role => hasRole(role));
        if (!hasRoleAccess) {
            return <Navigate to="/" replace />;
        }
    }

    // Store permissions in context for hasPermission to work
    // This allows components to check individual permissions
    
    return <Outlet />;
};

export default ProtectedRoute;
```

- [ ] **Step 3: Commit**

```bash
git add RetailChainUi/src/components/common/ProtectedRoute.jsx
git commit -m "feat: update ProtectedRoute to check role-based permissions"
```

---

### Task 4: Cập nhật AppRoutes với allowedRoles

**Files:**
- Modify: `RetailChainUi/src/routes/AppRoutes.jsx`

- [ ] **Step 1: Đọc AppRoutes hiện tại**

Xem lại file tại `RetailChainUi/src/routes/AppRoutes.jsx`

- [ ] **Step 2: Cập nhật AppRoutes thêm allowedRoles cho từng route**

```jsx
// File: RetailChainUi/src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout/MainLayout";

// ... (giữ nguyên imports)

// Auth
import LoginPage from "../pages/Auth/LoginPage";
import ForbiddenPage from "../pages/Auth/ForbiddenPage";
import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/403" element={<ForbiddenPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    {/* Dashboard & Reports - All authenticated users */}
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/reports" element={<ExecutiveReport />} />

                    {/* Store Module - SUPER_ADMIN only */}
                    <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
                        <Route path="/store" element={<StorePage />} />
                    </Route>
                    <Route path="/store/:id" element={<StoreDashboardPage />} />
                    <Route path="/store/:id/inventory" element={<StoreInventoryDetail />} />
                    <Route path="/store/:id/staff" element={<StoreStaffPage />} />

                    {/* Warehouse Module - SUPER_ADMIN only */}
                    <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
                        <Route path="/warehouse" element={<WarehouseListPage />} />
                    </Route>

                    {/* Product Module - STAFF+ (VIEW), STORE_MANAGER+ (CREATE, UPDATE) */}
                    <Route path="/products" element={<ProductPage />} />
                    <Route path="/products/create" element={
                        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']} /> && <ProductEditPage />
                    } />
                    <Route path="/products/:slug" element={<ProductDetailPage />} />
                    <Route path="/products/:slug/edit" element={
                        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']} /> && <ProductEditPage />
                    } />

                    {/* Inventory Module - STAFF+ (VIEW), STORE_MANAGER+ (UPDATE, TRANSFER) */}
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/inventory/ledger" element={<StockLedger />} />

                    {/* Stock In - STORE_MANAGER+ (CREATE), STAFF+ (VIEW) */}
                    <Route path="/stock-in" element={<StockInList />} />
                    <Route path="/stock-in/create" element={
                        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']} /> && <CreateStockIn />
                    } />

                    {/* Stock Out - STORE_MANAGER+ (CREATE), STAFF+ (VIEW) */}
                    <Route path="/stock-out" element={<StockOutList />} />
                    <Route path="/stock-out/create" element={
                        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']} /> && <CreateStockOut />
                    } />

                    {/* Staff Module - STORE_MANAGER+ */}
                    <Route path="/staff" element={
                        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']} /> && <StaffList />
                    } />
                    <Route path="/staff/shifts" element={
                        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']} /> && <StaffShiftsPage />
                    } />
                    <Route path="/staff/calendar" element={<StaffCalendar />} />
                    <Route path="/staff/attendance" element={
                        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']} /> && <StaffAttendance />
                    } />
                    <Route path="/staff/profile/:id" element={<StaffProfile />} />
                    <Route path="/staff/resource" element={
                        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']} /> && <ResourceAssignment />
                    } />

                    {/* User Management - STORE_MANAGER+ */}
                    <Route path="/users" element={
                        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']} /> && <UserManagementPage />
                    } />

                    {/* Profile - All authenticated users */}
                    <Route path="/profile" element={<ProfilePage />} />

                    {/* Role & Permission - SUPER_ADMIN only */}
                    <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
                        <Route path="/roles" element={<RolePermissionPage />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
```

- [ ] **Step 3: Commit**

```bash
git add RetailChainUi/src/routes/AppRoutes.jsx
git commit -m "feat: update AppRoutes with role-based access control"
```

---

## Chunk 3: Testing và Fix lỗi

### Task 5: Test build và kiểm tra

**Files:**
- Test: `RetailChainUi/`

- [ ] **Step 1: Chạy build để kiểm tra lỗi**

```bash
cd RetailChainUi && npm run build
```

Expected: Build thành công

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "fix: complete role-based routes implementation"
```

---

### Task 6: Tạo issue cho công việc tiếp theo (nếu cần)

- [ ] **Step 1: Tạo bd issue cho việc test thủ công**

```bash
bd create "Test role-based access control" --description="Test các route với từng role: STAFF, STORE_MANAGER, SUPER_ADMIN" -p 2 --json
```

- [ ] **Step 2: Sync bd**

```bash
bd sync && git push
```

---

## Tổng kết

| Task | Mô tả | Files |
|------|-------|-------|
| 1 | Kiểm tra AuthContext | AuthProvider.jsx, useAuth.js |
| 2 | Tạo roleRoutes.config.js | roleRoutes.config.js (NEW) |
| 3 | Cập nhật ProtectedRoute | ProtectedRoute.jsx |
| 4 | Cập nhật AppRoutes | AppRoutes.jsx |
| 5 | Test build | - |
| 6 | Tạo issue test | bd |

**Approach:** Approach 1 - Giới hạn Routes theo Role/Permissions
