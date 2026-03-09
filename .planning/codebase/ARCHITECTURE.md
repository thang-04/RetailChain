# Architecture

**Analysis Date:** 2026-03-09

## Pattern Overview

**Overall:** Layered Architecture with Service-Repository Pattern (Spring MVC + React SPA)

**Key Characteristics:**
- Backend uses standard Spring Boot layered architecture: Controller -> Service -> Repository -> Entity
- Frontend uses feature-based SPA architecture with React Router v7
- JWT-based authentication with role-based and permission-based authorization
- RESTful API communication between frontend and backend

---

## Backend Layers (RetailChainService)

### Controller Layer
- **Location:** `RetailChainService/src/main/java/com/sba301/retailmanagement/controller/`
- **Purpose:** Expose REST APIs, handle HTTP requests/responses, apply `@PreAuthorize` for permissions
- **Files:**
  - `AuthController.java` - Authentication endpoints
  - `InventoryController.java` - Inventory operations
  - `ProductController.java` - Product management
  - `StoreController.java` - Store management
  - `WarehouseController.java` - Warehouse management
  - `UserController.java` - User management
  - `RoleController.java`, `PermissionController.java` - RBAC
- **Pattern:** Controllers return `String` (JSON string via `ResponseJson.toJsonString()`), use logging with prefix pattern `[methodName]|param=value`

### Service Layer
- **Location:** `RetailChainService/src/main/java/com/sba301/retailmanagement/service/`
- **Purpose:** Business logic, transaction management, orchestration
- **Interface + Implementation Pattern:**
  - Interface: `InventoryService.java`
  - Implementation: `impl/InventoryServiceImpl.java`
- **Annotations:** `@Service`, `@RequiredArgsConstructor`, `@Transactional`

### Repository Layer
- **Location:** `RetailChainService/src/main/java/com/sba301/retailmanagement/repository/`
- **Purpose:** Data access, JPA queries
- **Pattern:** Extend `JpaRepository<Entity, Long>`, custom query methods

### Entity Layer
- **Location:** `RetailChainService/src/main/java/com/sba301/retailmanagement/entity/`
- **Purpose:** JPA entities mapped to database tables
- **Key Entities:**
  - `User.java` - User with roles, store-scoped authorization
  - `Role.java`, `Permission.java` - RBAC entities
  - `Warehouse.java`, `StoreWarehouse.java` - Warehouse and store-warehouse linking
  - `InventoryStock.java` - Stock with composite key `InventoryStockId`
  - `InventoryDocument.java`, `InventoryDocumentItem.java` - Inventory transaction documents
  - `Product.java`, `ProductVariant.java`, `ProductCategory.java` - Product catalog
  - `Store.java` - Store entity

### Security Layer
- **Location:** `RetailChainService/src/main/java/com/sba301/retailmanagement/security/`
- **Files:**
  - `JwtTokenProvider.java` - JWT token generation/validation
  - `CustomUserDetails.java` - User principal
  - `CustomUserDetailsService.java` - Load user from DB
  - `SecurityConstants.java` - Permission constants (e.g., `INVENTORY_VIEW`, `INVENTORY_CREATE`)
- **Authorization:** Method-level with `@PreAuthorize("hasAuthority('PERMISSION_NAME')")`

### DTO Layer
- **Location:** `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/`
- **Request DTOs:** `request/` - Input objects (e.g., `StockRequest.java`, `WarehouseRequest.java`)
- **Response DTOs:** `response/` - Output objects (e.g., `InventoryStockResponse.java`, `WarehouseResponse.java`)

---

## Frontend Layers (RetailChainUi)

### Routing Layer
- **Location:** `RetailChainUi/src/routes/AppRoutes.jsx`
- **Pattern:** React Router v7 with `<Routes>` and `<Route>`
- **Protected Routes:** Wrapped in `ProtectedRoute` component with role-based access
- **Layout:** `MainLayout` with Header, Sidebar for authenticated pages

### Service Layer (API Client)
- **Location:** `RetailChainUi/src/services/`
- **Axios Client:** `services/api/axiosClient.js` - Configured instance with interceptors
  - `axiosPublic` - No auth interceptor (login only)
  - `axiosPrivate` - Auto-attaches Bearer token, handles 401/403
- **Service Files:** Domain-specific API calls
  - `auth.service.js` - Login, register
  - `inventory.service.js` - Stock operations
  - `product.service.js` - Product CRUD
  - `store.service.js` - Store operations
  - `staff.service.js` - Staff management

### Context Layer
- **Location:** `RetailChainUi/src/contexts/AuthContext/`
- **Purpose:** Global auth state (user, token, roles, logout)
- **Pattern:** React Context API with `AuthProvider` wrapper in `App.jsx`

### Components
- **UI Components (shadcn/ui):** `RetailChainUi/src/components/ui/` - Reusable primitives (Button, Input, Dialog, Table, etc.)
- **Layout Components:** `RetailChainUi/src/components/layout/` - Header, Sidebar, MainLayout, Footer
- **Common Components:** `RetailChainUi/src/components/common/` - DataTable, ProtectedRoute

### Pages (Views)
- **Location:** `RetailChainUi/src/pages/`
- **Feature-based Modules:**
  - `Auth/` - Login, Forbidden
  - `Dashboard/` - Main dashboard
  - `Inventory/` - Stock overview, ledger
  - `StockIn/`, `StockOut/` - Stock transactions
  - `Product/` - Product list, detail, edit
  - `Store/`, `StoreDashboard/` - Store management
  - `Staff/` - Staff list, shifts, attendance
  - `Warehouse/` - Warehouse list
  - `RolePermission/` - RBAC UI
  - `UserManagement/` - User CRUD

---

## Data Flow

### API Request Flow (Frontend to Backend)

1. **User Action** triggers React component state change
2. **Service Call** invokes `axiosPrivate.get/post()` with endpoint
3. **Axios Interceptor** attaches `Authorization: Bearer {token}`
4. **Spring Controller** receives request, validates `@PreAuthorize`
5. **Service Layer** executes business logic, manages `@Transactional`
6. **Repository Layer** queries database via JPA
7. **Response** flows back: Repository -> Service -> Controller -> JSON
8. **Axios Response Interceptor** parses JSON, handles 401/403
9. **React Component** updates state, triggers UI re-render

### Authentication Flow

1. User submits login credentials
2. `axiosPublic.post('/auth/login', credentials)`
3. Backend validates credentials, generates JWT (access token + refresh token)
4. Frontend stores token in `localStorage.setItem('token')`
5. Subsequent requests use `axiosPrivate` with token in Authorization header
6. Token expiration triggers 401 -> redirect to login

---

## Key Abstractions

### Permission-Based Authorization
- **Concept:** Fine-grained permissions (e.g., `INVENTORY_VIEW`, `INVENTORY_CREATE`, `WAREHOUSE_TRANSFER`)
- **Roles:** Group of permissions assigned to users (e.g., `SUPER_ADMIN`, `STORE_MANAGER`, `STAFF`)
- **Scope:** Users can be scoped to a `storeId` for multi-tenant-like access control
- **Constants:** `SecurityConstants.java` defines all permission strings

### Composite Key Entities
- `InventoryStock` uses embedded ID `InventoryStockId` (warehouseId + variantId)
- `StoreWarehouse` uses embedded ID `StoreWarehouseId` (storeId + warehouseId)

### Document-Based Inventory
- `InventoryDocument` - Header (type: IMPORT/EXPORT/TRANSFER)
- `InventoryDocumentItem` - Line items
- `InventoryHistory` - Audit trail of all stock movements

---

## Entry Points

### Backend
- **Main Application:** `RetailChainService/src/main/java/com/sba301/retailmanagement/RetailChainServiceApplication.java`
- **API Base Path:** `/api/*`
- **Controller Mapping:** Annotations like `@RequestMapping("/api/inventory")`

### Frontend
- **Entry:** `RetailChainUi/src/main.jsx` -> `App.jsx`
- **Router:** `RetailChainUi/src/routes/AppRoutes.jsx`
- **Base URL:** Configurable via `VITE_API_URL` env var, default `http://localhost:8080/retail-chain/api`

---

## Error Handling

### Backend
- **Global Exception:** `exception/GlobalException.java` catches unhandled exceptions
- **Response Format:** `ResponseJson.toJsonString(ApiCode, message)` and `ResponseJson.toJsonWithData(ApiCode, message, data)`
- **API Codes:** `utils/ApiCode.java` - SUCCESSFUL, ERROR_INTERNAL, ERROR_NOT_FOUND, etc.

### Frontend
- **Axios Interceptor:** Catches HTTP errors, shows toast notification via `sonner`
- **401 Handling:** Clears token, redirects to `/login`
- **403 Handling:** Redirects to `/403` Forbidden page

---

## Cross-Cutting Concerns

**Logging:**
- Controllers use `@Slf4j` with structured logging: `log.info("{}|START", prefix)`
- Prefix pattern: `[methodName]|param=value`

**Validation:**
- Request DTOs use manual validation in Service layer
- Throws `RuntimeException` for validation failures

**Authentication:**
- JWT tokens with expiration
- Refresh token mechanism via `RefreshToken` entity
- Token stored in localStorage on frontend

**Serialization:**
- Backend uses Gson with custom `LocalDateTimeAdapter` in `CommonUtils.java`

---

*Architecture analysis: 2026-03-09*
