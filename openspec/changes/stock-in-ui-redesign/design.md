## Context

Stock-in page hiện tại có design cũ với:
- Header đơn giản: FileText icon, background primary/10
- Dark mode classes (dark:...)
- Không có stat cards
- Filter bar không có pills
- Empty state tiếng Anh ("No Records Found")

Stock-out đã được redesign với pattern mới (đã implement stock-out-cards-filter-sync). Cần áp dụng tương tự cho stock-in.

## Goals / Non-Goals

**Goals:**
- Thêm 5 stat cards với filter sync (giống stock-out đã làm)
- Redesign header với gradient emerald + Download icon
- Xóa dark mode classes
- Thêm filter pills
- Sửa empty state tiếng Việt

**Non-Goals:**
- Không tách StatCard thành component reusable (để sau này)
- Không thay đổi table structure (giữ nguyên columns)
- Không thêm feature mới (Excel import giữ nguyên)

## Decisions

### 1. Reuse helper functions từ stock-out
**Decision:** Copy các helper functions từ StockOutList.jsx vào StockInList.jsx:
- `detectTimeframe(start, end)` - detect month/quarter/year/custom
- `getBaselineRange(timeframe, currentStart)` - lấy baseline cho trend
- `formatCompactCurrency(value)` - format 1.5B, 15M

**Rationale:** Logic đã được test ở stock-out, có thể reuse ngay.

### 2. Stat cards variant colors
**Decision:** Sử dụng emerald accent cho stock-in thay vì teal (primary):
- default: primary (giữ brand)
- success: emerald (hoàn thành)
- warning: amber (chờ duyệt)
- danger: red (đã hủy)
- info: sky (giá trị)

**Rationale:** Stock-in là "nhập vào" → màu xanh lá (emerald) phù hợp hơn teal.

### 3. Reuse StatCard component
**Decision:** Định nghĩa StatCard inline trong StockInList.jsx (giống stock-out).

**Rationale:** Tách ra component riêng nằm ngoài scope của task này.

### 4. Excel Import giữ nguyên
**Decision:** Giữ nguyên Excel Import feature với button "Nhập Excel".

**Rationale:** Stock-out chỉ có placeholder, stock-in có function thực tế - giữ lại.

### 5. Table columns giữ nguyên
**Decision:** Giữ nguyên columns, chỉ thêm "Nhà Cung Cấp" nếu chưa có.

**Rationale:** Stock-in có unique column "Nhà Cung Cấp" - giữ nguyên.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Duplicate code helpers | Maintainability | Ghi chú trong code để refactor sau |
| Inconsistent colors | UX | Dùng emerald cho stock-in (khác stock-out) |
| Filter sync logic lỗi | Data display | Test kỹ các scenarios |

## Migration Plan

1. **Bước 1**: Copy helper functions từ stock-out vào stock-in
2. **Bước 2**: Thêm StatCard component inline
3. **Bước 3**: Thêm stats useMemo với filter sync
4. **Bước 4**: Redesign header (gradient + icon)
5. **Bước 5**: Thêm filter pills
6. **Bước 6**: Sửa empty state tiếng Việt
7. **Bước 7**: Xóa dark mode classes
8. **Bước 8**: Test và verify

## Open Questions

- **Q1**: Có cần thay đổi primary color từ teal sang emerald cho toàn app?
  - **A**: Không - chỉ thay đổi accent trong stat cards stock-in
  
- **Q2**: Modal detail có cần thay đổi không?
  - **A**: Giữ nguyên - đã có style tốt