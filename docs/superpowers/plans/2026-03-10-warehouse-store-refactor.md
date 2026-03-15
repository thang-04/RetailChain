# Refactor Warehouse-Store Relationship Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor database schema từ mô hình nhiều kho cha-con sang 1 kho tổng + mỗi store có 1 warehouse riêng (1:1)

**Architecture:** 
- Xóa bảng `store_warehouses` (quan hệ nhiều-nhiều)
- Thêm `warehouse_id` NOT NULL vào `stores` (quan hệ 1:1)
- Đơn giản hóa `warehouses`: xóa `parent_id`, `warehouse_level`, thêm `is_central`
- Khi tạo Store → auto tạo Warehouse kèm theo

**Tech Stack:** Java Spring Boot, JPA, MySQL

---

## Chunk 1: Database & Entity Changes

### Task 1: Cập nhật Warehouse Entity

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/entity/Warehouse.java`

- [ ] **Step 1: Đọc file hiện tại**

```java
// File hiện tại có các trường:
// - parentId
// - warehouseLevel
// Cần xóa và thêm isCentral
```

- [ ] **Step 2: Sửa Warehouse.java**

```java
package com.sba301.retailmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "province", length = 100)
    private String province;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "ward", length = 100)
    private String ward;

    @Column(name = "contact_name", length = 255)
    private String contactName;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_central")
    private Boolean isCentral = false;

    @Column(name = "status", nullable = false)
    private Integer status = 1;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
```

- [ ] **Step 3: Commit**

```bash
git add RetailChainService/src/main/java/com/sba301/retailmanagement/entity/Warehouse.java
git commit -m "refactor: update Warehouse entity - remove parentId/warehouseLevel, add isCentral"
```

---

### Task 2: Cập nhật Store Entity

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/entity/Store.java`

- [ ] **Step 1: Sửa Store.java thêm warehouseId**

```java
package com.sba301.retailmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "stores")
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "status", nullable = false)
    private Integer status = 1;

    @Column(name = "warehouse_id", nullable = false)
    private Long warehouseId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add RetailChainService/src/main/java/com/sba301/retailmanagement/entity/Store.java
git commit -m "refactor: add warehouseId to Store entity - 1:1 relationship"
```

---

### Task 3: Xóa StoreWarehouse Entity

**Files:**
- Delete: `RetailChainService/src/main/java/com/sba301/retailmanagement/entity/StoreWarehouse.java`
- Delete: `RetailChainService/src/main/java/com/sba301/retailmanagement/entity/StoreWarehouseId.java`

- [ ] **Step 1: Xóa 2 files**

```bash
rm RetailChainService/src/main/java/com/sba301/retailmanagement/entity/StoreWarehouse.java
rm RetailChainService/src/main/java/com/sba301/retailmanagement/entity/StoreWarehouseId.java
```

- [ ] **Step 2: Commit**

```bash
git rm RetailChainService/src/main/java/com/sba301/retailmanagement/entity/StoreWarehouse.java
git rm RetailChainService/src/main/java/com/sba301/retailmanagement/entity/StoreWarehouseId.java
git commit -m "refactor: remove StoreWarehouse entity - replaced by Store.warehouseId"
```

---

## Chunk 2: DTO Changes

### Task 4: Cập nhật WarehouseRequest DTO

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/request/WarehouseRequest.java`

- [ ] **Step 1: Đọc và sửa WarehouseRequest.java**

```java
package com.sba301.retailmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseRequest {
    private String code;
    private String name;
    private String address;
    private String province;
    private String district;
    private String ward;
    private String contactName;
    private String contactPhone;
    private String description;
    private Boolean isCentral;
    private Integer status;
}
```

- [ ] **Step 2: Commit**

```bash
git add RetailChainService/src/main/java/com/sba301/retailmanagement/dto/request/WarehouseRequest.java
git commit -m "refactor: update WarehouseRequest - remove parentId/warehouseLevel, add isCentral"
```

---

### Task 5: Cập nhật WarehouseResponse DTO

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/response/WarehouseResponse.java`

- [ ] **Step 1: Đọc file và sửa**

```java
package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseResponse {
    private Long id;
    private String code;
    private String name;
    private String address;
    private String province;
    private String district;
    private String ward;
    private String contactName;
    private String contactPhone;
    private String description;
    private Boolean isCentral;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

- [ ] **Step 2: Commit**

```bash
git add RetailChainService/src/main/java/com/sba301/retailmanagement/dto/response/WarehouseResponse.java
git commit -m "refactor: update WarehouseResponse - remove parentId/warehouseLevel, add isCentral"
```

---

### Task 6: Cập nhật CreateStoreRequest DTO

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/request/CreateStoreRequest.java`

- [ ] **Step 1: Sửa CreateStoreRequest.java - warehouseId không bắt buộc**

```java
package com.sba301.retailmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateStoreRequest {
    private String code;
    private String name;
    private String address;
    // warehouseId removed - will be auto-created with store
}
```

- [ ] **Step 2: Commit**

```bash
git add RetailChainService/src/main/java/com/sba301/retailmanagement/dto/request/CreateStoreRequest.java
git commit -m "refactor: remove warehouseId from CreateStoreRequest - auto-created"
```

---

## Chunk 3: Repository Changes

### Task 7: Cập nhật WarehouseRepository

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/repository/WarehouseRepository.java`

- [ ] **Step 1: Sửa WarehouseRepository.java**

```java
package com.sba301.retailmanagement.repository;

import com.sba301.retailmanagement.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    Optional<Warehouse> findByCode(String code);
    boolean existsByCode(String code);
    Optional<Warehouse> findByIsCentralTrue();
    long countByIsCentralTrue();
}
```

- [ ] **Step 2: Commit**

```bash
git add RetailChainService/src/main/java/com/sba301/retailmanagement/repository/WarehouseRepository.java
git commit -m "refactor: add findByIsCentralTrue to WarehouseRepository"
```

---

### Task 8: Xóa StoreWarehouseRepository

**Files:**
- Delete: `RetailChainService/src/main/java/com/sba301/retailmanagement/repository/StoreWarehouseRepository.java`

- [ ] **Step 1: Xóa file**

```bash
rm RetailChainService/src/main/java/com/sba301/retailmanagement/repository/StoreWarehouseRepository.java
```

- [ ] **Step 2: Commit**

```bash
git rm RetailChainService/src/main/java/com/sba301/retailmanagement/repository/StoreWarehouseRepository.java
git commit -m "refactor: remove StoreWarehouseRepository - no longer needed"
```

---

## Chunk 4: Service Changes

### Task 9: Cập nhật WarehouseServiceImpl

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/WarehouseServiceImpl.java`

- [ ] **Step 1: Sửa createWarehouse method**

```java
@Override
@Transactional
public WarehouseResponse createWarehouse(WarehouseRequest request) {
    if (warehouseRepository.existsByCode(request.getCode())) {
        throw new RuntimeException("Warehouse code already exists");
    }

    // Validate only 1 central warehouse
    if (Boolean.TRUE.equals(request.getIsCentral()) && warehouseRepository.countByIsCentralTrue() > 0) {
        throw new RuntimeException("Only one central warehouse allowed");
    }

    Warehouse warehouse = new Warehouse();
    warehouse.setCode(request.getCode());
    warehouse.setName(request.getName());
    warehouse.setAddress(request.getAddress());
    warehouse.setProvince(request.getProvince());
    warehouse.setDistrict(request.getDistrict());
    warehouse.setWard(request.getWard());
    warehouse.setContactName(request.getContactName());
    warehouse.setContactPhone(request.getContactPhone());
    warehouse.setDescription(request.getDescription());
    warehouse.setIsCentral(request.getIsCentral() != null ? request.getIsCentral() : false);
    warehouse.setStatus(request.getStatus() != null ? request.getStatus() : 1);
    warehouse.setCreatedAt(LocalDateTime.now());
    warehouse.setUpdatedAt(LocalDateTime.now());

    Warehouse savedWarehouse = warehouseRepository.save(warehouse);
    return mapToResponse(savedWarehouse);
}
```

- [ ] **Step 2: Sửa updateWarehouse method - xóa parentId, warehouseLevel**

```java
@Override
@Transactional
public WarehouseResponse updateWarehouse(Long id, WarehouseRequest request) {
    Warehouse warehouse = warehouseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Warehouse not found"));

    if (request.getCode() != null && !request.getCode().equals(warehouse.getCode())) {
        if (warehouseRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Warehouse code already exists");
        }
        warehouse.setCode(request.getCode());
    }

    if (request.getName() != null) {
        warehouse.setName(request.getName());
    }

    if (request.getAddress() != null) {
        warehouse.setAddress(request.getAddress());
    }

    if (request.getProvince() != null) {
        warehouse.setProvince(request.getProvince());
    }

    if (request.getDistrict() != null) {
        warehouse.setDistrict(request.getDistrict());
    }

    if (request.getWard() != null) {
        warehouse.setWard(request.getWard());
    }

    if (request.getContactName() != null) {
        warehouse.setContactName(request.getContactName());
    }

    if (request.getContactPhone() != null) {
        warehouse.setContactPhone(request.getContactPhone());
    }

    if (request.getDescription() != null) {
        warehouse.setDescription(request.getDescription());
    }

    if (request.getStatus() != null) {
        warehouse.setStatus(request.getStatus());
    }

    // Handle isCentral change
    if (request.getIsCentral() != null && !request.getIsCentral().equals(warehouse.getIsCentral())) {
        if (Boolean.TRUE.equals(request.getIsCentral())) {
            if (warehouseRepository.countByIsCentralTrue() > 0) {
                throw new RuntimeException("Only one central warehouse allowed");
            }
        }
        warehouse.setIsCentral(request.getIsCentral());
    }

    warehouse.setUpdatedAt(LocalDateTime.now());
    Warehouse saved = warehouseRepository.save(warehouse);
    return mapToResponse(saved);
}
```

- [ ] **Step 3: Sửa mapToResponse method**

```java
private WarehouseResponse mapToResponse(Warehouse warehouse) {
    return WarehouseResponse.builder()
            .id(warehouse.getId())
            .code(warehouse.getCode())
            .name(warehouse.getName())
            .address(warehouse.getAddress())
            .province(warehouse.getProvince())
            .district(warehouse.getDistrict())
            .ward(warehouse.getWard())
            .contactName(warehouse.getContactName())
            .contactPhone(warehouse.getContactPhone())
            .description(warehouse.getDescription())
            .isCentral(warehouse.getIsCentral())
            .status(warehouse.getStatus())
            .createdAt(warehouse.getCreatedAt())
            .updatedAt(warehouse.getUpdatedAt())
            .build();
}
```

- [ ] **Step 4: Commit**

```bash
git add RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/WarehouseServiceImpl.java
git commit -m "refactor: update WarehouseServiceImpl - use isCentral instead of parentId/warehouseLevel"
```

---

### Task 10: Cập nhật StoreServiceImpl

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/StoreServiceImpl.java`

- [ ] **Step 1: Sửa imports - bỏ StoreWarehouse**

```java
// Remove:
// import com.sba301.retailmanagement.entity.StoreWarehouse;
// import com.sba301.retailmanagement.entity.StoreWarehouseId;
// import com.sba301.retailmanagement.repository.StoreWarehouseRepository;
```

- [ ] **Step 2: Sửa constructor và field - bỏ StoreWarehouseRepository**

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final StoreMapper storeMapper;
    // REMOVED: private final StoreWarehouseRepository storeWarehouseRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryStockRepository inventoryStockRepository;
```

- [ ] **Step 3: Sửa createStore method - auto tạo warehouse**

```java
@Override
public StoreResponse createStore(CreateStoreRequest request) {
    String prefix = "[createStore]|code=" + (request != null ? request.getCode() : "null");
    log.info("{}|START", prefix);
    try {
        if (request == null || request.getCode() == null) {
            log.error("{}|FAILED|Request or code is null", prefix);
            throw new IllegalArgumentException("Request or code cannot be null");
        }
        if (storeRepository.findByCode(request.getCode()).isPresent()) {
            log.error("{}|Store code already exists", prefix);
            throw new IllegalArgumentException("Store code already exists");
        }

        // Auto-create warehouse for store (1:1 relationship)
        Warehouse warehouse = new Warehouse();
        warehouse.setCode("WH_" + request.getCode());
        warehouse.setName("Kho " + request.getName());
        warehouse.setAddress(request.getAddress());
        warehouse.setIsCentral(false);
        warehouse.setStatus(1);
        warehouse.setCreatedAt(LocalDateTime.now());
        warehouse.setUpdatedAt(LocalDateTime.now());
        
        Warehouse savedWarehouse = warehouseRepository.save(warehouse);

        Store store = storeMapper.toEntity(request);
        store.setWarehouseId(savedWarehouse.getId());
        store.setCreatedAt(LocalDateTime.now());
        store.setUpdatedAt(LocalDateTime.now());

        Store savedStore = storeRepository.save(store);

        StoreResponse response = storeMapper.toResponse(savedStore);
        response.setWarehouseId(savedWarehouse.getId());

        log.info("{}|END|id={}, warehouseId={}", prefix, savedStore.getId(), savedWarehouse.getId());
        return response;
    } catch (IllegalArgumentException e) {
        throw e;
    } catch (Exception e) {
        log.error("{}|Exception={}", prefix, e.getMessage(), e);
        throw new RuntimeException("Error creating store: " + e.getMessage());
    }
}
```

- [ ] **Step 4: Sửa updateStore method - bỏ StoreWarehouse logic**

```java
@Override
public StoreResponse updateStore(String slug, UpdateStoreRequest request) {
    String prefix = "[updateStore]|slug=" + slug;
    log.info("{}|START", prefix);
    try {
        Optional<Store> storeOptional = storeRepository.findByCode(slug);
        if (storeOptional.isEmpty()) {
            log.error("{}|Store not found", prefix);
            throw new ResourceNotFoundException("Store not found with code: " + slug);
        }
        Store store = storeOptional.get();

        storeMapper.updateEntity(store, request);
        store.setUpdatedAt(LocalDateTime.now());

        // Update warehouse if address changed
        if (request.getAddress() != null && store.getWarehouseId() != null) {
            Optional<Warehouse> warehouseOpt = warehouseRepository.findById(store.getWarehouseId());
            warehouseOpt.ifPresent(warehouse -> {
                warehouse.setAddress(request.getAddress());
                warehouse.setUpdatedAt(LocalDateTime.now());
                warehouseRepository.save(warehouse);
            });
        }

        Store updatedStore = storeRepository.save(store);

        StoreResponse response = storeMapper.toResponse(updatedStore);
        
        // Include warehouseId in response
        if (updatedStore.getWarehouseId() != null) {
            response.setWarehouseId(updatedStore.getWarehouseId());
        }

        log.info("{}|END", prefix);
        return response;
    } catch (ResourceNotFoundException e) {
        throw e;
    } catch (Exception e) {
        log.error("{}|Exception={}", prefix, e.getMessage(), e);
        throw new RuntimeException("Error updating store: " + e.getMessage());
    }
}
```

- [ ] **Step 5: Sửa getStoreBySlug - bỏ StoreWarehouse logic**

```java
@Override
public StoreDetailResponse getStoreBySlug(String slug) {
    String prefix = "[getStoreBySlug]|slug=" + slug;
    log.info("{}|START", prefix);
    try {
        Optional<Store> storeOptional = storeRepository.findByCode(slug);
        if (storeOptional.isEmpty()) {
            log.error("{}|Store not found", prefix);
            throw new ResourceNotFoundException("Store not found with code: " + slug);
        }
        Store store = storeOptional.get();
        StoreDetailResponse response = storeMapper.toDetailResponse(store);

        // Get warehouseId directly from store (1:1)
        response.setWarehouseId(store.getWarehouseId());

        // ... rest of the method stays the same, but use store.getWarehouseId() instead of storeWarehouses
        // Instead of:
        // List<StoreWarehouse> storeWarehouses = storeWarehouseRepository.findByStoreId(store.getId());
        // Use:
        Long warehouseId = store.getWarehouseId();
        
        // Then use warehouseId for inventory queries
        if (warehouseId != null) {
            List<InventoryStock> stocks = inventoryStockRepository.findByWarehouseId(warehouseId);
            // ... rest of inventory logic
        }
        
        // ... rest stays the same
        
        log.info("{}|END", prefix);
        return response;
    } catch (ResourceNotFoundException e) {
        throw e;
    } catch (Exception e) {
        log.error("{}|Exception={}", prefix, e);
        throw new RuntimeException("Error retrieving store: e.getMessage(), " + e.getMessage());
    }
}
```

- [ ] **Step 6: Commit**

```bash
git add RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/StoreServiceImpl.java
 "refactor:git commit -m update StoreServiceImpl - auto-create warehouse, remove StoreWarehouse"
```

---

## Chunk 5: Mapper & Response DTO

### Task 11: Cập nhật StoreMapper

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/mapper/StoreMapper.java`

- [ ] **Step 1: Đọc file và kiểm tra**

```java
// Check if toResponse method includes warehouseId
// May need to add: response.setWarehouseId(entity.getWarehouseId());
```

- [ ] **Step 2: Commit**

```bash
git add RetailChainService/src/main/java/com/sba301/retailmanagement/mapper/StoreMapper.java
git commit -m "refactor: update StoreMapper to include warehouseId in response"
```

---

### Task 12: Cập nhật StoreResponse DTO

**Files:**
- Check: `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/response/StoreResponse.java`

- [ ] **Step 1: Đọc file và thêm warehouseId nếu chưa có**

```java
package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StoreResponse {
    private Long id;
    private String code;
    private String name;
    private String address;
    private Integer status;
    private Long warehouseId;  // ADD THIS
    // ... other fields
}
```

- [ ] **Step 2: Commit**

```bash
git add RetailChainService/src/main/java/com/sba301/retailmanagement/dto/response/StoreResponse.java
git commit -m "refactor: add warehouseId to StoreResponse"
```

---

## Chunk 6: Database Migration

### Task 13: Tạo migration SQL

**Files:**
- Create: `RetailChainService/src/main/resources/db/migration/V2__refactor_warehouse_store_relationship.sql`

- [ ] **Step 1: Tạo migration file**

```sql
-- V2__refactor_warehouse_store_relationship.sql

-- 1. Add warehouse_id to stores (NOT NULL)
ALTER TABLE stores ADD COLUMN warehouse_id BIGINT NOT NULL;

-- 2. Add is_central to warehouses
ALTER TABLE warehouses ADD COLUMN is_central BOOLEAN DEFAULT FALSE;

-- 3. Create warehouse for each existing store
INSERT INTO warehouses (code, name, address, is_central, status, created_at, updated_at)
SELECT 
    CONCAT('WH_', code) as code,
    CONCAT('Kho ', name) as name,
    address,
    FALSE as is_central,
    status,
    created_at,
    updated_at
FROM stores;

-- 4. Update stores.warehouse_id with new warehouses
UPDATE stores s
SET s.warehouse_id = (
    SELECT w.id FROM warehouses w 
    WHERE w.code = CONCAT('WH_', s.code)
);

-- 5. Set one warehouse as central (choose one or create new)
-- Option A: Set existing warehouse as central
-- UPDATE warehouses SET is_central = TRUE WHERE id = 1;

-- Option B: Create central warehouse manually
INSERT INTO warehouses (code, name, is_central, status, created_at, updated_at)
VALUES ('WH_CENTRAL', 'Kho Tổng', TRUE, 1, NOW(), NOW());

-- 6. Drop store_warehouses table
DROP TABLE IF EXISTS store_warehouses;

-- 7. Add foreign key constraint
ALTER TABLE stores 
ADD CONSTRAINT fk_stores_warehouse 
FOREIGN KEY (warehouse_id) REFERENCES warehouses(id);

-- 8. Drop old columns from warehouses
ALTER TABLE warehouses DROP COLUMN IF EXISTS parent_id;
ALTER TABLE warehouses DROP COLUMN IF EXISTS warehouse_level;
ALTER TABLE warehouses DROP COLUMN IF EXISTS is_default;
```

- [ ] **Step 2: Commit**

```bash
git add RetailChainService/src/main/resources/db/migration/V2__refactor_warehouse_store_relationship.sql
git commit -m "db: add V2 migration for warehouse-store refactor"
```

---

## Chunk 7: Verification

### Task 14: Test và verify

**Files:**
- Test: API endpoints

- [ ] **Step 1: Build project**

```bash
cd RetailChainService
mvn clean compile
```

- [ ] **Step 2: Chạy migration và start server**

```bash
# Server sẽ chạy Flyway migration tự động
```

- [ ] **Step 3: Test API tạo kho tổng**

```bash
curl -X POST http://localhost:8080/api/warehouses \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WH_CENTRAL",
    "name": "Kho Tổng",
    "isCentral": true,
    "address": "Hà Nội"
  }'
```

- [ ] **Step 4: Test API tạo store (sẽ auto tạo warehouse)**

```bash
curl -X POST http://localhost:8080/api/stores \
  -H "Content-Type: application/json" \
  -d '{
    "code": "STORE001",
    "name": "Cửa hàng 1",
    "address": "Hà Nội"
  }'
```

- [ ] **Step 5: Verify trong database**

```bash
# Kiểm tra warehouse của store đã được tạo
python scripts/mysql_query.py --query "SELECT s.id, s.code, s.name, w.id as warehouse_id, w.code as warehouse_code FROM stores s JOIN warehouses w ON s.warehouse_id = w.id"
```

- [ ] **Step 6: Commit**

```bash
git commit --allow-empty -m "test: verify warehouse-store refactor works"
```

---

## Tổng kết

**Các files cần thay đổi:**
- Entity: `Warehouse.java`, `Store.java` (modify); `StoreWarehouse.java`, `StoreWarehouseId.java` (delete)
- DTO: `WarehouseRequest.java`, `WarehouseResponse.java`, `CreateStoreRequest.java`, `StoreResponse.java`
- Repository: `WarehouseRepository.java` (modify); `StoreWarehouseRepository.java` (delete)
- Service: `WarehouseServiceImpl.java`, `StoreServiceImpl.java`
- Migration: `V2__refactor_warehouse_store_relationship.sql`

**Thứ tự thực hiện:**
1. Chunk 1: Entity Changes
2. Chunk 2: DTO Changes
3. Chunk 3: Repository Changes
4. Chunk 4: Service Changes
5. Chunk 5: Mapper & Response
6. Chunk 6: Database Migration
7. Chunk 7: Verification
