# API Testing Plan với Curl

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tạo kế hoạch kiểm thử tuần tự các API của RetailChain sử dụng curl, chia thành các phase logic để xác minh backend hoạt động đúng.

**Architecture:** Test theo từng nhóm chức năng:
- Phase 1: Authentication (login, register, refresh, logout)
- Phase 2: Core Entities (roles, permissions, users)
- Phase 3: Business Entities (stores, products, suppliers, warehouses)
- Phase 4: Inventory Operations (stock, import, export, transfer)
- Phase 5: History & Reports

**Tech Stack:**
- Backend: Spring Boot (localhost:8080/retail-chain)
- Database: MySQL (retail_2)
- Testing: curl với JWT authentication

---

## Phase 1: Authentication APIs

### Task 1.1: Login và Lấy Token

- [ ] **Step 1: Test Login với SUPER_ADMIN**

```bash
curl -X POST "http://localhost:8080/retail-chain/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@retailchain.com", "password": "admin123"}'
```

Expected: Trả về accessToken và refreshToken, lưu accessToken để dùng cho các API tiếp theo.

- [ ] **Step 2: Test Login với STORE_MANAGER**

```bash
curl -X POST "http://localhost:8080/retail-chain/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "manager@retailchain.com", "password": "manager123"}'
```

- [ ] **Step 3: Test Login với STAFF**

```bash
curl -X POST "http://localhost:8080/retail-chain/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "staff@retailchain.com", "password": "staff123"}'
```

- [ ] **Step 4: Test Login thất bại (sai password)**

```bash
curl -X POST "http://localhost:8080/retail-chain/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@retailchain.com", "password": "wrongpassword"}'
```

Expected: 401 Unauthorized

### Task 1.2: Refresh Token

- [ ] **Step 1: Test Refresh Token**

```bash
curl -X POST "http://localhost:8080/retail-chain/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "<PASTE_REFRESH_TOKEN_HERE>"}'
```

Expected: Trả về accessToken mới

### Task 1.3: Logout

- [ ] **Step 1: Test Logout**

```bash
curl -X POST "http://localhost:8080/retail-chain/api/auth/logout" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json"
```

---

## Phase 2: Core Entities (Roles, Permissions, Users)

**Lưu ý:** Các API trong phase này yêu cầu token. Thay thế `<ACCESS_TOKEN>` bằng token đã lấy ở Phase 1.

### Task 2.1: Roles APIs

- [ ] **Step 1: GET all roles**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/roles" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Expected: Trả về 3 roles (SUPER_ADMIN, STORE_MANAGER, STAFF)

- [ ] **Step 2: GET role by ID**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/roles/1" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Task 2.2: Permissions APIs

- [ ] **Step 1: GET all permissions**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/permissions" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Expected: Trả về danh sách permissions

- [ ] **Step 2: GET permission by ID**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/permissions/1" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Task 2.3: User APIs

- [ ] **Step 1: GET all users**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/user" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Expected: Trả về danh sách users với roles và permissions

- [ ] **Step 2: GET current user (/me)**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/user/me" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Expected: Trả về thông tin user hiện tại

- [ ] **Step 3: GET user by ID**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/user/1" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

- [ ] **Step 4: GET user by email**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/user/email/admin@retailchain.com" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## Phase 3: Business Entities (Stores, Products, Suppliers, Warehouses)

### Task 3.1: Store APIs

- [ ] **Step 1: GET all stores**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/stores" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Expected: Trả về 4 stores (đã seed)

- [ ] **Step 2: GET store by slug**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/stores/store-1" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

- [ ] **Step 3: GET staff by store**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/stores/1/staff" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Task 3.2: Product APIs

- [ ] **Step 1: GET all products**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/product" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Expected: Trả về 5 products

- [ ] **Step 2: GET product by slug**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/product/ao-thun-nam-at001" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

- [ ] **Step 3: GET product categories**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/product/categories" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

- [ ] **Step 4: GET next product code**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/product/next-code" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Task 3.3: Supplier APIs

- [ ] **Step 1: GET all suppliers**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/supplier" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Task 3.4: Warehouse APIs

- [ ] **Step 1: GET all warehouses**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/warehouse" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Expected: Trả về 3 warehouses

- [ ] **Step 2: POST create warehouse**

```bash
curl -X POST "http://localhost:8080/retail-chain/api/warehouse" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kho Test",
    "address": "123 Test Street",
    "type": "CENTRAL_WAREHOUSE"
  }'
```

- [ ] **Step 3: PUT update warehouse**

```bash
curl -X PUT "http://localhost:8080/retail-chain/api/warehouse/1" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kho Test Updated",
    "address": "456 New Street",
    "type": "CENTRAL_WAREHOUSE"
  }'
```

---

## Phase 4: Inventory Operations

### Task 4.1: Stock Queries

- [ ] **Step 1: GET stock by warehouse**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/inventory/stock/1" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

- [ ] **Step 2: GET stock by product**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/inventory/product/1" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

- [ ] **Step 3: GET inventory overview**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/inventory/overview" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Task 4.2: Import Stock

- [ ] **Step 1: POST import stock**

```bash
curl -X POST "http://localhost:8080/retail-chain/api/inventory/import" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "warehouseId": 1,
    "productId": 1,
    "quantity": 100,
    "unitPrice": 50000,
    "note": "Test nhập kho"
  }'
```

### Task 4.3: Export Stock

- [ ] **Step 1: POST export stock**

```bash
curl -X POST "http://localhost:8080/retail-chain/api/inventory/export" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "warehouseId": 1,
    "productId": 1,
    "quantity": 10,
    "note": "Test xuất kho"
  }'
```

### Task 4.4: Transfer Stock

- [ ] **Step 1: POST transfer stock**

```bash
curl -X POST "http://localhost:8080/retail-chain/api/inventory/transfer" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "fromWarehouseId": 1,
    "toWarehouseId": 2,
    "productId": 1,
    "quantity": 5,
    "note": "Test chuyển kho"
  }'
```

### Task 4.5: Documents

- [ ] **Step 1: GET all documents**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/inventory/documents" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## Phase 5: History & Reports

### Task 5.1: Inventory History

- [ ] **Step 1: GET history records**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/inventory-history/record" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

- [ ] **Step 2: GET history record by ID**

```bash
curl -X GET "http://localhost:8080/retail-chain/api/inventory-history/record/1" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

- [ ] **Step 3: POST add history record**

```bash
curl -X POST "http://localhost:8080/retail-chain/api/inventory-history/record/add" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "warehouseId": 1,
    "changeType": "IMPORT",
    "quantity": 50,
    "note": "Test thêm bản ghi"
  }'
```

---

## Bash Script Tổng Hợp

File: `test-all-apis.sh`

```bash
#!/bin/bash

BASE_URL="http://localhost:8080/retail-chain"
TOKEN=""

echo "=== Phase 1: Authentication ==="

# Login
echo "1. Login..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@retailchain.com", "password": "admin123"}')
echo "$RESPONSE"

TOKEN=$(echo "$RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

# Phase 2: Core Entities
echo "=== Phase 2: Core Entities ==="
curl -s -X GET "$BASE_URL/api/roles" -H "Authorization: Bearer $TOKEN"
echo ""
curl -s -X GET "$BASE_URL/api/permissions" -H "Authorization: Bearer $TOKEN"
echo ""
curl -s -X GET "$BASE_URL/api/user" -H "Authorization: Bearer $TOKEN"
echo ""

# Phase 3: Business Entities
echo "=== Phase 3: Business Entities ==="
curl -s -X GET "$BASE_URL/api/stores" -H "Authorization: Bearer $TOKEN"
echo ""
curl -s -X GET "$BASE_URL/api/product" -H "Authorization: Bearer $TOKEN"
echo ""
curl -s -X GET "$BASE_URL/api/warehouse" -H "Authorization: Bearer $TOKEN"
echo ""

# Phase 4: Inventory
echo "=== Phase 4: Inventory ==="
curl -s -X GET "$BASE_URL/api/inventory/stock/1" -H "Authorization: Bearer $TOKEN"
echo ""
curl -s -X GET "$BASE_URL/api/inventory/overview" -H "Authorization: Bearer $TOKEN"
echo ""

# Phase 5: History
echo "=== Phase 5: History ==="
curl -s -X GET "$BASE_URL/api/inventory-history/record" -H "Authorization: Bearer $TOKEN"
echo ""
```

---

## Expected Results Summary

| Phase | API | Expected |
|-------|-----|----------|
| 1 | POST /auth/login | 200 + JWT tokens |
| 1 | POST /auth/refresh | 200 + new access token |
| 1 | POST /auth/logout | 200 |
| 2 | GET /roles | 3 roles |
| 2 | GET /permissions | Danh sách permissions |
| 2 | GET /user | Users với roles/permissions |
| 3 | GET /stores | 4 stores |
| 3 | GET /product | 5 products |
| 3 | GET /warehouse | 3 warehouses |
| 4 | GET /inventory/stock/{id} | Stock data |
| 4 | POST /inventory/import | 200 + document |
| 5 | GET /inventory-history/record | History records |
