## Why

Trang tạo phiếu xuất kho (/stock-out/create) hiện tại sử dụng form đơn giản, chưa có wizard step như trang stock-in. Cần redesign lại theo cùng chuẩn wizard 3 bước để đảm bảo UX nhất quán: Thông tin → Sản phẩm → Xác nhận.

## What Changes

- Tạo mới `StockOutWizard` component với 3 bước wizard
- Tạo các step components: StepOneInfo, StepTwoProducts, StepThreeConfirm
- Step 1: Chọn kho nguồn (mặc định kho tổng) và kho đích (danh sách kho cửa hàng)
- Step 2: Chọn sản phẩm xuất (có lọc theo category, tìm kiếm)
- Step 3: Xác nhận thông tin và submit
- Update CreateStockOut.jsx để sử dụng wizard mới

## Capabilities

### New Capabilities
- `redesign-stock-out-create-page`: Tạo wizard xuất kho theo chuẩn 3 bước

### Modified Capabilities
- Không có

## Impact

- Frontend:
  - File: `RetailChainUi/src/components/StockOutWizard/` (tạo mới folder)
  - File: `StockOutWizard.jsx` - Component wizard chính
  - File: `ProgressStepper.jsx` - Reuse từ StockInWizard
  - File: `StepOneInfo.jsx` - Thông tin kho xuất/nhận
  - File: `StepTwoProducts.jsx` - Chọn sản phẩm
  - File: `StepThreeConfirm.jsx` - Xác nhận
  - File: `CreateStockOut.jsx` - Update để sử dụng wizard
- Backend: Không cần thay đổi (API transfer đã có)
