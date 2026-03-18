## ADDED Requirements

### Requirement: Xem lịch sử chấm công cá nhân
Nhân viên phải có thể xem được lịch sử checkin/checkout của chính mình.

#### Scenario: Lấy lịch sử thành công (default 30 ngày)
- **WHEN** nhân viên gọi API GET /api/attendance/my-history
- **AND** không có query params
- **THEN** hệ thống trả về danh sách 30 ngày gần nhất
- **AND** mỗi item bao gồm: date, checkInTime, checkOutTime, workHours, status, shiftName

#### Scenario: Phân trang lịch sử
- **WHEN** nhân viên gọi API GET /api/attendance/my-history?page=1&limit=30
- **THEN** hệ thống trả về:
  - data: danh sách 30 records
  - pagination: { page: 1, limit: 30, total: 365, totalPages: 13 }

#### Scenario: Lọc lịch sử theo ngày
- **WHEN** nhân viên gọi API GET /api/attendance/my-history?from=2024-01-01&to=2024-01-31
- **THEN** hệ thống trả về danh sách trong khoảng ngày đó

#### Scenario: Lọc lịch sử theo tháng
- **WHEN** nhân viên gọi API GET /api/attendance/my-history?month=2024-01
- **THEN** hệ thống trả về danh sách tất cả các ngày trong tháng 01/2024

#### Scenario: Không có dữ liệu lịch sử
- **WHEN** nhân viên chưa từng checkin
- **THEN** hệ thống trả về danh sách rỗng
- **AND** pagination: { page: 1, limit: 30, total: 0, totalPages: 0 }

#### Scenario: Data structure - Mỗi ngày 1 row
- **WHEN** hệ thống trả về attendance history
- **THEN** mỗi row đại diện cho 1 ngày với cả checkin và checkout:
  ```json
  {
    "date": "2024-01-25",
    "checkInTime": "08:00",
    "checkOutTime": "17:00",
    "workHours": 8.0,
    "status": "ONTIME",
    "shiftName": "Ca Sáng"
  }
  ```

### Requirement: Phân quyền xem lịch sử
Hệ thống phải kiểm soát quyền xem lịch sử theo role.

#### Scenario: Staff xem lịch sử của mình
- **WHEN** staff gọi API GET /api/attendance/my-history
- **AND** user đang login là staff
- **THEN** hệ thống trả về lịch sử của chính user đó

#### Scenario: Staff xem lịch sử của người khác
- **WHEN** staff cố gắng gọi API với userId khác
- **AND** userId khác với user đang login
- **THEN** hệ thống trả về lỗi 403
- **AND** thông báo "Bạn không có quyền xem lịch sử của người khác"

#### Scenario: Manager xem lịch sử của staff trong store
- **WHEN** Manager gọi API GET /api/attendance/user/111
- **AND** staff 111 thuộc store của manager
- **AND** manager có quyền
- **THEN** hệ thống trả về lịch sử của user 111

#### Scenario: Manager xem lịch sử của staff ngoài store
- **WHEN** Manager cố gắng xem lịch sử của staff không thuộc store của mình
- **AND** staff không thuộc store của manager
- **THEN** hệ thống trả về lỗi 403
- **AND** thông báo "Bạn không có quyền xem lịch sử của nhân viên này"

### Requirement: Xuất báo cáo lịch sử
Nhân viên phải có thể xuất báo cáo lịch sử chấm công.

#### Scenario: Xuất file Excel (sync)
- **WHEN** nhân viên click nút "Export"
- **AND** chọn định dạng Excel
- **AND** số records <= 500
- **THEN** hệ thống tải file Excel ngay lập tức
- **AND** file bao gồm: STT, Ngày, Giờ vào, Giờ ra, Số giờ, Trạng thái, Tên ca

#### Scenario: Xuất file CSV
- **WHEN** nhân viên click nút "Export"
- **AND** chọn định dạng CSV
- **THEN** hệ thống tải file CSV ngay lập tức

#### Scenario: Xuất file quá lớn (async warning)
- **WHEN** nhân viên chọn export với số records > 500
- **AND** user vẫn xác nhận export
- **THEN** hệ thống trả về warning "File sẽ được tạo và gửi qua email"
- **AND** xử lý async (Phase 2)
