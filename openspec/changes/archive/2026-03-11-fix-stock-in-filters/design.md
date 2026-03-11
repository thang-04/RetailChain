## Context

Trang /stock-in có bộ lọc với các thành phần:
1. Search input - tìm kiếm theo documentCode, supplier, targetWarehouseName
2. Status Select - lọc theo trạng thái (Pending, Completed, Cancelled)
3. Date Range - lọc theo ngày tạo (start, end)
4. Reset Button - làm mới tất cả bộ lọc

## Goals / Non-Goals

**Goals:**
- Kiểm tra search filter hoạt động đúng
- Kiểm tra status filter hoạt động đúng
- Kiểm tra date filter hoạt động đúng
- Kiểm tra reset button hoạt động đúng

**Non-Goals:**
- Thêm tính năng lọc mới
- Thay đổi UI

## Decisions

1. **Kiểm tra code hiện tại**
   - Search filter: Lọc theo documentCode, supplier, targetWarehouseName ✓
   - Status filter: Lọc theo status === statusFilter ✓
   - Date filter: Lọc theo createdAt >= start && createdAt <= end ✓
   - Reset: Set all filters to default ✓

## Risks / Trade-offs

- **Risk**: Code có vẻ đã hoạt động đúng → Cần user xác nhận bằng cách test thực tế
