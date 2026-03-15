## 1. Implement Fuzzy Matching

- [x] 1.1 Tạo hàm fuzzyMatch với 3-tier strategy (exact, DB contains Excel, Excel contains DB)
- [x] 1.2 Thêm trim() cho giá trị từ Excel trước khi so khớp
- [x] 1.3 Apply fuzzy matching cho category trong handleFileSelect
- [x] 1.4 Apply fuzzy matching cho size (sử dụng SIZES array)
- [x] 1.5 Apply fuzzy matching cho color (sử dụng COLORS array)

## 2. Testing

- [ ] 2.1 Test exact match: "Áo Thun" → "Áo Thun"
- [ ] 2.2 Test partial match: "Quần" → "Quần Jeans" (DB contains Excel)
- [ ] 2.3 Test partial match: "Jeans" → "Quần Jeans" (Excel contains DB)
- [ ] 2.4 Test whitespace: "  Áo Thun  " → "Áo Thun"
- [ ] 2.5 Test no match: giá trị không tồn tại → hiển thị gốc
