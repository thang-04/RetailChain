# Coding Conventions

**Analysis Date:** 2026-02-26

## Overview

This codebase follows a dual-stack architecture:
- **Backend:** Java 17 with Spring Boot 3.2.1, JPA/Hibernate, MySQL
- **Frontend:** React 19 with Vite, Tailwind CSS, shadcn/ui

The project enforces **Tiếng Việt** for comments and user-facing text in both stacks.

---

## Backend Conventions (Java/Spring Boot)

### Naming Patterns

**Classes:**
- PascalCase: `InventoryServiceImpl`, `WarehouseController`, `WarehouseResponse`
- Suffix pattern: `Service`, `Controller`, `Repository`, `Entity`, `Request`, `Response`, `Exception`, `Mapper`

**Methods:**
- camelCase: `createWarehouse()`, `getStockByWarehouse()`, `importStock()`

**Variables:**
- camelCase: `warehouseId`, `request.getCode()`, `savedWarehouse`

**Constants:**
- UPPER_SNAKE_CASE in Config classes: `LINK_ACCOUNT_TYPE.FACEBOOK`

### Package Structure

```
src/main/java/com/sba301/retailmanagement/
├── config/           # Configuration classes
├── controller/      # REST endpoints
├── dto/
│   ├── request/     # Request DTOs
│   └── response/    # Response DTOs
├── entity/          # JPA entities
├── enums/           # Enumerations
├── exception/       # Custom exceptions
├── mapper/          # DTO-Entity mappers
├── repository/      # JPA repositories
├── service/         # Service interfaces
│   └── impl/        # Service implementations
└── utils/           # Utility classes
```

### Code Style

**Annotations:**
```java
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
@RestController
@RequestMapping("/api/inventory")
```

**Dependency Injection:**
- Use `@RequiredArgsConstructor` (Lombok) instead of constructor injection
- Fields marked as `private final`

**Entity Classes:**
```java
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
    // Fields with column definitions
}
```

**DTO Classes:**
- Request DTOs: Use `@Data` (Lombok)
- Response DTOs: Use `@Data` + `@Builder`

### Service Layer Pattern

**Interface:**
```java
public interface InventoryService {
    WarehouseResponse createWarehouse(WarehouseRequest request);
    List<WarehouseResponse> getAllWarehouses();
}
```

**Implementation:**
```java
@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {
    private final WarehouseRepository warehouseRepository;
    
    @Override
    @Transactional
    public WarehouseResponse createWarehouse(WarehouseRequest request) {
        // Validation
        if (warehouseRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Warehouse code already exists");
        }
        // Business logic
        Warehouse warehouse = new Warehouse();
        // ... field mapping
        return mapToWarehouseResponse(warehouseRepository.save(warehouse));
    }
}
```

### Controller Pattern

```java
@Slf4j
@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @GetMapping("/stock/{warehouseId}")
    public String getStockByWarehouse(@PathVariable Long warehouseId) {
        String prefix = "[getStockByWarehouse]|warehouseId=" + warehouseId;
        log.info("{}|START", prefix);
        try {
            List<InventoryStockResponse> response = inventoryService.getStockByWarehouse(warehouseId);
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Stock retrieved successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving stock: " + e.getMessage());
        }
    }
}
```

### Error Handling

**Custom Exceptions:**
```java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

**Global Exception Handler:**
```java
@Slf4j
@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<?>> handleRuntimeException(RuntimeException e) {
        log.error("Runtime Exception: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.internalError(e.getMessage()));
    }
}
```

**Service Error Patterns:**
- Throw `RuntimeException` for validation failures
- Use descriptive error messages in Vietnamese

### Logging

**Pattern:**
```java
String prefix = "[getStockByWarehouse]|warehouseId=" + warehouseId;
log.info("{}|START", prefix);
try {
    // logic
    log.info("{}|END|size={}", prefix, response.size());
} catch (Exception e) {
    log.error("{}|Exception={}", prefix, e.getMessage(), e);
}
```

### Mapper Pattern

```java
@Component
public class StoreMapper {
    public StoreResponse toResponse(Store store) {
        if (store == null) return null;
        return StoreResponse.builder()
                .id(store.getId())
                .code(store.getCode())
                // ...
                .build();
    }
}
```

### Import Organization

Order:
1. Java standard library (`java.time.*`, `java.util.*`)
2. Third-party libraries (`com.google.gson.*`, `org.springframework.*`)
3. Project packages (`com.sba301.retailmanagement.*`)

---

## Frontend Conventions (React)

### Naming Patterns

**Files:**
- PascalCase for components: `InventoryPage.jsx`, `Button.jsx`, `InventoryTable.jsx`
- camelCase for services/hooks: `inventory.service.js`, `useGeoLocation.js`

**Components:**
- PascalCase: `const InventoryPage = () => {...}`

**Functions:**
- camelCase: `fetchInventory()`, `handleFilterChange()`

### File Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components (Header, Sidebar, Footer)
│   └── common/          # Shared components
├── configs/             # App configuration
├── hooks/               # Custom hooks
├── lib/                 # Utility libraries (utils.js)
├── pages/               # Page components (feature-based)
├── routes/              # Route definitions
└── services/            # API services
    └── api/             # Axios configuration
```

### Component Patterns

**Page Component (Default Export):**
```jsx
const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchInventory = useCallback(async () => {
    // logic
  }, [dependencies]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};

export default InventoryPage;
```

**UI Component (Named Export):**
```jsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(...);

function Button({ className, variant, size, asChild, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

export { Button, buttonVariants };
```

### Styling

**Tailwind CSS:**
- Use utility classes directly in JSX
- Dark mode: `dark:bg-surface-dark`
- Custom color tokens: `bg-primary`, `text-primary-foreground`

**Class Merging:**
```jsx
import { cn } from "@/lib/utils";

<div className={cn("base-classes", conditional && "conditional-class")}>
```

### API Service Pattern

```javascript
import { axiosPrivate } from './api/axiosClient';

const inventoryService = {
  createWarehouse: async (data) => {
    return axiosPrivate.post('/inventory/warehouse', data);
  },
  getAllWarehouses: async () => {
    return axiosPrivate.get('/inventory/warehouse');
  },
  // Error handling in individual calls
  getStockInRecords: async () => {
    try {
      const response = await axiosPrivate.get('/inventory/documents?type=IMPORT');
      return response.data || [];
    } catch (error) {
      console.error("Fetch stock in error", error);
      return [];
    }
  },
};

export default inventoryService;
```

### State Management

**Local State:**
```javascript
const [inventoryData, setInventoryData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

**Derived State:**
```javascript
const [page, setPage] = useState(1);
const totalPages = Math.ceil(total / pageSize);
```

### Event Handlers

```javascript
const handleFilterChange = (partial) => {
  setFilters((prev) => ({ ...prev, ...partial }));
  setPage(1);
};

const handleDateChange = (range) => {
  setDateRange(range);
  setPage(1);
};
```

### Import Path Conventions

**Relative paths:**
```javascript
import inventoryService from "../../services/inventory.service";
import { Button } from "@/components/ui/button";
```

**Path alias:** `@/` maps to `src/`

### Error Handling

```javascript
try {
  const [historyPage, overviewData] = await Promise.all([
    inventoryService.getInventoryHistoryRecords({...}),
    inventoryService.getInventoryOverview(),
  ]);
  setInventoryData(historyPage?.items || []);
} catch (err) {
  console.error("Failed to fetch inventory history:", err);
  setError(err?.message || "Không tải được dữ liệu.");
  setInventoryData([]);
} finally {
  setLoading(false);
}
```

### Conditional Rendering

```jsx
{error && (
  <div className="p-4 mx-4 mt-4 rounded-lg bg-red-50 text-red-700 text-sm">
    {error}
  </div>
)}
{loading ? (
  <div className="p-10 text-center text-slate-500">Đang tải...</div>
) : (
  <InventoryTable data={inventoryData} />
)}
```

---

## Common Rules

1. **Language:** All comments and user-facing text use Tiếng Việt
2. **No Magic Numbers:** Use named constants or configuration
3. **Consistent Returns:** Controllers return `String` (JSON), not objects directly
4. **Logging:** Both stacks log operations (Java with `@Slf4j`, JS with `console`)
5. **Validation:** Backend validates input, frontend provides feedback
6. **Null Handling:** Use Optional in Java, defensive checks in JS

---

*Convention analysis: 2026-02-26*
