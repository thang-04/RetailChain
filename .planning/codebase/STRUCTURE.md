# Codebase Structure

**Analysis Date:** 2026-02-26

## Directory Layout

```
RetailChain/                           # Monorepo root
├── RetailChainService/               # Backend: Spring Boot, Java
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/sba301/retailmanagement/
│   │   │   │       ├── config/            # Spring configurations
│   │   │   │       ├── controller/        # REST API controllers
│   │   │   │       ├── dto/               # Data Transfer Objects
│   │   │   │       │   ├── request/       # Request DTOs
│   │   │   │       │   ├── response/      # Response DTOs
│   │   │   │       │   └── common/         # Shared DTOs
│   │   │   │       ├── entity/            # JPA entities
│   │   │   │       ├── enums/             # Enumerations
│   │   │   │       ├── exception/         # Exception handling
│   │   │   │       ├── mapper/            # DTO-Entity mappers
│   │   │   │       ├── repository/        # JPA repositories
│   │   │   │       ├── service/           # Business logic
│   │   │   │       │   ├── impl/           # Service implementations
│   │   │   │       │   └── *.java         # Service interfaces
│   │   │   │       └── utils/             # Utility classes
│   │   │   └── resources/     # Config files, messages
│   │   └── test/              # Unit tests
│   └── pom.xml               # Maven build config
│
├── RetailChainUi/                     # Frontend: React, Vite
│   ├── src/
│   │   ├── assets/                    # Static assets
│   │   │   ├── images/                # Images (auth/, banners/)
│   │   │   ├── icons/                 # SVG icon components
│   │   │   └── styles/                # Global styles
│   │   ├── components/                # Reusable UI components
│   │   │   ├── ui/                    # shadcn/ui components
│   │   │   │   ├── button.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── table.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   └── ... (other UI components)
│   │   │   ├── common/                # Custom common components
│   │   │   └── layout/                 # Layout components
│   │   │       ├── Header/
│   │   │       ├── Footer/
│   │   │       ├── MainLayout/
│   │   │       └── Sidebar/
│   │   ├── configs/                   # App configuration
│   │   ├── pages/                      # Page components (route destinations)
│   │   │   ├── Dashboard/
│   │   │   ├── Store/
│   │   │   ├── StoreDashboard/
│   │   │   ├── Product/
│   │   │   ├── Inventory/
│   │   │   ├── StockIn/
│   │   │   ├── StockOut/
│   │   │   ├── Transfer/
│   │   │   ├── Staff/
│   │   │   └── Warehouse/
│   │   ├── routes/                     # Route definitions
│   │   ├── services/                   # API services
│   │   │   ├── api/                     # Axios client config
│   │   │   │   └── axiosClient.js
│   │   │   ├── auth.service.js
│   │   │   ├── dashboard.service.js
│   │   │   ├── inventory.service.js
│   │   │   ├── product.service.js
│   │   │   ├── staff.service.js
│   │   │   ├── store.service.js
│   │   │   └── supplier.service.js
│   │   ├── utils/                      # Utility functions
│   │   ├── App.jsx                     # Root component
│   │   └── main.jsx                    # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── .planning/codebase/                 # This analysis output
├── docs/                               # Project documentation
└── AGENTS.md                           # Agent instructions
```

## Directory Purposes

### Backend Directories

**`RetailChainService/src/main/java/com/sba301/retailmanagement/controller/`:**
- Purpose: REST API endpoint definitions
- Contains: `@RestController` annotated classes
- Key files: `InventoryController.java`, `StoreController.java`, `ProductController.java`, `UserController.java`, `WarehouseController.java`

**`RetailChainService/src/main/java/com/sba301/retailmanagement/service/`:**
- Purpose: Business logic implementation
- Contains: Service interfaces and implementations
- Key files: `InventoryService.java`, `InventoryServiceImpl.java`, `StoreService.java`, `ProductService.java`

**`RetailChainService/src/main/java/com/sba301/retailmanagement/repository/`:**
- Purpose: Database access layer
- Contains: JPA Repository interfaces
- Key files: `InventoryStockRepository.java`, `WarehouseRepository.java`, `ProductRepository.java`

**`RetailChainService/src/main/java/com/sba301/retailmanagement/entity/`:**
- Purpose: Database table mappings
- Contains: JPA entities with Lombok annotations
- Key files: `InventoryStock.java`, `Warehouse.java`, `Store.java`, `Product.java`, `User.java`

**`RetailChainService/src/main/java/com/sba301/retailmanagement/dto/`:**
- Purpose: API request/response data objects
- Contains: Request and Response DTOs organized in subdirectories

### Frontend Directories

**`RetailChainUi/src/pages/`:**
- Purpose: Full-page components mapped to routes
- Contains: Feature-specific page components with local subdirectories for components/hooks/helpers

**`RetailChainUi/src/components/ui/`:**
- Purpose: shadcn/ui base components (Buttons, Inputs, Tables, Cards, etc.)
- Contains: Reusable atomic UI components styled with Tailwind

**`RetailChainUi/src/components/layout/`:**
- Purpose: Structural layout components
- Contains: `Header/`, `Sidebar/`, `MainLayout/`, `Footer/`

**`RetailChainUi/src/services/`:**
- Purpose: API communication layer
- Contains: Service modules for each backend domain

**`RetailChainUi/src/routes/`:**
- Purpose: Route definitions using react-router-dom
- Key files: `AppRoutes.jsx`

## Key File Locations

### Entry Points

- **Backend Main:** `RetailChainService/src/main/java/com/sba301/retailmanagement/RetailChainServiceApplication.java`
- **Frontend Main:** `RetailChainUi/src/main.jsx`
- **Frontend App:** `RetailChainUi/src/App.jsx`

### Configuration

- **Backend Config:** `RetailChainService/src/main/java/com/sba301/retailmanagement/config/Config.java`
- **Web Config:** `RetailChainService/src/main/java/com/sba301/retailmanagement/config/WebConfig.java`
- **OpenAPI Config:** `RetailChainService/src/main/java/com/sba301/retailmanagement/config/OpenApiConfig.java`
- **Frontend Vite Config:** `RetailChainUi/vite.config.js`

### Core Logic

- **Inventory Service:** `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java`
- **Store Service:** `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/StoreServiceImpl.java`
- **Product Service:** `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/ProductServiceImpl.java`

### Frontend API Client

- **Axios Client:** `RetailChainUi/src/services/api/axiosClient.js`
- **Inventory Service:** `RetailChainUi/src/services/inventory.service.js`
- **Product Service:** `RetailChainUi/src/services/product.service.js`

## Naming Conventions

### Backend (Java)

| Type | Convention | Example |
|------|-------------|---------|
| Entities | PascalCase, singular | `Warehouse.java`, `InventoryStock.java` |
| Repositories | EntityName + Repository | `WarehouseRepository.java` |
| Services | EntityName + Service | `InventoryService.java` |
| Controllers | Domain + Controller | `InventoryController.java` |
| DTOs | Domain + Request/Response | `WarehouseRequest.java`, `InventoryStockResponse.java` |
| Enums | PascalCase | `InventoryDocumentType.java`, `ShiftStatus.java` |

### Frontend (React/JavaScript)

| Type | Convention | Example |
|------|------------|---------|
| Pages | PascalCase + Page/Page.jsx | `WarehouseListPage.jsx`, `DashboardPage.jsx` |
| Components | PascalCase | `Sidebar.jsx`, `Button.jsx` |
| Services | camelCase + .service.js | `inventory.service.js`, `product.service.js` |
| Hooks | use + PascalCase | `useAuth.js` (if exists) |
| Utils | camelCase | `storage.js`, `validators.js` |
| Routes | App + Routes.jsx | `AppRoutes.jsx` |

### File Organization Patterns

**Frontend Page Structure:**
```
pages/
├── FeatureName/
│   ├── FeaturePage.jsx         # Main page component
│   ├── components/             # Local components (only for this feature)
│   │   ├── ComponentA/
│   │   │   ├── ComponentA.jsx
│   │   │   └── index.js
│   │   └── ComponentB.jsx
│   ├── hooks/                  # Local hooks
│   └── helpers/                # Local utilities
```

## Where to Add New Code

### Backend (Spring Boot)

**New Entity:**
- Location: `RetailChainService/src/main/java/com/sba301/retailmanagement/entity/`
- Follow: JPA entity pattern with Lombok annotations

**New Repository:**
- Location: `RetailChainService/src/main/java/com/sba301/retailmanagement/repository/`
- Pattern: Extend `JpaRepository<Entity, Long>`

**New Service:**
- Location: `RetailChainService/src/main/java/com/sba301/retailmanagement/service/`
- Create: Interface + Implementation in `impl/` subpackage

**New Controller:**
- Location: `RetailChainService/src/main/java/com/sba301/retailmanagement/controller/`
- Annotations: `@RestController`, `@RequestMapping`, `@RequiredArgsConstructor`

**New DTO:**
- Location: `RetailChainService/src/main/java/com/sba301/retailmanagement/dto/request/` or `dto/response/`
- Pattern: Plain Java classes with Lombok getters/setters or Builder pattern

### Frontend (React)

**New Page:**
- Location: `RetailChainUi/src/pages/{ModuleName}/`
- Create: `PageName.jsx` as default export

**New Service (API):**
- Location: `RetailChainUi/src/services/`
- File: `{domain}.service.js`
- Pattern: Export object with API methods, import `axiosPrivate` from `./api/axiosClient`

**New UI Component:**
- Location: `RetailChainUi/src/components/ui/` (for shadcn-style)
- Or: `RetailChainUi/src/components/common/` (for custom)

**New Route:**
- Location: `RetailChainUi/src/routes/AppRoutes.jsx`
- Add: `<Route path="..." element={<PageComponent />} />`

## Special Directories

**`RetailChainService/src/main/java/com/sba301/retailmanagement/utils/`:**
- Purpose: Utility classes (`ResponseJson`, `CommonUtils`, `ApiCode`)
- Contains: Response formatting, date handling, API codes

**`RetailChainService/src/main/java/com/sba301/retailmanagement/enums/`:**
- Purpose: Domain enumerations
- Contains: `InventoryDocumentType`, `InventoryAction`, `ShiftStatus`, etc.

**`RetailChainService/src/main/java/com/sba301/retailmanagement/exception/`:**
- Purpose: Exception classes
- Contains: `GlobalException.java`, `ResourceNotFoundException.java`

**`RetailChainUi/src/components/ui/`:**
- Purpose: shadcn/ui component library
- Contains: Reusable UI primitives (Button, Input, Table, Card, Dialog, etc.)
- Generated: Components installed via shadcn/cli

---

*Structure analysis: 2026-02-26*
