# Attendance Permission Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hiển thị đúng menu attendance cho từng role (Staff, Store Manager, Super Admin)

**Architecture:** Sửa Sidebar.jsx để hiển thị menu và StaffAttendance.jsx để phân biệt role khi gọi API dashboard

**Tech Stack:** React, JavaScript, shadcn/ui components

---

## Task 1: Sửa Sidebar Menu

**Files:**
- Modify: `RetailChainUi/src/components/layout/Sidebar/Sidebar.jsx`

### Steps:

- [ ] **Step 1: Đọc file Sidebar.jsx**

```bash
Read: RetailChainUi/src/components/layout/Sidebar/Sidebar.jsx
```

- [ ] **Step 2: Sửa menu "Chấm công" - bật hiển thị cho tất cả role**

Tìm menu item với `path: "/attendance"` và thay đổi:
```javascript
{
  path: "/attendance",
  label: "Chấm công",
  icon: "access_time",
  show: isStaff() || isStoreManager() || isSuperAdmin(),  // Thay đổi từ false
},
```

- [ ] **Step 3: Commit changes**

```bash
git add RetailChainUi/src/components/layout/Sidebar/Sidebar.jsx
git commit -m "fix: show attendance menu for all authenticated roles"
```

---

## Task 2: Sửa StaffAttendance.jsx

**Files:**
- Modify: `RetailChainUi/src/pages/Staff/Attendance/StaffAttendance.jsx`

### Steps:

- [ ] **Step 1: Thêm imports cần thiết**

Thêm vào đầu file:
```javascript
import storeService from '@/services/store.service';
```

- [ ] **Step 2: Thêm state cho Super Admin**

Sau dòng `const [statusFilter, setStatusFilter] = useState('all');`, thêm:
```javascript
const [selectedStoreId, setSelectedStoreId] = useState(null);
const [stores, setStores] = useState([]);
```

- [ ] **Step 3: Thêm useEffect để load stores cho Super Admin**

Thêm sau `useEffect` hiện tại:
```javascript
useEffect(() => {
  if (isSuperAdmin()) {
    storeService.getAllStores()
      .then(data => setStores(data))
      .catch(err => console.error('Failed to load stores:', err));
  }
}, [isSuperAdmin]);
```

- [ ] **Step 4: Sửa fetchDashboard callback để xử lý Super Admin**

Thay đổi logic trong `fetchDashboard`:
```javascript
const fetchDashboard = useCallback(async () => {
  // Store Manager: bắt buộc có storeId
  if (!user?.storeId && !isSuperAdmin()) return;
  
  try {
    setLoading(true);
    let dashRes, listRes;
    
    if (isSuperAdmin() && !selectedStoreId) {
      // Super Admin chưa chọn cửa hàng → lấy dashboard tất cả
      dashRes = await attendanceService.getAllDashboard();
      listRes = { code: 200, data: [] }; // Placeholder
    } else {
      // Store Manager hoặc Super Admin đã chọn cửa hàng cụ thể
      const targetStoreId = isSuperAdmin() ? selectedStoreId : user.storeId;
      [dashRes, listRes] = await Promise.all([
        attendanceService.getDashboard(targetStoreId, selectedDate),
        attendanceService.getStoreAttendance(targetStoreId, selectedDate, statusFilter === 'all' ? '' : statusFilter)
      ]);
    }
    
    if (dashRes.code === 200) {
      setDashboard(dashRes.data);
    }
    if (listRes.code === 200) {
      setAttendanceList(listRes.data || []);
    }
  } catch (error) {
    console.error('Failed to fetch attendance:', error);
    toast.error('Không tải được dữ liệu chấm công');
  } finally {
    setLoading(false);
  }
}, [user, selectedDate, statusFilter, isSuperAdmin, selectedStoreId]);
```

- [ ] **Step 5: Thêm UI dropdown cho Super Admin**

Tìm phần Header và thêm Select dropdown sau phần `div.flex.gap-2`:

```javascript
{isSuperAdmin() && (
  <Select 
    value={selectedStoreId || 'all'} 
    onValueChange={(val) => setSelectedStoreId(val === 'all' ? null : val)}
  >
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder="Chọn cửa hàng" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Tất cả cửa hàng</SelectItem>
      {stores.map(store => (
        <SelectItem key={store.id} value={store.dbId}>
          {store.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)}

{isStoreManager() && user?.storeId && (
  <div className="text-sm text-muted-foreground">
    Cửa hàng: {stores.find(s => s.dbId === user.storeId)?.name || 'Đang tải...'}
  </div>
)}
```

- [ ] **Step 6: Import thêm useAuth functions**

Đảm bảo `useAuth` trả về `isSuperAdmin`, `isStoreManager`, `isStaff`:
```javascript
const { user, isSuperAdmin, isStoreManager, isStaff } = useAuth();
```

- [ ] **Step 7: Commit changes**

```bash
git add RetailChainUi/src/pages/Staff/Attendance/StaffAttendance.jsx
git commit -m "feat: add role-based attendance dashboard for super admin"
```

---

## Task 3: Testing

**Files:**
- Manual testing in browser

### Steps:

- [ ] **Step 1: Test với Staff account**

1. Login với Staff account
2. Kiểm tra Sidebar: Thấy menu "Chấm công", KHÔNG thấy "Dashboard Chấm công"
3. Click "Chấm công" → Vào trang checkin/checkout

- [ ] **Step 2: Test với Store Manager account**

1. Login với Store Manager account
2. Kiểm tra Sidebar: Thấy cả "Chấm công" và "Dashboard Chấm công"
3. Click "Dashboard Chấm công" → Kiểm tra hiển thị đúng cửa hàng mình quản lý

- [ ] **Step 3: Test với Super Admin account**

1. Login với Super Admin account
2. Kiểm tra Sidebar: Thấy cả 2 menu
3. Click "Dashboard Chấm công" → Kiểm tra dropdown chọn cửa hàng
4. Chọn "Tất cả cửa hàng" → Hiển thị tổng hợp
5. Chọn 1 cửa hàng cụ thể → Hiển thị dashboard cửa hàng đó

---

## Summary

| Task | Files | Description |
|------|-------|-------------|
| 1 | Sidebar.jsx | Bật hiển thị menu attendance |
| 2 | StaffAttendance.jsx | Thêm role detection + store dropdown |
| 3 | Manual test | Test 3 role accounts |

**Total estimated time:** 15-20 minutes
