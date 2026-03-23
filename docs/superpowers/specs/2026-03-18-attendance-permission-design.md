# Design: Phân quyền menu Attendance & Dashboard

**Created:** 2026-03-18  
**Status:** Approved  
**Target:** Frontend (RetailChainUi)

---

## 1. Mục tiêu

Hiển thị đúng menu attendance cho từng role:
- **Staff**: Thấy menu checkin/checkout cá nhân
- **Store Manager**: Thấy menu checkin/checkout + dashboard cửa hàng mình quản lý
- **Super Admin**: Thấy menu checkin/checkout + dashboard tất cả cửa hàng (với dropdown chọn)

---

## 2. Current Issues

| Vấn đề | File | Dòng |
|---------|------|------|
| Menu `/attendance` bị ẩn hoàn toàn | Sidebar.jsx | 63-67 |
| Store Manager & Super Admin dùng chung logic | StaffAttendance.jsx | 24 |
| Super Admin không có storeId nên lỗi | StaffAttendance.jsx | 24 |

---

## 3. Sidebar Changes

### 3.1 Menu Check-in/Check-out cá nhân

```javascript
{
  path: "/attendance",
  label: "Chấm công",
  icon: "access_time",
  show: isStaff() || isStoreManager() || isSuperAdmin(),
},
```

**Trước:** `show: false`  
**Sau:** Hiển thị cho tất cả role

### 3.2 Menu Dashboard Chấm công

```javascript
{
  path: "/staff/attendance", 
  label: "Dashboard Chấm công",
  icon: "fact_check",
  show: isStoreManager() || isSuperAdmin(),
},
```

**Trước:** `show: isSuperAdmin() || isStoreManager()` (đã đúng)  
**Sau:** Giữ nguyên

---

## 4. StaffAttendance.jsx Changes

### 4.1 Role Detection

```javascript
const { user, isSuperAdmin, isStoreManager, isStaff } = useAuth();
```

### 4.2 State cho Super Admin

```javascript
const [selectedStoreId, setSelectedStoreId] = useState(null);
const [stores, setStores] = useState([]);
const [allStoresData, setAllStoresData] = useState(null); // Cho getAllDashboard
```

### 4.3 Load Stores (Super Admin only)

```javascript
useEffect(() => {
  if (isSuperAdmin()) {
    storeService.getAllStores().then(data => {
      setStores(data);
    });
  }
}, [isSuperAdmin]);
```

### 4.4 API Call Logic

```javascript
const fetchDashboard = useCallback(async () => {
  if (!storeId && !isSuperAdmin()) return;
  
  try {
    setLoading(true);
    let dashRes, listRes;
    
    if (isSuperAdmin() && !selectedStoreId) {
      // Super Admin chưa chọn cửa hàng → lấy tất cả
      dashRes = await attendanceService.getAllDashboard();
      // TODO: Cần backend API cho getAllStoreAttendance()
      listRes = { code: 200, data: [] };
    } else {
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
}, [storeId, selectedDate, statusFilter, isSuperAdmin, selectedStoreId, user]);
```

### 4.5 UI - Store Selector cho Super Admin

```javascript
{isSuperAdmin() && (
  <div className="flex items-center gap-2">
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
  </div>
)}

{isStoreManager() && (
  <div className="text-sm text-muted-foreground">
    Cửa hàng: {user?.storeName || 'Đang tải...'}
  </div>
)}
```

---

## 5. API Dependencies

| API | Status | Notes |
|-----|--------|-------|
| `GET /stores` | ✅ Có sẵn | `storeService.getAllStores()` |
| `GET /attendance/dashboard/{storeId}` | ✅ Có sẵn | Store-specific dashboard |
| `GET /attendance/dashboard/all` | ✅ Có sẵn | Tổng hợp tất cả store |
| `GET /attendance/store/{storeId}` | ✅ Có sẵn | Attendance list per store |

---

## 6. Permission Matrix

| Role | /attendance (Checkin/Checkout) | /staff/attendance (Dashboard) | Dashboard Scope |
|------|-------------------------------|------------------------------|-----------------|
| **STAFF** | ✅ Hiển thị | ❌ Không thấy | - |
| **STORE_MANAGER** | ✅ Hiển thị | ✅ Hiển thị | Cửa hàng mình (disabled dropdown) |
| **SUPER_ADMIN** | ✅ Hiển thị | ✅ Hiển thị | Tất cả + dropdown chọn |

---

## 7. Files Changed

| File | Changes |
|------|---------|
| `src/components/layout/Sidebar/Sidebar.jsx` | Sửa `show` conditions cho 2 menu items |
| `src/pages/Staff/Attendance/StaffAttendance.jsx` | Thêm role detection, store dropdown, API routing |
| `src/services/attendance.service.js` | Không cần thay đổi (đã có methods) |

---

## 8. Testing Checklist

- [ ] Staff login → Thấy menu "Chấm công", KHÔNG thấy "Dashboard Chấm công"
- [ ] Store Manager login → Thấy cả 2 menu, Dashboard chỉ hiện cửa hàng mình
- [ ] Super Admin login → Thấy cả 2 menu, Dashboard có dropdown chọn cửa hàng
- [ ] Super Admin chọn "Tất cả cửa hàng" → Hiển thị tổng hợp
- [ ] Super Admin chọn 1 cửa hàng cụ thể → Hiển thị dashboard cửa hàng đó
