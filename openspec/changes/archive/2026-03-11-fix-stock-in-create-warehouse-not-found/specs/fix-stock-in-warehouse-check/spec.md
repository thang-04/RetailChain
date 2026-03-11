## ADDED Requirements

### Requirement: StockInWizard phải tìm thấy kho tổng
StockInWizard phải có thể tìm và chọn warehouse có isCentral = 1 một cách chính xác.

#### Scenario: Tìm kho tổng khi load trang
- **WHEN** StockInWizard load dữ liệu warehouses
- **THEN** warehouse có isCentral = 1 được tìm thấy và auto-select

#### Scenario: So sánh isCentral với Integer
- **WHEN** backend trả về isCentral là Integer (0 hoặc 1)
- **THEN** điều kiện `wh.isCentral === 1` phải đúng cho kho tổng
