## Why

Tại modal chi tiết phiếu nhập kho, cột "Đơn giá" và "Thành tiền" đang hiển thị "--" thay vì hiển thị giá trị từ API. Nguyên nhân là code frontend đang hardcode "--" thay vì sử dụng `item.unitPrice` và `item.totalPrice` từ API response.

## What Changes

- Sửa file `StockInList.jsx` để hiển thị đơn giá và thành tiền từ dữ liệu API
- Sử dụng `item.unitPrice` và `item.totalPrice` thay vì hardcode "--"
- Format số tiền theo định dạng Việt Nam (VND)

## Capabilities

### New Capabilities
- `fix-stock-in-modal-price-display`: Hiển thị đơn giá và thành tiền trong modal chi tiết

### Modified Capabilities
- Không có

## Impact

- File: `RetailChainUi/src/pages/StockIn/StockInList.jsx` - Sửa hiển thị cột đơn giá và thành tiền
- Backend: Không cần thay đổi (đã có API trả về unitPrice và totalPrice)
