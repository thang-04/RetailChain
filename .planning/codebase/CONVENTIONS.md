# Coding Conventions

**Analysis Date:** 2026-03-09

## Naming Patterns

### Java Backend

**Files:**
- Entity: PascalCase singular (e.g., `Warehouse.java`, `Product.java`)
- Repository: PascalCase singular + Repository suffix (e.g., `WarehouseRepository.java`)
- Service Interface: PascalCase singular + Service suffix (e.g., `InventoryService.java`)
- Service Implementation: PascalCase singular + ServiceImpl (e.g., `InventoryServiceImpl.java`)
- Controller: PascalCase singular + Controller suffix (e.g., `WarehouseController.java`)
- DTO Request: PascalCase + Request suffix (e.g., `WarehouseRequest.java`)
- DTO Response: PascalCase + Response suffix (e.g., `WarehouseResponse.java`)
- Exception: PascalCase + Exception suffix (e.g., `ResourceNotFoundException.java`)

**Functions/Methods:**
- camelCase (e.g., `createWarehouse`, `getStockByWarehouse`, `mapToWarehouseResponse`)

**Variables:**
- camelCase (e.g., `warehouse`, `savedWarehouse`, `stockId`)
- Constants: UPPER_SNAKE_CASE for truly constant values

**Types/Classes:**
- PascalCase (e.g., `Warehouse`, `InventoryStock`, `ApiResponse`)

### JavaScript/React Frontend

**Files:**
- Components: PascalCase (e.g., `LoginPage.jsx`, `ProductTable.jsx`)
- Services: camelCase + .service.js suffix (e.g., `product.service.js`, `auth.service.js`)
- Hooks: camelCase + use prefix (e.g., `useAuth.js`, `useAxios.js`)
- Utilities: camelCase (e.g., `storage.js`, `validators.js`)
- Config: camelCase (e.g., `app.config.js`, `routes.config.js`)

**Functions/Components:**
- Components: Arrow function with PascalCase name (e.g., `const LoginPage = () => { ... }`)
- Hooks: camelCase with use prefix (e.g., `useAuth`, `useDebounce`)
- Regular functions: camelCase

**Variables:**
- camelCase (e.g., `allProducts`, `filteredProducts`, `isSubmitting`)

## Code Style

### Java Backend

**Formatting:**
- Uses Lombok annotations extensively (`@Data`, `@Getter`, `@Setter`, `@AllArgsConstructor`, `@NoArgsConstructor`, `@Builder`)
- Spring annotations (`@Service`, `@RestController`, `@Transactional`, `@RestControllerAdvice`)
- Indentation: 4 spaces

**Linting:**
- Not explicitly configured (Maven project without Checkstyle)

**Import Organization:**
1. Java/Jakarta EE packages
2. Spring Framework packages
3. Third-party libraries (Lombok, Jackson, etc.)
4. Internal packages (com.sba301.retailmanagement.*)

**Entity Pattern:**
- Uses JPA annotations (`@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`)
- Composite keys via separate ID class (e.g., `InventoryStockId.java`)
- Relationships defined with `@OneToMany`, `@ManyToOne`, etc.

**DTO Pattern:**
- Request DTOs: Use `@Data` Lombok annotation, fields match request JSON
- Response DTOs: Use `@Builder` pattern, immutable construction

### JavaScript/React Frontend

**Formatting:**
- Tool: ESLint + Prettier (via Vite)
- Configuration: `eslint.config.js` with react-hooks and react-refresh plugins
- Rule: `no-unused-vars: ['error', { varsIgnorePattern: '^[A-Z_]' }]`

**Linting:**
- ESLint with recommended configs:
  - `@eslint/js`
  - `eslint-plugin-react-hooks`
  - `eslint-plugin-react-refresh`

**Tailwind CSS:**
- Uses Tailwind CSS v4 with `@tailwindcss/postcss`
- Utility classes for styling
- Dark mode support via `dark:` prefix

**Import Organization:**
1. React imports (`react`)
2. React Router (`react-router-dom`)
3. Third-party libraries (lucide-react, axios, etc.)
4. Internal components
5. Internal services/hooks/contexts
6. Internal utilities

**Component Structure:**
```jsx
// Pattern observed in codebase
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SomeIcon } from "lucide-react";
import SomeComponent from "./components/SomeComponent";
import someService from "../../services/some.service";

const ComponentName = () => {
  // State hooks
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    // effect logic
  }, []);

  // Handlers
  const handleAction = () => {
    // handler logic
  };

  // Render
  return (
    <div>...</div>
  );
};

export default ComponentName;
```

## Error Handling

### Java Backend

**Pattern:**
- Custom exceptions: `ResourceNotFoundException`
- Generic handling: `RuntimeException` with custom messages
- Global exception handler: `GlobalException.java` with `@RestControllerAdvice`
- Logging: Uses Lombok `@Slf4j` with `log.error()`, `log.warn()`

**Exception Handler Pattern:**
```java
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ApiResponse<?>> handleRuntimeException(RuntimeException e) {
    log.error("Runtime Exception: {}", e.getMessage(), e);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.internalError(e.getMessage()));
}
```

**Error Response:**
- All errors wrapped in `ApiResponse<T>` with standardized format
- HTTP status codes: 200 (success), 400 (bad request), 404 (not found), 500 (server error)

### JavaScript/React Frontend

**Pattern:**
- Try-catch blocks in async handlers
- Error state in components
- Graceful degradation (mock data fallback when backend offline)

**Example from ProductPage:**
```javascript
try {
  const [prodRes, catRes] = await Promise.all([...]);
  setAllProducts(prodRes.data || []);
} catch (error) {
  console.error("Failed to fetch products or categories:", error);
  setBackendOffline(true);
  setAllProducts(MOCK_PRODUCTS); // Fallback
}
```

## Logging

### Java Backend
- Framework: SLF4J with Lombok `@Slf4j`
- Patterns: `log.error()`, `log.warn()`, `log.info()`
- Example: `log.error("Runtime Exception: {}", e.getMessage(), e);`

### JavaScript/React Frontend
- Framework: Console (`console.error`, `console.warn`, `console.log`)
- Example: `console.error("Failed to fetch products or categories:", error);`

## Comments

### Java
- Javadoc-style comments on DTO wrapper classes (e.g., `ApiResponse.java`)
- Inline comments for complex logic (e.g., transaction handling)
- Vietnamese comments observed in business logic

### JavaScript/React
- Vietnamese comments throughout codebase
- Inline comments for complex filtering logic
- Mock data labeled with comments (e.g., `// Mock data dùng khi backend offline`)

## Function Design

### Java
- **Size:** Methods typically under 50 lines; complex methods broken into private helpers
- **Parameters:** Minimal parameters; use DTOs for complex requests
- **Return:** Return DTOs/Responses, never expose entities directly

### React
- **Size:** Components can be large; complex logic extracted to custom hooks
- **Parameters:** Props for component input
- **Return:** JSX or null

## Module Design

### Java Backend

**Service Layer Pattern:**
- Interface + Implementation pattern
- Example: `InventoryService` (interface) + `InventoryServiceImpl` (implementation)
- Uses `@RequiredArgsConstructor` for dependency injection

**Repository Pattern:**
- Extends `JpaRepository<Entity, IdType>`
- Custom query methods following Spring Data JPA naming conventions

**Controller Pattern:**
- REST endpoints with `@RestController`
- Uses `@RequestMapping` or method-level annotations (`@GetMapping`, `@PostMapping`, etc.)

### React Frontend

**Exports:**
- Page components: `export default` (e.g., `export default LoginPage;`)
- Common components: Named exports preferred
- Services: Default exports (e.g., `export default productService;`)

**Barrel Files:**
- Not extensively used; direct imports from files

**Context API:**
- Auth context in `src/contexts/AuthContext/`
- Provider pattern with custom hooks (e.g., `useAuth`)

## Special Patterns

### Backend - Transaction Management
- `@Transactional` annotation on mutation methods
- Cascading deletes handled explicitly
- Soft delete pattern mentioned (preferred over hard delete)

### Frontend - API Service Pattern
```javascript
// Example from product.service.js
const productService = {
  getAllProducts: () => axiosClient.get('/products'),
  getProductById: (id) => axiosClient.get(`/products/${id}`),
  createProduct: (data) => axiosClient.post('/products', data),
  updateProduct: (id, data) => axiosClient.put(`/products/${id}`, data),
  deleteProduct: (id) => axiosClient.delete(`/products/${id}`),
};
export default productService;
```

### Frontend - State Management
- Local state: `useState` for component-specific data
- Global state: React Context API (`AuthContext`)
- Server state: Direct API calls with try-catch

---

*Convention analysis: 2026-03-09*
