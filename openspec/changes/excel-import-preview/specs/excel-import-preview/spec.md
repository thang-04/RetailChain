## ADDED Requirements

### Requirement: Người dùng có thể xem trước dữ liệu Excel trước khi import
Hệ thống SHALL cho phép người dùng chọn file Excel và xem trước toàn bộ dữ liệu trong modal trước khi quyết định import.

#### Scenario: Người dùng chọn file Excel hợp lệ
- **WHEN** người dùng click nút "Nhập Excel" và chọn file .xlsx/.xls hợp lệ
- **THEN** hệ thống parse file Excel và hiển thị modal preview với dữ liệu các cột: SKU, Tên sản phẩm, Số lượng, Đơn giá, Ghi chú

#### Scenario: Người dùng chọn file không đúng định dạng
- **WHEN** người dùng chọn file không phải .xlsx/.xls (VD: .csv, .txt)
- **THEN** hệ thống hiển thị thông báo lỗi "File không hợp lệ. Vui lòng chọn file .xlsx hoặc .xls"

#### Scenario: File Excel rỗng
- **WHEN** người dùng chọn file Excel không có dữ liệu
- **THEN** hệ thống hiển thị thông báo "File Excel không có dữ liệu"

---

### Requirement: Hệ thống validate dữ liệu client-side trước khi preview
Hệ thống SHALL kiểm tra tính hợp lệ của dữ liệu Excel ở phía client trước khi hiển thị preview.

#### Scenario: Dữ liệu hợp lệ - hiển thị trạng thái "Hợp lệ"
- **WHEN** dòng dữ liệu có SKU không trống, số lượng là số nguyên dương, đơn giá là số dương
- **THEN** hệ thống đánh dấu dòng đó là "✓ Hợp lệ" với màu xanh

#### Scenario: SKU để trống
- **WHEN** dòng dữ liệu có SKU trống hoặc null
- **THEN** hệ thống đánh dấu dòng đó là "✗ Lỗi" với thông báo "SKU không được để trống"

#### Scenario: Số lượng không hợp lệ
- **WHEN** dòng dữ liệu có số lượng không phải số nguyên dương
- **THEN** hệ thống đánh dấu dòng đó là "✗ Lỗi" với thông báo "Số lượng phải là số nguyên dương"

#### Scenario: Đơn giá không hợp lệ
- **WHEN** dòng dữ liệu có đơn giá <= 0 hoặc không phải số
- **THEN** hệ thống đánh dấu dòng đó là "✗ Lỗi" với thông báo "Đơn giá phải lớn hơn 0"

---

### Requirement: Hệ thống kiểm tra SKU tồn tại qua API
Hệ thống SHALL gọi API để kiểm tra xem SKU trong Excel đã tồn tại trong hệ thống hay chưa.

#### Scenario: SKU đã tồn tại trong hệ thống
- **WHEN** API trả về `exists: true` cho SKU
- **THEN** hệ thống đánh dấu dòng đó là "✓ Tồn tại" với màu xanh

#### Scenario: SKU chưa tồn tại trong hệ thống
- **WHEN** API trả về `exists: false` cho SKU
- **THEN** hệ thống đánh dấu dòng đó là "🆕 Sẽ tạo mới" với màu vàng

#### Scenario: API kiểm tra SKU thất bại
- **WHEN** gọi API thất bại (network error, server error)
- **THEN** hệ thống đánh dấu dòng đó là "✓ Hợp lệ" (không chặn import), hiển thị warning nhỏ

---

### Requirement: Người dùng có thể bỏ qua dòng lỗi trước khi import
Hệ thống SHALL cho phép người dùng bỏ chọn các dòng lỗi trước khi xác nhận import.

#### Scenario: Người dùng bỏ chọn dòng lỗi
- **WHEN** người dùng uncheck checkbox của dòng lỗi
- **THEN** dòng đó bị bỏ qua khi import, không được gửi lên server

#### Scenario: Người dùng import với một số dòng lỗi được bỏ qua
- **WHEN** người dùng click "Import" sau khi bỏ chọn một số dòng lỗi
- **THEN** hệ thống chỉ gửi các dòng còn được check lên server

---

### Requirement: Modal preview hiển thị tổng kết dữ liệu
Hệ thống SHALL hiển thị tổng số dòng hợp lệ, dòng lỗi, dòng sẽ tạo mới trong modal preview.

#### Scenario: Preview hiển thị thống kê
- **WHEN** modal preview được mở
- **THEN** hiển thị: "Tổng: X dòng | Hợp lệ: Y | Lỗi: Z | Sẽ tạo mới: W"

---

### Requirement: Người dùng có thể hủy thao tác preview
Hệ thống SHALL cho phép người dùng đóng modal preview và quay lại mà không import.

#### Scenario: Người dùng click nút "Hủy"
- **WHEN** người dùng click nút "Hủy" trong modal
- **THEN** modal đóng, không có dữ liệu nào được gửi lên server

#### Scenario: Người dùng click nút X đóng modal
- **WHEN** người dùng click nút X (close) ở góc phải modal
- **THEN** modal đóng, không có dữ liệu nào được gửi lên server
