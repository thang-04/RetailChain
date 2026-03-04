/* ============================================================
   RETAIL CHAIN MANAGEMENT SYSTEM
   ============================================================ */

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- 1) STORES
-- =========================
DROP TABLE IF EXISTS attendance_logs;
DROP TABLE IF EXISTS shift_assignments;
DROP TABLE IF EXISTS shifts;

DROP TABLE IF EXISTS inventory_history;
DROP TABLE IF EXISTS inventory_document_item;
DROP TABLE IF EXISTS inventory_document;
DROP TABLE IF EXISTS inventory_stock;

DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_categories;

DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS store_warehouses;
DROP TABLE IF EXISTS warehouses;
DROP TABLE IF EXISTS stores;

-- =========================
-- STORES
-- =========================
CREATE TABLE stores (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK. ID cửa hàng',
  code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã cửa hàng (duy nhất), dùng hiển thị/tra cứu (vd: HN-01)',
  name VARCHAR(255) NOT NULL COMMENT 'Tên cửa hàng',
  address VARCHAR(500) NULL COMMENT 'Địa chỉ cửa hàng',
  status TINYINT NOT NULL DEFAULT 1 COMMENT 'Trạng thái hoạt động: 1=active, 0=inactive',
  created_at DATETIME(3) NOT NULL COMMENT 'Thời điểm tạo bản ghi',
  updated_at DATETIME(3) NOT NULL COMMENT 'Thời điểm cập nhật bản ghi gần nhất'
) ENGINE=InnoDB COMMENT='Danh sách cửa hàng trong chuỗi';

-- =========================
-- 2) WAREHOUSES + MAPPING
-- =========================
CREATE TABLE warehouses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK. ID kho',
  code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã kho (duy nhất), dùng hiển thị/tra cứu',
  name VARCHAR(255) NOT NULL COMMENT 'Tên kho',
  warehouse_type TINYINT NOT NULL DEFAULT 1 COMMENT 'Loại kho: 1=Kho tổng (CHAIN), 0=Kho cửa hàng (STORE)',
  store_id BIGINT NULL COMMENT 'Kho cửa hàng thuộc store nào (warehouse_type=0). Kho tổng để NULL',
  status TINYINT NOT NULL DEFAULT 1 COMMENT 'Trạng thái kho: 1=active, 0=inactive',
  created_at DATETIME(3) NOT NULL COMMENT 'Thời điểm tạo bản ghi',
  updated_at DATETIME(3) NOT NULL COMMENT 'Thời điểm cập nhật bản ghi gần nhất',
  CONSTRAINT fk_wh_store FOREIGN KEY (store_id) REFERENCES stores(id)
) ENGINE=InnoDB COMMENT='Danh sách kho (kho tổng và kho cửa hàng)';

CREATE INDEX idx_wh_store ON warehouses(store_id);
CREATE INDEX idx_wh_type ON warehouses(warehouse_type);

CREATE TABLE store_warehouses (
  store_id BIGINT NOT NULL COMMENT 'FK -> stores.id. Cửa hàng',
  warehouse_id BIGINT NOT NULL COMMENT 'FK -> warehouses.id. Kho được gán cho cửa hàng',
  is_default TINYINT NOT NULL DEFAULT 0 COMMENT 'Kho mặc định của cửa hàng: 1=yes, 0=no',
  PRIMARY KEY (store_id, warehouse_id),
  CONSTRAINT fk_sw_store FOREIGN KEY (store_id) REFERENCES stores(id),
  CONSTRAINT fk_sw_wh FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
) ENGINE=InnoDB COMMENT='Mapping cửa hàng - kho (một cửa hàng có thể có nhiều kho)';

-- Optional but useful: ensure only one default warehouse per store (MySQL 8 supports functional index workaround).
-- If you want strict DB-level enforcement, you can handle in application layer.
CREATE INDEX idx_sw_store_default ON store_warehouses(store_id, is_default);

-- =========================
-- 3) USERS + ROLES (RBAC)
-- =========================
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK. ID người dùng',
  store_id BIGINT NULL COMMENT 'FK -> stores.id. Người dùng thuộc cửa hàng nào (Admin chuỗi có thể NULL)',
  username VARCHAR(100) NOT NULL UNIQUE COMMENT 'Tên đăng nhập (duy nhất)',
  password TEXT NOT NULL COMMENT 'Mật khẩu đã hash (BCrypt), KHÔNG lưu plain text',
  full_name VARCHAR(255) NULL COMMENT 'Họ tên',
  phone VARCHAR(50) NULL COMMENT 'Số điện thoại',
  email VARCHAR(255) NULL COMMENT 'Email',
  status TINYINT NOT NULL DEFAULT 1 COMMENT 'Trạng thái tài khoản: 1=active, 0=inactive/locked',
  created_at DATETIME(3) NOT NULL COMMENT 'Thời điểm tạo',
  updated_at DATETIME(3) NOT NULL COMMENT 'Thời điểm cập nhật gần nhất',
  CONSTRAINT fk_user_store FOREIGN KEY (store_id) REFERENCES stores(id)
) ENGINE=InnoDB COMMENT='Tài khoản người dùng hệ thống';

CREATE INDEX idx_users_store ON users(store_id);
CREATE INDEX idx_users_status ON users(status);

CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK. ID role',
  code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã role (duy nhất): ADMIN, STORE_MANAGER, STAFF',
  name VARCHAR(255) NOT NULL COMMENT 'Tên role hiển thị'
) ENGINE=InnoDB COMMENT='Danh sách role (phân quyền theo vai trò)';

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL COMMENT 'FK -> users.id',
  role_id BIGINT NOT NULL COMMENT 'FK -> roles.id',
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB COMMENT='Mapping user - role (1 user có thể có nhiều role)';

-- =========================
-- 4) PRODUCTS (FASHION)
-- =========================
CREATE TABLE product_categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK. ID danh mục sản phẩm',
  name VARCHAR(255) NOT NULL COMMENT 'Tên danh mục (vd: Áo, Quần, Váy...)'
) ENGINE=InnoDB COMMENT='Danh mục sản phẩm';

CREATE TABLE products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK. ID sản phẩm (model/mẫu)',
  category_id BIGINT NOT NULL COMMENT 'FK -> product_categories.id. Danh mục',
  code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã model sản phẩm (vd: TSHIRT-001)',
  name VARCHAR(255) NOT NULL COMMENT 'Tên sản phẩm/model (vd: Áo thun basic nam)',
  description TEXT NULL COMMENT 'Mô tả chi tiết sản phẩm',
  gender ENUM('MEN','WOMEN','UNISEX','KIDS') NULL COMMENT 'Đối tượng: Nam/Nữ/Unisex/Trẻ em',
  status TINYINT NOT NULL DEFAULT 1 COMMENT 'Trạng thái sản phẩm: 1=active, 0=inactive',
  created_at DATETIME(3) NOT NULL COMMENT 'Thời điểm tạo',
  updated_at DATETIME(3) NOT NULL COMMENT 'Thời điểm cập nhật gần nhất',
  CONSTRAINT fk_prod_cat FOREIGN KEY (category_id) REFERENCES product_categories(id)
) ENGINE=InnoDB COMMENT='Sản phẩm cấp model (không phân biệt size/màu)';

CREATE INDEX idx_products_cat ON products(category_id);
CREATE INDEX idx_products_status ON products(status);

CREATE TABLE product_variants (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK. ID biến thể (SKU thực tế)',
  product_id BIGINT NOT NULL COMMENT 'FK -> products.id. Thuộc model nào',
  sku VARCHAR(80) NOT NULL UNIQUE COMMENT 'SKU duy nhất cho biến thể (size+màu). Dùng trong bán/nhập/xuất',
  barcode VARCHAR(80) NULL UNIQUE COMMENT 'Mã vạch (nếu có). NULL allowed, nếu có phải duy nhất',
  size VARCHAR(30) NOT NULL COMMENT 'Size (S/M/L/XL/28/29...)',
  color VARCHAR(50) NOT NULL COMMENT 'Màu (Black/White/Red...)',
  price DECIMAL(18,2) NOT NULL COMMENT 'Giá bán của biến thể',
  status TINYINT NOT NULL DEFAULT 1 COMMENT 'Trạng thái biến thể: 1=active, 0=inactive',
  created_at DATETIME(3) NOT NULL COMMENT 'Thời điểm tạo',
  updated_at DATETIME(3) NOT NULL COMMENT 'Thời điểm cập nhật gần nhất',
  CONSTRAINT fk_pv_product FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE KEY uk_variant (product_id, size, color)
) ENGINE=InnoDB COMMENT='Biến thể sản phẩm theo size/màu (SKU thực tế)';

CREATE INDEX idx_pv_product ON product_variants(product_id);
CREATE INDEX idx_pv_status ON product_variants(status);

-- =========================
-- 5) INVENTORY (STOCK + DOCUMENTS + HISTORY)
-- =========================
CREATE TABLE inventory_stock (
  warehouse_id BIGINT NOT NULL COMMENT 'FK -> warehouses.id. Kho',
  variant_id BIGINT NOT NULL COMMENT 'FK -> product_variants.id. Biến thể (SKU)',
  quantity INT NOT NULL DEFAULT 0 COMMENT 'Số lượng tồn hiện tại trong kho (đơn vị: cái)',
  updated_at DATETIME(3) NOT NULL COMMENT 'Thời điểm cập nhật số lượng gần nhất',
  PRIMARY KEY (warehouse_id, variant_id),
  CONSTRAINT fk_is_wh FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  CONSTRAINT fk_is_var FOREIGN KEY (variant_id) REFERENCES product_variants(id)
) ENGINE=InnoDB COMMENT='Tồn kho hiện tại theo kho + SKU (cache để query nhanh)';

CREATE INDEX idx_is_variant ON inventory_stock(variant_id);

CREATE TABLE inventory_document (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK. ID phiếu kho',
  document_code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã phiếu (duy nhất): PN-20260122-0001...',
  document_type ENUM('IMPORT','EXPORT','TRANSFER','ADJUST') NOT NULL COMMENT 'IMPORT=Nhập, EXPORT=Xuất, TRANSFER=Điều chuyển, ADJUST=Điều chỉnh',

  source_warehouse_id BIGINT NULL COMMENT 'Kho nguồn (EXPORT/TRANSFER/ADJUST). IMPORT thường NULL',
  target_warehouse_id BIGINT NULL COMMENT 'Kho đích (IMPORT/TRANSFER). EXPORT thường NULL',

  reference_type VARCHAR(30) NULL COMMENT 'Loại đối tượng tham chiếu (vd: SALES_ORDER, SUPPLIER, RETURN...)',
  reference_id BIGINT NULL COMMENT 'ID đối tượng tham chiếu',

  note VARCHAR(500) NULL COMMENT 'Ghi chú phiếu',
  created_by BIGINT NOT NULL COMMENT 'FK -> users.id. Người tạo phiếu',
  created_at DATETIME(3) NOT NULL COMMENT 'Thời điểm tạo phiếu',

  CONSTRAINT fk_idoc_src_wh FOREIGN KEY (source_warehouse_id) REFERENCES warehouses(id),
  CONSTRAINT fk_idoc_tgt_wh FOREIGN KEY (target_warehouse_id) REFERENCES warehouses(id),
  CONSTRAINT fk_idoc_user FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB COMMENT='Phiếu nghiệp vụ kho (nhập/xuất/điều chuyển/điều chỉnh)';

CREATE INDEX idx_idoc_type_time ON inventory_document(document_type, created_at);
CREATE INDEX idx_idoc_time ON inventory_document(created_at);
CREATE INDEX idx_idoc_ref ON inventory_document(reference_type, reference_id);

CREATE TABLE inventory_document_item (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK. ID dòng chi tiết phiếu',
  document_id BIGINT NOT NULL COMMENT 'FK -> inventory_document.id. Thuộc phiếu nào',
  variant_id BIGINT NOT NULL COMMENT 'FK -> product_variants.id. SKU nào',
  quantity INT NOT NULL COMMENT 'Số lượng của SKU trong phiếu (luôn dương)',
  note VARCHAR(255) NULL COMMENT 'Ghi chú dòng',
  CONSTRAINT fk_idi_doc FOREIGN KEY (document_id) REFERENCES inventory_document(id),
  CONSTRAINT fk_idi_var FOREIGN KEY (variant_id) REFERENCES product_variants(id)
) ENGINE=InnoDB COMMENT='Chi tiết các SKU trong một phiếu kho';

CREATE INDEX idx_idi_doc ON inventory_document_item(document_id);
CREATE INDEX idx_idi_variant ON inventory_document_item(variant_id);

CREATE TABLE inventory_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK. ID lịch sử biến động tồn kho',
  document_id BIGINT NOT NULL COMMENT 'FK -> inventory_document.id. Biến động thuộc phiếu nào',
  document_item_id BIGINT NOT NULL COMMENT 'FK -> inventory_document_item.id. Biến động thuộc dòng nào',

  warehouse_id BIGINT NOT NULL COMMENT 'FK -> warehouses.id. Kho bị ảnh hưởng',
  variant_id BIGINT NOT NULL COMMENT 'FK -> product_variants.id. SKU bị ảnh hưởng',

  action ENUM('IN','OUT') NOT NULL COMMENT 'IN=tăng tồn, OUT=giảm tồn',
  quantity INT NOT NULL COMMENT 'Số lượng tăng/giảm',
  balance_after INT NOT NULL COMMENT 'Tồn kho sau khi áp biến động',

  actor_user_id BIGINT NOT NULL COMMENT 'FK -> users.id. Người thực hiện thao tác',
  occurred_at DATETIME(3) NOT NULL COMMENT 'Thời điểm phát sinh biến động',

  CONSTRAINT fk_ih_doc FOREIGN KEY (document_id) REFERENCES inventory_document(id),
  CONSTRAINT fk_ih_item FOREIGN KEY (document_item_id) REFERENCES inventory_document_item(id),
  CONSTRAINT fk_ih_wh FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  CONSTRAINT fk_ih_var FOREIGN KEY (variant_id) REFERENCES product_variants(id),
  CONSTRAINT fk_ih_user FOREIGN KEY (actor_user_id) REFERENCES users(id)
) ENGINE=InnoDB COMMENT='Sổ lịch sử (append-only) để audit/trace biến động tồn kho';

CREATE INDEX idx_ih_wh_var_time ON inventory_history(warehouse_id, variant_id, occurred_at);
CREATE INDEX idx_ih_var_time ON inventory_history(variant_id, occurred_at);
CREATE INDEX idx_ih_doc ON inventory_history(document_id);

-- =========================
-- 6) WORKFORCE (SHIFTS + ATTENDANCE)
-- =========================
CREATE TABLE shifts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK. ID ca làm',
  store_id BIGINT NOT NULL COMMENT 'FK -> stores.id. Ca thuộc cửa hàng nào',
  name VARCHAR(100) NOT NULL COMMENT 'Tên ca (vd: Ca sáng, Ca chiều)',
  start_time TIME NOT NULL COMMENT 'Giờ bắt đầu ca',
  end_time TIME NOT NULL COMMENT 'Giờ kết thúc ca',
  created_at DATETIME(3) NOT NULL COMMENT 'Thời điểm tạo',
  updated_at DATETIME(3) NOT NULL COMMENT 'Thời điểm cập nhật gần nhất',
  CONSTRAINT fk_shift_store FOREIGN KEY (store_id) REFERENCES stores(id)
) ENGINE=InnoDB COMMENT='Danh sách ca làm việc theo cửa hàng';

CREATE INDEX idx_shifts_store ON shifts(store_id);

CREATE TABLE shift_assignments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK. ID phân ca',
  shift_id BIGINT NOT NULL COMMENT 'FK -> shifts.id. Ca nào',
  user_id BIGINT NOT NULL COMMENT 'FK -> users.id. Nhân viên được phân ca',
  work_date DATE NOT NULL COMMENT 'Ngày làm việc của ca',
  status ENUM('ASSIGNED','CANCELLED') NOT NULL DEFAULT 'ASSIGNED' COMMENT 'Trạng thái phân ca',
  created_by BIGINT NOT NULL COMMENT 'FK -> users.id. Người tạo phân ca (manager/admin)',
  created_at DATETIME(3) NOT NULL COMMENT 'Thời điểm tạo phân ca',
  CONSTRAINT fk_sa_shift FOREIGN KEY (shift_id) REFERENCES shifts(id),
  CONSTRAINT fk_sa_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_sa_created_by FOREIGN KEY (created_by) REFERENCES users(id),
  UNIQUE KEY uk_sa (user_id, work_date, shift_id)
) ENGINE=InnoDB COMMENT='Lịch phân ca cho nhân viên theo ngày';

CREATE INDEX idx_sa_user_date ON shift_assignments(user_id, work_date);
CREATE INDEX idx_sa_shift_date ON shift_assignments(shift_id, work_date);

CREATE TABLE attendance_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK. ID log chấm công',
  assignment_id BIGINT NULL COMMENT 'FK -> shift_assignments.id. Có thể NULL nếu chấm công không gắn ca',
  user_id BIGINT NOT NULL COMMENT 'FK -> users.id. Người được chấm công',
  store_id BIGINT NOT NULL COMMENT 'FK -> stores.id. Cửa hàng phát sinh chấm công',
  check_type ENUM('IN','OUT') NOT NULL COMMENT 'IN=vào ca, OUT=ra ca',
  method ENUM('MANUAL','QR') NOT NULL COMMENT 'MANUAL=nhập tay, QR=quét QR',
  occurred_at DATETIME(3) NOT NULL COMMENT 'Thời điểm thực tế check-in/out',
  note VARCHAR(255) NULL COMMENT 'Ghi chú',
  created_by BIGINT NULL COMMENT 'FK -> users.id. Ai tạo log (manager tạo hộ). Nếu tự chấm có thể = user_id',
  created_at DATETIME(3) NOT NULL COMMENT 'Thời điểm ghi log vào hệ thống',
  CONSTRAINT fk_al_assign FOREIGN KEY (assignment_id) REFERENCES shift_assignments(id),
  CONSTRAINT fk_al_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_al_store FOREIGN KEY (store_id) REFERENCES stores(id),
  CONSTRAINT fk_al_created_by FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB COMMENT='Log chấm công (IN/OUT) theo nhân viên/cửa hàng';

CREATE INDEX idx_al_user_time ON attendance_logs(user_id, occurred_at);
CREATE INDEX idx_al_store_time ON attendance_logs(store_id, occurred_at);
CREATE INDEX idx_al_assignment ON attendance_logs(assignment_id);

SET FOREIGN_KEY_CHECKS = 1;
