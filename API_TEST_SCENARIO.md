### Kịch bản Test API Quản Lý Kho (Inventory Management)

Dưới đây là các câu lệnh `curl` để test các API bạn vừa tạo. Bạn có thể chạy chúng trong terminal (Git Bash, WSL) hoặc Import vào Postman.

#### 1. Tạo Kho Tổng (Main Warehouse)
*Mục đích: Tạo một kho trung tâm không gắn với cửa hàng nào.*

```bash
curl -X POST http://localhost:8080/api/inventory/warehouse \
-H "Content-Type: application/json" \
-d '{
  "code": "WH-MAIN-01",
  "name": "Kho Tổng Hà Nội",
  "warehouseType": 1,
  "storeId": null
}'
```

#### 2. Tạo Kho Cửa Hàng (Store Warehouse)
*Mục đích: Tạo một kho gắn liền với cửa hàng (ví dụ Store ID = 1).*

```bash
curl -X POST http://localhost:8080/api/inventory/warehouse \
-H "Content-Type: application/json" \
-d '{
  "code": "WH-STORE-01",
  "name": "Kho Cửa Hàng Quận 1",
  "warehouseType": 2,
  "storeId": 1
}'
```

#### 3. Lấy Danh Sách Tất Cả Kho
*Mục đích: Kiểm tra xem các kho vừa tạo có xuất hiện trong danh sách không.*

```bash
curl -X GET http://localhost:8080/api/inventory/warehouse
```

#### 4. Xem Tồn Kho Của Một Kho Cụ Thể
*Mục đích: Xem số lượng hàng tồn trong kho (Thay `1` bằng ID của kho bạn muốn xem).*

```bash
curl -X GET http://localhost:8080/api/inventory/stock/1
```

---

### Dữ liệu mẫu (JSON) để test trong Postman

**Request Body (Tạo Kho Tổng):**
```json
{
  "code": "WH-HCM-MAIN",
  "name": "Kho Tổng Hồ Chí Minh",
  "warehouseType": 1
}
```

**Request Body (Tạo Kho Cửa Hàng - Store 2):**
```json
{
  "code": "WH-STORE-02",
  "name": "Kho Cửa Hàng Quận 3",
  "warehouseType": 2,
  "storeId": 2
}
```
