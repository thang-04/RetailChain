## Why

Hiện tại, chức năng **Nhập Excel** trong trang Phiếu nhập kho chỉ cho phép người dùng chọn file Excel và gửi trực tiếp lên server mà không có bước xem trước dữ liệu. Điều này gây ra nhiều vấn đề:

- Người dùng không biết dữ liệu có hợp lệ hay không trước khi import
- Lỗi Excel (sai định dạng, SKU không tồn tại) chỉ được phát hiện sau khi import thất bại
- Không thể xem trước sản phẩm mới sẽ được tạo vs sản phẩm đã có trong hệ thống

Cần xây dựng tính năng **Excel Import with Preview** để cho phép người dùng xem trước dữ liệu, validate và quyết định có import hay không.

## What Changes

- Thêm bước **Preview** sau khi chọn file Excel - hiển thị dữ liệu trong modal
- Validate dữ liệu client-side trước khi import (giá > 0, số hợp lệ, không để trống)
- Kiểm tra tồn tại của SKU qua API - hiển thị nhãn "🆕 Sẽ tạo mới" nếu SKU chưa có trong hệ thống
- Hiển thị lỗi chi tiết từng dòng và cho phép bỏ qua dòng lỗi
- Giữ nguyên API endpoint hiện tại `POST /api/inventory/import/excel`

## Capabilities

### New Capabilities

- **excel-import-preview**: Tính năng cho phép xem trước, validate và import dữ liệu từ Excel với các bước:
  - Parse file Excel client-side bằng thư viện xlsx
  - Validate dữ liệu (giá > 0, số lượng hợp lệ, các trường bắt buộc)
  - Kiểm tra SKU tồn tại qua API backend
  - Hiển thị preview trong modal với trạng thái từng dòng (hợp l/lỗi/mới)
  - Cho phép bỏ qua dòng lỗi và tiếp tục import

### Modified Capabilities

- **stock-in-management**: Cập nhật luồng nhập kho từ "chọn file → gửi ngay" sang "chọn file → preview → xác nhận import"

## Impact

- **Frontend**: 
  - Cập nhật `StockInList.jsx` - thay thế nút "Nhập Excel" hiện tại
  - Tạo component `ExcelPreviewModal.jsx` mới
  - Cập nhật `inventory.service.js` - thêm method kiểm tra SKU tồn tại

- **Backend**: 
  - Tạo mới API `GET /api/products/exists?sku=...` để kiểm tra SKU tồn tại

- **Dependencies**: 
  - Thêm thư viện `xlsx` cho frontend (đã có sẵn trong project)
