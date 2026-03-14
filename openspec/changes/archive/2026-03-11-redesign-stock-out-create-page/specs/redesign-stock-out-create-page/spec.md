## ADDED Requirements

### Requirement: Wizard xuất kho hoạt động đúng
Wizard xuất kho phải hoạt động với 3 bước.

#### Scenario: Hiển thị wizard 3 bước
- **WHEN** người dùng truy cập `/stock-out/create`
- **THEN** hiển thị ProgressStepper với 3 bước: Thông tin, Sản phẩm, Xác nhận

### Requirement: Bước 1 - Thông tin kho
Người dùng phải chọn được kho nguồn và kho đích.

#### Scenario: Auto chọn kho tổng
- **WHEN** người dùng vào bước 1
- **THEN** kho nguồn tự động chọn kho tổng (isCentral=true)
- **AND** người dùng không thể thay đổi kho nguồn

#### Scenario: Chọn kho đích
- **WHEN** người dùng mở dropdown kho đích
- **THEN** hiển thị danh sách kho cửa hàng (isCentral=false)
- **AND** người dùng phải chọn 1 kho đích

### Requirement: Bước 2 - Chọn sản phẩm
Người dùng phải chọn được sản phẩm để xuất.

#### Scenario: Hiển thị danh sách sản phẩm
- **WHEN** người dùng vào bước 2
- **THEN** hiển thị danh sách sản phẩm từ kho nguồn
- **AND** có thể lọc theo category
- **AND** có thể tìm kiếm theo tên/sku

#### Scenario: Chọn sản phẩm
- **WHEN** người dùng click chọn sản phẩm
- **THEN** thêm sản phẩm vào danh sách xuất
- **AND** nhập số lượng xuất

### Requirement: Bước 3 - Xác nhận
Người dùng xác nhận và submit phiếu xuất.

#### Scenario: Hiển thị thông tin xác nhận
- **WHEN** người dùng vào bước 3
- **THEN** hiển thị: kho nguồn, kho đích, danh sách sản phẩm, tổng số lượng

#### Scenario: Submit thành công
- **WHEN** người dùng click "Tạo phiếu xuất"
- **THEN** gọi API transferStock
- **AND** hiển thị thông báo thành công
- **AND** redirect về danh sách xuất kho
