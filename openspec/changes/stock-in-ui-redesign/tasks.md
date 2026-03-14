## 1. Helper Functions

- [x] 1.1 Copy `detectTimeframe(start, end)` từ stock-out
- [x] 1.2 Copy `getBaselineRange(timeframe, currentStart)` từ stock-out
- [x] 1.3 Copy `formatCompactCurrency(value)` từ stock-out

## 2. StatCard Component

- [x] 2.1 Thêm StatCard component vào StockInList.jsx (giống stock-out)
- [x] 2.2 Định nghĩa variants: default, success, warning, danger, info (emerald accent)

## 3. Stats Logic với Filter Sync

- [x] 3.1 Thêm stats useMemo với dateFilter state
- [x] 3.2 Tính total, pending, completed, cancelled
- [x] 3.3 Tính totalValue với format compact
- [x] 3.4 Tính totalItems và unique suppliers
- [x] 3.5 Tính trend theo timeframe type

## 4. Header Redesign

- [x] 4.1 Thay đổi icon từ FileText sang Download
- [x] 4.2 Thêm gradient background (emerald)
- [x] 4.3 Đổi title "Quản Lý Nhập Kho" → "Nhập Kho"
- [x] 4.4 Update subtitle

## 5. Filter Pills

- [x] 5.1 Thêm FilterPill component
- [x] 5.2 Thêm logic hasActiveFilters
- [x] 5.3 Hiển thị pills khi có filter
- [x] 5.4 Thêm onRemove handler cho từng pill

## 6. Filter Bar Updates

- [x] 6.1 Giữ nguyên filter inputs (search, status, date)
- [x] 6.2 Cập nhật status values: 'ALL' → 'all' (đồng bộ với stock-out)
- [x] 6.3 Giữ Excel Import button

## 7. Empty State

- [x] 7.1 Sửa title "No Records Found" → "Chưa có phiếu nhập kho"
- [x] 7.2 Sửa subtitle sang tiếng Việt
- [x] 7.3 Đổi icon FileText → Download

## 8. Dark Mode Removal

- [x] 8.1 Xóa tất cả class `dark:` trong StockInList.jsx
- [x] 8.2 Thay thế bằng light mode classes (bg-background, text-foreground)

## 9. Table Updates

- [x] 9.1 Giữ nguyên columns
- [x] 9.2 Cập nhật status badge style (giống stock-out)
- [x] 9.3 Giữ Excel Import functionality

## 10. Testing & Verification

- [ ] 10.1 Verify stat cards hiển thị đúng
- [ ] 10.2 Verify filter sync hoạt động
- [ ] 10.3 Verify filter pills hoạt động
- [ ] 10.4 Verify empty state tiếng Việt
- [ ] 10.5 Verify không còn dark mode classes
- [x] 10.6 Run lint kiểm tra errors