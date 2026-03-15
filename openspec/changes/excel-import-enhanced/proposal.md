## Why

Chức năng Excel Import hiện tại thiếu các trường bắt buộc theo database schema (category_id, size, color) và không cho phép người dùng chọn dropdown cho các trường foreign key. Cần nâng cấp để:

- Validate đầy đủ các trường NOT NULL trong database
- Cho phép chọn Category, Size, Color qua dropdown thay vì text
- Hỗ trợ chọn Supplier cho phiếu nhập

## What Changes

- Thêm dropdown **Supplier** chung cho toàn bộ phiếu nhập (1 phiếu = 1 supplier)
- Thêm dropdown **Category** bắt buộc cho mỗi dòng sản phẩm (từ API `/api/categories`)
- Thêm dropdown **Size** bắt buộc cho mỗi dòng (values từ DB: S, M, L, XL, 26-43, UNI)
- Thêm dropdown **Color** bắt buộc cho mỗi dòng (values từ DB: Đen, Trắng, Xám, Xanh Navy, Xanh, Hoa, Nâu, Be, Vàng)
- Validation: Nếu chưa chọn Category/Size/Color → hiển thị lỗi, không cho import
- Giữ nguyên các trường text: SKU, ProductName, Quantity, UnitPrice, Description, Note

## Capabilities

### New Capabilities

- **excel-import-enhanced**: Nâng cấp Excel Import với dropdown cho các trường bắt buộc:
  - Supplier dropdown (chung cho document)
  - Category dropdown per-row (bắt buộc)
  - Size dropdown per-row (bắt buộc)  
  - Color dropdown per-row (bắt buộc)
  - Validation đầy đủ theo database schema

### Modified Capabilities

- **stock-in-excel-import**: Cập nhật từ phiên bản basic (chỉ có SKU, tên, số lượng, giá) sang phiên bản đầy đủ với dropdown validation

## Impact

- **Frontend**: 
  - Cập nhật `ExcelPreviewModal.jsx` - thêm dropdown columns
  - Gọi API lấy categories, suppliers
  - Validate bắt buộc chọn Category/Size/Color

- **Backend**: 
  - Cập nhật `importStockFromExcel` để xử lý categoryId, size, color, supplierId
  - API không đổi (đã có `/api/categories`, `/api/suppliers`)

- **Database Schema** (đã xác nhận):
  - products.category_id: NOT NULL
  - product_variants.size: NOT NULL
  - product_variants.color: NOT NULL
