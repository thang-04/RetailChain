# Danh sách công việc: Checkin/Checkout Attendance

## Phase 1: Database & Backend Infrastructure

### 1.1 Database Schema
- [x] Thêm cột `status` vào bảng `attendance_logs`
- [x] Thêm cột `work_hours` vào bảng `attendance_logs`

### 1.2 Entity Layer
- [x] Cập nhật `AttendanceLog.java` - thêm fields: status, workHours

### 1.3 Repository Layer
- [x] Cập nhật `AttendanceLogRepository.java` - thêm các query methods:
  - [x] `findByUserIdAndOccurredAtBetween`
  - [x] `findByStoreIdAndOccurredAtBetween`
  - [x] `findByUserIdAndDate` (custom query cho history)
  - [x] `findLatestCheckinByUserIdAndDate` (tìm record IN gần nhất)
  - [x] `findUnclosedAttendanceByUserId` (tìm record chưa checkout)

### 1.4 DTOs
- [x] Tạo `AttendanceCheckinRequest.java`
- [x] Tạo `AttendanceCheckoutRequest.java`
- [x] Tạo `AttendanceCheckinResponse.java`
- [x] Tạo `AttendanceHistoryResponse.java` (cho mỗi ngày 1 row)
- [x] Tạo `AttendanceDashboardResponse.java`
- [x] Tạo `AttendanceEditRequest.java` (cho sửa thủ công)

## Phase 2: Backend Service Layer

### 2.1 Attendance Service Interface
- [x] Tạo `AttendanceService.java` - định nghĩa các method:
  - [x] `checkin(AttendanceCheckinRequest, UserDetails)`
  - [x] `checkout(AttendanceCheckoutRequest, UserDetails)`
  - [x] `getMyHistory(Long userId, LocalDate from, LocalDate to, int page, int limit)`
  - [x] `getHistoryByUser(Long userId, Long targetUserId, Long storeId)`
  - [x] `getStoreAttendance(Long storeId, LocalDate date, String status)`
  - [x] `getDashboard(Long storeId, LocalDate date)`
  - [x] `getAllDashboard(String region)`
  - [x] `editAttendance(Long id, AttendanceEditRequest, Long managerId)`
  - [x] `createManualAttendance(AttendanceManualRequest, Long managerId)`

### 2.2 Attendance Service Implementation
- [x] Tạo `AttendanceServiceImpl.java`
- [x] Implement Haversine formula cho GPS distance calculation
- [x] Implement logic checkin:
  - [x] Validate GPS config của store
  - [x] Validate khoảng cách (<= 50m)
  - [x] Validate store đang hoạt động
  - [x] Tìm ShiftAssignment của user trong ngày
  - [x] Check ngày nghỉ (không ca = reject)
  - [x] Auto-close phiên cũ nếu đã checkin
  - [x] Xác định status (ONTIME/LATE)
- [x] Implement logic checkout:
  - [x] Validate đã checkin chưa
  - [x] Validate khoảng cách GPS
  - [x] Tính workHours
  - [x] Xác định status (EARLY_LEAVE/giữ nguyên)
  - [x] Warning nếu workHours > 12h
- [x] Implement history với pagination
- [x] Implement dashboard metrics
- [x] Implement phân quyền (Staff/Manager/Admin)

### 2.3 Batch Job (Optional - Phase 2)
- [ ] Tạo `AttendanceCleanupTask.java` - chạy lúc 01:00 hàng ngày
- [ ] Auto-close các record chưa checkout qua ngày hôm trước

## Phase 3: Controller Layer

### 3.1 Attendance Controller
- [x] Tạo `AttendanceController.java`
- [x] Implement endpoints:
  - [x] `POST /api/attendance/checkin`
  - [x] `POST /api/attendance/checkout`
  - [x] `GET /api/attendance/my-history`
  - [x] `GET /api/attendance/user/{userId}` (Manager/Admin)
  - [x] `GET /api/attendance/store/{storeId}`
  - [x] `GET /api/attendance/dashboard/{storeId}`
  - [x] `GET /api/attendance/dashboard/all`
  - [x] `PUT /api/attendance/{id}/edit`
  - [x] `POST /api/attendance/manual` (thủ công)

### 3.2 Error Handling
- [ ] Thêm exception classes:
  - [ ] `AttendanceException.java`
  - [ ] `GpsValidationException.java`
- [ ] Cập nhật `GlobalException.java` - handle attendance exceptions

## Phase 4: Frontend Service

### 4.1 API Service
- [ ] Tạo `src/services/attendance.service.js`
- [ ] Implement methods:
  - [ ] `checkin(data)`
  - [ ] `checkout(data)`
  - [ ] `getMyHistory(params)`
  - [ ] `getStoreAttendance(storeId, params)`
  - [ ] `getDashboard(storeId, params)`
  - [ ] `editAttendance(id, data)`
  - [ ] `createManualAttendance(data)`

## Phase 5: Frontend UI

### 5.1 StaffAttendance Page - Updates
- [ ] Cập nhật `StaffAttendance.jsx`:
  - [ ] Thêm state cho checkin/checkout status
  - [ ] Thêm GPS location handling
  - [ ] Thêm Check-in button với GPS
  - [ ] Thêm Check-out button với GPS
  - [ ] Hiển thị current status (đã checkin chưa)
  - [ ] Connect với API lấy history

### 5.2 Components
- [ ] Tạo `CheckinButton.jsx` - button với GPS icon
- [ ] Tạo `CheckoutButton.jsx` - button với GPS icon
- [ ] Tạo `AttendanceStatusBadge.jsx` - hiển thị ONTIME/LATE/EARLY_LEAVE/FORGOT
- [ ] Tạo `AttendanceHistoryTable.jsx` - table với pagination
- [ ] Tạo `AttendanceDashboard.jsx` - KPI cards

### 5.3 GPS Integration
- [ ] Tạo `src/hooks/useGeolocation.js`:
  - [ ] Lấy GPS location
  - [ ] Validate accuracy
  - [ ] Handle errors (permission denied, timeout)

### 5.4 Permission Handling
- [ ] Ẩn/hiện Checkin/Checkout buttons theo role
- [ ] Ẩn/hiện Manager actions (edit, manual create)
- [ ] Ẩn/hiện Dashboard theo role

## Phase 6: Testing

### 6.1 Unit Tests
- [ ] Test Haversine distance calculation
- [ ] Test checkin logic (ONTIME, LATE cases)
- [ ] Test checkout logic (EARLY_LEAVE, workHours calculation)
- [ ] Test multi-shift handling
- [ ] Test phân quyền

### 6.2 Integration Tests
- [ ] Test API checkin với GPS
- [ ] Test API checkout với GPS
- [ ] Test API history với pagination
- [ ] Test API dashboard

### 6.3 Manual Testing
- [ ] Test checkin ngoài bán kính (50m+)
- [ ] Test checkin ngày nghỉ
- [ ] Test quên checkout + auto-close
- [ ] Test batch job

## Phase 7: Documentation & Deployment

### 7.1 Documentation
- [ ] Update API documentation
- [ ] Viết user guide cho Staff
- [ ] Viết hướng dẫn cho Manager

### 7.2 Deployment
- [ ] Chạy database migration
- [ ] Deploy backend
- [ ] Deploy frontend

---

## Task Dependencies

```
Phase 1 (DB & Entity)
    │
    ▼
Phase 2 (Service) ◄────┐
    │                   │
    ▼                   │
Phase 3 (Controller)───┼──► Phase 5 (Frontend)
    │                   │
    ▼                   │
Phase 4 (FE Service)───┘
    │
    ▼
Phase 6 (Testing)
    │
    ▼
Phase 7 (Docs & Deploy)
```

## Priority Order

1. **P0 - Critical**: Phase 1 (DB) → Phase 2 (checkin/checkout logic) → Phase 3 (Controller) → Phase 4-5 (Basic UI)
2. **P1 - Important**: Dashboard, History with pagination
3. **P2 - Nice to have**: Batch job, Export, Audit trail
