## Context

Trang `/stock-in/create` hiện tại là single-page form với:
- Card thông tin chung (chọn NCC)
- Table danh sách sản phẩm (thêm/xóa row)
- Submit button

**Hạn chế hiện tại:**
- Không có step indicator
- Select dropdown dài khi có nhiều sản phẩm
- Thiếu preview trước khi submit
- Không validate trùng lặp sản phẩm

## Goals / Non-Goals

**Goals:**
- Cải thiện UX với wizard 3 bước
- Thêm search nhanh sản phẩm với filter
- Validation real-time và feedback rõ ràng
- Preview order trước submit

**Non-Goals:**
- Thay đổi API contract
- Thêm tính năng xuất Excel/PDF
- Tích hợp barcode scanner

## Decisions

1. **Wizard Structure**: 3 bước sử dụng state local
   - Bước 1: Chọn kho + Nhà cung cấp
   - Bước 2: Thêm sản phẩm (search + add)
   - Bước 3: Review & Xác nhận

2. **Search Component**: Combobox với debounce search
   - Filter theo: category, size, color
   - Hiển thị: SKU, tên sản phẩm, size, color, price

3. **Validation Strategy**:
   - Client-side: check trùng lặp variant
   - Required fields: warehouse, ít nhất 1 sản phẩm

4. **Component Library**: Tiếp tục dùng shadcn/ui
   - Dùng现有的: Card, Button, Input, Select, Table
   - Thêm mới: Dialog (cho confirm), Badge (cho summary)

## Risks / Trade-offs

- [Risk] Nhiều state cần quản lý → Mitigation: Dùng useReducer hoặc tách component
- [Risk] API chậm khi load nhiều sản phẩm → Mitigation: Thêm loading skeleton
- [Risk] Mobile UX không tốt → Mitigation: Responsive layout với grid

## Migration Plan

1. Tạo component mới (không xóa file cũ)
2. Update route để dùng component mới
3. Test E2E với các case: thành công, validation error, network error
4. Deploy và monitor
