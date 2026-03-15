## ADDED Requirements

### Requirement: Stat cards stock-in với metrics tùy chỉnh
Trang stock-in PHẢI hiển thị 5 stat cards với metrics phù hợp business logic nhập kho.

#### Scenario: Hiển thị 5 stat cards
- **WHEN** trang stock-in load và có dữ liệu
- **THEN** hiển thị 5 cards:
  - Tổng phiếu: tổng số phiếu nhập
  - Hoàn thành: số phiếu đã hoàn thành
  - Tổng sản phẩm: tổng số sản phẩm đã nhập (thay thế "Chờ duyệt")
  - Nhà cung cấp: số lượng NCC unique (thay thế "Đã hủy")
  - Giá trị: tổng giá trị nhập kho

#### Scenario: Không có dữ liệu
- **WHEN** không có record nào
- **THEN** stat cards KHÔNG hiển thị

### Requirement: Metrics phản ánh đúng business logic nhập kho
Vì nhập kho mặc định hoàn thành (không cần duyệt), các metrics "Chờ duyệt" và "Đã hủy" không có ý nghĩa.

#### Scenario: Không hiển thị Pending/Cancelled
- **WHEN** hiển thị stat cards stock-in
- **THEN** KHÔNG hiển thị card "Chờ duyệt"
- **AND** KHÔNG hiển thị card "Đã hủy"

#### Scenario: Thay thế bằng metrics có ý nghĩa
- **WHEN** stock-in
- **THEN** "Chờ duyệt" → "Tổng sản phẩm" (tổng quantity)
- **AND** "Đã hủy" → "Nhà cung cấp" (unique suppliers count)