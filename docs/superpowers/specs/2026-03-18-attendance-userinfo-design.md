# Thiết kế: Cải thiện bảng Attendance - Thêm thông tin nhân viên

**Ngày:** 2026-03-18
**Tác giả:** AI Assistant
**Trạng thái:** Approved

## 1. Tổng quan

**Vấn đề:** Trang `/staff/attendance` (Dashboard Attendance cho Manager/Admin) hiện tại không hiển thị tên nhân viên và ca làm việc trong bảng attendance.

**Mục tiêu:** Thêm 2 cột mới vào bảng: "Nhân viên" và "Ca làm việc"

## 2. Thiết kế Backend

### 2.1. Sửa DTO - AttendanceHistoryResponse.java

**File:** `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/response/AttendanceHistoryResponse.java`

**Thêm 2 trường:**
```java
private Long userId;
private String userName;
// shiftName đã có sẵn trong DTO
```

### 2.2. Sửa Service - AttendanceServiceImpl.java

**File:** `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/AttendanceServiceImpl.java`

**Method:** `buildHistoryResponse(List<AttendanceLog> logs)`

**Logic thay đổi:**
- Mỗi `AttendanceLog` tạo **1 dòng riêng** (không nhóm theo ngày)
- Lấy `userName` từ `log.getUser().getFullName()`
- Lấy `shiftName` từ `log.getAssignment().getShift().getName()`
- Với check-in và check-out cùng ngày của same user -> vẫn là 1 dòng (cập nhật checkOutTime)

**Output JSON:**
```json
{
    "userId": 111,
    "userName": "Trần Văn Hùng",
    "shiftName": "Ca Test",
    "date": "2026-03-18",
    "checkInTime": "21:11",
    "checkOutTime": "21:15",
    "workHours": 0.07,
    "status": "LATE"
}
```

## 3. Thiết kế Frontend

### 3.1. Sửa StaffAttendance.jsx

**File:** `RetailChainUi/src/pages/Staff/Attendance/StaffAttendance.jsx`

**Thêm 2 cột vào bảng:**

| STT | Cột | Dữ liệu |
|-----|-----|----------|
| 1 | Nhân viên | `record.userName` |
| 2 | Ca làm việc | `record.shiftName` |
| 3 | Ngày | `formatDate(record.date)` |
| 4 | Check-in | `record.checkInTime` |
| 5 | Check-out | `record.checkOutTime` |
| 6 | Giờ làm | `record.workHours` |
| 7 | Trạng thái | Badge status |

**Thứ tự cột mới:** Nhân viên, Ca làm, Ngày, Check-in, Check-out, Giờ làm, Trạng thái

## 4. Danh sách files cần sửa

| STT | File | Thay đổi |
|-----|------|-----------|
| 1 | `AttendanceHistoryResponse.java` | Thêm userId, userName |
| 2 | `AttendanceServiceImpl.java` | Sửa buildHistoryResponse |
| 3 | `StaffAttendance.jsx` | Thêm 2 cột vào bảng |

## 5. Test cases

1. **Manager đăng nhập** -> Thấy bảng có tên nhân viên và ca làm việc
2. **Admin đăng nhập** -> Thấy bảng có tên nhân viên và ca làm việc
3. **Nhân viên checkout muộn** -> Hiển thị đúng trạng thái LATE
4. **Không có attendance** -> Hiển thị "Không có dữ liệu"
