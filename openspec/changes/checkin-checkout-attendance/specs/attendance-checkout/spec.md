## ADDED Requirements

### Requirement: Checkout với GPS Location
Nhân viên phải checkout tại vị trí cách cửa hàng không quá 50m tính theo đường thẳng.

#### Scenario: Checkout thành công trong phạm vi cho phép
- **WHEN** nhân viên click nút "Check Out" và trình duyệt lấy được GPS location
- **AND** khoảng cách từ vị trí nhân viên đến cửa hàng <= 50m
- **AND** store đang hoạt động
- **THEN** hệ thống lưu attendance_log với check_type = OUT
- **AND** tính workHours = checkoutTime - checkinTime
- **AND** trả về thông báo "Checkout thành công"

#### Scenario: Checkout thất bại do ngoài phạm vi
- **WHEN** nhân viên click nút "Check Out" và khoảng cách > 50m
- **THEN** hệ thống trả về lỗi 400
- **AND** thông báo "Bạn phải checkout trong phạm vi 50m từ cửa hàng"

#### Scenario: Checkout khi chưa checkin
- **WHEN** nhân viên click checkout mà chưa checkin trong ngày
- **THEN** hệ thống trả về lỗi 400
- **AND** thông báo "Bạn chưa checkin hôm nay"

#### Scenario: Checkout sớm (Early Leave)
- **WHEN** nhân viên checkout trước giờ kết thúc ca - 10 phút
- **AND** nhân viên có ca làm việc trong ngày
- **THEN** hệ thống lưu status = "EARLY_LEAVE"
- **AND** trả về cảnh báo "Bạn checkout sớm X phút so với giờ kết thúc ca"

#### Scenario: Checkout bình thường (trong giờ làm việc)
- **WHEN** nhân viên checkout trong khoảng giờ cho phép (endTime - 10p đến endTime + 30p)
- **THEN** hệ thống giữ nguyên status từ checkin (ONTIME hoặc LATE)

#### Scenario: Checkout ngoài giờ làm việc
- **WHEN** nhân viên checkout ngoài khoảng thời gian ca được phân
- **THEN** hệ thống vẫn cho phép checkout
- **AND** trả về warning "Bạn đang checkout ngoài giờ làm việc"

#### Scenario: Checkout khi Store đóng cửa
- **WHEN** store có status = đóng cửa
- **AND** nhân viên click checkout
- **THEN** hệ thống trả về lỗi 400
- **AND** thông báo "Cửa hàng đang đóng cửa"

### Requirement: Tính toán số giờ làm việc tự động
Hệ thống phải tính toán số giờ làm việc dựa trên thời gian checkin và checkout.

#### Scenario: Tính workHours bình thường
- **WHEN** nhân viên checkin lúc 08:00 và checkout lúc 17:00
- **THEN** workHours = 9.0 giờ

#### Scenario: Tính workHours qua ngày (ca đêm)
- **WHEN** nhân viên checkin lúc 22:00 ngày hôm nay và checkout lúc 06:00 ngày hôm sau
- **THEN** workHours = 8.0 giờ (tính đúng qua đêm)

#### Scenario: Tính workHours cho multi-shift (nhiều ca trong ngày)
- **WHEN** nhân viên checkin Ca Sáng (08:00), chưa checkout
- **AND** checkin lại Ca Chiều (13:00) cùng ngày
- **THEN** hệ thống tự động close record Ca Sáng với workHours = 5.0
- **AND** tạo record mới cho Ca Chiều

#### Scenario: Work hours > 12 giờ (warning)
- **WHEN** workHours > 12.0 giờ
- **THEN** hệ thống vẫn lưu bình thường
- **AND** trả về warning "Cảnh báo: Thời gian làm việc > 12 giờ, vui lòng kiểm tra lại"

#### Scenario: Checkout time trước checkin time (validation error)
- **WHEN** checkoutTime <= checkinTime
- **THEN** hệ thống trả về lỗi 400
- **AND** thông báo "Thời gian checkout phải sau thời gian checkin"

### Requirement: Xử lý quên checkout
Hệ thống phải xử lý các trường hợp nhân viên quên checkout.

#### Scenario: Auto close khi checkin mới trong ngày
- **WHEN** nhân viên checkin lúc 08:00 (Ca Sáng), chưa checkout
- **AND** nhân viên checkin lại lúc 14:00 (Ca Chiều) cùng ngày
- **THEN** hệ thống tự động close record cũ lúc 14:00
- **AND** status = "FORGOT" cho record cũ
- **AND** workHours tính đến 14:00

#### Scenario: Batch job auto-close qua midnight
- **WHEN** batch job chạy lúc 01:00 hàng ngày
- **AND** tìm thấy các attendance_log có check_type = IN mà occurred_at < hôm qua
- **THEN** hệ thống tạo record checkout với occurred_at = 23:59:59 của ngày hôm qua
- **AND** status = "FORGOT"
- **AND** workHours tính đến 23:59:59
- **AND** log để theo dõi

#### Scenario: Batch job - record đã được xử lý
- **WHEN** batch job tìm thấy record đã có trạng thái FORGOT
- **THEN** hệ thống bỏ qua, không xử lý lại
