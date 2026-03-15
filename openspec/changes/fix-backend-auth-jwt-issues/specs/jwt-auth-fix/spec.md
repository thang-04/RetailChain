## ADDED Requirements

### Requirement: JWT Token Validation thành công
Hệ thống phải validate được JWT token từ login để truy cập các API protected.

#### Scenario: Login và lấy token
- **WHEN** người dùng gọi API login với email/password đúng
- **THEN** hệ thống trả về JWT token hợp lệ

#### Scenario: Gọi API protected với token hợp lệ
- **WHEN** người dùng gọi API /api/warehouse với Authorization: Bearer <token>
- **THEN** hệ thống trả về dữ liệu (200 OK)

#### Scenario: Gọi API protected với token không hợp lệ
- **WHEN** người dùng gọi API với token giả mạo hoặc hết hạn
- **THEN** hệ thống trả về 401 Unauthorized

### Requirement: JwtAuthenticationFilter hoạt động đúng
JwtAuthenticationFilter phải validate token và set SecurityContext đúng cách.

#### Scenario: Filter set authentication đúng
- **WHEN** request có header Authorization: Bearer <valid-token>
- **THEN** JwtAuthenticationFilter validate token thành công và set SecurityContext với authorities

#### Scenario: Filter bỏ qua request không có token
- **WHEN** request không có header Authorization
- **THEN** filter cho request đi tiếp mà không block (cho phép anonymous endpoints)

### Requirement: SecurityConfig cho phép API protected
Các endpoint warehouse, inventory phải yêu cầu authentication.

#### Scenario: Warehouse API yêu cầu authentication
- **WHEN** gọi GET /api/warehouse không có token
- **THEN** hệ thống trả về 401 Unauthorized

#### Scenario: Warehouse API với quyền WAREHOUSE_VIEW
- **WHEN** gọi GET /api/warehouse với token có quyền WAREHOUSE_VIEW
- **THEN** hệ thống trả về danh sách warehouse
