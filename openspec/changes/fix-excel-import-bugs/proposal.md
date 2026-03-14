## Why

Hiện tại tính năng Excel Import trong trang Nhập kho có 2 lỗi cần sửa gấp:

1. **API Categories lỗi 404**: Frontend gọi `/api/categories` nhưng backend chỉ có `/api/product/categories`
2. **Không map được category/size/color từ Excel**: Khi file Excel có sẵn cột Danh mục, Size, Màu thì hệ thống không nhận diện mà luôn yêu cầu chọn thủ công

## What Changes

- Sửa API endpoint trong `inventory.service.js`: `/api/categories` → `/api/product/categories`
- Thêm mapping logic trong `ExcelPreviewModal.jsx` để nhận diện các trường từ Excel:
  - Category: "Danh mục", "Category", "CategoryName", "Loại"
  - Size: "Size", "size", "Kích thước"  
  - Color: "Màu", "Color", "Màu sắc"

## Capabilities

### New Capabilities
Không có capability mới - đây là fix bug.

### Modified Capabilities
- `excel-import`: Cập nhật logic mapping để hỗ trợ đọc category/size/color từ Excel

## Impact

- **Frontend**: 
  - `src/services/inventory.service.js` - sửa endpoint
  - `src/components/common/ExcelPreviewModal/ExcelPreviewModal.jsx` - thêm mapping
- **Backend**: Không thay đổi
