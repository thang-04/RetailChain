## Context

Tính năng Excel Import trong trang Nhập kho hiện tại có 2 lỗi:

1. **Lỗi API 404**: Frontend gọi `/api/categories` nhưng backend chỉ expose `/api/product/categories`
2. **Thiếu mapping**: Khi đọc file Excel, code hardcode `null` cho categoryId, size, color thay vì map từ các cột trong Excel

## Goals / Non-Goals

**Goals:**
- Sửa API endpoint để gọi đúng `/api/product/categories`
- Thêm logic map category/size/color từ các cột Excel

**Non-Goals:**
- Không thay đổi logic validation
- Không thay đổi backend

## Decisions

### 1. Sửa API Endpoint
**Quyết định**: Sửa endpoint trong `inventory.service.js`

- **Alternatives**: 
  - Tạo API mới `/api/categories` ở backend
  - Sửa frontend để gọi đúng endpoint
- **Rationale**: Frontend fix đơn giản hơn, không cần thay đổi backend

### 2. Mapping Strategy
**Quyết định**: Map nhiều tên cột possible

- **Code change** trong `ExcelPreviewModal.jsx`:
```js
// Category mapping
categoryId: row["Danh mục"] || row.Category || row.CategoryName || row["Loại"] || null

// Size mapping  
size: row.Size || row.size || row["Kích thước"] || null

// Color mapping
color: row.Màu || row.Color || row["Màu sắc"] || null
```

## Risks / Trade-offs

- **[Risk]**: Tên cột Excel không khớp → Người dùng vẫn phải chọn thủ công
  - **Mitigation**: Hiển thị rõ ràng các tên cột được hỗ trợ trong hướng dẫn

- **[Risk]**: Giá trị trong Excel không khớp với danh sách options
  - **Mitigation**: Nếu giá trị không có trong dropdown, hiển thị giá trị gốc và yêu cầu chọn lại
