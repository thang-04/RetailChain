## 1. Chuẩn bị dữ liệu

- [x] 1.1 Import categories từ API vào state
- [x] 1.2 Xây dựng hàm lọc sản phẩm theo category và search term

## 2. Two-Panel Layout

- [x] 2.1 Tạo cấu trúc modal với two-panel (left: product grid, right: selected items)
- [x] 2.2 Thêm responsive classes (1 cột trên mobile, 2 cột trên tablet/desktop)

## 3. Product Grid Panel (Bên trái)

- [x] 3.1 Tạo search input với icon và placeholder
- [x] 3.2 Tạo category tabs component
- [x] 3.3 Xây dựng product grid với 2-3 cột
- [x] 3.4 Hiển thị hình ảnh sản phẩm hoặc placeholder
- [x] 3.5 Thêm visual feedback khi hover (border, shadow)
- [x] 3.6 Thêm checkmark indicator cho sản phẩm đã chọn
- [x] 3.7 Disable click trên sản phẩm đã thêm vào danh sách

## 4. Selected Items Panel (Bên phải)

- [x] 4.1 Hiển thị header với số lượng sản phẩm đã chọn
- [x] 4.2 Tạo danh sách sản phẩm đã chọn với card layout
- [x] 4.3 Thêm nút tăng/giảm số lượng với input
- [x] 4.4 Thêm nút xóa sản phẩm
- [x] 4.5 Thêm textarea cho ghi chú

## 5. Variant Selection Dialog

- [x] 5.1 Tạo dialog component cho việc chọn variant
- [x] 5.2 Hiển thị danh sách variant với SKU, color, size, giá
- [x] 5.3 Thêm input số lượng trong dialog
- [x] 5.4 Xử lý logic khi chọn variant → thêm vào danh sách

## 6. Tích hợp API và Logic

- [x] 6.1 Gọi API categories khi modal mở
- [x] 6.2 Xử lý logic thêm sản phẩm vào danh sách
- [x] 6.3 Xử lý logic tăng/giảm/xóa sản phẩm
- [x] 6.4 Submit request với danh sách items

## 7. Design System & Polish

- [x] 7.1 Áp dụng design tokens (colors, spacing, typography)
- [x] 7.2 Thêm transitions và animations mượt mà
- [x] 7.3 Kiểm tra dark mode compatibility
- [x] 7.4 Test responsive trên các kích thước màn hình

## 8. Verification

- [x] 8.1 Chạy lint và fix errors
- [x] 8.2 Test thủ công: mở modal, thêm sản phẩm, gửi request
- [x] 8.3 Verify UI match với design specs
