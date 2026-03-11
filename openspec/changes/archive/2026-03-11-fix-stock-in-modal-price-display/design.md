## Context

Tại modal chi tiết phiếu nhập kho trong StockInList.jsx, các cột "Đơn giá" và "Thành tiền" đang hiển thị "--" thay vì giá trị thực từ API. Nguyên nhân là code đang hardcode string "--" thay vì sử dụng `item.unitPrice` và `item.totalPrice`.

API đã trả về đầy đủ các trường:
- `unitPrice`: đơn giá (VD: 199000)
- `totalPrice`: thành tiền (VD: 1990000)

## Goals / Non-Goals

**Goals:**
- Hiển thị đơn giá từ `item.unitPrice`
- Hiển thị thành tiền từ `item.totalPrice`
- Format số tiền theo định dạng Việt Nam (có dấu phẩy, thêm "đ")

**Non-Goals:**
- Thay đổi logic backend
- Thay đổi các phần khác của UI

## Decisions

1. **Sử dụng toLocaleString cho format tiền**
   - Rationale: Cách đơn giản nhất, format chuẩn Việt Nam

## Risks / Trade-offs

- **Risk**: Giá trị null/undefined → Mitigation: Sử dụng `(item.unitPrice || 0).toLocaleString()`
