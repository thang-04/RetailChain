## 1. Kiểm tra và sửa API Backend

- [x] 1.1 Kiểm tra API DELETE /api/stock-in/{id} có hoạt động không
- [x] 1.2 Nếu chưa có, tạo mới endpoint DELETE trong StockInController
- [x] 1.3 Kiểm tra API POST /api/stock-in (tạo mới) trả về đúng status

## 2. Sửa lỗi xóa phiếu nhập (Frontend)

- [x] 2.1 Thêm Dialog component (shadcn/ui) vào StockInList.jsx
- [x] 2.2 Tạo state cho dialog xác nhận xóa
- [x] 2.3 Gọi API DELETE khi xác nhận xóa
- [x] 2.4 Thêm toast thông báo kết quả (thành công/lỗi)
- [x] 2.5 Cập nhật danh sách sau khi xóa

## 3. Sửa lỗi nhập từ Excel (Frontend)

- [x] 3.1 Gắn file input vào button "Nhập Excel"
- [x] 3.2 Cài đặt thư viện xlsx (SheetJS) - Sử dụng backend để parse
- [x] 3.3 Tạo hàm parse file Excel
- [x] 3.4 Validate dữ liệu từ file
- [x] 3.5 Gọi API tạo phiếu với dữ liệu từ file
- [x] 3.6 Hiển thị toast kết quả import

## 4. Sửa trạng thái mặc định

- [x] 4.1 Sửa backend: thay đổi default status thành PENDING khi tạo phiếu
- [x] 4.2 Hoặc sửa frontend: gửi status = PENDING trong request tạo phiếu
- [x] 4.3 Verify: tạo phiếu mới phải có trạng thái "Chờ duyệt"

## 5. Cải thiện UX (LOW priority)

- [ ] 5.1 Cải thiện date picker cho lọc theo ngày
- [ ] 5.2 Sửa bug hiển thị "Tổng số lượng" khi chưa chọn sản phẩm

## 6. Test và verify

- [ ] 6.1 Test xóa phiếu: click xóa, xác nhận, kiểm tra danh sách
- [ ] 6.2 Test nhập Excel: tạo file mẫu, import, kiểm tra phiếu được tạo
- [ ] 6.3 Test tạo phiếu mới: verify trạng thái là "Chờ duyệt"
