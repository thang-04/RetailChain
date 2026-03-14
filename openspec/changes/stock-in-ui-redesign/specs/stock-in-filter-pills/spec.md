## ADDED Requirements

### Requirement: Filter pills hiển thị active filters
Khi có bất kỳ filter nào đang active, PHẢI hiển thị filter pills.

#### Scenario: Không có filter
- **WHEN** không có search term, không có date filter, status = all
- **THEN** filter pills KHÔNG hiển thị

#### Scenario: Có search filter
- **WHEN** searchTerm không rỗng
- **THEN** hiển thị pill: [Tìm kiếm: "term"] với nút X để xóa

#### Scenario: Có status filter
- **WHEN** statusFilter không = "all"
- **THEN** hiển thị pill: [Trạng thái: "label"] với nút X để xóa

#### Scenario: Có date filter
- **WHEN** dateFilter.start hoặc dateFilter.end không rỗng
- **THEN** hiển thị pill: [Từ ngày: dd/mm/yyyy] và/hoặc [Đến ngày: dd/mm/yyyy]

#### Scenario: Xóa filter bằng pill
- **WHEN** người dùng click nút X trên pill
- **THEN** filter tương ứng được reset về mặc định
- **AND** cards và table cập nhật

### Requirement: Filter pills style
Filter pills PHẢI có style nhất quán với stock-out.

#### Scenario: Pill style
- **WHEN** hiển thị pills
- **THEN** sử dụng: inline-flex, gap-1.5, px-3 py-1.5, bg-primary/10, text-primary, rounded-full
- **AND** label uppercase với opacity thấp hơn

### Requirement: Reset all filters button
Button "Xóa lọc" PHẢI reset tất cả filters về mặc định.

#### Scenario: Reset all
- **WHEN** người dùng click "Xóa lọc"
- **THEN** searchTerm = '', statusFilter = 'all', dateFilter = {start: '', end: ''}
- **AND** pills ẩn đi