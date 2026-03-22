## ADDED Requirements

### Requirement: Dashboard theo dõi attendance của store
Store Manager phải có thể xem dashboard tổng quan về attendance của cửa hàng.

#### Scenario: Lấy dashboard thành công
- **WHEN** Manager gọi API GET /api/attendance/dashboard/{storeId}
- **AND** storeId hợp lệ
- **THEN** hệ thống trả về:
  - presentToday: Số nhân viên đã checkin hôm nay (đang làm việc)
  - completedToday: Số nhân viên đã checkout hôm nay (hoàn thành)
  - totalStaff: Tổng số nhân viên trong store
  - lateArrivals: Số nhân viên có status = LATE hôm nay
  - earlyLeaves: Số nhân viên có status = EARLY_LEAVE hôm nay
  - avgWorkHours: Số giờ làm trung bình của staff đã checkout hôm nay
  - forgotCount: Số nhân viên quên checkout (status = FORGOT)

#### Scenario: Dashboard với dữ liệu trống
- **WHEN** store chưa có attendance nào trong ngày
- **THEN** hệ thống trả về:
  - presentToday: 0
  - completedToday: 0
  - lateArrivals: 0
  - earlyLeaves: 0
  - avgWorkHours: 0
  - forgotCount: 0

#### Scenario: Lấy dashboard theo ngày cụ thể
- **WHEN** Manager gọi API GET /api/attendance/dashboard/{storeId}?date=2024-01-25
- **THEN** hệ thống trả về dashboard cho ngày đó

#### Scenario: Store đóng cửa
- **WHEN** store có status = đóng cửa
- **AND** Manager gọi API dashboard
- **THEN** hệ thống trả về thông báo "Cửa hàng đang đóng cửa"
- **AND** metrics = 0

### Requirement: Xem danh sách attendance của store
Store Manager phải có thể xem chi tiết attendance của tất cả nhân viên trong store.

#### Scenario: Lấy danh sách attendance theo ngày
- **WHEN** Manager gọi API GET /api/attendance/store/{storeId}?date=2024-01-25
- **AND** store đang hoạt động
- **THEN** hệ thống trả về danh sách tất cả nhân viên trong store
- **AND** mỗi item bao gồm: userId, userName, checkInTime, checkOutTime, workHours, status, shiftName

#### Scenario: Lấy danh sách attendance theo khoảng ngày
- **WHEN** Manager gọi API GET /api/attendance/store/{storeId}?from=2024-01-01&to=2024-01-31
- **THEN** hệ thống trả về danh sách attendance trong khoảng ngày
- **AND** có phân trang (page, limit)

#### Scenario: Lọc theo trạng thái
- **WHEN** Manager gọi API GET /api/attendance/store/{storeId}?status=LATE
- **THEN** hệ thống chỉ trả về các record có status = LATE

#### Scenario: Lọc nhiều trạng thái
- **WHEN** Manager gọi API GET /api/attendance/store/{storeId}?status=LATE,EARLY_LEAVE
- **THEN** hệ thống trả về các record có status LATE hoặc EARLY_LEAVE

### Requirement: Sửa thủ công attendance
Store Manager phải có thể sửa thủ công attendance của nhân viên.

#### Scenario: Sửa checkin time
- **WHEN** Manager gọi API PUT /api/attendance/{id}/edit
- **AND** truyền newCheckInTime = "09:00"
- **AND** Manager có quyền (thuộc store)
- **THEN** hệ thống cập nhật checkin time
- **AND** recalculate workHours
- **AND** recalculate status dựa trên ca làm việc

#### Scenario: Sửa checkout time
- **WHEN** Manager gọi API PUT /api/attendance/{id}/edit
- **AND** truyền newCheckOutTime = "18:00"
- **THEN** hệ thống cập nhật checkout time
- **AND** recalculate workHours
- **AND** recalculate status (LATE/EARLY_LEAVE/ONTIME)

#### Scenario: Thêm record checkin/checkout thủ công
- **WHEN** Manager tạo record thủ công cho nhân viên quên checkin/checkout
- **AND** truyền đầy đủ thông tin (userId, checkType, occurredAt)
- **THEN** hệ thống tạo record mới
- **AND** ghi chú note = "Sửa thủ công bởi [tên manager] - [ngày giờ]"

#### Scenario: Audit trail cho sửa thủ công
- **WHEN** Manager sửa attendance
- **THEN** hệ thống lưu log:
  - ai sửa (managerId)
  - sửa gì (field cũ → field mới)
  - thời điểm (timestamp)
  - lý do (nếu có)

### Requirement: Super Admin xem toàn hệ thống
Super Admin phải có thể xem attendance của tất cả các store.

#### Scenario: Admin xem dashboard tất cả store
- **WHEN** Admin gọi API GET /api/attendance/dashboard/all
- **AND** user có role SUPER_ADMIN
- **THEN** hệ thống trả về dashboard tổng hợp của tất cả store
- **AND** bao gồm: tổng presentToday, totalStaff, avgWorkHours...

#### Scenario: Admin lọc theo region
- **WHEN** Admin gọi API GET /api/attendance/dashboard/all?region=SOUTH
- **AND** user có role SUPER_ADMIN
- **THEN** hệ thống chỉ trả về dashboard của các store khu vực SOUTH

#### Scenario: Admin xem attendance store bất kỳ
- **WHEN** Admin gọi API GET /api/attendance/store/{storeId}
- **AND** user có role SUPER_ADMIN
- **THEN** hệ thống trả về attendance của store đó (như Manager)
