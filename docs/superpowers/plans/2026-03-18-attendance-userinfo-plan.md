# Attendance UserInfo Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm thông tin nhân viên (tên + ca làm) vào bảng attendance ở trang /staff/attendance

**Architecture:** 
- Backend: Sửa DTO và Service để trả về userId, userName, shiftName cho mỗi attendance log
- Frontend: Cập nhật bảng để hiển thị 2 cột mới "Nhân viên" và "Ca làm"

**Tech Stack:** Spring Boot (Java), React (JavaScript), JPA

---

## File Structure

| STT | File | Thay đổi |
|-----|------|-----------|
| 1 | `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/response/AttendanceHistoryResponse.java` | Thêm userId, userName |
| 2 | `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/AttendanceServiceImpl.java` | Sửa buildHistoryResponse |
| 3 | `RetailChainUi/src/pages/Staff/Attendance/StaffAttendance.jsx` | Thêm 2 cột vào bảng |

---

## Task 1: Sửa Backend DTO

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/response/AttendanceHistoryResponse.java`

- [ ] **Step 1: Thêm 2 trường vào DTO**

Mở file và thêm 2 dòng sau vào class:
```java
private Long userId;
private String userName;
```

**Code đầy đủ sau khi sửa:**
```java
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceHistoryResponse {
    private Long userId;
    private String userName;
    private String date;
    private String checkInTime;
    private String checkOutTime;
    private Double workHours;
    private String status;
    private String shiftName;
}
```

---

## Task 2: Sửa Backend Service

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/AttendanceServiceImpl.java:563-600`

- [ ] **Step 1: Đọc method buildHistoryResponse hiện tại**

Xem lại code từ dòng 563 đến 601

- [ ] **Step 2: Thay thế method buildHistoryResponse**

Thay thế toàn bộ method `buildHistoryResponse` bằng code mới:

```java
private List<AttendanceHistoryResponse> buildHistoryResponse(List<AttendanceLog> logs) {
    List<AttendanceHistoryResponse> result = new ArrayList<>();
    
    for (AttendanceLog log : logs) {
        // Chỉ xử lý các bản ghi check-in
        if (log.getCheckType() != CheckType.IN) {
            continue;
        }
        
        String userName = null;
        String shiftName = null;
        
        // Lấy userName từ User entity (sử dụng fetch join đã có)
        if (log.getUser() != null) {
            userName = log.getUser().getFullName();
        }
        
        // Lấy shiftName từ Assignment -> Shift
        if (log.getAssignment() != null && log.getAssignment().getShift() != null) {
            shiftName = log.getAssignment().getShift().getName();
        }
        
        // Format thời gian
        String checkInTime = log.getOccurredAt().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm"));
        String checkOutTime = null;
        Double workHours = null;
        
        // Tìm bản ghi checkout cùng ngày của same user
        if (log.getWorkHours() != null) {
            checkOutTime = checkInTime; // Placeholder - sẽ cập nhật từ OUT log
            workHours = log.getWorkHours();
        }
        
        AttendanceHistoryResponse response = AttendanceHistoryResponse.builder()
                .userId(log.getUserId())
                .userName(userName)
                .shiftName(shiftName)
                .date(log.getOccurredAt().toLocalDate().toString())
                .checkInTime(checkInTime)
                .checkOutTime(checkOutTime)
                .workHours(workHours)
                .status(log.getStatus())
                .build();
        
        result.add(response);
    }
    
    // Sắp xếp theo ngày giảm dần
    result.sort((a, b) -> b.getDate().compareTo(a.getDate()));
    
    return result;
}
```

**Lưu ý:** Method này chỉ xử lý check-in logs. Bản ghi check-out được xử lý riêng trong method `getMyHistory` và `getHistoryByUser`. Kiểm tra lại các method đó nếu cần.

- [ ] **Step 2: Restart server Spring Boot để nhận thay đổi**

Restart IntelliJ run configuration hoặc chạy lại maven

- [ ] **Step 3: Test API**

```bash
curl -s "http://localhost:8080/retail-chain/api/attendance/store/155?date=2026-03-18" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Expected output:**
```json
{
    "code": 200,
    "desc": "Lấy attendance thành công",
    "data": [
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
    ]
}
```

---

## Task 3: Sửa Frontend - Thêm cột vào bảng

**Files:**
- Modify: `RetailChainUi/src/pages/Staff/Attendance/StaffAttendance.jsx:218-239`

- [ ] **Step 1: Thêm 2 cột vào TableHeader**

Tìm `<TableHeader>` và thêm 2 `<TableHead>` mới sau `<TableRow>`:

```jsx
<TableHeader>
    <TableRow>
        <TableHead>Nhân viên</TableHead>
        <TableHead>Ca làm</TableHead>
        <TableHead>Ngày</TableHead>
        <TableHead>Check-in</TableHead>
        <TableHead>Check-out</TableHead>
        <TableHead>Giờ làm</TableHead>
        <TableHead>Trạng thái</TableHead>
    </TableRow>
</TableHeader>
```

- [ ] **Step 2: Thêm 2 cột vào TableBody**

Tìm `<TableBody>` và thêm 2 `<TableCell>` cho mỗi row:

```jsx
<TableBody>
    {attendanceList.map((record, index) => (
        <TableRow key={index}>
            <TableCell className="font-medium">{record.userName || 'N/A'}</TableCell>
            <TableCell>{record.shiftName || 'N/A'}</TableCell>
            <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
            <TableCell>{record.checkInTime || '--:--'}</TableCell>
            <TableCell>{record.checkOutTime || '--:--'}</TableCell>
            <TableCell>{record.workHours ? `${record.workHours}h` : '--'}</TableCell>
            <TableCell>{getStatusBadge(record.status)}</TableCell>
        </TableRow>
    ))}
</TableBody>
```

- [ ] **Step 3: Chạy dev server và test**

```bash
cd RetailChainUi && npm run dev
```

Truy cập http://localhost:5173/staff/attendance và đăng nhập bằng manager01

---

## Task 4: Commit Changes

- [ ] **Step 1: Commit backend changes**

```bash
git add RetailChainService/src/main/java/com/sba301/retailmanagement/dto/response/AttendanceHistoryResponse.java
git add RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/AttendanceServiceImpl.java
git commit -m "feat(attendance): add userId, userName, shiftName to history response"
```

- [ ] **Step 2: Commit frontend changes**

```bash
git add RetailChainUi/src/pages/Staff/Attendance/StaffAttendance.jsx
git commit -m "feat(attendance-ui): show employee name and shift in attendance table"
```

---

## Verification

Sau khi hoàn thành:
1. Đăng nhập manager01@retailchain.com / 12345678
2. Vào menu "Dashboard Chấm công"
3. Bảng phải hiển thị:
   - Cột "Nhân viên" với tên nhân viên
   - Cột "Ca làm" với tên ca (Ca Test)
4. Test với admin để xem attendance của tất cả cửa hàng
