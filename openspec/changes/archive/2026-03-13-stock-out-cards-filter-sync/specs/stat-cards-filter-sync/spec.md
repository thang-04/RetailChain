## ADDED Requirements

### Requirement: Stat cards đồng bộ với bộ lọc ngày
Khi người dùng thay đổi bộ lọc ngày (từ ngày / đến ngày), stat cards PHẢI cập nhật dữ liệu tương ứng với khoảng thời gian được chọn.

#### Scenario: Lọc theo tháng cụ thể
- **WHEN** người dùng chọn "Từ ngày" = 01/03/2026 và "Đến ngày" = 31/03/2026
- **THEN** stat cards hiển thị tổng số phiếu xuất trong tháng 3/2026

#### Scenario: Lọc theo quý
- **WHEN** người dùng chọn "Từ ngày" = 01/01/2026 và "Đến ngày" = 31/03/2026
- **THEN** stat cards hiển thị tổng số phiếu xuất trong Q1/2026

#### Scenario: Xóa bộ lọc
- **WHEN** người dùng nhấn "Xóa lọc" (clear filters)
- **THEN** stat cards trở về hiển thị dữ liệu tháng hiện tại

### Requirement: Trend calculation theo timeframe type
Hệ thống PHẢI tính toán trend dựa trên loại khoảng thời gian đang được lọc.

#### Scenario: Filter 1 tháng
- **WHEN** date range = 1 tháng (ví dụ: tháng 3/2026)
- **THEN** trend = ((tổng tháng 3) - (tổng tháng 2)) / (tổng tháng 2) * 100

#### Scenario: Filter 1 quý
- **WHEN** date range = 1 quý (ví dụ: Q1/2026)
- **THEN** trend = ((tổng Q1) - (tổng Q4/2025)) / (tổng Q4/2025) * 100

#### Scenario: Filter 1 năm
- **WHEN** date range = 1 năm (ví dụ: 2026)
- **THEN** trend = ((tổng 2026) - (tổng 2025)) / (tổng 2025) * 100

#### Scenario: Custom range (không khớp 1 tháng/quý/năm)
- **WHEN** date range = custom (ví dụ: 15/02/2026 - 20/03/2026)
- **THEN** trend KHÔNG hiển thị (ẩn)

### Requirement: Xử lý edge case khi filter rộng
Khi người dùng lọc khoảng thời gian rộng (cả năm), stat cards vẫn PHẢI hiển thị đúng dữ liệu đã aggregate.

#### Scenario: Lọc cả năm
- **WHEN** người dùng lọc "Từ ngày" = 01/01/2026 và "Đến ngày" = 31/12/2026
- **THEN** cards "Tổng phiếu" hiển thị tổng cả năm
- **AND** cards "Giá trị" hiển thị tổng giá trị cả năm với format thu gọn (ví dụ: 1.5B thay vì 1,500,000,000)

### Requirement: Empty state
Khi không có dữ liệu trong khoảng thời gian được lọc, stat cards PHẢI ẩn hoàn toàn.

#### Scenario: Không có dữ liệu trong range
- **WHEN** date range được chọn không có record nào
- **THEN** stat cards không hiển thị (giữ nguyên như hiện tại)