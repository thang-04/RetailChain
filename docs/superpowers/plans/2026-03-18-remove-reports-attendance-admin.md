# Remove Reports and Attendance from System Admin Interface

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ẩn menu Reports và Attendance (Chấm công) khỏi Sidebar của System Admin (SUPER_ADMIN)

**Architecture:** Chỉ cần sửa điều kiện hiển thị (show) trong mảng menuItems của Sidebar component. Không cần sửa routes vì routes đã được bảo vệ bởi ProtectedRoute.

**Tech Stack:** React, Tailwind CSS, React Router DOM v7

---

## File Structure

| File | Responsibility |
|------|----------------|
| `RetailChainUi/src/components/layout/Sidebar/Sidebar.jsx` | Định nghĩa menu items - cần sửa điều kiện `show` |

---

## Task 1: Ẩn Reports khỏi Sidebar cho SUPER_ADMIN

**Files:**
- Modify: `RetailChainUi/src/components/layout/Sidebar/Sidebar.jsx:49-54`

- [ ] **Step 1: Sửa điều kiện hiển thị của Reports**

Mở file `RetailChainUi/src/components/layout/Sidebar/Sidebar.jsx`, tìm đến dòng 49-54:

```javascript
// Code hiện tại (dòng 49-54):
{
  path: "/reports",
  label: "Reports",
  icon: "bar_chart",
  show: hasPermission('REPORT_SYSTEM_VIEW') || hasPermission('REPORT_STORE_VIEW') || isStoreManager(),
},
```

Thay thế bằng:

```javascript
{
  path: "/reports",
  label: "Reports",
  icon: "bar_chart",
  show: false, // Ẩn hoàn toàn khỏi System Admin
},
```

- [ ] **Step 2: Commit thay đổi**

```bash
git add RetailChainUi/src/components/layout/Sidebar/Sidebar.jsx
git commit -m "chore: hide Reports menu from System Admin"
```

---

## Task 2: Ẩn Chấm công khỏi Sidebar cho SUPER_ADMIN (giữ lại Attendance Dashboard)

**Files:**
- Modify: `RetailChainUi/src/components/layout/Sidebar/Sidebar.jsx:62-67`

- [ ] **Step 1: Sửa điều kiện hiển thị của Chấm công**

Mở file `RetailChainUi/src/components/layout/Sidebar/Sidebar.jsx`, tìm đến dòng 62-67:

```javascript
// Code hiện tại (dòng 62-67):
{
  path: "/attendance",
  label: "Chấm công",
  icon: "access_time",
  show: true, // All authenticated users
},
```

Thay thế bằng:

```javascript
{
  path: "/attendance",
  label: "Chấm công",
  icon: "access_time",
  show: false, // Ẩn hoàn toàn khỏi System Admin
},
```

**Giữ nguyên Attendance Dashboard (dòng 68-73):**
```javascript
{
  path: "/staff/attendance",
  label: "Attendance Dashboard",
  icon: "fact_check",
  show: isSuperAdmin() || isStoreManager(),
},
```

- [ ] **Step 2: Commit thay đổi**

```bash
git add RetailChainUi/src/components/layout/Sidebar/Sidebar.jsx
git commit -m "chore: hide Chấm công menu from System Admin"
```

---

## Verification

- [ ] Chạy `npm run dev` trong thư mục `RetailChainUi`
- [ ] Đăng nhập bằng tài khoản admin (admin/admin123)
- [ ] Xác nhận sidebar KHÔNG còn hiển thị:
  - ❌ Reports
  - ❌ Chấm công
- [ ] Các menu sau vẫn hiển thị:
  - ✅ Dashboard
  - ✅ Stores
  - ✅ Products
  - ✅ Inventory
  - ✅ Stock In
  - ✅ Stock Out
  - ✅ Staff Shifts
  - ✅ Attendance Dashboard (vẫn giữ)
  - ✅ Roles & Permissions
  - ✅ User Management

---

## Summary

| Menu Item | Action | Dòng trong Sidebar.jsx |
|-----------|--------|------------------------|
| Reports | Ẩn (`show: false`) | 53 |
| Chấm công | Ẩn (`show: false`) | 66 |
| Attendance Dashboard | Giữ nguyên | 72 |

**Lưu ý:** Routes vẫn tồn tại trong `AppRoutes.jsx` nhưng không hiển thị trong menu. Nếu muốn chặn hoàn toàn truy cập, có thể thêm redirect trong ProtectedRoute hoặc xóa routes tương ứng.
