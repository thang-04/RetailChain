## MODIFIED Requirements

### Requirement: Menu điều hướng Sidebar

Sidebar của ứng dụng phải hiển thị các mục menu dựa trên quyền của người dùng. Hệ thống phải loại bỏ mục Central Warehouse khỏi danh sách menu.

#### Scenario: Không hiển thị Central Warehouse trong menu
- **WHEN** người dùng đăng nhập vào hệ thống
- **THEN** mục menu "Central Warehouse" không được hiển thị trong sidebar

#### Scenario: Không thể truy cập qua đường dẫn /warehouse
- **WHEN** người dùng cố gắng truy cập trực tiếp đường dẫn /warehouse
- **THEN** hệ thống phải xử lý yêu cầu (redirect hoặc hiển thị thông báo phù hợp)

### Requirement: Danh sách menu Sidebar

Hệ thống phải cung cấp danh sách các mục menu sau đây:
- Dashboard (`/`)
- Stores hoặc My Store (`/store`)
- Products (`/products`)
- Inventory (`/inventory`)
- Stock In (`/stock-in`)
- Stock Out (`/stock-out`)
- Reports (`/reports`)
- Human Resources (`/staff`)
- Roles & Permissions (`/roles`)
- User Management (`/users`)
- Staff Shifts (`/staff/shifts`)

**REMOVED Requirements**

### Requirement: Central Warehouse trong menu Sidebar

**Reason**: Loại bỏ theo yêu cầu của người dùng - không cần hiển thị giao diện kho tổng trong sidebar.

**Migration**: Sử dụng đường dẫn trực tiếp nếu cần truy cập chức năng kho (nếu API vẫn hỗ trợ).