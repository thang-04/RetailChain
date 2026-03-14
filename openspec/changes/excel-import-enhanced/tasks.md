## 1. Frontend - Cập nhật ExcelPreviewModal

- [x] 1.1 Thêm state: categories, suppliers, sizes, colors
- [x] 1.2 Gọi API `/api/categories` khi modal mở
- [x] 1.3 Gọi API `/api/suppliers` khi modal mở
- [x] 1.4 Định nghĩa mảng sizes cố định: S, M, L, XL, 26-43, UNI
- [x] 1.5 Định nghĩa mảng colors cố định: Đen, Trắng, Xám, Xanh Navy, Xanh, Hoa, Nâu, Be, Vàng

## 2. Frontend - Thêm Supplier Dropdown

- [x] 2.1 Thêm Supplier dropdown ở phần "Thông tin chung" (chung cho toàn bộ)
- [x] 2.2 Validate: bắt buộc chọn Supplier trước khi Import
- [x] 2.3 Pass supplierId xuống backend khi import

## 3. Frontend - Thêm Category/Size/Color Dropdown per-row

- [x] 3.1 Thêm Category dropdown column trong table preview
- [x] 3.2 Thêm Size dropdown column trong table preview
- [x] 3.3 Thêm Color dropdown column trong table preview
- [x] 3.4 Validate: bắt buộc chọn cả 3 (Category, Size, Color) mỗi dòng

## 4. Frontend - Validation tổng hợp

- [x] 4.1 Disable Import button nếu chưa chọn Supplier
- [x] 4.2 Disable Import button nếu có dòng nào chưa chọn Category/Size/Color
- [x] 4.3 Hiển thị số lỗi trong nút Import: "Nhập kho (3 dòng, 2 lỗi)"

## 5. Backend - Cập nhật InventoryService

- [x] 5.1 Thêm SupplierRepository vào InventoryServiceImpl
- [x] 5.2 Cập nhật importStockFromExcel nhận thêm: categoryId, size, color, supplierId
- [x] 5.3 Resolve supplier name → supplierId trong backend
- [x] 5.4 Gán categoryId khi tạo product mới
- [x] 5.5 Gán size, color khi tạo variant mới
- [x] 5.6 Gán supplierId cho inventory_document

## 6. Testing

- [ ] 6.1 Test: Load categories/suppliers khi mở modal
- [ ] 6.2 Test: Validate - không chọn Supplier → lỗi
- [ ] 6.3 Test: Validate - không chọn Category/Size/Color → lỗi per-row
- [ ] 6.4 Test: Import thành công với đầy đủ dropdown
- [ ] 6.5 Test: Kiểm tra database sau khi import
