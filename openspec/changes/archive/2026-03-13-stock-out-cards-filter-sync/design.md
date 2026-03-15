## Context

Trang `/stock-out` hiện tại có stat cards và table data sử dụng 2 bộ lọc khác nhau:
- **Stat cards**: Luôn hiển thị dữ liệu "tháng hiện tại" (hardcoded logic trong `useMemo` lines 172-208)
- **Table**: Sử dụng `dateFilter` state từ lines 125, 155-161

Khi người dùng lọc ngày trong table, cards không thay đổi - gây inconsistency.

## Goals / Non-Goals

**Goals:**
- Đồng bộ date filter giữa stat cards và table
- Tự động detect timeframe type (tháng/quý/năm/custom) để tính trend đúng
- Xử lý edge case khi filter rộng (format tiền tệ thu gọn)

**Non-Goals:**
- Không thay đổi UI layout hiện tại của stat cards
- Không tách StatCard thành component reusable (nằm ngoài scope)
- Không làm real-time update khi có phiếu mới (vẫn giữ reload page)

## Decisions

### 1. Sử dụng dateFilter state hiện có cho cả cards và table
**Alternatives considered:**
- Tạo state riêng cho cards filter → ❌ Thêm complexity, UX không nhất quán
- Tách filter thành context/global state → ❌ Over-engineering cho single page

**Decision:** Dùng `dateFilter` state hiện có (lines 125), pass vào stats useMemo.

### 2. Tự động detect timeframe type
**Algorithm:**
```javascript
const detectTimeframe = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = (end - start) / (1000 * 60 * 60 * 24);
  
  // ~30 days = 1 month
  if (diffDays >= 25 && diffDays <= 35) return 'month';
  
  // ~90 days = 1 quarter
  if (diffDays >= 85 && diffDays <= 95) return 'quarter';
  
  // ~365 days = 1 year
  if (diffDays >= 350 && diffDays <= 380) return 'year';
  
  // Custom range
  return 'custom';
};
```

### 3. Trend calculation dựa trên timeframe type
**Decision:** Mỗi timeframe có baseline riêng:
- `month` → tháng trước
- `quarter` → quý trước
- `year` → năm trước
- `custom` → ẩn trend

### 4. Format giá trị tiền tệ thu gọn
**Decision:** Khi giá trị > 1 tỷ, format thành "X.XB":
```javascript
const formatCurrency = (value) => {
  if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
  return value.toLocaleString('vi-VN') + 'đ';
};
```

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Date filter không set (empty) | Cards lấy mặc định = tháng này | Xử lý: nếu cả start và end = '' → dùng current month |
| User lọc ngày mai (future) | Cards hiển thị 0 | Acceptable - đúng behavior |
| Performance khi records > 10k | Filter chạy lại nhiều lần | Sử dụng `useMemo` đã có - đủ tốt |

## Migration Plan

1. **Bước 1**: Refactor `stats` useMemo (lines 172-208) để nhận `dateFilter` params
2. **Bước 2**: Thêm helper function `detectTimeframe()` và `getBaselineRange()`
3. **Bước 3**: Cập nhật trend calculation logic theo timeframe
4. **Bước 4**: Thêm format currency helper cho large values
5. **Bước 5**: Test các scenario đã defined trong spec

## Open Questions

- **Q1**: Có cần thêm loading state cho cards khi đang filter không?
  - **A**: Không cần - filter là synchronous, không call API
  
- **Q2**: Search và status filter có cần ảnh hưởng đến cards không?
  - **A**: Hiện tại: KHÔNG - chỉ date filter ảnh hưởng đến cards (giữ nhất quán với requirement)