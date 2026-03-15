## Why

Code fix đã được apply để lưu totalAmount khi tạo phiếu TRANSFER mới, nhưng các phiếu cũ trong database vẫn có total_amount = NULL. Cần cập nhật dữ liệu hiện có để hiển thị đúng giá trị trên frontend.

## What Changes

- Chạy câu lệnh SQL để update total_amount cho các phiếu TRANSFER có sẵn
- Tính tổng từ bảng inventory_document_item (sum(quantity * price))

## Capabilities

### New Capabilities

- `update-existing-transfer-total`: Cập nhật total_amount cho các phiếu TRANSFER cũ

### Modified Capabilities

- (không có)

## Impact

- Database: Cập nhật bảng inventory_document
- Không ảnh hưởng code backend
