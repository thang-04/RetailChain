# Lược đồ Database `retail_chain`

## Tổng quan

- **Database**: retail_chain
- **Số bảng**: 24
- **Engine**: InnoDB
- **Collation**: utf8mb4_0900_ai_ci

---

## Danh sách bảng

| STT | Tên bảng | Mô tả | Số dòng |
|-----|----------|-------|---------|
| 1 | users | Tài khoản người dùng hệ thống | 16 |
| 2 | roles | Danh sách role (phân quyền theo vai trò) | 2 |
| 3 | permissions | Danh sách quyền | 59 |
| 4 | user_roles | Mapping user - role (1 user có thể có nhiều role) | 16 |
| 5 | role_permissions | Mapping role - permission | 59 |
| 6 | refresh_tokens | Token refresh | 14 |
| 7 | stores | Danh sách cửa hàng trong chuỗi | 6 |
| 8 | warehouses | Danh sách kho (kho tổng và kho cửa hàng) | 7 |
| 9 | store_warehouses | Mapping store - warehouse | 0 |
| 10 | products | Sản phẩm cấp model (không phân biệt size/màu) | 22 |
| 11 | product_categories | Danh mục sản phẩm | 10 |
| 12 | product_variants | Biến thể sản phẩm theo size/màu (SKU thực tế) | 54 |
| 13 | suppliers | Danh sách nhà cung cấp | 5 |
| 14 | inventory_stock | Tồn kho hiện tại theo kho + SKU (cache để query nhanh) | 130 |
| 15 | inventory_document | Phiếu nghiệp vụ kho (nhập/xuất/điều chuyển/điều chỉnh) | 20 |
| 16 | inventory_document_item | Chi tiết các SKU trong một phiếu kho | 35 |
| 17 | inventory_history | Sổ lịch sử (append-only) để audit/trace biến động tồn kho | 50 |
| 18 | shifts | Danh sách ca làm việc theo cửa hàng | 9 |
| 19 | shift_assignments | Lịch phân ca cho nhân viên theo ngày | 3 |
| 20 | attendance_logs | Log chấm công (IN/OUT) theo nhân viên/cửa hàng | 4 |
| 21 | otp_codes | Mã OTP xác thực | 1 |
| 22 | stock_request | Yêu cầu chuyển hàng giữa các kho | 8 |
| 23 | stock_request_item | Chi tiết các SKU trong yêu cầu chuyển hàng | 8 |
| 24 | inventory_document_backup_20260311 | Backup phiếu kho (backup table) | 2 |

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
| is_first_login | bit(1) | | NO | | |

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
| name | varchar(255) | NO | | | |
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
| name | varchar(255) | NO | | | |
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
| latitude | double | YES | | | |
| longitude | double | YES | | | |
| radius_meters | int | YES | 50 | | |

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
| is_central | int | YES | | | |
| is_default | int | YES | | | |
| parent_id | bigint | YES | | | |
| warehouse_level | int | YES | | | |

**Indexes**:
- PRIMARY (id)
- code (unique)

---

### 9. store_warehouses - Mapping store - warehouse

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| is_default | int | | NO | | |
| store_id | bigint | PRI | NO | | |
| warehouse_id | bigint | PRI | NO | | |

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
- UKqftlp982upbw9ey6wuyt4a4ga (product_id, size, color unique) - DUPLICATE
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
| status | varchar(20) | YES | | | |

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
| is_default | bit(1) | | NO | | |

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
| method | enum('MANUAL','QR','GPS') | | NO | | |
| occurred_at | datetime(3) | | NO | | |
| note | varchar(255) | YES | | | |
| created_by | bigint | MUL | YES | | |
| created_at | datetime(3) | | NO | | |
| latitude | double | YES | | | |
| longitude | double | YES | | | |
| distance_meters | double | YES | | | |
| status | varchar(20) | YES | | | |
| work_hours | double | YES | | | |

**Indexes**:
- PRIMARY (id)
- fk_al_created_by (created_by)
- idx_al_user_time (user_id, occurred_at)
- idx_al_store_time (store_id, occurred_at)
- idx_al_assignment (assignment_id)

---

### 21. otp_codes - Mã OTP xác thực

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| email | varchar(255) | | NO | | |
| expires_at | datetime(6) | | NO | | |
| otp_code | varchar(255) | | NO | | |

**Indexes**:
- PRIMARY (id)

---

### 22. stock_request - Yêu cầu chuyển hàng

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| request_code | varchar(50) | UNI | NO | | |
| status | enum('PENDING','APPROVED','REJECTED','CANCELLED','EXPORTED') | | NO | | |
| store_id | bigint | MUL | NO | | |
| source_warehouse_id | bigint | MUL | NO | | |
| target_warehouse_id | bigint | MUL | NO | | |
| priority | varchar(20) | YES | | | |
| note | varchar(500) | YES | | | |
| created_by | bigint | MUL | NO | | |
| created_at | datetime(6) | | NO | | |
| approved_by | bigint | MUL | YES | | |
| approved_at | datetime(6) | YES | | | |
| rejected_by | bigint | MUL | YES | | |
| rejected_at | datetime(6) | YES | | | |
| reject_reason | varchar(500) | YES | | | |
| cancelled_by | bigint | MUL | YES | | |
| cancelled_at | datetime(6) | YES | | | |
| cancel_reason | varchar(500) | YES | | | |
| exported_document_id | bigint | MUL | YES | | |

**Indexes**:
- PRIMARY (id)
- UK_70nmtyc7e4e7o2imct3ggjj5n (request_code unique)
- FKcr1y9myi7ayffmdbxsr52k49l (approved_by)
- FKphchohq4wqnjslnfqb3dwpmcr (cancelled_by)
- FK37iktp5alcfr7dc6s530rh61s (created_by)
- FKkmj5ux2j6ajpjai4ky20envdn (exported_document_id)
- FKblcuqptdsgi3t5wxdhc9vypc2 (rejected_by)
- FK48bti9w77mnmdc64wtx18q8ii (store_id)
- FKb34l9xoajt9linuk7pmga5fx4 (target_warehouse_id)
- FKcbgrweylyqojbhslo2nv9cxwq (source_warehouse_id)

---

### 23. stock_request_item - Chi tiết yêu cầu chuyển hàng

| Column | Type | Key | Null | Default | Extra |
|--------|------|-----|------|---------|-------|
| id | bigint | PRI | NO | | auto_increment |
| stock_request_id | bigint | MUL | NO | | |
| variant_id | bigint | MUL | NO | | |
| quantity | int | | NO | | |
| note | varchar(200) | YES | | | |

**Indexes**:
- PRIMARY (id)
- FKa6b2tjpgjm3qw54i4km2kuyc1 (stock_request_id)
- FKmu7arim8wokxddfykroto0jar (variant_id)

---

### 24. inventory_document_backup_20260311 - Backup phiếu kho

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
| status | varchar(20) | YES | | | |

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

## Quan hệ giữa các bảng

```
users 1--N user_roles N--1 roles
roles 1--N role_permissions N--1 permissions
users 1--N refresh_tokens
users 1--N otp_codes

users N--1 stores (store_id)
users N--1 warehouses (warehouse_id)

stores 1--N shifts
stores 1--N store_warehouses N--1 warehouses
stores 1--N stock_request
stores 1--N attendance_logs

warehouses 1--N warehouses (parent_id - tự tham chiếu)
warehouses 1--N inventory_stock
warehouses 1--N inventory_document (source_warehouse_id, target_warehouse_id)
warehouses N--1 suppliers

products N--1 product_categories
products 1--N product_variants

product_variants 1--N inventory_stock
product_variants 1--N inventory_document_item
product_variants 1--N inventory_history
product_variants 1--N stock_request_item

inventory_document 1--N inventory_document_item
inventory_document 1--N inventory_history

stock_request 1--N stock_request_item
stock_request N--1 warehouses (source_warehouse_id, target_warehouse_id)
stock_request N--1 inventory_document (exported_document_id)

shifts 1--N shift_assignments
users 1--N shift_assignments

shift_assignments 1--N attendance_logs
users 1--N attendance_logs
```

---

## Các thay đổi so với phiên bản trước

### Cập nhật columns:
- **users**: Thêm column `is_first_login` (bit(1))
- **stores**: Thêm columns `latitude`, `longitude`, `radius_meters`
- **warehouses**: Thêm column `is_central`, bỏ index trên `parent_id`
- **inventory_document**: Thêm column `status`
- **attendance_logs**: Thêm columns `latitude`, `longitude`, `distance_meters`, `status`, `work_hours`; mở rộng `method` thêm 'GPS'
- **shifts**: Thêm column `is_default` (bit(1))

### Bảng mới:
- **otp_codes**: Lưu mã OTP xác thực email
- **stock_request**: Yêu cầu chuyển hàng giữa các kho
- **stock_request_item**: Chi tiết SKU trong yêu cầu chuyển hàng
- **inventory_document_backup_20260311**: Bảng backup phiếu kho

### Lưu ý:
- **product_variants**: Có 2 index trùng lặp (uk_variant và UKqftlp982upbw9ey6wuyt4a4ga) - cần xóa 1

---

*Generated: 2026-03-18*
