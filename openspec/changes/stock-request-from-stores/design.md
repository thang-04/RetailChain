## Context

### Background
Hệ thống hiện tại có chức năng Xuất Kho (StockOut) cho phép Warehouse Manager tạo phiếu chuyển hàng từ kho tổng đến cửa hàng (loại TRANSFER). Tuy nhiên, Store Manager không có cách chủ động yêu cầu xuất hàng mà phải phụ thuộc vào quy trình thủ công từ phía kho tổng.

### Current State
- **Luồng hiện tại**: Warehouse Manager tự tạo phiếu TRANSFER từ kho tổng đến cửa hàng
- **Store Dashboard**: Chỉ hiển thị tồn kho, không có chức năng yêu cầu xuất hàng
- **StockOut Page**: Chỉ hiển thị danh sách phiếu xuất đã tạo

### Constraints
- Không được ảnh hưởng đến luồng xuất kho hiện tại (TRANSFER)
- Store Manager chỉ có thể gửi request, không tự duyệt
- SuperAdmin mới có quyền duyệt/từ chối request

## Goals / Non-Goals

**Goals:**
- Cho phép Store Manager gửi yêu cầu xuất hàng từ cửa hàng lên kho tổng
- Cho phép SuperAdmin xem danh sách request chờ duyệt và thực hiện duyệt/từ chối
- Tự động tạo phiếu TRANSFER khi SuperAdmin duyệt request
- Hiển thị thông báo cho cả Store Manager và SuperAdmin
- Kiểm tra tồn kho tại thời điểm tạo request

**Non-Goals:**
- Không tạo chức năng thông báo email/push notification riêng (dùng UI trong app)
- Không tạo chức năng gán request cho nhiều admin khác nhau
- Không tạo chức năng request giữa các cửa hàng với nhau
- Không tạo chức năng duyệt tự động

## Decisions

### 1. Tạo bảng riêng stock_request thay vì mở rộng inventory_document

**Lý do:**
- Tách biệt rõ ràng giữa "yêu cầu" (request) và "xuất kho thực tế" (document)
- Dễ quản lý vòng đời riêng của request (PENDING → APPROVED/REJECTED/CANCELLED)
- Store Manager và SuperAdmin làm việc trên 2 luồng độc lập
- Không ảnh hưởng đến logic xuất kho hiện tại

**Alternatives considered:**
- Mở rộng inventory_document với type REQUEST: Phức tạp, 1 document vừa là request vừa là phiếu xuất

### 2. Kiểm tra tồn kho tại thời điểm tạo request

**Lý do:**
- Store Manager biết được ngay request có hợp lệ không
- Tránh trường hợp gửi request xong, đợi duyệt mới biết không đủ hàng
- Trải nghiệm người dùng tốt hơn

**Alternatives considered:**
- Kiểm tra khi duyệt: Chính xác hơn nhưng có thể fail lúc duyệt, trải nghiệm kém

### 3. Tab thông báo tích hợp trong StockOut page

**Lý do:**
- SuperAdmin đã quen làm việc tại StockOut page
- Giảm số click để xem thông báo
- Unified experience cho Warehouse Manager

**Alternatives considered:**
- Trang thông báo riêng: Tốn thêm effort phát triển, tách biệt không cần thiết

### 4. Khi duyệt request tạo phiếu TRANSFER (không phải EXPORT)

**Lý do:**
- Request từ cửa hàng luôn là chuyển hàng vào kho cửa hàng
- Giữ nguyên luồng xuất kho hiện tại
- InventoryDocumentType.TRANSFER đã hỗ trợ logic giảm/tăng stock đúng

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Request tồn tại nhưng tồn kho thay đổi (giảm) khi duyệt | Validate lại tồn kho khi duyệt, báo lỗi nếu không đủ |
| Store Manager gửi request sai cửa hàng | Validate store_id hợp lệ, chỉ xem được request của store mình |
| SuperAdmin duyệt nhầm request | Cần confirm trước khi duyệt, hiển thị chi tiết đầy đủ |
| Nhiều request cùng lúc cho 1 sản phẩm | Xử lý concurrency tại service layer |

## Migration Plan

### Phase 1: Backend
1. Tạo enum StockRequestStatus
2. Tạo entity StockRequest, StockRequestItem
3. Tạo repository, service, controller
4. Tạo API endpoints

### Phase 2: Frontend - Store Dashboard
1. Thêm button "Gửi yêu cầu xuất hàng"
2. Tạo form modal tạo request
3. Tạo danh sách request của cửa hàng

### Phase 3: Frontend - StockOut Page
1. Thêm tab "Yêu cầu chờ duyệt"
2. Thêm tab "Thông báo"
3. Implement actions duyệt/từ chối

## Open Questions

1. **Cần thêm trường priority (bình thường/ưu tiên) không?** - Hiện tại thiết kế có priority nhưng có thể đơn giản hóa
2. **Thông báo có cần lưu vào database không?** - Hiện tại thiết kế chỉ hiển thị UI, không lưu database
