## ADDED Requirements

### Requirement: Bulk actions cho NCC và Danh mục
Hệ thống PHẢI cho phép người dùng áp dụng NCC và Danh mục cho nhiều dòng cùng lúc.

#### Scenario: Bulk chọn NCC
- **WHEN** người dùng chọn NCC từ dropdown "Bulk NCC"
- **THEN** hệ thống áp dụng NCC đó cho tất cả dòng đang hiển thị

#### Scenario: Bulk chọn Danh mục
- **WHEN** người dùng chọn Danh mục từ dropdown "Bulk Category"
- **THEN** hệ thống áp dụng Danh mục đó cho tất cả dòng đang hiển thị

#### Scenario: Bulk chỉ áp dụng cho filter hiện tại
- **WHEN** người dùng áp dụng bulk action
- **THEN** hệ thống chỉ áp dụng cho các dòng đang được lọc (tab hiện tại)

#### Scenario: Bulk action cập nhật validation
- **WHEN** bulk action được áp dụng
- **THEN** hệ thống re-validate các dòng bị ảnh hưởng

### Requirement: Expand row editor
Hệ thống PHẢI cho phép edit chi tiết từng dòng trong expandable row.

#### Scenario: Mở row để edit
- **WHEN** người dùng click vào dòng
- **THEN** hệ thống mở rộng dòng để hiển thị form edit

#### Scenario: Đóng row editor
- **WHEN** người dùng click nút đóng hoặc click ra ngoài
- **THEN** hệ thống đóng row và lưu thay đổi

#### Scenario: Row editor chứa tất cả fields
- **WHEN** row được mở rộng
- **THEN** hệ thống hiển thị tất cả fields có thể edit (SKU, tên, NCC, Danh mục, Size, Màu, Số lượng, Đơn giá)
