# Thiết kế kỹ thuật: Checkin/Checkout Attendance

## 1. Database Schema

### 1.1 Thay đổi bảng attendance_logs

```sql
ALTER TABLE attendance_logs 
ADD COLUMN status VARCHAR(20) NULL COMMENT 'ONTIME, LATE, EARLY_LEAVE, FORGOT',
ADD COLUMN work_hours DECIMAL(4,2) NULL COMMENT 'Số giờ làm việc thực tế';
```

### 1.2 Cập nhật Entity AttendanceLog

```java
@Entity
@Table(name = "attendance_logs")
public class AttendanceLog {
    // ... existing fields ...
    
    @Column(name = "status", length = 20)
    private String status; // ONTIME, LATE, EARLY_LEAVE, FORGOT
    
    @Column(name = "work_hours", precision = 4, scale = 2)
    private Double workHours;
}
```

## 2. API Design

### 2.1 Endpoints

| Method | Endpoint | Mô tả | Phân quyền |
|--------|----------|--------|------------|
| POST | `/api/attendance/checkin` | Checkin với GPS | Staff, Manager |
| POST | `/api/attendance/checkout` | Checkout với GPS | Staff, Manager |
| GET | `/api/attendance/my-history` | Lịch sử checkin của user hiện tại | Staff, Manager |
| GET | `/api/attendance/store/{storeId}` | Attendance của store theo ngày | Manager, Admin |
| GET | `/api/attendance/dashboard/{storeId}` | Dashboard attendance | Manager, Admin |
| PUT | `/api/attendance/{id}/edit` | Sửa thủ công attendance | Manager |

### 2.2 Request/Response DTOs

#### Checkin Request
```json
{
  "latitude": 10.7769,
  "longitude": 106.7,
  "note": "Optional"
}
```

#### Checkin Response
```json
{
  "id": 1,
  "userId": 111,
  "userName": "Trần Văn Hùng",
  "storeId": 155,
  "checkType": "IN",
  "status": "LATE",
  "occurredAt": "2024-01-25T08:15:00",
  "distanceMeters": 25.5,
  "message": "Checkin thành công. Bạn đến muộn 10 phút so với giờ bắt đầu ca."
}
```

#### Attendance History Item
```json
{
  "id": 1,
  "date": "2024-01-25",
  "checkInTime": "08:00",
  "checkOutTime": "17:05",
  "workHours": 8.08,
  "status": "ONTIME",
  "shiftName": "Ca Sáng"
}
```

## 3. Business Logic

### 3.1 Checkin Flow

```
User clicks Checkin
       │
       ▼
Browser gets GPS location (navigator.geolocation)
       │
       ▼
POST /api/attendance/checkin
       │
       ├──► Validate: Store có GPS coordinates?
       │         └── Nếu không → Error: "Cửa hàng chưa được cấu hình GPS"
       │
       ├──► Calculate distance (Haversine formula)
       │         └── Nếu distance > store.radius_meters → Reject
       │
       ├──► Find today's ShiftAssignment cho user
       │         └── Nếu không có → Warning nhưng vẫn cho checkin
       │
       ├──► Check if already checked in (chưa checkout)
       │         └── Nếu có → Auto-close phiên cũ (status=FORGOT)
       │
       ├──► Check late arrival
       │         └── Nếu occurredAt > shift.startTime + 10p → status=LATE
       │         └── Nếu không → status=ONTIME
       │
       └──► Save attendance_log → Return response
```

### 3.2 Checkout Flow

```
User clicks Checkout
       │
       ▼
Browser gets GPS location
       │
       ▼
POST /api/attendance/checkout
       │
       ├──► Find today's checkin (chưa có checkout)
       │         └── Nếu không có → Error: "Chưa checkin"
       │
       ├──► Calculate workHours = checkoutTime - checkinTime
       │
       ├──► Check early leave
       │         └── Nếu occurredAt < shift.endTime - 10p → status=EARLY_LEAVE
       │         └── Nếu không → giữ nguyên status từ checkin
       │
       └──► Save attendance_log → Return response
```

### 3.3 GPS Distance Calculation (Haversine Formula)

```java
private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    final int R = 6371000; // Earth's radius in meters
    double latRad1 = Math.toRadians(lat1);
    double latRad2 = Math.toRadians(lat2);
    double deltaLat = Math.toRadians(lat2 - lat1);
    double deltaLon = Math.toRadians(lon2 - lon1);
    
    double a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
               Math.cos(latRad1) * Math.cos(latRad2) *
               Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
}
```

### 3.4 Quên Checkout Handling

| Scenario | Xử lý |
|----------|-------|
| User checkin mà có record IN chưa có OUT | Auto-close record cũ với status=FORGOT, workHours tính từ IN đến thời điểm checkout mới |
| User không checkout và ngày đã kết qua midnight | Batch job chạy mỗi đêm, auto-close các record chưa checkout |
| User checkout nhưng request thất bại (network) | Frontend retry, hoặc user click lại sẽ auto-close phiên cũ |

## 4. Frontend Design

### 4.1 StaffAttendance Page Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    StaffAttendance.jsx                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Header: "Attendance & Performance"                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  KPI Cards                                           │   │
│  │  • Present Today: X / Y staff                       │   │
│  │  • Late Arrivals: N                                  │   │
│  │  • Avg Work Hours: X.Xh                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Action Bar (chỉ hiện cho Staff)                    │   │
│  │  ┌────────────────┐  ┌────────────────┐             │   │
│  │  │  CHECK IN      │  │  CHECK OUT     │             │   │
│  │  │  (GPS Button) │  │  (GPS Button)  │             │   │
│  │  └────────────────┘  └────────────────┘             │   │
│  │                                                     │   │
│  │  Status: ● Checked In at 08:00                    │   │
│  │          ○ Not Checked In                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Attendance Table                                    │   │
│  │  • Staff | Date | CheckIn | CheckOut | Hours |    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 GPS Permission Flow

```javascript
const handleCheckin = async () => {
  // 1. Request GPS permission
  if (!navigator.geolocation) {
    return alert('Trình duyệt không hỗ trợ GPS');
  }
  
  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000
    });
  });
  
  const { latitude, longitude } = position.coords;
  
  // 2. Call API
  const response = await attendanceService.checkin({
    latitude,
    longitude
  });
  
  // 3. Show result
  if (response.data.status === 'LATE') {
    showWarning('Bạn đến muộn ' + response.data.lateMinutes + ' phút');
  }
};
```

## 5. Phân quyền

| Role | Checkin/Checkout | Xem history của mình | Xem attendance store | Xem toàn hệ thống |
|------|------------------|----------------------|---------------------|-------------------|
| Staff | ✅ | ✅ | ❌ | ❌ |
| Store Manager | ✅ (cho staff) | ✅ | ✅ | ❌ |
| Super Admin | ❌ | ✅ | ✅ | ✅ |

## 6. Error Handling

| Error Case | HTTP Status | Message |
|------------|-------------|---------|
| Store chưa có GPS config | 400 | "Cửa hàng chưa được cấu hình GPS" |
| Checkin ngoài bán kính | 400 | "Bạn phải checkin trong phạm vi 50m từ cửa hàng" |
| Checkout mà chưa checkin | 400 | "Bạn chưa checkin hôm nay" |
| User không thuộc store nào | 403 | "Bạn không được phân công cửa hàng" |
| GPS permission denied | 400 | "Vui lòng cho phép trình duyệt truy cập vị trí" |
| GPS timeout | 400 | "Không lấy được vị trí, vui lòng thử lại" |

## 7. Cấu trúc file

### Backend
```
RetailChainService/src/main/java/com/sba301/retailmanagement/
├── entity/
│   └── AttendanceLog.java (updated)
├── dto/
│   ├── request/
│   │   ├── AttendanceCheckinRequest.java
│   │   └── AttendanceCheckoutRequest.java
│   └── response/
│       ├── AttendanceCheckinResponse.java
│       ├── AttendanceHistoryResponse.java
│       └── AttendanceDashboardResponse.java
├── repository/
│   └── AttendanceLogRepository.java (updated)
├── service/
│   ├── AttendanceService.java (interface)
│   └── impl/
│       └── AttendanceServiceImpl.java
└── controller/
    └── AttendanceController.java
```

### Frontend
```
RetailChainUi/src/
├── services/
│   └── attendance.service.js (new)
├── pages/
│   └── Staff/
│       └── Attendance/
│           └── StaffAttendance.jsx (updated)
```
