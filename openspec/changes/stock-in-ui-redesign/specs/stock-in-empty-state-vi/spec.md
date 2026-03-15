## ADDED Requirements

### Requirement: Empty state hiển thị tiếng Việt
Khi không có records, PHẢI hiển thị message bằng tiếng Việt.

#### Scenario: Không có records và không có filters
- **WHEN** records = 0 và không có active filters
- **THEN** hiển thị:
  - Title: "Chưa có phiếu nhập kho"
  - Subtitle: "Tạo phiếu nhập kho đầu tiên để bắt đầu quản lý nhập hàng vào kho."

#### Scenario: Không có records và có filters
- **WHEN** records = 0 và có active filters
- **THEN** hiển thị:
  - Title: "Không tìm thấy kết quả"
  - Subtitle: "Thử điều chỉnh bộ lọc để tìm kiếm kết quả khác."

### Requirement: Empty state action buttons
Empty state PHẠM hiển thị các action buttons phù hợp.

#### Scenario: No records, no filters - hiển thị button tạo mới
- **WHEN** records = 0 và không có active filters
- **THEN** hiển thị button: "Tạo phiếu nhập" dẫn đến /stock-in/create

#### Scenario: No records, has filters - hiển thị button xóa filter
- **WHEN** records = 0 và có active filters
- **THEN** hiển thị button: "Xóa bộ lọc"

### Requirement: Empty state icon
Empty state PHẢI sử dụng icon phù hợp với stock-in.

#### Scenario: Icon hiển thị
- **WHEN** hiển thị empty state
- **THEN** sử dụng icon Download (thay vì FileText như hiện tại)