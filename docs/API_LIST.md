# Danh Sách API - RetailChain

## AuthController (`/api/auth`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Đăng xuất |

---

## UserController (`/api/user`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/user` | Lấy danh sách user |
| GET | `/api/user/me` | Lấy thông tin user hiện tại |
| GET | `/api/user/{id}` | Lấy user theo ID |
| GET | `/api/user/email/{email}` | Tìm user theo email |
| POST | `/api/user` | Tạo user mới |
| PUT | `/api/user/{id}` | Cập nhật user |
| DELETE | `/api/user/{id}` | Xóa user |

---

## RoleController (`/api/roles`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/roles` | Lấy danh sách role |
| GET | `/api/roles/{id}` | Lấy role theo ID |
| POST | `/api/roles` | Tạo role mới |
| PUT | `/api/roles/{id}` | Cập nhật role |
| DELETE | `/api/roles/{id}` | Xóa role |

---

## PermissionController (`/api/permissions`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/permissions` | Lấy danh sách permission |
| GET | `/api/permissions/{id}` | Lấy permission theo ID |

---

## StoreController (`/api/stores`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/stores` | Lấy danh sách cửa hàng |
| GET | `/api/stores/{slug}` | Lấy cửa hàng theo slug |
| POST | `/api/stores` | Tạo cửa hàng mới |
| PUT | `/api/stores/{slug}` | Cập nhật cửa hàng |
| GET | `/api/stores/{id}/staff` | Lấy danh sách nhân viên |

---

## ProductController (`/api/product`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/product/upload` | Upload ảnh sản phẩm |
| GET | `/api/product/uploads/{fileName}` | Lấy ảnh sản phẩm |
| GET | `/api/product` | Lấy danh sách sản phẩm |
| GET | `/api/product/{slug}` | Lấy sản phẩm theo slug |
| POST | `/api/product` | Tạo sản phẩm mới |
| PUT | `/api/product/{slug}` | Cập nhật sản phẩm |
| GET | `/api/product/next-code` | Lấy mã sản phẩm tiếp theo |
| GET | `/api/product/categories` | Lấy danh mục sản phẩm |

---

## SupplierController (`/api/supplier`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/supplier` | Lấy danh sách nhà cung cấp |

---

## WarehouseController (`/api/warehouse`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/warehouse` | Tạo kho mới |
| GET | `/api/warehouse` | Lấy danh sách kho |
| PUT | `/api/warehouse/{id}` | Cập nhật kho |
| DELETE | `/api/warehouse/{id}` | Xóa kho |

---

## InventoryController (`/api/inventory`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/inventory/stock/{warehouseId}` | Lấy tồn kho theo kho |
| GET | `/api/inventory/product/{productId}` | Lấy tồn kho theo sản phẩm |
| POST | `/api/inventory/import` | Nhập kho |
| POST | `/api/inventory/export` | Xuất kho |
| POST | `/api/inventory/transfer` | Chuyển kho |
| GET | `/api/inventory/documents` | Lấy danh sách phiếu |
| DELETE | `/api/inventory/documents/{id}` | Xóa phiếu |
| GET | `/api/inventory/overview` | Tổng quan tồn kho |

---

## InventoryHistoryController (`/api/inventory-history`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/inventory-history/record` | Lấy lịch sử tồn kho |
| GET | `/api/inventory-history/record/{id}` | Lấy chi tiết lịch sử |
| POST | `/api/inventory-history/record/add` | Thêm bản ghi lịch sử |
| GET | `/api/inventory-history/record/export` | Export lịch sử |

---

**Tổng số API: 58 endpoints**
