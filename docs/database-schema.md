# Lược đồ Database `retail_chain`

## Tổng quan

- **Database**: retail_chain
- **Số bảng**: 20
- **Engine**: InnoDB
- **Collation**: utf8mb4_0900_ai_ci

---

## Danh sách bảng

| STT | Tên bảng | Mô tả | Số dòng |
|-----|----------|-------|---------|
| 1 | users | Tài khoản người dùng hệ thống | 14 |
| 2 | roles | Danh sách role (phân quyền theo vai trò) | 5 |
| 3 | permissions | Danh sách quyền | 59 |
| 4 | user_roles | Mapping user - role (1 user có thể có nhiều role) | 14 |
| 5 | role_permissions | Mapping role - permission | 100 |
| 6 | refresh_tokens | Token refresh | 0 |
| 7 | stores | Danh sách cửa hàng trong chuỗi | 10 |
| 8 | warehouses | Danh sách kho (kho tổng và kho cửa hàng) | 10 |
| 9 | store_warehouses | Mapping store - warehouse | 10 |
| 10 | products | Sản phẩm cấp model (không phân biệt size/màu) | 10 |
| 11 | product_categories | Danh mục sản phẩm | 10 |
| 12 | product_variants | Biến thể sản phẩm theo size/màu (SKU thực tế) | 10 |
| 13 | suppliers | Danh sách nhà cung cấp | 10 |
| 14 | inventory_stock | Tồn kho hiện tại theo kho + SKU (cache để query nhanh) | 10 |
| 15 | inventory_document | Phiếu nghiệp vụ kho (nhập/xuất/điều chuyển/điều chỉnh) | 10 |
| 16 | inventory_document_item | Chi tiết các SKU trong một phiếu kho | 10 |
| 17 | inventory_history | Sổ lịch sử (append-only) để audit/trace biến động tồn kho | 10 |
| 18 | shifts | Danh sách ca làm việc theo cửa hàng | 10 |
| 19 | shift_assignments | Lịch phân ca cho nhân viên theo ngày | 10 |
| 20 | attendance_logs | Log chấm công (IN/OUT) theo nhân viên/cửa hàng | 10 |

---

## Chi tiết từng bảng

### 1. users - Tài khoản người dùng

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| store_id | bigint | MUL | YES | | |
| username | varchar(100) | UNI | NO | | |
| password | varchar(255) | | NO | | |
| full_name | varchar(255) | YES | | | |
| phone | varchar(50) | YES | | | |
| email | varchar(255) | YES | | | |
| status | int | MUL | NO | | |
| created_at | datetime(3) | | NO | | |
| updated_at | datetime(3) | | NO | | |
| created_by_user_id | bigint | YES | | | |
| region | enum('NORTH','CENTRAL','SOUTH') | YES | | | |
| warehouse_id | bigint | YES | | | |

**Indexes**:
- PRIMARY (id)
- username (unique)
- idx_users_store (store_id)
- idx_users_status (status)

---

### 2. roles - Danh sách role

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| code | varchar(50) | UNI | NO | | |
| name | varchar(255) | | NO | | |
| description | varchar(255) | YES | | | |

**Indexes**:
- PRIMARY (id)
- code (unique)

---

### 3. permissions - Danh sách quyền

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| code | varchar(50) | UNI | NO | | |
| name | varchar(255) | | NO | | |
| description | varchar(255) | YES | | | |

**Indexes**:
- PRIMARY (id)
- UK_7lcb6glmvwlro3p2w2cewxtvd (code unique)

---

### 4. user_roles - Mapping user - role

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| user_id | bigint | PRI | NO | | |
| role_id | bigint | PRI | NO | | |

**Indexes**:
- PRIMARY (user_id, role_id)
- fk_ur_role (role_id)

---

### 5. role_permissions - Mapping role - permission

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| role_id | bigint | PRI | NO | | |
| permission_id | bigint | PRI | NO | | |

**Indexes**:
- PRIMARY (role_id, permission_id)
- FKegdk29eiy7mdtefy5c7eirr6e (permission_id)

---

### 6. refresh_tokens - Token refresh

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| expiry_date | datetime(6) | | NO | | |
| token | varchar(512) | UNI | NO | | |
| user_id | bigint | MUL | NO | | |

**Indexes**:
- PRIMARY (id)
- UK_ghpmfn23vmxfu3spu3lfg4r2d (token unique)
- FK1lih5y2npsf8u5o3vhdb9y0os (user_id)

---

### 7. stores - Danh sách cửa hàng

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| code | varchar(50) | UNI | NO | | |
| name | varchar(255) | | NO | | |
| address | varchar(500) | YES | | | |
| status | int | | NO | | |
| created_at | datetime(3) | | NO | | |
| updated_at | datetime(3) | | NO | | |
| warehouse_id | bigint | MUL | YES | | |

**Indexes**:
- PRIMARY (id)
- code (unique)
- fk_stores_warehouse (warehouse_id)

---

### 8. warehouses - Danh sách kho

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| code | varchar(50) | UNI | NO | | |
| name | varchar(255) | | NO | | |
| status | int | | NO | | |
| created_at | datetime(3) | | NO | | |
| updated_at | datetime(3) | | NO | | |
| address | varchar(500) | YES | | | |
| province | varchar(100) | YES | | | |
| district | varchar(100) | YES | | | |
| ward | varchar(100) | YES | | | |
| contact_name | varchar(255) | YES | | | |
| contact_phone | varchar(20) | YES | | | |
| description | text | YES | | | |
| parent_id | bigint | MUL | YES | | |
| warehouse_level | int | YES | 1 | | |
| is_default | int | YES | | | |

**Indexes**:
- PRIMARY (id)
- code (unique)
- parent_id

---

### 9. store_warehouses - Mapping store - warehouse

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| store_id | bigint | PRI | NO | | |
| warehouse_id | bigint | PRI | NO | | |
| is_default | int | | NO | | |

**Indexes**:
- PRIMARY (store_id, warehouse_id)
- FK5ydfvl05chnnj2xlj5op45q8g (warehouse_id)

---

### 10. products - Sản phẩm cấp model

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| category_id | bigint | MUL | NO | | |
| code | varchar(50) | UNI | NO | | |
| name | varchar(255) | | NO | | |
| description | text | YES | | | |
| gender | enum('MEN','WOMEN','UNISEX','KIDS') | YES | | | |
| status | int | MUL | NO | | |
| created_at | datetime(3) | | NO | | |
| updated_at | datetime(3) | | NO | | |
| image | varchar(255) | YES | | | |
| slug | varchar(255) | UNI | YES | | |

**Indexes**:
- PRIMARY (id)
- code (unique)
- UK_ostq1ec3toafnjok09y9l7dox (slug unique)
- idx_products_cat (category_id)
- idx_products_status (status)

---

### 11. product_categories - Danh mục sản phẩm

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| name | varchar(255) | | NO | | |

**Indexes**:
- PRIMARY (id)

---

### 12. product_variants - Biến thể sản phẩm (SKU)

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| product_id | bigint | MUL | NO | | |
| sku | varchar(80) | UNI | NO | | |
| barcode | varchar(80) | UNI | YES | | |
| size | varchar(30) | | NO | | |
| color | varchar(50) | | NO | | |
| price | decimal(10,2) | YES | | | |
| status | int | MUL | NO | | |
| created_at | datetime(3) | | NO | | |
| updated_at | datetime(3) | | NO | | |

**Indexes**:
- PRIMARY (id)
- sku (unique)
- uk_variant (product_id, size, color unique)
- barcode (unique)
- idx_pv_product (product_id)
- idx_pv_status (status)

---

### 13. suppliers - Danh sách nhà cung cấp

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| code | varchar(50) | UNI | NO | | |
| name | varchar(255) | | NO | | |
| contact_info | varchar(255) | YES | | | |
| address | varchar(500) | YES | | | |
| status | int | YES | 1 | | |
| created_at | datetime(3) | YES | CURRENT_TIMESTAMP(3) | DEFAULT_GENERATED |
| updated_at | datetime(3) | YES | CURRENT_TIMESTAMP(3) | DEFAULT_GENERATED on update CURRENT_TIMESTAMP(3) |

**Indexes**:
- PRIMARY (id)
- code (unique)

---

### 14. inventory_stock - Tồn kho hiện tại

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| warehouse_id | bigint | PRI | NO | | |
| variant_id | bigint | PRI | NO | | |
| quantity | int | | NO | 0 | |
| updated_at | datetime(3) | | NO | | |

**Indexes**:
- PRIMARY (warehouse_id, variant_id)
- idx_is_variant (variant_id)

---

### 15. inventory_document - Phiếu nghiệp vụ kho

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| document_code | varchar(50) | UNI | NO | | |
| document_type | enum('IMPORT','EXPORT','TRANSFER','ADJUST') | MUL | NO | | |
| source_warehouse_id | bigint | MUL | YES | | |
| target_warehouse_id | bigint | MUL | YES | | |
| reference_type | varchar(30) | MUL | YES | | |
| reference_id | bigint | YES | | | |
| note | varchar(500) | YES | | | |
| created_by | bigint | MUL | NO | | |
| created_at | datetime(3) | MUL | NO | | |
| supplier_id | bigint | MUL | YES | | |
| total_amount | decimal(38,2) | YES | | | |

**Indexes**:
- PRIMARY (id)
- document_code (unique)
- fk_idoc_src_wh (source_warehouse_id)
- fk_idoc_tgt_wh (target_warehouse_id)
- fk_idoc_user (created_by)
- idx_idoc_type_time (document_type, created_at)
- idx_idoc_time (created_at)
- idx_idoc_ref (reference_type, reference_id)
- fk_idoc_supplier (supplier_id)

---

### 16. inventory_document_item - Chi tiết phiếu kho

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| document_id | bigint | MUL | NO | | |
| variant_id | bigint | MUL | NO | | |
| quantity | int | | NO | | |
| unit_price | decimal(18,2) | YES | 0.00 | | |
| note | varchar(255) | YES | | | |

**Indexes**:
- PRIMARY (id)
- idx_idi_doc (document_id)
- idx_idi_variant (variant_id)

---

### 17. inventory_history - Lịch sử biến động tồn kho

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| document_id | bigint | MUL | NO | | |
| document_item_id | bigint | MUL | NO | | |
| warehouse_id | bigint | MUL | NO | | |
| variant_id | bigint | MUL | NO | | |
| action | enum('IN','OUT') | | NO | | |
| quantity | int | | NO | | |
| balance_after | int | | NO | | |
| actor_user_id | bigint | MUL | NO | | |
| occurred_at | datetime(3) | | NO | | |

**Indexes**:
- PRIMARY (id)
- fk_ih_item (document_item_id)
- fk_ih_user (actor_user_id)
- idx_ih_wh_var_time (warehouse_id, variant_id, occurred_at)
- idx_ih_var_time (variant_id, occurred_at)
- idx_ih_doc (document_id)

---

### 18. shifts - Danh sách ca làm việc

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| store_id | bigint | MUL | NO | | |
| name | varchar(100) | | NO | | |
| start_time | time | | NO | | |
| end_time | time | | NO | | |
| created_at | datetime(3) | | NO | | |
| updated_at | datetime(3) | | NO | | |

**Indexes**:
- PRIMARY (id)
- idx_shifts_store (store_id)

---

### 19. shift_assignments - Lịch phân ca

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| shift_id | bigint | MUL | NO | | |
| user_id | bigint | MUL | NO | | |
| work_date | date | | NO | | |
| status | enum('ASSIGNED','CANCELLED') | | NO | ASSIGNED | |
| created_by | bigint | MUL | NO | | |
| created_at | datetime(3) | | NO | | |

**Indexes**:
- PRIMARY (id)
- uk_sa (user_id, work_date, shift_id unique)
- fk_sa_created_by (created_by)
- idx_sa_user_date (user_id, work_date)
- idx_sa_shift_date (shift_id, work_date)

---

### 20. attendance_logs - Log chấm công

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| assignment_id | bigint | MUL | YES | | |
| user_id | bigint | MUL | NO | | |
| store_id | bigint | MUL | NO | | |
| check_type | enum('IN','OUT') | | NO | | |
| method | enum('MANUAL','QR') | | NO | | |
| occurred_at | datetime(3) | | NO | | |
| note | varchar(255) | YES | | | |
| created_by | bigint | MUL | YES | | |
| created_at | datetime(3) | | NO | | |

**Indexes**:
- PRIMARY (id)
- fk_al_created_by (created_by)
- idx_al_user_time (user_id, occurred_at)
- idx_al_store_time (store_id, occurred_at)
- idx_al_assignment (assignment_id)

---

## Quan hệ giữa các bảng

```
users 1--N user_roles N--1 roles
roles 1--N role_permissions N--1 permissions
users 1--N refresh_tokens

users N--1 stores (store_id)
users N--1 warehouses (warehouse_id)

stores 1--N shifts
stores 1--N store_warehouses N--1 warehouses

warehouses 1--N warehouses (parent_id - tự tham chiếu)
warehouses 1--N inventory_stock
warehouses 1--N inventory_document (source_warehouse_id, target_warehouse_id)
warehouses N--1 suppliers

products N--1 product_categories
products 1--N product_variants

product_variants 1--N inventory_stock
product_variants 1--N inventory_document_item
product_variants 1--N inventory_history

inventory_document 1--N inventory_document_item
inventory_document 1--N inventory_history

shifts 1--N shift_assignments
users 1--N shift_assignments

shift_assignments 1--N attendance_logs
users 1--N attendance_logs
stores 1--N attendance_logs
```

---

*Generated: 2026-03-10*
