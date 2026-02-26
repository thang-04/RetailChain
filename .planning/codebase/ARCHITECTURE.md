# Architecture

**Analysis Date:** 2026-02-26

## Pattern Overview

**Overall:** Monorepo with Spring Boot backend and React frontend

**Key Characteristics:**
- **Backend:** Spring Boot REST API with JPA/Hibernate for MySQL database
- **Frontend:** React 19 with Vite, using shadcn/ui components and Tailwind CSS
- **Communication:** REST API over HTTP with JSON payloads
- **State Management:** React Context API for global state (Auth)
- **Architecture Pattern:** Layered Architecture (Controller → Service → Repository)

## Layers

**Backend (RetailChainService/):**

### Controller Layer:
- Purpose: Handle HTTP requests, map to service calls, return JSON responses
- Location: `RetailChainService/src/main/java/com/sba301/retailmanagement/controller/`
- Contains: REST controllers with `@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping`, etc.
- Depends on: Service interfaces
- Used by: Frontend HTTP clients

### Service Layer:
- Purpose: Business logic orchestration, transaction management
- Location: `RetailChainService/src/main/java/com/sba301/retailmanagement/service/`
- Contains: Interface definitions and implementations (`Service.java`, `ServiceImpl.java`)
- Depends on: Repository layer, Entities, DTOs
- Used by: Controller layer
- Key annotations: `@Service`, `@Transactional`, `@RequiredArgsConstructor`

### Repository Layer:
- Purpose: Data access abstraction, database queries
- Location: `RetailChainService/src/main/java/com/sba301/retailmanagement/repository/`
- Contains: JPA Repository interfaces extending `JpaRepository`
- Depends on: Entity classes
- Used by: Service layer

### Entity Layer:
- Purpose: Database table mapping with JPA annotations
- Location: `RetailChainService/src/main/java/com/sba301/retailmanagement/entity/`
- Contains: JPA entities with `@Entity`, `@Table`, relationships (`@OneToMany`, `@ManyToOne`)
- Depends on: None (base layer)
- Used by: Repository layer

### DTO Layer:
- Purpose: Data transfer objects for API request/response
- Location: `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/request/` and `dto/response/`
- Contains: Request DTOs (input) and Response DTOs (output)
- Depends on: Entity classes (for mapping)
- Used by: Controller and Service layers

**Frontend (RetailChainUi/):**

### Routes Layer:
- Purpose: Define application navigation paths
- Location: `RetailChainUi/src/routes/`
- Contains: Route definitions using `react-router-dom`
- Depends on: Page components, Layout components

### Pages Layer:
- Purpose: Full-page components representing routes
- Location: `RetailChainUi/src/pages/`
- Contains: Feature-specific pages (Dashboard, Store, Product, Inventory, Staff, Warehouse)
- Depends on: Service layer, UI components
- Examples: `DashboardPage.jsx`, `StorePage.jsx`, `InventoryPage.jsx`

### Components Layer:
- Purpose: Reusable UI components
- Location: `RetailChainUi/src/components/ui/` (shadcn components), `RetailChainUi/src/components/common/`, `RetailChainUi/src/components/layout/`
- Contains: Buttons, Inputs, Tables, Cards, Layout components
- Depends on: None (base UI layer)

### Services Layer:
- Purpose: API communication abstraction
- Location: `RetailChainUi/src/services/`
- Contains: Service modules for each domain (`inventory.service.js`, `product.service.js`, etc.)
- Depends on: Axios client configuration
- Used by: Pages, Components

### API Client Layer:
- Purpose: Axios instance configuration, interceptors for auth tokens
- Location: `RetailChainUi/src/services/api/axiosClient.js`
- Contains: `axiosPublic`, `axiosPrivate` instances with request/response interceptors

## Data Flow

**Backend Flow:**
```
HTTP Request → Controller → Service → Repository → Database
                    ↓              ↓
              ResponseJson    Entity/DTO
```

**Frontend Flow:**
```
User Action → Page Component → Service → axiosClient → Backend API
                  ↓                              ↓
            UI Update                    JSON Response
```

**Inventory Module Example (Backend):**
1. `InventoryController` receives request: `POST /api/inventory/import`
2. Validates request, delegates to `InventoryService.importStock()`
3. `InventoryServiceImpl.importStock()`:
   - Finds Warehouse by ID
   - Creates `InventoryDocument` (type: IMPORT)
   - For each item: validates stock, creates document item, updates `InventoryStock`
   - Logs history via `InventoryHistoryRepository`
   - Saves all changes in single transaction
4. Returns `ResponseJson.toJsonString()` with success/error code

## Key Abstractions

**Backend:**

| Abstraction | Purpose | Examples |
|-------------|---------|----------|
| Repository Pattern | Abstract database access | `InventoryStockRepository`, `WarehouseRepository` |
| Service Interface | Define business operations contract | `InventoryService`, `UserService` |
| DTO Pattern | Decouple API from internal entities | `WarehouseRequest`, `InventoryStockResponse` |
| Response Wrapper | Standardize API responses | `ResponseJson` utility class |

**Frontend:**

| Abstraction | Purpose | Examples |
|-------------|---------|----------|
| Service Modules | Encapsulate API calls | `inventoryService`, `productService` |
| Axios Interceptors | Handle auth tokens globally | Token attachment, error handling |
| Context API | Global state management | AuthContext (if implemented) |
| Layout Components | Consistent page structure | `MainLayout`, `Sidebar`, `Header` |

## Entry Points

**Backend:**
- Location: `RetailChainService/src/main/java/com/sba301/retailmanagement/RetailChainServiceApplication.java`
- Triggers: Spring Boot application startup (`@SpringBootApplication`)
- Responsibilities: Initialize Spring context, auto-configure JPA, start embedded server (typically port 8080)

**Frontend:**
- Location: `RetailChainUi/src/main.jsx`
- Responsibilities: Mount React app to DOM element `#root`
- App Entry: `RetailChainUi/src/App.jsx` - sets up `BrowserRouter` and renders routes

**API Endpoints (Sample - Inventory Controller):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/inventory/warehouse` | POST | Create warehouse |
| `/api/inventory/warehouse` | GET | List all warehouses |
| `/api/inventory/stock/{warehouseId}` | GET | Get stock by warehouse |
| `/api/inventory/import` | POST | Import stock (Stock In) |
| `/api/inventory/export` | POST | Export stock (Stock Out) |
| `/api/inventory/transfer` | POST | Transfer between warehouses |
| `/api/inventory/documents` | GET | Get documents by type |
| `/api/inventory/overview` | GET | Get inventory dashboard data |

## Error Handling

**Backend Strategy:**
- Uses `ResponseJson` utility class to wrap responses with code and message
- `ApiCode` enum defines standard error codes (SUCCESSFUL, ERROR_INTERNAL, etc.)
- Global exception handler via `@ControllerAdvice` (implied `GlobalException.java`)
- Exceptions return JSON strings directly from controllers (non-standard but used)

**Frontend Strategy:**
- Axios response interceptors handle HTTP errors
- Service functions wrap API calls in try/catch blocks
- Returns empty arrays/objects on error to prevent UI crashes

## Cross-Cutting Concerns

**Logging:** SLF4J with `@Slf4j` annotation in backend services; prefix logging with method context (e.g., `[getStockByWarehouse]`)

**Validation:** Manual validation in Service layer; throws `RuntimeException` for validation failures

**Authentication:** Backend placeholder `createdBy(1L)` comments indicate security context needed; Frontend uses Bearer token in `Authorization` header via `axiosPrivate` interceptor

**Date Handling:** Uses `LocalDateTime` in Java backend; Gson adapter configured in `CommonUtils.java` for JSON serialization

---

*Architecture analysis: 2026-02-26*
