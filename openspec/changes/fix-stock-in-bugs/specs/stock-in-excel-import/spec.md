## ADDED Requirements

### Requirement: Nhập phiếu từ file Excel
Hệ thống PHẢI cho phép người dùng nhập phiếu nhập kho từ file Excel.

#### Scenario: Mở dialog chọn file
- **WHEN** người dùng click button "Nhập Excel"
- **THEN** mở file dialog để chọn file (.xlsx, .xls)

#### Scenario: Import thành công
- **WHEN** người dùng chọn file Excel hợp lệ và click "Import"
- **THEN** parse file Excel
- **AND** tạo phiếu nhập với dữ liệu từ file
- **AND** hiển thị toast "Nhập thành công X phiếu"
- **AND** cập nhật danh sách phiếu nhập

#### Scenario: File không hợp lệ
- **WHEN** người dùng chọn file không đúng định dạng
- **THEN** hiển thị toast lỗi "File không hợp lệ. Vui lòng chọn file Excel (.xlsx, .xls)"

#### Scenario: Dữ liệu trong file lỗi
- **WHEN** file Excel có dữ liệu không hợp lệ (thiếu trường bắt buộc)
- **THEN** hiển thị toast lỗi chi tiết về dòng lỗi
