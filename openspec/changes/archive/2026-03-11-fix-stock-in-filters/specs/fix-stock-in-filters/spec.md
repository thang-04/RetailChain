## ADDED Requirements

### Requirement: Bộ lọc tìm kiếm hoạt động đúng
Tìm kiếm theo mã phiếu, nhà cung cấp, tên kho phải hoạt động.

#### Scenario: Tìm theo mã phiếu
- **WHEN** nhập mã phiếu vào ô tìm kiếm
- **THEN** hiển thị các phiếu có mã chứa từ khóa tìm kiếm

#### Scenario: Tìm theo nhà cung cấp
- **WHEN** nhập tên nhà cung cấp vào ô tìm kiếm
- **THEN** hiển thị các phiếu có nhà cung cấp chứa từ khóa

#### Scenario: Tìm theo tên kho
- **WHEN** nhập tên kho vào ô tìm kiếm
- **THEN** hiển thị các phiếu có tên kho đích chứa từ khóa

### Requirement: Bộ lọc trạng thái hoạt động đúng
Lọc theo trạng thái phiếu phải hoạt động.

#### Scenario: Lọc phiếu Hoàn thành
- **WHEN** chọn "Hoàn thành" trong dropdown trạng thái
- **THEN** chỉ hiển thị các phiếu có status = "Completed"

### Requirement: Bộ lọc ngày hoạt động đúng
Lọc theo khoảng ngày phải hoạt động.

#### Scenario: Lọc theo ngày bắt đầu
- **WHEN** chọn ngày bắt đầu
- **THEN** hiển thị các phiếu được tạo từ ngày đó trở đi

#### Scenario: Lọc theo ngày kết thúc
- **WHEN** chọn ngày kết thúc
- **THEN** hiển thị các phiếu được tạo đến ngày đó

### Requirement: Nút làm mới hoạt động đúng
Nút "Làm mới" phải reset tất cả bộ lọc về mặc định.

#### Scenario: Reset bộ lọc
- **WHEN** click nút "Làm mới"
- **THEN** ô tìm kiếm, dropdown trạng thái, ngày bắt đầu, ngày kết thúc được reset về mặc định
