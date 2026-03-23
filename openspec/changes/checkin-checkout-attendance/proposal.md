## Tại sao cần thay đổi này

Hiện tại hệ thống RetailChain đã có cơ sở dữ liệu `attendance_logs` với các trường GPS (latitude, longitude, distance_meters), nhưng **chưa có Service và API** để xử lý nghiệp vụ checkin/checkout. Frontend cũng chỉ có giao diện mockup chưa kết nối API.

Việc triển khai tính năng chấm công GPS là cần thiết để:
- Quản lý giờ giấc làm việc của nhân viên chính xác
- Đảm bảo nhân viên có mặt tại cửa hàng khi checkin (bán kính 50m)
- Tính toán số giờ làm việc tự động dựa trên ca được phân công
- Store Manager và Super Admin có thể theo dõi attendance của nhân viên/cửa hàng

## Những thay đổi cụ thể

### Backend
- Cập nhật Entity `AttendanceLog`: thêm các trường `status` (ONTIME/LATE/EARLY_LEAVE/FORGOT) và `workHours`
- Tạo mới `AttendanceService` và `AttendanceServiceImpl` xử lý logic checkin/checkout
- Tạo mới `AttendanceController` với các REST API endpoints
- Tạo DTOs cho request và response
- Cập nhật `AttendanceLogRepository` nếu cần thêm query methods

### Frontend
- Cập nhật `StaffAttendance.jsx`: tích hợp GPS API và kết nối với backend
- Thêm button Checkin/Checkout với GPS location
- Hiển thị lịch sử chấm công từ API
- Phân quyền hiển thị theo role (Staff xem được của mình, Manager xem được của store, Admin xem được toàn hệ thống)

### Database
- Thêm cột `status` và `work_hours` vào bảng `attendance_logs`

## Năng lực mới

### Các năng lực được tạo mới

- `attendance-checkin`: Chức năng checkin với GPS location, kiểm tra khoảng cách với cửa hàng (max 50m), kiểm tra thời gian so với ca được phân công
- `attendance-checkout`: Chức năng checkout với GPS location, tính toán số giờ làm việc tự động, phát hiện quên checkout và xử lý tự động
- `attendance-history`: Xem lịch sử chấm công cá nhân
- `attendance-dashboard`: Dashboard theo dõi attendance của store (present today, late arrivals, average work hours)

## Tác động

### Backend
- Package `com.sba301.retailmanagement.service`: Thêm `AttendanceService.java` và `AttendanceServiceImpl.java`
- Package `com.sba301.retailmanagement.controller`: Thêm `AttendanceController.java`
- Package `com.sba301.retailmanagement.dto`: Thêm request/response DTOs
- Package `com.sba301.retailmanagement.entity`: Cập nhật `AttendanceLog.java`

### Frontend
- `src/pages/Staff/Attendance/StaffAttendance.jsx`: Cập nhật để kết nối API và tích hợp GPS

### Database
- Bảng `attendance_logs`: Thêm cột `status` (VARCHAR(20)) và `work_hours` (DECIMAL(4,2))

### Dependencies
- Không cần thêm thư viện mới - sử dụng GPS API có sẵn trong browser
