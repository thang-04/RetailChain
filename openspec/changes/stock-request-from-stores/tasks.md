## 1. Database Layer

- [x] 1.1 Tạo enum StockRequestStatus (PENDING, APPROVED, REJECTED, CANCELLED, EXPORTED)
- [x] 1.2 Tạo entity StockRequest với các trường: id, request_code, store_id, target_warehouse_id, status, note, priority, created_by, created_at, approved_by, approved_at, rejected_by, rejected_at, reject_reason, cancelled_by, cancelled_at, cancel_reason, exported_document_id
- [x] 1.3 Tạo entity StockRequestItem với các trường: id, stock_request_id, variant_id, quantity, note
- [x] 1.4 Tạo repository StockRequestRepository với các method: findByStoreId, findByStatus, findById
- [x] 1.5 Tạo repository StockRequestItemRepository

## 2. Backend - DTOs & Services

- [x] 2.1 Tạo StockRequestDTO (request/response) với các trường phù hợp
- [x] 2.2 Tạo StockRequestItemDTO
- [x] 2.3 Tạo StockRequestService interface với các method: createRequest, getPendingRequests, getStoreRequests, approveRequest, rejectRequest, cancelRequest
- [x] 2.4 Tạo StockRequestServiceImpl implement các method với business logic

## 3. Backend - Controller

- [x] 3.1 Tạo StockRequestController với các endpoints:
  - POST /api/stock-request (tạo request)
  - GET /api/stock-request/store/{storeId} (xem request của store)
  - GET /api/stock-request/pending (xem request chờ duyệt)
  - GET /api/stock-request/{id} (chi tiết request)
  - PUT /api/stock-request/{id}/approve (duyệt request)
  - PUT /api/stock-request/{id}/reject (từ chối request)
  - PUT /api/stock-request/{id}/cancel (hủy request)
- [x] 3.2 Thêm security permissions cần thiết (INVENTORY_CREATE, INVENTORY_VIEW, INVENTORY_UPDATE)

## 4. Frontend - Store Dashboard

- [x] 4.1 Tạo stock request service (src/services/stockRequest.service.js) với các API calls
- [x] 4.2 Thêm button "Gửi yêu cầu xuất hàng" trong Store Dashboard
- [x] 4.3 Tạo modal/form tạo request với: chọn sản phẩm (searchable dropdown), nhập số lượng, thêm ghi chú
- [x] 4.4 Tạo danh sách request của cửa hàng trong Store Dashboard
- [x] 4.5 Thêm chức năng hủy request cho các request PENDING

## 5. Frontend - StockOut Page

- [x] 5.1 Thêm tab "Yêu cầu chờ duyệt" trong StockOut page
- [x] 5.2 Hiển thị danh sách request chờ duyệt với filter theo cửa hàng
- [x] 5.3 Tạo modal xem chi tiết request
- [x] 5.4 Thêm button "Duyệt" và "Từ chối" trong mỗi request
- [x] 5.5 Xử lý logic duyệt: gọi API approve, hiển thị kết quả
- [x] 5.6 Xử lý logic từ chối: hiển thị dialog nhập lý do từ chối

## 6. Frontend - Notifications

- [x] 6.1 Thêm tab "Thông báo" trong StockOut page
- [x] 6.2 Hiển thị danh sách thông báo: request mới từ cửa hàng, kết quả duyệt/từ chối
- [x] 6.3 Thêm badge hiển thị số thông báo chưa đọc
- [x] 6.4 Thêm notification trong Store Dashboard cho kết quả request

## 7. Integration & Testing

- [ ] 7.1 Kiểm tra flow gửi request từ Store Dashboard
- [ ] 7.2 Kiểm tra flow duyệt/từ chối từ StockOut page
- [ ] 7.3 Kiểm tra tự động tạo phiếu TRANSFER khi duyệt
- [ ] 7.4 Kiểm tra validation: sản phẩm không đủ tồn kho
- [ ] 7.5 Kiểm tra notification hiển thị đúng
