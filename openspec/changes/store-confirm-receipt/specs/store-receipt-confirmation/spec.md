## ADDED Requirements

### Requirement: Cửa hàng xác nhận đã nhận hàng
Hệ thống SHALL cho phép cửa hàng xác nhận đã nhận hàng từ phiếu xuất kho.

#### Scenario: Xác nhận thành công
- **WHEN** Store Manager click nút "Xác nhận đã nhận" trên phiếu có status PENDING
- **THEN** Hệ thống cập nhật status phiếu thành COMPLETED
- **AND** Hiển thị thông báo thành công
- **AND** Danh sách phiếu cập nhật status mới

#### Scenario: Xác nhận phiếu đã COMPLETED
- **WHEN** Store Manager click nút "Xác nhận đã nhận" trên phiếu có status COMPLETED
- **THEN** Hệ thống hiển thị thông báo phiếu đã được xác nhận trước đó
- **AND** Không thay đổi dữ liệu

#### Scenario: Xác nhận phiếu không tồn tại
- **WHEN** Store Manager gọi API confirm với id không tồn tại
- **THEN** Hệ thống trả về lỗi 404

### Requirement: Xem danh sách phiếu xuất đến cửa hàng
Hệ thống SHALL hiển thị danh sách phiếu xuất kho gửi đến cửa hàng.

#### Scenario: Hiển thị danh sách phiếu
- **WHEN** Store Manager truy cập tab "Hàng đến"
- **THEN** Hệ thống hiển thị danh sách phiếu xuất có targetWarehouseId = warehouseId của cửa hàng
- **AND** Mỗi phiếu hiển thị: mã phiếu, ngày tạo, số sản phẩm, trạng thái

#### Scenario: Lọc phiếu theo trạng thái
- **WHEN** Store Manager chọn filter "Chờ xác nhận"
- **THEN** Hệ thống chỉ hiển thị các phiếu có status PENDING

#### Scenario: Không có phiếu nào
- **WHEN** Store Manager truy cập tab "Hàng đến" và không có phiếu nào
- **THEN** Hệ thống hiển thị thông báo "Không có phiếu nhận hàng nào"

### Requirement: Xem chi tiết phiếu xuất
Hệ thống SHALL cho phép xem chi tiết đầy đủ của phiếu xuất kho.

#### Scenario: Xem chi tiết phiếu
- **WHEN** Store Manager click vào một phiếu trong danh sách
- **THEN** Hệ thống hiển thị popup/modal với:
  - Mã phiếu, ngày tạo
  - Kho nguồn (từ đâu)
  - Trạng thái
  - Danh sách sản phẩm (tên, SKU, số lượng)
  - Nút hành động (nếu status = PENDING)

#### Scenario: Chi tiết phiếu không tồn tại
- **WHEN** Store Manager truy cập chi tiết phiếu với id không tồn tại
- **THEN** Hệ thống hiển thị thông báo lỗi
