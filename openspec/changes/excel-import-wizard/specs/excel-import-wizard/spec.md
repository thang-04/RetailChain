## ADDED Requirements

### Requirement: Wizard 3 bước cho import Excel
Hệ thống PHẢI cung cấp wizard 3 bước để import dữ liệu từ file Excel.

#### Scenario: Chuyển bước hợp lệ
- **WHEN** người dùng hoàn thành bước hiện tại và nhấn "Tiếp tục"
- **THEN** hệ thống chuyển sang bước tiếp theo

#### Scenario: Quay lại bước trước
- **WHEN** người dùng nhấn "Quay lại"
- **THEN** hệ thống quay về bước trước và giữ nguyên dữ liệu đã nhập

#### Scenario: Đóng wizard
- **WHEN** người dùng nhấn "Hủy" hoặc nút đóng
- **THEN** hệ thống đóng wizard và hỏi có lưu draft không

### Requirement: Bước 1 - Upload file
Hệ thống PHẢI cho phép người dùng upload file Excel và download template.

#### Scenario: Upload file hợp lệ
- **WHEN** người dùng chọn file .xlsx hoặc .xls
- **THEN** hệ thống parse file và hiển thị dữ liệu

#### Scenario: Upload file không hợp lệ
- **WHEN** người dùng chọn file không đúng định dạng
- **THEN** hệ thống hiển thị thông báo lỗi

#### Scenario: Download template
- **WHEN** người dùng nhấn nút "Tải template"
- **THEN** hệ thống tải file .xlsx với header đúng format

### Requirement: Bước 2 - Map columns
Hệ thống PHẢI cho phép người dùng map Excel columns với system fields.

#### Scenario: Auto-detect mapping
- **WHEN** người dùng upload file
- **THEN** hệ thống tự động detect mapping dựa trên header

#### Scenario: Manual mapping
- **WHEN** người dùng thay đổi mapping
- **THEN** hệ thống cập nhật mapping và hiển thị preview

### Requirement: Bước 3 - Review và Import
Hệ thống PHẢI cho phép người dùng xem trước, edit và import dữ liệu.

#### Scenario: Hiển thị preview table
- **WHEN** người dùng đến bước 3
- **THEN** hệ thống hiển thị table với pagination

#### Scenario: Import thành công
- **WHEN** người dùng nhấn "Nhập" với ít nhất 1 dòng hợp lệ
- **THEN** hệ thống import dữ liệu và hiển thị thông báo thành công
