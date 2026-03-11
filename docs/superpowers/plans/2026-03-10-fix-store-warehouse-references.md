# Fix StoreWarehouse References - Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix code trong staging branch để sử dụng warehouseId trong Store thay vì StoreWarehouse mapping

**Architecture:** Thay thế quan hệ nhiều-nhiều Store-Warehouse (qua StoreWarehouse) bằng quan hệ 1-1 (Store có warehouseId)

**Tech Stack:** Java Spring Boot, JPA, MySQL

---

## Chunk 1: Entity Changes

### Task 1: Update Warehouse Entity

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/entity/Warehouse.java`

- [ ] **Step 1: Read and update Warehouse.java**

```java
// Remove fields: isDefault, warehouseLevel, parentId
// Add field: isCentral

// Replace:
    @Column(name = "is_default")
    private Integer isDefault = 0;

    @Column(name = "warehouse_level")
    private Integer warehouseLevel;

    @Column(name = "parent_id")
    private Long parentId;

// With:
    @Column(name = "is_central")
    private Boolean isCentral = false;
```

- [ ] **Step 2: Commit**

```bash
cd RetailChainService
git add src/main/java/com/sba301/retailmanagement/entity/Warehouse.java
git commit -m "refactor: update Warehouse entity - replace isDefault/warehouseLevel/parentId with isCentral"
```

---

### Task 2: Delete StoreWarehouse Entity Files

**Files:**
- Delete: `RetailChainService/src/main/java/com/sba301/retailmanagement/entity/StoreWarehouse.java`
- Delete: `RetailChainService/src/main/java/com/sba301/retailmanagement/entity/StoreWarehouseId.java`

- [ ] **Step 1: Delete files**

```bash
rm RetailChainService/src/main/java/com/sba301/retailmanagement/entity/StoreWarehouse.java
rm RetailChainService/src/main/java/com/sba301/retailmanagement/entity/StoreWarehouseId.java
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "refactor: delete StoreWarehouse and StoreWarehouseId entities"
```

---

## Chunk 2: DTO Changes

### Task 3: Update WarehouseRequest DTO

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/request/WarehouseRequest.java`

- [ ] **Step 1: Update WarehouseRequest.java**

```java
// Remove:
    private Integer isDefault;
    private Integer warehouseLevel;
    private Long parentId;

// Add:
    private Boolean isCentral;
```

- [ ] **Step 2: Commit**

```bash
git add src/main/java/com/sba301/retailmanagement/dto/request/WarehouseRequest.java
git commit -m "refactor: update WarehouseRequest - replace isDefault/warehouseLevel/parentId with isCentral"
```

---

### Task 4: Update WarehouseResponse DTO

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/response/WarehouseResponse.java`

- [ ] **Step 1: Update WarehouseResponse.java**

```java
// Remove:
    private Integer isDefault;
    private Integer warehouseLevel;
    private Long parentId;

// Add:
    private Boolean isCentral;
```

- [ ] **Step 2: Commit**

```bash
git add src/main/java/com/sba301/retailmanagement/dto/response/WarehouseResponse.java
git commit -m "refactor: update WarehouseResponse - replace isDefault/warehouseLevel/parentId with isCentral"
```

---

## Chunk 3: Repository Changes

### Task 5: Delete StoreWarehouseRepository

**Files:**
- Delete: `RetailChainService/src/main/java/com/sba301/retailmanagement/repository/StoreWarehouseRepository.java`

- [ ] **Step 1: Delete repository**

```bash
rm RetailChainService/src/main/java/com/sba301/retailmanagement/repository/StoreWarehouseRepository.java
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "refactor: delete StoreWarehouseRepository"
```

---

## Chunk 4: Service Changes

### Task 6: Update WarehouseServiceImpl

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/WarehouseServiceImpl.java`

- [ ] **Step 1: Update createWarehouse method - use isCentral**

```java
// Replace warehouseLevel and parentId handling with isCentral
warehouse.setIsCentral(request.getIsCentral() != null ? request.getIsCentral() : false);
```

- [ ] **Step 2: Update updateWarehouse method - remove parentId/warehouseLevel**

```java
// Remove:
if (request.getWarehouseLevel() != null) {
    warehouse.setWarehouseLevel(request.getWarehouseLevel());
}
if (request.getParentId() != null) {
    warehouse.setParentId(request.getParentId());
}

// Add:
if (request.getIsCentral() != null && !request.getIsCentral().equals(warehouse.getIsCentral())) {
    warehouse.setIsCentral(request.getIsCentral());
}
```

- [ ] **Step 3: Update mapToResponse - use isCentral**

```java
// Replace .warehouseLevel().parentId() with .isCentral()
.isCentral(warehouse.getIsCentral())
```

- [ ] **Step 4: Commit**

```bash
git add src/main/java/com/sba301/retailmanagement/service/impl/WarehouseServiceImpl.java
git commit -m "refactor: update WarehouseServiceImpl - use isCentral instead of parentId/warehouseLevel"
```

---

### Task 7: Update StoreServiceImpl

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/StoreServiceImpl.java`

- [ ] **Step 1: Remove StoreWarehouse imports**

```java
// Remove:
import com.sba301.retailmanagement.entity.StoreWarehouse;
import com.sba301.retailmanagement.entity.StoreWarehouseId;
import com.sba301.retailmanagement.repository.StoreWarehouseRepository;
```

- [ ] **Step 2: Remove StoreWarehouseRepository field**

```java
// Remove:
private final StoreWarehouseRepository storeWarehouseRepository;
```

- [ ] **Step 3: Update getStoreBySlug - use store.warehouseId directly**

```java
// Replace:
List<StoreWarehouse> storeWarehouses = storeWarehouseRepository.findByStoreId(store.getId());
if (!storeWarehouses.isEmpty()) {
    response.setWarehouseId(storeWarehouses.get(0).getWarehouse().getId());
}

// With:
response.setWarehouseId(store.getWarehouseId());
```

- [ ] **Step 4: Update createStore - auto-create warehouse**

```java
// Replace the StoreWarehouse creation logic with:
Warehouse warehouse = new Warehouse();
warehouse.setCode("WH_" + request.getCode());
warehouse.setName("Kho " + request.getName());
warehouse.setAddress(request.getAddress());
warehouse.setIsCentral(false);
warehouse.setStatus(1);
warehouse.setCreatedAt(LocalDateTime.now());
warehouse.setUpdatedAt(LocalDateTime.now());
Warehouse savedWarehouse = warehouseRepository.save(warehouse);

store.setWarehouseId(savedWarehouse.getId());
```

- [ ] **Step 5: Update updateStore - remove StoreWarehouse logic**

```java
// Remove storeWarehouseRepository.deleteByStoreId and StoreWarehouse creation
// Just update store.setWarehouseId if needed
```

- [ ] **Step 6: Commit**

```bash
git add src/main/java/com/sba301/retailmanagement/service/impl/StoreServiceImpl.java
git commit -m "refactor: update StoreServiceImpl - use warehouseId, auto-create warehouse"
```

---

### Task 8: Update InventoryServiceImpl

**Files:**
- Modify: `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java`

- [ ] **Step 1: Remove StoreWarehouseRepository**

```java
// Remove import and field
// Remove: import com.sba301.retailmanagement.repository.StoreWarehouseRepository;
// Remove: private final StoreWarehouseRepository storeWarehouseRepository;
```

- [ ] **Step 2: Update transferStock validation**

```java
// Replace StoreWarehouse check with isCentral check
// Replace:
boolean sourceHasStore = storeWarehouseRepository.existsByWarehouseId(sourceWarehouse.getId());
if (sourceHasStore) {
    throw new RuntimeException("Transfer source must be a Central Warehouse");
}

// With:
if (!Boolean.TRUE.equals(sourceWarehouse.getIsCentral())) {
    throw new RuntimeException("Transfer source must be a Central Warehouse (isCentral=true)");
}
```

- [ ] **Step 3: Update mapToWarehouseResponse - use isCentral**

```java
// Replace .isDefault() with .isCentral()
.isCentral(warehouse.getIsCentral())
```

- [ ] **Step 4: Update deleteWarehouse - remove StoreWarehouse logic**

```java
// Remove storeWarehouseRepository.deleteByWarehouseId call
```

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java
git commit -m "refactor: update InventoryServiceImpl - remove StoreWarehouse, use isCentral"
```

---

## Chunk 5: Verification

### Task 9: Build and Test

**Files:**
- Test: Build project

- [ ] **Step 1: Build project**

```bash
cd RetailChainService
./mvnw.cmd clean compile
```

- [ ] **Step 2: If build fails, fix errors and rebuild**

- [ ] **Step 3: Commit**

```bash
git commit --allow-empty -m "build: verify compilation successful"
```

---

## Tổng kết

**Files cần thay đổi:**
1. `Warehouse.java` - Entity
2. `StoreWarehouse.java` - Delete
3. `StoreWarehouseId.java` - Delete
4. `WarehouseRequest.java` - DTO
5. `WarehouseResponse.java` - DTO
6. `StoreWarehouseRepository.java` - Delete
7. `WarehouseServiceImpl.java` - Service
8. `StoreServiceImpl.java` - Service
9. `InventoryServiceImpl.java` - Service

**Thứ tự thực hiện:**
1. Chunk 1: Entity Changes (Task 1-2)
2. Chunk 2: DTO Changes (Task 3-4)
3. Chunk 3: Repository Changes (Task 5)
4. Chunk 4: Service Changes (Task 6-8)
5. Chunk 5: Verification (Task 9)
