## ADDED Requirements

### Requirement: Wizard 3 bước tạo phiếu nhập kho
Hệ thống SHALL cung cấp giao diện wizard 3 bước để tạo phiếu nhập kho:
1. Chọn kho và nhà cung cấp
2. Thêm sản phẩm vào phiếu
3. Xác nhận và submit

#### Scenario: Chuyển bước hợp lệ
- **WHEN** người dùng hoàn thành các field required của bước hiện tại và click "Tiếp tục"
- **THEN** hệ thống chuyển sang bước tiếp theo và hiển thị progress indicator

#### Scenario: Quay lại bước trước
- **WHEN** người dùng click "Quay lại"
- **THEN** hệ thống quay về bước trước và giữ nguyên dữ liệu đã nhập

#### Scenario: Validation failed
- **WHEN** người dùng click "Tiếp tục" nhưng chưa điền đủ thông tin required
- **THEN** hệ thống hiển thị thông báo lỗi và KHÔNG chuyển bước

### Requirement: Search và filter sản phẩm
Hệ thống SHALL cho phép người dùng search sản phẩm với các filter:
- Tìm theo tên/SKU
- Filter theo category
- Filter theo size
- Filter theo color

#### Scenario: Search sản phẩm
- **WHEN** người dùng nhập keyword vào ô search
- **THEN** hệ thhiện danh sách sản phẩm matching trong 300ms (debounced)

#### Scenario: Filter theo category
- **WHEN** người dùng chọn category từ dropdown filter
- **THEN** danh sách sản phẩm được lọc theo category đó

#### Scenario: Thêm sản phẩm đã tồn tại
- **WHEN** người dùng thêm sản phẩm đã có trong danh sách
- **THEN** hệ thống hiển thị cảnh báo và yêu cầu xác nhận hoặc cập nhật số lượng

### Requirement: Summary panel hiển thị tổng quan đơn
Hệ thống SHALL hiển thị panel summary với:
- Tổng số dòng sản phẩm
- Tổng số lượng sản phẩm
- Danh sách sản phẩm đã thêm

#### Scenario: Xem summary
- **WHEN** người dùng đã thêm ít nhất 1 sản phẩm
- **THEN** panel summary hiển thị thông tin chính xác của đơn nhập

### Requirement: Validation form
Hệ thống SHALL validate dữ liệu trước khi submit:
- Warehouse phải được chọn
- Ít nhất 1 sản phẩm trong danh sách
- Số lượng phải > 0

#### Scenario: Submit với dữ liệu hợp lệ
- **WHEN** ngườ dùng click "Tạo phiếu nhập" với dữ liệu hợp lệ
- **THEN** hệ thống gọi API và hiển thị success message

#### Scenario: Submit với dữ liệu không hợp lệ
- **WHEN** người dùng click "Tạo phiếu nhập" nhưng thiếu required fields
- **THEN** hệ thống hiển thị lỗi cụ thể tại các field lỗi

### Requirement: Preview trước khi submit
Tại bước xác nhận, hệ thống SHALL hiển thị:
- Thông tin phiếu nhập (kho, NCC, ngày tạo)
- Danh sách sản phẩm đầy đủ
- Tổng số lượng
- Ghi chú

#### Scenario: Xem preview
- **WHEN** người dùng đến bước xác nhận
- **THEN** hệ thống hiển thị toàn bộ thông tin phiếu nhập để review
