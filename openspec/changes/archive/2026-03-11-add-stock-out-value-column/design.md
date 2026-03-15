## Context

Trang danh sách xuất kho hiện tại chỉ hiển thị các cột: Mã phiếu, Ngày tạo, Người tạo, Kho xuất, Kho nhận, Số sản phẩm, Trạng thái. Thiếu cột "Giá trị" để hiển thị tổng tiền của mỗi phiếu xuất kho.

API `GET /inventory/documents` đã trả về trường `totalValue` trong response.

## Goals / Non-Goals

**Goals:**
- Thêm cột "Giá trị" vào bảng danh sách xuất kho
- Hiển thị đúng giá trị từ API (totalValue)
- Định dạng tiền tệ Việt Nam (VND)

**Non-Goals:**
- Không thay đổi API backend
- Không thay đổi logic xử lý dữ liệu
- Không thay đổi các trang khác

## Decisions

1. **Vị trí cột**: Đặt cột "Giá trị" ở cuối bảng, trước cột "Trạng thái"
2. **Định dạng**: Sử dụng hàm formatCurrency đã có sẵn trong dự án
3. **Xử lý null**: Nếu totalValue null/undefined, hiển thị "--"

## Risks / Trade-offs

- [Rủi ro] API không trả về totalValue → Kiểm tra API response trước khi hiển thị
