## ADDED Requirements

### Requirement: API Categories hoạt động đúng
Hệ thống SHALL gọi đúng API endpoint `/api/product/categories` để lấy danh sách danh mục.

#### Scenario: Load categories khi mở modal
- **WHEN** người dùng mở Excel Import modal
- **THEN** hệ thống gọi API `/api/product/categories` và hiển thị dropdown Danh mục

### Requirement: Map category từ Excel
Hệ thống SHALL nhận diện cột Danh mục từ Excel với các tên: "Danh mục", "Category", "CategoryName", "Loại".

#### Scenario: Excel có cột Danh mục
- **WHEN** file Excel có cột "Danh mục" hoặc "Category"
- **THEN** hệ thống tự động map giá trị vào dropdown, không cần chọn thủ công

### Requirement: Map size từ Excel
Hệ thống SHALL nhận diện cột Size từ Excel với các tên: "Size", "size", "Kích thước".

#### Scenario: Excel có cột Size
- **WHEN** file Excel có cột "Size" hoặc "Kích thước"
- **THEN** hệ thống tự động map giá trị vào dropdown, không cần chọn thủ công

### Requirement: Map color từ Excel
Hệ thống SHALL nhận diện cột Màu từ Excel với các tên: "Màu", "Color", "Màu sắc".

#### Scenario: Excel có cột Màu
- **WHEN** file Excel có cột "Màu" hoặc "Color"
- **THEN** hệ thống tự động map giá trị vào dropdown, không cần chọn thủ công
