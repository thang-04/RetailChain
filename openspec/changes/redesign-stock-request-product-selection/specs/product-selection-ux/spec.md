## ADDED Requirements

### Requirement: Category Filter Tabs
Hệ thống PHẢI hiển thị các tab lọc theo danh mục sản phẩm bao gồm "Tất cả" và các danh mục từ API.

#### Scenario: Hiển thị tất cả danh mục
- **WHEN** modal được mở và dữ liệu categories đã load
- **THEN** hiển thị tab "Tất cả" và các tab danh mục tương ứng

#### Scenario: Lọc theo danh mục được chọn
- **WHEN** người dùng click vào tab danh mục (khác "Tất cả")
- **THEN** lọc danh sách sản phẩm chỉ hiển thị sản thuộc danh mục đó

### Requirement: Product Grid Display
Hệ thống PHẢI hiển thị sản phẩm dạng lưới với hình ảnh, tên, và mã sản phẩm.

#### Scenario: Hiển thị sản phẩm có hình ảnh
- **WHEN** sản phẩm có trường image
- **THEN** hiển thị hình ảnh sản phẩm trong grid

#### Scenario: Hiển thị sản phẩm không có hình ảnh
- **WHEN** sản phẩm không có image
- **THEN** hiển thị placeholder icon Package

#### Scenario: Grid responsive
- **WHEN** màn hình có chiều rộng >= 1024px
- **THEN** hiển thị 3 cột sản phẩm

- **WHEN** màn hình có chiều rộng < 1024px
- **THEN** hiển thị 2 cột sản phẩm

### Requirement: Visual Product Selection
Hệ thống PHẢI cho phép chọn sản phẩm bằng click và hiển thị trạng thái đã chọn.

#### Scenario: Chọn sản phẩm không có variant
- **WHEN** người dùng click vào sản phẩm không có variants
- **THEN** thêm sản phẩm vào danh sách yêu cầu với quantity = 1

#### Scenario: Chọn sản phẩm có variant
- **WHEN** người dùng click vào sản phẩm có variants
- **THEN** mở dialog chọn variant

#### Scenario: Sản phẩm đã được chọn
- **WHEN** sản phẩm đã có trong danh sách yêu cầu
- **THEN** hiển thị icon checkmark và border primary trên product card

### Requirement: Variant Selection Dialog
Hệ thống PHẢI cho phép chọn variant (màu/size) khi sản phẩm có nhiều phiên bản.

#### Scenario: Hiển thị danh sách variant
- **WHEN** dialog variant được mở
- **THEN** hiển thị danh sách các variant với SKU, color, size, và giá

#### Scenario: Chọn variant và số lượng
- **WHEN** người dùng nhập số lượng và click chọn variant
- **THEN** thêm variant vào danh sách với số lượng tương ứng và đóng dialog

### Requirement: Selected Items Management
Hệ thống PHẢI cho phép quản lý danh sách sản phẩm đã chọn.

#### Scenario: Hiển thị danh sách đã chọn
- **WHEN** có sản phẩm trong danh sách
- **THEN** hiển thị tất cả sản phẩm với tên, SKU, số lượng, và nút xóa

#### Scenario: Tăng số lượng
- **WHEN** người dùng click nút "+"
- **THEN** tăng số lượng sản phẩm lên 1

#### Scenario: Giảm số lượng
- **WHEN** người dùng click nút "-" và quantity > 1
- **THEN** giảm số lượng sản phẩm đi 1

#### Scenario: Xóa sản phẩm
- **WHEN** người dùng click nút xóa
- **THEN** xóa sản phẩm khỏi danh sách

### Requirement: Search Functionality
Hệ thống PHẢI cho phép tìm kiếm sản phẩm theo tên hoặc mã.

#### Scenario: Tìm kiếm theo tên
- **WHEN** người dùng nhập từ khóa vào ô search
- **THEN** lọc sản phẩm có tên chứa từ khóa (không phân biệt hoa thường)

#### Scenario: Tìm kiếm theo mã
- **WHEN** người dùng nhập mã sản phẩm
- **THEN** lọc sản phẩm có mã chứa từ khóa (không phân biệt hoa thường)

#### Scenario: Kết hợp search và category filter
- **WHEN** có cả search term và category được chọn
- **THEN** lọc sản phẩm thỏa mãn cả hai điều kiện
