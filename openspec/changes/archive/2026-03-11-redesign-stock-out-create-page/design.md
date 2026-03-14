## Context

Trang stock-out/create hiện tại sử dụng form đơn giản. Cần redesign theo wizard 3 bước giống như stock-in để đảm bảo UX nhất quán.

Luồng nghiệp vụ xuất kho:
- Xuất hàng từ **kho tổng** (central warehouse) 
- Đến **kho cửa hàng** (store warehouse)

## Goals / Non-Goals

**Goals:**
- Tạo wizard 3 bước: Thông tin → Sản phẩm → Xác nhận
- Step 1: Chọn kho nguồn (auto chọn kho tổng) và kho đích (danh sách kho cửa hàng)
- Step 2: Chọn sản phẩm xuất với filter category và search
- Step 3: Xác nhận và submit
- Sử dụng ProgressStepper component có sẵn

**Non-Goals:**
- Không thay đổi API backend
- Không thêm tính năng mới ngoài wizard

## Decisions

1. **Tái sử dụng StockInWizard pattern**
   - Rationale: Đã có sẵn, đảm bảo UX nhất quán
   - Copy cấu trúc và adapt cho stock-out

2. **Reuse ProgressStepper**
   - Rationale: Giảm trùng lặp code

3. **Sử dụng UI components có sẵn**
   - shadcn/ui components: Card, Button, Input, Select, Table, etc.
   - Lucide icons

## Risks / Trade-offs

- **Risk**: Logic khác nhau giữa import và transfer → Mitigation: Adapt data flow riêng cho từng step
