## Why

Tại trang tạo phiếu nhập kho (stock-in) trong giao diện admin, người dùng có thể chọn bất kỳ kho nào để nhập hàng, bao gồm cả kho cửa hàng. Tuy nhiên theo luồng nghiệp vụ đúng, nhập kho (stock-in) chỉ nên nhập vào kho tổng (central warehouse), sau đó xuất kho (stock-out) mới phân phối sang kho cửa hàng. Cần sửa để kho nhập hàng mặc định là kho tổng và không cho phép chọn kho khác.

## What Changes

- Ẩn dropdown chọn kho tại trang tạo phiếu nhập kho (StockInWizard)
- Hiển thị trường "Kho nhập hàng" dưới dạng text hiển thị (read-only) thay vì dropdown có thể chọn
- Luôn sử dụng kho tổng (isCentral=true) làm điểm đến của phiếu nhập kho
- Giữ nguyên logic lấy dữ liệu kho tổng từ API (hiện tại đã có)

## Capabilities

### New Capabilities
- `fix-stock-in-warehouse-default`: Sửa giao diện stock-in để chỉ nhập vào kho tổng

### Modified Capabilities
- Không có

## Impact

- File: `RetailChainUi/src/components/StockInWizard/StepOneInfo.jsx` - Sửa UI warehouse selection
- File: `RetailChainUi/src/components/StockInWizard/StockInWizard.jsx` - Logic đã đúng, không cần thay đổi
- Không ảnh hưởng đến API backend
- Không ảnh hưởng đến chức năng xuất kho (stock-out)
