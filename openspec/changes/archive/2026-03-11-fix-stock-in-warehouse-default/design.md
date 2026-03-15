## Context

Tại trang tạo phiếu nhập kho (stock-in) trong giao diện admin (`/stock-in/create`), người dùng hiện có thể chọn bất kỳ kho nào từ dropdown, bao gồm cả kho cửa hàng. Tuy nhiên theo luồng nghiệp vụ:

- **Stock-in (Nhập kho)**: Nhập hàng từ nhà cung cấp → Chỉ nhập vào **kho tổng** (central warehouse)
- **Stock-out (Xuất kho)**: Xuất hàng từ kho tổng → Phân phối sang **kho cửa hàng**

Code hiện tại đã set mặc định là kho tổng (line 53-58 StockInWizard.jsx), nhưng người dùng vẫn có thể thay đổi sang kho khác.

## Goals / Non-Goals

**Goals:**
- Ẩn/chặn dropdown chọn kho tại trang stock-in
- Hiển thị tên kho tổng dưới dạng text readonly
- Đảm bảo phiếu nhập kho luôn được tạo với warehouseId của kho tổng

**Non-Goals:**
- Không thay đổi luồng stock-out (xuất kho)
- Không thay đổi API backend
- Không thêm validation mới phía client

## Decisions

1. **Sử dụng text hiển thị thay vì dropdown**
   - Rationale: Đơn giản hóa UI, người dùng không thể thay đổi kho
   - Alternative: Disable dropdown nhưng vẫn hiển thị → Chọn phương án này vì rõ ràng hơn

2. **Giữ nguyên logic lấy warehouse ở StockInWizard**
   - Rationale: Logic đã đúng, chỉ cần sửa UI ở StepOneInfo

## Risks / Trade-offs

- **Risk**: Người dùng muốn nhập trực tiếp vào kho cửa hàng → Mitigation: Không hỗ trợ theo thiết kế nghiệp vụ, hướng dẫn người dùng dùng luồng điều chuyển kho (transfer)
- **Risk**: Khi không có kho tổng → Mitigation: Hiển thị thông báo lỗi
