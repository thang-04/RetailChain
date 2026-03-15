## Why

Trang `/stock-in/create` (StockInWizard) hiển thị thông báo "không tìm thấy kho tổng" ở bước 1 do lỗi type mismatch: frontend đang so sánh `wh.isCentral === true` (Boolean) trong khi backend trả về `isCentral` là Integer (0 hoặc 1) sau khi merge code từ các nhánh.

## What Changes

- Sửa logic kiểm tra `isCentral` trong StockInWizard từ so sánh Boolean sang so sánh Integer (`isCentral === 1`)

## Capabilities

### New Capabilities
- `fix-stock-in-warehouse-check`: Sửa logic kiểm tra kho tổng trong StockInWizard

### Modified Capabilities
- Không có

## Impact

- File bị ảnh hưởng: `RetailChainUi/src/components/StockInWizard/StockInWizard.jsx`
- Không ảnh hưởng đến backend API
