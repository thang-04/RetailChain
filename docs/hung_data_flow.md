# Data Flow Documentation - Các Chức Năng Của hung

---

## 1. Module Product (Quản Lý Sản Phẩm)

### 1.1 Full CRUD Operations

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCT CRUD DATA FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────────────┘

INPUT                          PROCESS                         OUTPUT                         STORAGE
━━━━━━━━                       ════════                        ══════                         ═══════

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐    ┌────────────────┐
│  CREATE PRODUCT │            │                  │            │                     │    │                │
│  ─────────────  │            │ ProductController│            │ ProductResponse     │    │   Product      │
│  • code         │──────────▶│  - validate      │──────────▶│  - id               │───▶│   Table        │
│  • name         │  POST     │  - map to entity │  POST     │  - code             │    │                │
│  • price        │  /api/    │  - save to DB    │  RETURN   │  - name             │    │   [products]   │
│  • categoryId   │  product   │  - map response  │  JSON     │  - price            │    │                │
│  • description  │            │                  │            │  - category         │    │   [product_    │
│  • imageUrl     │            └──────────────────┘            │  - variants[]       │    │    variants]   │
└─────────────────┘                                              │  - createdAt        │    │                │
                                                                └─────────────────────┘    └────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐    ┌────────────────┐
│  GET ALL        │            │                  │            │                     │    │                │
│  ──────────     │            │ ProductService   │            │ List<ProductResponse│   │                │
│  GET /api/      │──────────▶│  - findAll       │──────────▶│  - id               │◀───│                │
│  product        │  GET      │  - paginate      │  RETURN   │  - code             │    │                │
│                 │            │  - map to DTO    │  JSON     │  - name             │    │                │
│                 │            │                  │            │  - price            │    │                │
└─────────────────┘            └──────────────────┘            └─────────────────────┘    └────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐    ┌────────────────┐
│  GET BY ID      │            │                  │            │                     │    │                │
│  ──────────     │            │ ProductService   │            │ ProductResponse     │    │                │
│  GET /api/      │──────────▶│  - findById       │──────────▶│  - full details     │◀───│                │
│  product/{id}   │  GET      │  - orElseThrow    │  RETURN   │  - variants[]       │    │                │
│                 │            │  - map response  │  JSON     │  - category         │    │                │
└─────────────────┘            └──────────────────┘            └─────────────────────┘    └────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐    ┌────────────────┐
│  UPDATE         │            │                  │            │                     │    │                │
│  ──────────     │            │ ProductService   │            │ ProductResponse     │    │                │
│  PUT /api/      │──────────▶│  - findById       │──────────▶│  - updated data     │───▶│                │
│  product/{id}   │  PUT      │  - update entity  │  RETURN   │  - updatedAt        │    │                │
│                 │            │  - save          │  JSON     │                     │    │                │
└─────────────────┘            └──────────────────┘            └─────────────────────┘    └────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐    ┌────────────────┐
│  DELETE         │            │                  │            │                     │    │                │
│  ──────────     │            │ ProductService   │            │ Success Message     │    │                │
│  DELETE /api/   │──────────▶│  - findById       │──────────▶│  - "Delete product  │───▶│ [Soft Delete]  │
│  product/{id}   │  DELETE   │  - delete         │  RETURN   │    success"         │    │ or Hard Delete │
│                 │            │                  │  JSON     │                     │    │                │
└─────────────────┘            └──────────────────┘            └─────────────────────┘    └────────────────┘

```

### API Endpoints

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| GET | `/api/product` | - | `List<ProductResponse>` |
| GET | `/api/product/{id}` | - | `ProductResponse` |
| POST | `/api/product` | `ProductRequest` | `ProductResponse` |
| PUT | `/api/product/{id}` | `ProductRequest` | `ProductResponse` |
| DELETE | `/api/product/{id}` | - | `Success Message` |

---

## 2. Module Inventory (Quản Lý Kho)

### 2.1 Warehouse Management

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           WAREHOUSE DATA FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

INPUT                          PROCESS                         OUTPUT                         STORAGE
━━━━━━━━                       ════════                        ══════                         ═══════

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐    ┌────────────────┐
│  CREATE         │            │                  │            │                     │    │                │
│  WAREHOUSE      │            │InventoryService │            │ WarehouseResponse   │    │   Warehouse    │
│  ────────────   │            │  - createWarehouse│           │  - id               │───▶│   Table        │
│  POST /api/      │──────────▶│  - create         │──────────▶│  - name             │    │                │
│  inventory/     │  POST      │    StoreWarehouse│  RETURN   │  - address          │    │ [store_        │
│  warehouse      │            │    links          │  JSON     │  - type             │    │  warehouses]   │
│                 │            │                  │            │  - storeId          │    │                │
└─────────────────┘            └──────────────────┘            └─────────────────────┘    └────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐
│  GET ALL        │            │                  │            │                     │
│  WAREHOUSES    │──────────▶│InventoryService │            │ List<Warehouse      │
│                 │  GET      │  - getAll        │──────────▶│   Response>         │
│                 │            │                  │  RETURN   │                     │
└─────────────────┘            └──────────────────┘  JSON     └─────────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐
│  UPDATE         │            │                  │            │                     │
│  WAREHOUSE      │──────────▶│InventoryService │            │ WarehouseResponse    │
│  PUT /api/      │  PUT      │  - update        │──────────▶│                     │
│  inventory/     │            │                  │  RETURN   │                     │
│  warehouse/{id} │            │                  │  JSON     │                     │
└─────────────────┘            └──────────────────┘            └─────────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐
│  DELETE         │            │                  │            │                     │
│  WAREHOUSE      │──────────▶│InventoryService │            │ Success Message     │
│  DELETE /api/  │  DELETE    │  - delete        │──────────▶│                     │
│  inventory/     │            │                  │  RETURN   │                     │
│  warehouse/{id} │            │                  │  JSON     │                     │
└─────────────────┘            └──────────────────┘            └─────────────────────┘
```

### 2.2 Stock In (Nhập Kho)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              STOCK IN DATA FLOW                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

INPUT                          PROCESS                         OUTPUT                         STORAGE
━━━━━━━━                       ════════                        ══════                         ═══════

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐    ┌────────────────┐
│  IMPORT STOCK   │            │                  │            │                     │    │                │
│  (Nhập Kho)     │            │InventoryService │            │ Success Message     │    │                │
│  ────────────   │            │  - importStock() │            │  - "Stock imported  │    │ InventoryStock │
│  POST /api/     │──────────▶│  - validate      │──────────▶│    successfully"    │───▶│   Table        │
│  inventory/     │  POST      │    request        │  RETURN   │                     │    │                │
│  import         │            │  - update stock   │  JSON     │                     │    │ InventoryDoc   │
│                 │            │  - create doc     │            │                     │    │   Table        │
│ {               │            │  - record history│            │                     │    │                │
│   warehouseId   │            │                  │            │                     │    │ InventoryDoc   │
│   supplierId    │            └──────────────────┘            │                     │    │   Item Table   │
│   items: []     │                                          │                     │    │                │
│   totalAmount   │                                          └─────────────────────┘    │ InventoryHistory│
│   note          │                                                                     │   Table         │
│ }               │                                                                     └────────────────┘
└─────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐
│  GET DOCUMENTS  │            │                  │            │                     │
│  BY TYPE        │            │InventoryService │            │ List<InventoryDoc   │
│  ───────────    │            │  - getDocuments │──────────▶│   Response>         │
│  GET /api/      │  GET       │    ByType        │  RETURN   │                     │
│  inventory/     │            │                  │  JSON     │ [STOCK_IN type]     │
│  documents?     │            │                  │            │                     │
│  type=STOCK_IN  │            │                  │            │                     │
└─────────────────┘            └──────────────────┘            └─────────────────────┘
```

### 2.3 Stock Out (Xuất Kho)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              STOCK OUT DATA FLOW                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

INPUT                          PROCESS                         OUTPUT                         STORAGE
━━━━━━━━                       ════════                        ══════                         ═══════

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐    ┌────────────────┐
│  EXPORT STOCK   │            │                  │            │                     │    │                │
│  (Xuất Kho)     │            │InventoryService │            │ Success Message     │    │                │
│  ────────────   │            │  - exportStock() │            │  - "Stock exported  │    │ InventoryStock │
│  POST /api/     │──────────▶│  - validate       │──────────▶│    successfully"    │───▶│   (Decrease)   │
│  inventory/     │  POST      │    stock avail   │  RETURN   │                     │    │                │
│  export         │            │  - update stock  │  JSON     │                     │    │ InventoryDoc   │
│                 │            │  - create doc   │            │                     │    │   Table        │
│                 │            │  - record history│           │                     │    │                │
└─────────────────┘            └──────────────────┘            └─────────────────────┘    │ InventoryHistory│
                                                                                              │   Table         │
┌─────────────────┐                                                                      └────────────────┘
│  GET DOCUMENTS  │            ┌──────────────────┐            ┌─────────────────────┐
│  ───────────    │            │                  │            │                     │
│  GET /api/      │  GET       │InventoryService │──────────▶│ List<InventoryDoc   │
│  inventory/     │            │  - getDocuments │  RETURN   │   Response>         │
│  documents?     │            │    ByType        │  JSON     │                     │
│  type=STOCK_OUT │            │                  │            │ [STOCK_OUT type]    │
└─────────────────┘            └──────────────────┘            └─────────────────────┘
```

### 2.4 Transfer (Chuyển Kho)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                             TRANSFER DATA FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

INPUT                          PROCESS                         OUTPUT                         STORAGE
━━━━━━━━                       ════════                        ══════                         ═══════

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐    ┌────────────────┐
│  TRANSFER STOCK │            │                  │            │                     │    │                │
│  (Chuyển Kho)   │            │InventoryService │            │ Success Message     │    │                │
│  ────────────   │            │  - transferStock │            │  - "Stock           │    │ InventoryStock │
│  POST /api/     │──────────▶│  - validate      │──────────▶│    transferred      │───▶│   (2 records)  │
│  inventory/     │  POST      │    both wh       │  RETURN   │    successfully"    │    │                │
│  transfer       │            │  - decrease src  │  JSON     │                     │    │ From: -        │
│                 │            │  - increase dest │            │                     │    │ To: +          │
│ {               │            │  - create doc   │            │                     │    │                │
│   fromWhId      │            │  - record history│           │                     │    │ InventoryDoc   │
│   toWhId        │            │                  │            │                     │    │   Table        │
│   items: []     │            │                  │            │                     │    │                │
│ }               │            │                  │            │                     │    │ InventoryHistory│
└─────────────────┘            └──────────────────┘            └─────────────────────┘    └────────────────┘
```

### 2.5 Inventory History (Lịch Sử Tồn Kho)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          INVENTORY HISTORY DATA FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────────────┘

INPUT                          PROCESS                         OUTPUT                         STORAGE
━━━━━━━━                       ════════                        ══════                         ═══════

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐
│  GET ALL        │            │                  │            │                     │
│  HISTORY        │            │InventoryHistory │            │ List<Inventory      │
│  ────────────   │            │  Service         │            │   HistoryResponse>  │
│  GET /api/      │──────────▶│  - getAll        │──────────▶│                     │
│  inventory-     │  GET      │  - paginate      │  RETURN   │                     │
│  history/record │            │  - filter        │  JSON     │                     │
└─────────────────┘            └──────────────────┘            └─────────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐
│  GET DETAIL     │            │                  │            │                     │
│  ────────────   │            │InventoryHistory │            │ InventoryHistory   │
│  GET /api/      │  GET       │  Service         │──────────▶│   Response         │
│  inventory-     │            │  - getById       │  RETURN   │                     │
│  history/       │            │                  │  JSON     │                     │
│  record/{id}    │            │                  │            │                     │
└─────────────────┘            └──────────────────┘            └─────────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐    ┌────────────────┐
│  RECORD         │            │                  │            │                     │    │                │
│  HISTORY        │            │InventoryHistory │            │ Success Message     │    │                │
│  ────────────   │            │  Service         │            │                     │    │ InventoryHistory│
│  POST /api/     │──────────▶│  - recordChange()│──────────▶│                     │───▶│   Table        │
│  inventory-     │  POST     │  - validate      │  RETURN   │                     │    │                │
│  history/       │            │  - create record │  JSON     │                     │    │                │
│  record/add     │            │                  │            │                     │    │                │
│                 │            │                  │            │                     │    │                │
│ actorUserId     │            │                  │            │                     │    │                │
│ action          │            │                  │            │                     │    │                │
│ warehouseId     │            │                  │            │                     │    │                │
│ productId       │            │                  │            │                     │    │                │
│ quantity        │            │                  │            │                     │    │                │
└─────────────────┘            └──────────────────┘            └─────────────────────┘    └────────────────┘
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/inventory/warehouse` | Create warehouse |
| GET | `/api/inventory/warehouse` | Get all warehouses |
| PUT | `/api/inventory/warehouse/{id}` | Update warehouse |
| DELETE | `/api/inventory/warehouse/{id}` | Delete warehouse |
| GET | `/api/inventory/stock/{warehouseId}` | Get stock by warehouse |
| POST | `/api/inventory/import` | Stock In (import) |
| POST | `/api/inventory/export` | Stock Out (export) |
| POST | `/api/inventory/transfer` | Transfer between warehouses |
| GET | `/api/inventory/documents?type=` | Get documents by type |
| DELETE | `/api/inventory/documents/{id}` | Delete document |
| GET | `/api/inventory-history/record` | Get all history |
| GET | `/api/inventory-history/record/{id}` | Get history detail |
| POST | `/api/inventory-history/record/add` | Record new history |

---

## 3. Module Store (Quản Lý Cửa Hàng)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              STORE DATA FLOW                                         │
└─────────────────────────────────────────────────────────────────────────────────────┘

INPUT                          PROCESS                         OUTPUT                         STORAGE
━━━━━━━━                       ════════                        ══════                         ═══════

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐    ┌────────────────┐
│  CREATE STORE  │            │                  │            │                     │    │                │
│  ────────────   │            │ StoreService     │            │ StoreResponse       │    │   Store       │
│  POST /api/    │──────────▶│  - createStore() │──────────▶│  - id               │───▶│   Table        │
│  stores        │  POST     │  - validate      │  RETURN   │  - code             │    │                │
│                 │            │  - create wh    │  JSON     │  - name             │    │ StoreWarehouse│
│ {               │            │    if needed    │            │  - address          │    │   Table        │
│   code          │            │                  │            │  - slug             │    │                │
│   name          │            │                  │            │  - phone            │    │                │
│   address       │            │                  │            │  - warehouseId      │    │                │
│   phone         │            │                  │            │                     │    │                │
│ }               │            │                  │            │                     │    │                │
└─────────────────┘            └──────────────────┘            └─────────────────────┘    └────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐
│  GET ALL        │            │                  │            │                     │
│  STORES         │            │ StoreService     │            │ List<StoreResponse> │
│  ────────────   │  GET       │  - getAllStores │──────────▶│                     │
│  GET /api/      │            │                  │  RETURN   │                     │
│  stores         │            │                  │  JSON     │                     │
└─────────────────┘            └──────────────────┘            └─────────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐
│  GET BY SLUG    │            │                  │            │                     │
│  ────────────   │            │ StoreService     │            │ StoreDetailResponse│
│  GET /api/      │  GET       │  - getBySlug    │──────────▶│  - full details    │
│  stores/{slug}  │            │                  │  RETURN   │  - staff list      │
│                 │            │                  │  JSON     │  - inventory       │
└─────────────────┘            └──────────────────┘            └─────────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐
│  UPDATE STORE   │            │                  │            │                     │
│  ────────────   │            │ StoreService     │            │ StoreResponse       │
│  PUT /api/      │  PUT       │  - updateStore  │──────────▶│                     │
│  stores/{slug}  │            │                  │  RETURN   │                     │
│                 │            │                  │  JSON     │                     │
└─────────────────┘            └──────────────────┘            └─────────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐
│  GET STORE     │            │                  │            │                     │
│  STAFF         │            │                  │            │ List<StoreStaffDTO> │
│  ────────────   │  GET       │  - getStoreStaff│──────────▶│                     │
│  GET /api/      │            │                  │  RETURN   │ (Mock for now)     │
│  stores/{id}/   │            │                  │  JSON     │                     │
│  staff          │            │                  │            │                     │
└─────────────────┘            └──────────────────┘            └─────────────────────┘
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stores` | Get all stores |
| GET | `/api/stores/{slug}` | Get store by slug |
| POST | `/api/stores` | Create new store |
| PUT | `/api/stores/{slug}` | Update store |
| GET | `/api/stores/{id}/staff` | Get store staff |

---

## 4. Module Supplier (Quản Lý Nhà Cung Cấp)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                             SUPPLIER DATA FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

INPUT                          PROCESS                         OUTPUT                         STORAGE
━━━━━━━━                       ════════                        ══════                         ═══════

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐    ┌────────────────┐
│  GET ALL        │            │                  │            │                     │    │                │
│  SUPPLIERS      │            │SupplierService   │            │ List<Supplier       │    │                │
│  ────────────   │            │  - getAll        │──────────▶│   Response>         │◀───│   Supplier     │
│  GET /api/      │  GET       │                  │  RETURN   │                     │    │   Table        │
│  supplier       │            │                  │  JSON     │  - id               │    │                │
│                 │            │                  │            │  - name             │    │                │
│                 │            │                  │            │  - contact          │    │                │
│                 │            │                  │            │  - phone            │    │                │
│                 │            │                  │            │  - email            │    │                │
│                 │            │                  │            │  - address          │    │                │
└─────────────────┘            └──────────────────┘            └─────────────────────┘    └────────────────┘

┌─────────────────┐            ┌──────────────────┐            ┌─────────────────────┐
│  INTEGRATION   │            │                  │            │                     │
│  WITH          │            │  Used in:        │            │  Supplier linked    │
│  STOCK IN      │            │  - Stock In form │──────────▶│  to InventoryDoc    │
│  ────────────   │            │  - Select dropdown│          │  via supplierId    │
│                 │            │                  │            │                     │
└─────────────────┘            └──────────────────┘            └─────────────────────┘
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/supplier` | Get all suppliers |

---

## 5. Tổng Hợp Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEM OVERVIEW DATA FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────────────┐
                                    │    FRONTEND (React)   │
                                    │  RetailChainUi        │
                                    │  - Pages              │
                                    │  - Components         │
                                    │  - Services           │
                                    └───────────┬──────────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │   REST API Layer      │
                                    │   (Spring Boot)       │
                                    │   RetailChainService  │
                                    └───────────┬──────────┘
                                                │
        ┌───────────────────────────────────────┼───────────────────────────────────────┐
        │                                       │                                       │
        ▼                                       ▼                                       ▼
┌───────────────────┐               ┌───────────────────┐               ┌───────────────────┐
│  PRODUCT MODULE   │               │  INVENTORY MODULE │               │  STORE MODULE    │
│                   │               │                   │               │                   │
│ ProductController│               │InventoryController│               │ StoreController  │
│ - CRUD APIs      │               │ - Warehouse CRUD  │               │ - Store CRUD     │
│                   │               │ - Import/Export   │               │ - Staff query    │
│ ProductService   │               │ - Transfer         │               │                   │
│                   │               │                   │               │ StoreService     │
│ ProductRepository│               │InventoryService    │               │                   │
│                   │               │ - Stock logic      │               │ StoreRepository  │
└───────────────────┘               │ - Document mgmt    │               └───────────────────┘
                                    │ - History record    │                         │
                                    └───────────────────┘                         │
                                    │                         │                         │
                                    ▼                         ▼                         ▼
                            ┌─────────────────────────────────────────────────────────────┐
                            │                    DATABASE (MySQL)                        │
                            │                                                              │
                            │  ┌────────────┐  ┌────────────┐  ┌────────────┐              │
                            │  │  products  │  │ warehouses │  │   stores   │              │
                            │  │            │  │            │  │            │              │
                            │  │product_    │  │store_      │  │            │              │
                            │  │variants    │  │warehouses  │  │            │              │
                            │  └────────────┘  └────────────┘  └────────────┘              │
                            │                                                              │
                            │  ┌────────────────────┐  ┌────────────┐  ┌────────────┐       │
                            │  │ inventory_stocks  │  │ suppliers  │  │   users    │       │
                            │  │                    │  │            │  │            │       │
                            │  │ inventory_         │  │            │  │            │       │
                            │  │ documents          │  │            │  │            │       │
                            │  │ inventory_         │  │            │  │            │       │
                            │  │ document_items     │  │            │  │            │       │
                            │  │ inventory_history  │  │            │  │            │       │
                            │  └────────────────────┘  └────────────┘  └────────────┘       │
                            │                                                              │
                            └──────────────────────────────────────────────────────────────┘

```

---

## 6. Request/Response Formats

### 6.1 ProductRequest / ProductResponse

```json
// ProductRequest (POST/PUT)
{
  "code": "PROD001",
  "name": "Tên sản phẩm",
  "price": 100000,
  "categoryId": 1,
  "description": "Mô tả sản phẩm",
  "imageUrl": "https://..."
}

// ProductResponse
{
  "id": 1,
  "code": "PROD001",
  "name": "Tên sản phẩm",
  "price": 100000,
  "category": {...},
  "variants": [
    {
      "id": 1,
      "sku": "PROD001-M",
      "size": "M",
      "color": "Đỏ"
    }
  ],
  "createdAt": "2024-01-01T00:00:00"
}
```

### 6.2 StockRequest (Import/Export)

```json
{
  "warehouseId": 1,
  "supplierId": 1,
  "items": [
    {
      "productId": 1,
      "productVariantId": 1,
      "quantity": 100,
      "unitPrice": 50000
    }
  ],
  "totalAmount": 5000000,
  "note": "Nhập hàng tháng 1"
}
```

### 6.3 TransferRequest

```json
{
  "fromWarehouseId": 1,
  "toWarehouseId": 2,
  "items": [
    {
      "productId": 1,
      "productVariantId": 1,
      "quantity": 50
    }
  ],
  "note": "Chuyển hàng cho cửa hàng mới"
}
```

### 6.4 WarehouseRequest / WarehouseResponse

```json
// WarehouseRequest
{
  "name": "Kho Tổng Hà Nội",
  "address": "Hà Nội",
  "type": "CENTRAL"
}

// WarehouseResponse
{
  "id": 1,
  "name": "Kho Tổng Hà Nội",
  "address": "Hà Nội",
  "type": "CENTRAL",
  "storeId": null,
  "createdAt": "2024-01-01T00:00:00"
}
```

### 6.5 StoreRequest / StoreResponse

```json
// CreateStoreRequest
{
  "code": "STORE001",
  "name": "Cửa hàng Quận 1",
  "address": "TP.HCM",
  "phone": "0909123456"
}

// StoreResponse
{
  "id": 1,
  "code": "STORE001",
  "name": "Cửa hàng Quận 1",
  "address": "TP.HCM",
  "phone": "0909123456",
  "slug": "cuahang-quan1",
  "warehouseId": 2
}
```

---

*Tài liệu được tạo tự động từ phân tích codebase*
