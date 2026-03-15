## Why

Central Warehouse là chức năng quản lý kho tổng trong hệ thống. Theo yêu cầu, cần xóa toàn bộ giao diện liên quan đến Central Warehouse khỏi sidebar để đơn giản hóa menu điều hướng và loại bỏ quyền truy cập vào chức năng này từ giao diện người dùng.

## What Changes

- **Xóa menu Central Warehouse** khỏi Sidebar (`Sidebar.jsx`)
- Loại bỏ đường dẫn `/warehouse` khỏi navigation
- Xóa các quyền liên quan (`WAREHOUSE_VIEW`) nếu không còn sử dụng ở nơi khác

## Capabilities

### New Capabilities
Không có capability mới - đây là thay đổi loại bỏ giao diện.

### Modified Capabilities
- `sidebar-navigation`: Thay đổi cấu hình menu điều hướng - loại bỏ mục Central Warehouse

## Impact

- **Frontend**: File `RetailChainUi/src/components/layout/Sidebar/Sidebar.jsx`
- **Permissions**: Cần kiểm tra xem quyền `WAREHOUSE_VIEW` có còn được sử dụng ở nơi khác không