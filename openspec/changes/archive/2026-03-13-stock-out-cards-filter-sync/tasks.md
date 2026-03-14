## 1. Chuẩn bị

- [x] 1.1 Review lại file `StockOutList.jsx` (lines 172-208 - stats useMemo hiện tại)
- [x] 1.2 Tạo backup hoặc note lại logic cũ để so sánh

## 2. Helper Functions

- [x] 2.1 Tạo hàm `detectTimeframe(start, end)` - detect loại timeframe
- [x] 2.2 Tạo hàm `getBaselineRange(timeframe)` - lấy baseline cho trend
- [x] 2.3 Tạo hàm `formatCompactCurrency(value)` - format tiền tệ thu gọn (1.5B, 15M)

## 3. Refactor Stats Logic

- [x] 3.1 Cập nhật `stats` useMemo để sử dụng `dateFilter` state
- [x] 3.2 Xử lý edge case: khi dateFilter rỗng → dùng tháng hiện tại
- [x] 3.3 Tích hợp `detectTimeframe` vào logic tính stats
- [x] 3.4 Cập nhật trend calculation theo timeframe type
- [x] 3.5 Xử lý custom range → ẩn trend

## 4. Testing & Verification

- [ ] 4.1 Test: Lọc tháng cụ thể → cards hiển thị đúng
- [ ] 4.2 Test: Lọc quý → trend = so với quý trước
- [ ] 4.3 Test: Lọc cả năm → format tiền tệ thu gọn (1.5B)
- [ ] 4.4 Test: Custom range → trend ẩn
- [ ] 4.5 Test: Xóa filter → cards về tháng hiện tại

## 5. Cleanup

- [x] 5.1 Verify code không có console.log thừa
- [x] 5.2 Review lại layout stat cards sau khi thay đổi