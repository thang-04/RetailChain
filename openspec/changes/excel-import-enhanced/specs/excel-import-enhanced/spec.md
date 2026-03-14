## ADDED Requirements

### Requirement: Người dùng có thể chọn Supplier từ dropdown cho phiếu nhập
Hệ thống SHALL cho phép người dùng chọn Supplier từ dropdown khi nhập kho từ Excel.

#### Scenario: Load danh sách Suppliers khi mở modal
- **WHEN** người dùng mở modal Excel Preview
- **THEN** hệ thống gọi API lấy danh sách Suppliers và hiển thị trong dropdown

#### Scenario: Chọn Supplier từ dropdown
- **WHEN** người dùng click dropdown và chọn một Supplier
- **THEN** Supplier được chọn sẽ được gán cho toàn bộ phiếu nhập

#### Scenario: Không chọn Supplier
- **WHEN** người dùng không chọn Supplier và click Import
- **THEN** hệ thống hiển thị lỗi "Vui lòng chọn nhà cung cấp" và không cho import

---

### Requirement: Người dùng có thể chọn Category từ dropdown cho mỗi dòng sản phẩm
Hệ thống SHALL cho phép người dùng chọn Category từ dropdown cho mỗi dòng trong Excel preview.

#### Scenario: Load danh sách Categories khi mở modal
- **WHEN** người dùng mở modal Excel Preview
- **THEN** hệ thống gọi API lấy danh sách Categories và hiển thị trong dropdown

#### Scenario: Chọn Category cho dòng sản phẩm
- **WHEN** người dùng click dropdown Category ở một dòng và chọn Category
- **THEN** Category được chọn được lưu cho dòng đó

#### Scenario: Không chọn Category cho dòng sản phẩm
- **WHEN** người dùng không chọn Category và click Import
- **THEN** hệ thống hiển thị lỗi ở dòng đó "Vui lòng chọn danh mục" và không cho import

---

### Requirement: Người dùng có thể chọn Size từ dropdown cho mỗi dòng sản phẩm
Hệ thống SHALL cho phép người dùng chọn Size từ dropdown (S, M, L, XL, 26-43, UNI) cho mỗi dòng.

#### Scenario: Hiển thị dropdown Size với các giá trị từ DB
- **WHEN** người dùng mở modal Excel Preview
- **THEN** hệ thống hiển thị dropdown Size với các giá trị: S, M, L, XL, 26, 28, 30, 32, 34, 38, 39, 40, 41, 42, 43, UNI

#### Scenario: Chọn Size cho dòng sản phẩm
- **WHEN** người dùng click dropdown Size ở một dòng và chọn Size
- **THEN** Size được chọn được lưu cho dòng đó

#### Scenario: Không chọn Size cho dòng sản phẩm
- **WHEN** người dùng không chọn Size và click Import
- **THEN** hệ thống hiển thị lỗi ở dòng đó "Vui lòng chọn size" và không cho import

---

### Requirement: Người dùng có thể chọn Color từ dropdown cho mỗi dòng sản phẩm
Hệ thống SHALL cho phép người dùng chọn Color từ dropdown (Đen, Trắng, Xám, Xanh Navy, Xanh, Hoa, Nâu, Be, Vàng) cho mỗi dòng.

#### Scenario: Hiển thị dropdown Color với các giá trị từ DB
- **WHEN** người dùng mở modal Excel Preview
- **THEN** hệ thống hiển thị dropdown Color với các giá trị: Đen, Trắng, Xám, Xanh Navy, Xanh, Hoa, Nâu, Be, Vàng

#### Scenario: Chọn Color cho dòng sản phẩm
- **WHEN** người dùng click dropdown Color ở một dòng và chọn Color
- **THEN** Color được chọn được lưu cho dòng đó

#### Scenario: Không chọn Color cho dòng sản phẩm
- **WHEN** người dùng không chọn Color và click Import
- **THEN** hệ thống hiển thị lỗi ở dòng đó "Vui lòng chọn màu" và không cho import

---

### Requirement: Backend xử lý đầy đủ các trường khi import
Hệ thống SHALL xử lý categoryId, size, color, supplierId khi import từ Excel.

#### Scenario: Tạo product mới với category đã chọn
- **WHEN** SKU chưa tồn tại và category đã được chọn
- **THEN** hệ thống tạo product mới với categoryId từ dropdown

#### Scenario: Tạo variant mới với size và color đã chọn
- **WHEN** Tạo variant mới từ SKU
- **THEN** hệ thống gán size và color từ dropdown vào variant

#### Scenario: Gán supplier cho document
- **WHEN** Người dùng đã chọn Supplier và click Import
- **THEN** hệ thống gán supplierId vào inventory_document

---

### Requirement: Validation tổng hợp trước khi import
Hệ thống SHALL kiểm tra tất cả các trường bắt buộc trước khi cho phép import.

#### Scenario: Tất cả trường bắt buộc đã được chọn/nhập
- **WHEN** Tất cả SKU, ProductName, Category, Size, Color, Quantity, Supplier đã được chọn/nhập
- **THEN** Nút Import được kích hoạt (enabled)

#### Scenario: Thiếu một hoặc nhiều trường bắt buộc
- **WHEN** Có ít nhất một trường bắt buộc chưa được chọn/nhập
- **THEN** Nút Import bị vô hiệu hóa (disabled) và hiển thị số lỗi
