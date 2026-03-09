# Codebase Structure

**Analysis Date:** 2026-03-09

## Directory Layout

```
RetailChain/
├── RetailChainService/          # Backend: Spring Boot
│   ├── src/main/java/com/sba301/retailmanagement/
│   │   ├── config/              # Configuration classes
│   │   ├── controller/          # REST controllers
│   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── request/         # Input DTOs
│   │   │   └── response/        # Output DTOs
│   │   ├── entity/              # JPA entities
│   │   ├── enums/               # Enumerations
│   │   ├── exception/           # Exception handling
│   │   ├── mapper/              # DTO mappers
│   │   ├── repository/         # JPA repositories
│   │   ├── security/            # JWT, authentication
│   │   ├── service/            # Business logic
│   │   │   └── impl/            # Service implementations
│   │   └── utils/               # Utilities
│   └── src/main/resources/      # Config files
│
├── RetailChainUi/               # Frontend: React + Vite
│   ├── src/
│   │   ├── assets/              # Images, styles
│   │   ├── components/          # React components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── layout/          # Layout components
│   │   │   └── common/          # Shared components
│   │   ├── configs/             # App configuration
│   │   ├── contexts/            # React Context (Auth)
│   │   ├── hooks/               # Custom hooks
│   │   ├── lib/                 # Utilities (cn(), utils)
│   │   ├── pages/               # Page components
│   │   ├── routes/              # Router configuration
│   │   ├── services/            # API layer
│   │   │   └── api/              # Axios client config
│   │   ├── utils/               # Helper functions
│   │   ├── App.jsx              # Root component
│   │   └── main.jsx             # Entry point
│   └── package.json
│
├── docs/                        # Documentation
└── .beads/                      # Issue tracking
```

---

## Backend Directory Purposes

### `RetailChainService/src/main/java/com/sba301/retailmanagement/`

**controller/**
- Purpose: REST API endpoints
- Contains: `*Controller.java` files
- Key files: `InventoryController.java`, `AuthController.java`, `ProductController.java`, `StoreController.java`, `UserController.java`, `WarehouseController.java`, `RoleController.java`, `SupplierController.java`

**service/ & service/impl/**
- Purpose: Business logic layer
- Contains: Interface + Implementation pairs
- Key files: `InventoryService.java`, `InventoryServiceImpl.java`, `AuthServiceImpl.java`, `WarehouseServiceImpl.java`

**repository/**
- Purpose: Data access layer
- Contains: JPA repository interfaces
- Key files: `InventoryStockRepository.java`, `WarehouseRepository.java`, `UserRepository.java`, `ProductRepository.java`

**entity/**
- Purpose: Database table mappings
- Contains: JPA entity classes with Lombok annotations
- Key files: `User.java`, `InventoryStock.java`, `Warehouse.java`, `Product.java`, `Store.java`, `Role.java`, `Permission.java`

**dto/request/ & dto/response/**
- Purpose: API request/response objects
- Contains: POJOs for data transfer (avoid exposing entities)
- Key files: `StockRequest.java`, `WarehouseRequest.java`, `InventoryStockResponse.java`

**security/**
- Purpose: JWT authentication and authorization
- Contains: Token provider, user details, security constants
- Key files: `JwtTokenProvider.java`, `SecurityConstants.java`, `CustomUserDetailsService.java`

**enums/**
- Purpose: Type-safe constants
- Files: `InventoryAction.java`, `InventoryDocumentType.java`, `UserStatus.java`, `Gender.java`, `ShiftStatus.java`

**exception/**
- Purpose: Exception handling
- Files: `GlobalException.java`, `ResourceNotFoundException.java`

**config/**
- Purpose: Application configuration
- Files: `JwtProperties.java`, `OpenApiConfig.java`, `DataSeeder.java`, `WebConfig.java`

**utils/**
- Purpose: Utility classes
- Files: `ResponseJson.java`, `CommonUtils.java`, `ApiCode.java`

---

## Frontend Directory Purposes

### `RetailChainUi/src/`

**components/ui/**
- Purpose: shadcn/ui component library
- Contains: Button, Input, Dialog, Table, Select, Tabs, Card, etc.
- Location: Atomic design - primitive UI building blocks

**components/layout/**
- Purpose: Layout structure
- Subdirs: `Header/`, `Sidebar/`, `MainLayout/`, `Footer/`
- Contains: Navigation, sidebar menu, page wrapper

**components/common/**
- Purpose: Shared non-UI components
- Files: `ProtectedRoute.jsx`, `DataTable.jsx`

**pages/**
- Purpose: Page-level components (views)
- Subdirs by feature: `Auth/`, `Dashboard/`, `Inventory/`, `Product/`, `Store/`, `Staff/`, `Warehouse/`, `StockIn/`, `StockOut/`, `RolePermission/`
- Each feature may have sub-components, hooks, helpers

**services/ & services/api/**
- Purpose: API integration layer
- Files: Domain-specific service files (`inventory.service.js`, `product.service.js`, etc.)
- Axios config: `services/api/axiosClient.js`

**contexts/AuthContext/**
- Purpose: Global authentication state
- Files: `AuthProvider.jsx`, `useAuth.js`

**routes/**
- Purpose: Router configuration
- Files: `AppRoutes.jsx` - Central route definitions with role-based protection

**hooks/**
- Purpose: Custom React hooks
- Files: `useAxios.js`, `useDebounce.js`

**lib/**
- Purpose: Library utilities
- Files: `utils.js` (cn() class merger for Tailwind)

**utils/**
- Purpose: General helper functions
- Files: `storage.js` (localStorage wrapper), `validators.js`

**configs/**
- Purpose: App configuration constants

---

## Key File Locations

### Backend Entry Points

**Application Main:**
- `RetailChainService/src/main/java/com/sba301/retailmanagement/RetailChainServiceApplication.java`

**Configuration:**
- `RetailChainService/src/main/resources/application.properties`

### Frontend Entry Points

**Entry:**
- `RetailChainUi/src/main.jsx`

**Root Component:**
- `RetailChainUi/src/App.jsx`

**Routing:**
- `RetailChainUi/src/routes/AppRoutes.jsx`

**API Client:**
- `RetailChainUi/src/services/api/axiosClient.js`

---

## Naming Conventions

### Backend

**Java Classes:**
- Controllers: `*Controller.java` (e.g., `InventoryController.java`)
- Services: `*Service.java` (interface), `*ServiceImpl.java` (implementation)
- Repositories: `*Repository.java`
- Entities: `*Entity.java` or just entity name (e.g., `User.java`, `InventoryStock.java`)
- DTOs: `*Request.java`, `*Response.java`

**Java Packages:**
- All lowercase: `com.sba301.retailmanagement.controller`

**Methods:**
- camelCase (Java standard)

### Frontend

**Files:**
- Components: PascalCase `.jsx` (e.g., `ProductCard.jsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.js`)
- Utils: camelCase (e.g., `formatDate.js`)
- Services: camelCase (e.g., `inventory.service.js`)

**Directories:**
- Feature folders: PascalCase (e.g., `Product/`, `Inventory/`)
- Component folders: PascalCase (e.g., `Button/`, `Header/`)

**React Components:**
- Functional components with arrow functions
- Named exports for reusable components
- Default export for page components

---

## Where to Add New Code

### Backend

**New Feature/Module:**
1. Create Entity in `entity/`
2. Create Repository in `repository/`
3. Create Service Interface in `service/`
4. Create Service Implementation in `service/impl/`
5. Create Request/Response DTOs in `dto/request/` and `dto/response/`
6. Create Controller in `controller/`
7. Add permission constants in `security/SecurityConstants.java` (if needed)

**Example Path:**
```
entity/NewFeature.java
repository/NewFeatureRepository.java
service/NewFeatureService.java
service/impl/NewFeatureServiceImpl.java
dto/request/NewFeatureRequest.java
dto/response/NewFeatureResponse.java
controller/NewFeatureController.java
```

### Frontend

**New Page:**
1. Create folder in `pages/` (e.g., `pages/NewFeature/`)
2. Create page component `NewFeaturePage.jsx`
3. Add route in `routes/AppRoutes.jsx`
4. Create service in `services/newfeature.service.js` (if API calls needed)

**New UI Component:**
1. Create folder in `components/ui/` or `components/common/`
2. Implement component in `ComponentName.jsx`
3. Export from `index.js` barrel file

**New API Endpoint:**
1. Add method to appropriate service file in `services/`
2. Use `axiosPrivate` for authenticated endpoints

---

## Special Directories

**`.beads/`**
- Purpose: Issue tracking (beads_viewer)
- Generated: Yes (by bd command)
- Committed: Yes

**`docs/`**
- Purpose: Project documentation
- Generated: No (manual)
- Committed: Yes

**`uploads/`**
- Purpose: File uploads storage
- Generated: Yes (runtime)
- Committed: No (in .gitignore)

**`node_modules/`**
- Purpose: npm dependencies
- Generated: Yes (npm install)
- Committed: No

---

*Structure analysis: 2026-03-09*
