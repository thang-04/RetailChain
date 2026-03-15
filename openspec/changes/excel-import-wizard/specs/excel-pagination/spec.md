## ADDED Requirements

### Requirement: Pagination cho table preview
Hệ thống PHẢI hiển thị dữ liệu Excel với pagination.

#### Scenario: Hiển thị pagination
- **WHEN** dữ liệu có nhiều hơn 50 dòng
- **THEN** hệ thống hiển thị pagination với 50 dòng/trang

#### Scenario: Chuyển trang
- **WHEN** người dùng nhấn "Trang tiếp" hoặc số trang
- **THEN** hệ thống hiển thị dữ liệu của trang đó

#### Scenario: Tổng số trang
- **WHEN** dữ liệu được load
- **THEN** hệ thống hiển thị "Trang X/Y"

### Requirement: Filter tabs cho table
Hệ thống PHẢI cung cấp filter tabs để lọc dữ liệu theo trạng thái.

#### Scenario: Tab Tất cả
- **WHEN** người dùng chọn tab "Tất cả"
- **THEN** hệ thống hiển thị tất cả dòng

#### Scenario: Tab Hợp lệ
- **WHEN** người dùng chọn tab "Hợp lệ"
- **THEN** hệ thống chỉ hiển thị các dòng hợp lệ

#### Scenario: Tab Lỗi
- **WHEN** người dùng chọn tab "Lỗi"
- **THEN** hệ thống chỉ hiển thị các dòng có lỗi

#### Scenario: Tab Mới
- **WHEN** người dùng chọn tab "Mới"
- **THEN** hệ thống chỉ hiển thị các dòng sẽ tạo sản phẩm mới

#### Scenario: Số lượng trên tab
- **WHEN** dữ liệu được load
- **THEN** mỗi tab hiển thị số lượng dòng tương ứng trong ngoặc đơn
