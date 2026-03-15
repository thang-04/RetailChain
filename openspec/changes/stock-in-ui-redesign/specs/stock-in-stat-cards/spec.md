## ADDED Requirements

### Requirement: Stat cards hiển thị tổng quan dữ liệu stock-in
Trang stock-in PHẢI hiển thị 5 stat cards ở vị trí trên cùng, ngay dưới header, để hiển thị tổng quan dữ liệu nhập kho.

#### Scenario: Hiển thị 5 stat cards
- **WHEN** trang stock-in load và có dữ liệu
- **THEN** hiển thị 5 cards: Tổng phiếu, Chờ duyệt, Hoàn thành, Đã hủy, Giá trị

#### Scenario: Stat cards ẩn khi không có dữ liệu
- **WHEN** không có record nào trong database
- **THEN** stat cards KHÔNG hiển thị (giữ nguyên như hiện tại)

#### Scenario: Stat cards ẩn khi đang loading
- **WHEN** đang load dữ liệu (loading = true)
- **THEN** stat cards KHÔNG hiển thị

### Requirement: Stat cards đồng bộ với bộ lọc ngày
Khi người dùng thay đổi bộ lọc ngày, stat cards PHẢI cập nhật dữ liệu tương ứng với khoảng thời gian được chọn.

#### Scenario: Lọc theo tháng
- **WHEN** người dùng chọn "Từ ngày" = 01/03/2026 và "Đến ngày" = 31/03/2026
- **THEN** stat cards hiển thị tổng số phiếu nhập trong tháng 3/2026

#### Scenario: Xóa bộ lọc
- **WHEN** người dùng nhấn "Xóa lọc"
- **THEN** stat cards trở về hiển thị dữ liệu tháng hiện tại

#### Scenario: Custom range không hiển thị trend
- **WHEN** date range là custom (không khớp 1 tháng/quý/năm)
- **THEN** trend indicators ẩn

### Requirement: Metrics bổ sung trong stat cards
Stat cards hiển thị các metrics bổ sung ngoài số lượng phiếu.

#### Scenario: Hiển thị tổng sản phẩm
- **THEN** card "Giá trị" hiển thị subtitle "X sản phẩm" với X = tổng số sản phẩm trong các phiếu

#### Scenario: Hiển thị số nhà cung cấp
- **THEN** card "Giá trị" hiển thị subtitle "từ Y NCC" với Y = số lượng nhà cung cấp unique

### Requirement: Giá trị tiền tệ format thu gọn
Khi giá trị lớn (>= 1 triệu), PHẢI format thu gọn.

#### Scenario: Format triệu (M)
- **WHEN** giá trị >= 1,000,000 và < 1,000,000,000
- **THEN** hiển thị "X.XM" (ví dụ: 15.5M)

#### Scenario: Format tỷ (B)
- **WHEN** giá trị >= 1,000,000,000
- **THEN** hiển thị "X.XB" (ví dụ: 1.5B)

#### Scenario: Format bình thường
- **WHEN** giá trị < 1,000,000
- **THEN** hiển thị đầy đủ với "đ" (ví dụ: 500,000đ)