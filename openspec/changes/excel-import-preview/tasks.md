## 1. Backend - Tạo API kiểm tra SKU tồn tại

- [x] 1.1 Tạo ProductRepository method `findBySku(String sku)` 
- [x] 1.2 Tạo ProductService method `checkSkuExists(String sku)` trả về ProductExistsResponse (exists: boolean, productId: Long)
- [x] 1.3 Tạo ProductController endpoint `GET /api/products/exists?sku={sku}`
- [x] 1.4 Test API bằng curl - verify trả về đúng JSON

## 2. Frontend - Cập nhật Inventory Service

- [x] 2.1 Thêm method `checkSkuExists(sku)` trong `inventory.service.js` gọi API `GET /api/products/exists`
- [x] 2.2 Verify import existing method `importStockFromExcel` vẫn hoạt động

## 3. Frontend - Tạo Component ExcelPreviewModal

- [x] 3.1 Tạo file `ExcelPreviewModal.jsx` trong `src/components/common/`
- [x] 3.2 Import và sử dụng thư viện `xlsx` để parse file Excel
- [x] 3.3 Implement state: parsedData, errors, selectedRows
- [x] 3.4 Implement hàm validateRow(row) trả về error message hoặc null
- [x] 3.5 Implement gọi API checkSkuExists cho từng SKU
- [x] 3.6 Render table preview với các cột: STT, SKU, Tên SP, Số lượng, Đơn giá, Trạng thái
- [x] 3.7 Thêm checkbox để bỏ qua dòng lỗi
- [x] 3.8 Thêm thống kê: Tổng, Hợp lệ, Lỗi, Sẽ tạo mới
- [x] 3.9 Thêm nút "Hủy" và "Import" 

## 4. Frontend - Tích hợp vào StockInList

- [x] 4.1 Cập nhật `StockInList.jsx` - thay thế nút "Nhập Excel" hiện tại
- [x] 4.2 Thêm state `showPreviewModal` và xử lý mở/đóng modal
- [x] 4.3 Khi chọn file Excel → gọi ExcelPreviewModal với file
- [x] 4.4 Khi click "Import" trong modal → gọi `inventoryService.importStockFromExcel` với dữ liệu đã lọc
- [x] 4.5 Xử lý toast thành công/thất bại và refresh danh sách

## 5. Kiểm thử và Fix bugs

- [ ] 5.1 Test flow: chọn file → preview → import thành công
- [ ] 5.2 Test flow: file lỗi định dạng → hiển thị thông báo lỗi
- [ ] 5.3 Test flow: validate client-side lỗi → hiển thị trong preview
- [ ] 5.4 Test flow: bỏ chọn dòng lỗi → import các dòng còn lại
- [ ] 5.5 Test UI: modal hiển thị đúng trên mobile/desktop
