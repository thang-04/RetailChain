## ADDED Requirements

### Requirement: Store Manager gửi yêu cầu xuất hàng
Store Manager SHALL be able to create a stock request by selecting products, specifying quantities, and adding notes.

#### Scenario: Gửi yêu cầu thành công
- **WHEN** Store Manager fills in product selection, quantity, and note, then clicks "Gửi yêu cầu"
- **THEN** system validates the input, checks stock availability at target warehouse, creates a new stock_request with status PENDING, and returns success response

#### Scenario: Gửi yêu cầu với sản phẩm không đủ tồn kho
- **WHEN** Store Manager selects a product with quantity exceeding available stock
- **THEN** system displays error message "Sản phẩm [name] không đủ tồn kho. Hiện có: [quantity]" and does not create the request

#### Scenario: Gửi yêu cầu với dữ liệu không hợp lệ
- **WHEN** Store Manager submits request with missing required fields (no products selected or quantity = 0)
- **THEN** system displays validation error for each invalid field

### Requirement: Store Manager xem danh sách yêu cầu của cửa hàng
Store Manager SHALL be able to view all stock requests submitted by their store, including status and details.

#### Scenario: Xem danh sách yêu cầu
- **WHEN** Store Manager navigates to the request list view
- **THEN** system displays all requests from their store with columns: request code, date, status, product count, actions

#### Scenario: Lọc yêu cầu theo trạng thái
- **WHEN** Store Manager selects a status filter (e.g., "Chờ duyệt")
- **THEN** system displays only requests with matching status

### Requirement: Store Manager hủy yêu cầu
Store Manager SHALL be able to cancel their own request when it is still in PENDING status.

#### Scenario: Hủy yêu cầu thành công
- **WHEN** Store Manager clicks "Hủy" on a PENDING request
- **THEN** system updates request status to CANCELLED and records cancelled_by, cancelled_at, cancel_reason

#### Scenario: Không thể hủy yêu cầu đã duyệt
- **WHEN** Store Manager attempts to cancel a request with status APPROVED or EXPORTED
- **THEN** system displays error "Không thể hủy yêu cầu đã được xử lý"

### Requirement: SuperAdmin xem danh sách yêu cầu chờ duyệt
SuperAdmin SHALL be able to view all pending stock requests from all stores.

#### Scenario: Xem danh sách chờ duyệt
- **WHEN** SuperAdmin navigates to StockOut page and clicks "Yêu cầu chờ duyệt" tab
- **THEN** system displays all requests with status PENDING from all stores

#### Scenario: Lọc yêu cầu theo cửa hàng
- **WHEN** SuperAdmin selects a specific store from filter
- **THEN** system displays only requests from that store

### Requirement: SuperAdmin duyệt yêu cầu
SuperAdmin SHALL be able to approve a pending request, which automatically creates a TRANSFER document.

#### Scenario: Duyệt yêu cầu thành công
- **WHEN** SuperAdmin clicks "Duyệt" on a PENDING request
- **THEN** system validates current stock, creates TRANSFER document, updates request status to EXPORTED with exported_document_id

#### Scenario: Duyệt yêu cầu thất bại do không đủ tồn kho
- **WHEN** SuperAdmin attempts to approve but stock has changed since request creation
- **THEN** system displays error "Không đủ tồn kho tại thời điểm duyệt" and keeps request status as PENDING

### Requirement: SuperAdmin từ chối yêu cầu
SuperAdmin SHALL be able to reject a pending request with a reason.

#### Scenario: Từ chối yêu cầu
- **WHEN** SuperAdmin clicks "Từ chối" and enters rejection reason
- **THEN** system updates request status to REJECTED with rejected_by, rejected_at, reject_reason

### Requirement: Thông báo cập nhật trạng thái yêu cầu
System SHALL notify both Store Manager and SuperAdmin about request status changes.

#### Scenario: Thông báo khi có yêu cầu mới
- **WHEN** Store Manager creates a new stock request
- **THEN** SuperAdmin sees a notification in StockOut page with message "[Store Name] đã gửi yêu cầu mới"

#### Scenario: Thông báo khi yêu cầu được duyệt
- **WHEN** SuperAdmin approves a request
- **THEN** Store Manager sees a notification in their dashboard with message "Yêu cầu [code] đã được duyệt"

#### Scenario: Thông báo khi yêu cầu bị từ chối
- **WHEN** SuperAdmin rejects a request
- **THEN** Store Manager sees a notification with message "Yêu cầu [code] đã bị từ chối: [reason]"
