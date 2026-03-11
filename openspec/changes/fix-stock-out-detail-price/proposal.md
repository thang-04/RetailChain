## Why

Trang stock-out (/stock-out) không hiển thị dữ liệu và modal chi tiết hiển thị "--" cho đơn giá và thành tiền. Nguyên nhân: 1) API gọi sai type (đã fix) 2) Frontend modal hardcoded "--" thay vì dùng item.unitPrice và item.totalPrice từ API

## What Changes

- Sửa StockOutList.jsx modal hiển thị unitPrice và totalPrice từ API
- Tính totalValue tổng từ items

## Capabilities

### New Capabilities
- `fix-stock-out-detail-price`: Fix hiển thị giá trong modal chi tiết stock-out

### Modified Capabilities
- Không có
