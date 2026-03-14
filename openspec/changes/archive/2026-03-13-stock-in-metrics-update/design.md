## Context

Stock-in hiện tại sử dụng stat cards giống stock-out (Tổng phiếu, Chờ duyệt, Hoàn thành, Đã hủy, Giá trị). Tuy nhiên, business logic của nhập kho khác xuất kho:
- Nhập kho: Tạo phiếu → Hoàn thành ngay (không cần duyệt)
- Xuất kho: Tạo phiếu → Chờ duyệt → Hoàn thành/Hủy

Do đó "Chờ duyệt" và "Đã hủy" trong stock-in không có ý nghĩa.

## Goals / Non-Goals

**Goals:**
- Thay thế stat card "Chờ duyệt" → "Tổng sản phẩm"
- Thay thế stat card "Đã hủy" → "Nhà cung cấp"
- Giữ layout 5 cards, giữ nguyên style

**Non-Goals:**
- Không thay đổi stock-out (giữ nguyên)
- Không thay đổi stats logic (filter sync đã có từ task trước)

## Decisions

### 1. Metrics mapping
**Decision:** Thay thế trực tiếp:
- Pending → Tổng sản phẩm (total items count)
- Cancelled → Nhà cung cấp (unique suppliers count)

**Rationale:** Metrics mới có ý nghĩa business rõ ràng cho stock-in.

### 2. Variant colors
**Decision:** Giữ nguyên variant mapping:
- Tổng phiếu: default
- Hoàn thành: success (emerald)
- Tổng sản phẩm: info (sky) - thay cho warning
- Nhà cung cấp: info (sky) - thay cho danger
- Giá trị: info (sky) - giữ nguyên

### 3. Subtitle content
**Decision:** Cập nhật subtitle:
- Tổng sản phẩm: "sản phẩm đã nhập"
- Nhà cung cấp: "nhà cung cấp"

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Inconsistent với stock-out | Visual | Acceptable - business logic khác nhau |
| Nếu lọc date range khác | Metrics thay đổi | Giữ nguyên filter sync từ task trước |

## Migration Plan

1. Cập nhật stats useMemo - đổi tên biến pending → totalItems, cancelled → totalSuppliers
2. Cập nhật StatCard props - đổi title, subtitle, icon
3. Test verify

## Open Questions

- **Q**: Có cần giữ lại variant warning/danger không?
- **A**: Không cần - stock-in không có status Pending/Cancelled