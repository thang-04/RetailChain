# Proposal: Add GPS to Store Creation

## 1. Vấn đề (Problem)

Hiện tại khi tạo Store mới trong hệ thống:
- Frontend có Map để chọn location nhưng **KHÔNG gửi** latitude/longitude lên backend
- Backend DTO `CreateStoreRequest` **KHÔNG có** các field GPS
- Database có cột `latitude`, `longitude`, `radius_meters` nhưng luôn để **NULL**

**Hậu quả:** Tính năng chấm công GPS không hoạt động vì các store không có tọa độ.

## 2. Giải pháp (Solution)

Thêm GPS coordinates vào quy trình tạo store:
- Backend: Thêm fields latitude, longitude, radius_meters vào CreateStoreRequest DTO
- Frontend: Gửi tọa độ từ Map khi tạo store
- Database: Lưu tọa độ để phục vụ GPS validation khi checkin/checkout

## 3. Tác động (Impact)

| Aspect | Impact |
|--------|--------|
| Store Management | Tạo store với GPS coordinates |
| Attendance | GPS checkin hoạt động chính xác |
| User Experience | Staff có thể checkin tại đúng cửa hàng |

## 4. Phạm vi (Scope)

- Backend: CreateStoreRequest DTO, StoreService
- Frontend: AddStoreModal, store.service.js
- Database: Sử dụng các cột đã có (không cần migration)
