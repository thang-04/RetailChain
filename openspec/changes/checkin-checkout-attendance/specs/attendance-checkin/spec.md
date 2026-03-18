## ADDED Requirements

### Requirement: Checkin với GPS Location
Nhân viên phải checkin tại vị trí cách cửa hàng không quá 50m tính theo đường thẳng.

#### Scenario: Checkin thành công trong phạm vi cho phép
- **WHEN** nhân viên click nút "Check In" và trình duyệt lấy được GPS location
- **AND** khoảng cách từ vị trí nhân viên đến cửa hàng <= 50m
- **AND** store đang hoạt động (không đóng cửa)
- **THEN** hệ thống lưu attendance_log với check_type = IN
- **AND** trả về thông báo "Checkin thành công"
- **AND** status = "ONTIME" nếu checkin trước giờ bắt đầu ca + 10 phút

#### Scenario: Checkin thất bại do ngoài phạm vi
- **WHEN** nhân viên click nút "Check In" và trình duyệt lấy được GPS location
- **AND** khoảng cách từ vị trí nhân viên đến cửa hàng > 50m
- **THEN** hệ thống trả về lỗi với mã 400
- **AND** thông báo "Bạn phải checkin trong phạm vi 50m từ cửa hàng"

#### Scenario: Checkin muộn so với ca làm việc
- **WHEN** nhân viên checkin sau giờ bắt đầu ca + 10 phút
- **AND** nhân viên có ca làm việc trong ngày
- **THEN** hệ thống lưu attendance_log với status = "LATE"
- **AND** trả về cảnh báo "Bạn đến muộn X phút so với giờ bắt đầu ca"

#### Scenario: Checkin khi đã có record IN chưa checkout (multi-shift)
- **WHEN** nhân viên đã checkin hôm nay nhưng chưa checkout
- **AND** nhân viên click checkin lại (ca tiếp theo trong ngày)
- **THEN** hệ thống tự động đóng phiên cũ với status = "FORGOT"
- **AND** workHours tính đến thời điểm checkin mới
- **AND** tạo record checkin mới cho ca tiếp theo

#### Scenario: Checkin khi Store chưa có GPS config
- **WHEN** cửa hàng chưa có latitude/longitude được cấu hình
- **AND** nhân viên click checkin
- **THEN** hệ thống trả về lỗi 400
- **AND** thông báo "Cửa hàng chưa được cấu hình GPS"

#### Scenario: Checkin khi Store đóng cửa
- **WHEN** store có status = đóng cửa (inactive)
- **AND** nhân viên click checkin
- **THEN** hệ thống trả về lỗi 400
- **AND** thông báo "Cửa hàng đang đóng cửa, không thể checkin"

#### Scenario: Checkin khi trình duyệt không hỗ trợ GPS
- **WHEN** trình duyệt không hỗ trợ Geolocation API
- **THEN** hệ thống trả về lỗi 400
- **AND** thông báo "Trình duyệt không hỗ trợ GPS"

#### Scenario: Checkin khi GPS accuracy thấp
- **WHEN** GPS accuracy > 100m
- **THEN** hệ thống trả về lỗi 400
- **AND** thông báo "Không thể xác định vị trí chính xác, vui lòng thử lại"

#### Scenario: Checkin ngoài giờ làm việc (có warning)
- **WHEN** nhân viên checkin ngoài khoảng thời gian ca được phân
- **THEN** hệ thống vẫn cho phép checkin
- **AND** trả về warning "Bạn đang checkin ngoài giờ làm việc"
- **AND** status = null (không tính LATE)

### Requirement: Tự động phát hiện ca làm việc
Hệ thống phải xác định ca làm việc của nhân viên dựa trên ShiftAssignment của ngày hôm nay.

#### Scenario: Tìm thấy ca làm việc được phân công
- **WHEN** nhân viên có ShiftAssignment cho ngày hôm nay
- **AND** ca có start_time và end_time
- **THEN** hệ thống sử dụng start_time và end_time của ca đó để tính toán status

#### Scenario: Không tìm thấy ca làm việc
- **WHEN** nhân viên không có ShiftAssignment cho ngày hôm nay
- **THEN** hệ thống trả về lỗi 400
- **AND** thông báo "Bạn chưa được phân ca hôm nay, không thể checkin"

#### Scenario: Checkin vào ngày nghỉ (không có ca)
- **WHEN** ngày hôm nay là chủ nhật (hoặc ngày nghỉ của store)
- **AND** nhân viên không có ca làm việc
- **THEN** hệ thống trả về lỗi 400
- **AND** thông báo "Hôm nay là ngày nghỉ, không thể checkin"

#### Scenario: Checkin vào ngày nghỉ (có ca đặc biệt)
- **WHEN** ngày hôm nay là chủ nhật nhưng nhân viên có ca làm việc đặc biệt
- **AND** ShiftAssignment tồn tại cho ngày đó
- **THEN** hệ thống cho phép checkin bình thường

### Requirement: User không thuộc store nào
#### Scenario: User không được phân công store
- **WHEN** user không có store_id trong hệ thống
- **AND** user click checkin
- **THEN** hệ thống trả về lỗi 403
- **AND** thông báo "Bạn không được phân công cửa hàng"
