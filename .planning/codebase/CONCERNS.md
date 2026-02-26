# Codebase Concerns

**Analysis Date:** 2026-02-26

## Security Considerations

### No Authentication/Authorization
- **Risk:** All API endpoints are publicly accessible without authentication
- **Files:** `RetailChainService/pom.xml` - No Spring Security dependency
- **Impact:** Anyone can access and modify any data via API
- **Recommendation:** Add Spring Security with JWT authentication

### Hardcoded User IDs
- **Risk:** All inventory operations are attributed to user ID 1
- **Files:** 
  - `src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java` (lines 117, 178, 252, 323)
- **Current mitigation:** Uses TODO comments placeholder `// TODO: Get from SecurityContext`
- **Recommendation:** Implement proper SecurityContext integration

### Token Storage in LocalStorage
- **Risk:** Tokens vulnerable to XSS attacks
- **Files:** `RetailChainUi/src/services/api/axiosClient.js` (line 46)
- **Current implementation:** `localStorage.getItem('accessToken')`
- **Recommendation:** Use httpOnly cookies for token storage

### No 401 Redirect to Login
- **Risk:** User remains on page with expired token
- **Files:** `RetailChainUi/src/services/api/axiosClient.js` (lines 69-74)
- **Current behavior:** Just logs warning and rejects request
- **Recommendation:** Redirect to `/login` on 401

---

## Tech Debt

### Generic RuntimeException Usage
- **Issue:** All business logic errors thrown as generic RuntimeException
- **Files:** 
  - `src/main/java/com/sba301/retailmanagement/service/impl/StoreServiceImpl.java` (multiple lines)
  - `src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java` (multiple lines)
  - `src/main/java/com/sba301/retailmanagement/service/impl/WarehouseServiceImpl.java` (multiple lines)
- **Impact:** No proper error categorization, poor error handling
- **Fix approach:** Create custom exception hierarchy (ResourceNotFoundException, ValidationException, BusinessException)

### Poor Error Response Mapping
- **Issue:** GlobalException handler maps ALL RuntimeExceptions to HTTP 500
- **Files:** `src/main/java/com/sba301/retailmanagement/exception/GlobalException.java` (lines 20-25)
- **Current:** `return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)`
- **Fix approach:** Create specific exception types with appropriate HTTP status codes

### Missing Validation Error Details
- **Issue:** Validation errors don't return field-level messages
- **Files:** `src/main/java/com/sba301/retailmanagement/exception/GlobalException.java` (lines 48-59)
- **Current:** Returns generic "Validation Failed" message
- **Fix approach:** Return detailed field errors in response

### Incomplete Store Detail Endpoint
- **Issue:** Store detail doesn't populate related data (manager, KPI, inventory, staff)
- **Files:** `src/main/java/com/sba301/retailmanagement/service/impl/StoreServiceImpl.java` (lines 79-84)
- **Current:** TODO comment indicating incomplete implementation
- **Fix approach:** Fetch related data from respective services

### Product Service Incomplete
- **Issue:** Product service has TODO indicating endpoint not implemented
- **Files:** `RetailChainUi/src/services/product.service.js` (line 13)
- **Fix approach:** Implement when backend endpoint is available

### Frontend Using Alert Instead of Toast
- **Issue:** Using browser alert() for user notifications
- **Files:** 
  - `RetailChainUi/src/pages/StockIn/CreateStockIn.jsx` (lines 104, 128)
  - `RetailChainUi/src/pages/Warehouse/CreateWarehouseModal.jsx` (line 136 - placeholder)
- **Fix approach:** Replace with proper toast notification component

---

## Testing Gaps

### No Backend Unit Tests
- **What's not tested:** All service layer logic, repositories, controllers
- **Files:** `src/test/java/com/sba301/retailmanagement/RetailChainServiceApplicationTests.java`
- **Current:** Only contains empty contextLoads test
- **Risk:** Logic bugs undetected until manual testing
- **Priority:** High

### No Frontend Tests
- **What's not tested:** All React components, hooks, services
- **Files:** No test files found in `RetailChainUi/`
- **Risk:** UI regressions undetected
- **Priority:** High

### No Integration Tests
- **What's not tested:** API endpoint integration, database operations
- **Risk:** Data inconsistencies between layers
- **Priority:** Medium

---

## Performance Concerns

### Unbounded findAll() Queries
- **Issue:** Multiple endpoints use `findAll()` without pagination
- **Files:** 
  - `src/main/java/com/sba301/retailmanagement/service/impl/StoreServiceImpl.java` (line 37)
  - `src/main/java/com/sba301/retailmanagement/service/impl/ProductServiceImpl.java` (line 34)
  - `src/main/java/com/sba301/retailmanagement/service/impl/SupplierServiceImpl.java` (line 21)
  - `src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java` (lines 68, 487)
  - `src/main/java/com/sba301/retailmanagement/service/impl/WarehouseServiceImpl.java` (line 53)
- **Impact:** Will cause memory issues with large datasets
- **Fix approach:** Add pagination support to all list endpoints

### Potential N+1 Query Issues
- **Issue:** No fetch joins or entity graphs defined
- **Files:** Multiple repository implementations
- **Risk:** Multiple database queries for related entities
- **Fix approach:** Use @EntityGraph or custom queries with JOIN FETCH

---

## Code Quality Issues

### Mapper Null Returns
- **Issue:** Mapper methods return null instead of throwing or handling
- **Files:** `src/main/java/com/sba301/retailmanagement/mapper/StoreMapper.java` (lines 14-15, 28-29, 40-41)
- **Risk:** NullPointerException in consuming code
- **Fix approach:** Use Optional or throw IllegalArgumentException

### Duplicate Null Check Pattern
- **Issue:** Repeated null checks in every mapper method
- **Files:** `src/main/java/com/sba301/retailmanagement/mapper/StoreMapper.java`
- **Fix approach:** Use lombok @NonNull or centralize validation

### Mixed Approaches in GlobalException
- **Issue:** Uses both RuntimeException and custom ResourceNotFoundException inconsistently
- **Files:** `src/main/java/com/sba301/retailmanagement/exception/GlobalException.java`
- **Fix approach:** Create consistent exception hierarchy

---

## Known Bugs

### Inventory Service Hardcoded Values
- **Symptoms:** All inventory documents show createdBy=1 regardless of actual user
- **Files:** `src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java`
- **Trigger:** Any stock import, export, or transfer operation
- **Workaround:** None - audit trail is inaccurate

### Validation Errors Lose Detail
- **Symptoms:** User sees "Validation Failed" without knowing which fields are invalid
- **Files:** `src/main/java/com/sba301/retailmanagement/exception/GlobalException.java`
- **Trigger:** Submitting invalid form data
- **Workaround:** Check browser console for error details

### Backend Compilation Issues
- **Symptoms:** Multiple LSP errors in IDE indicating missing getters/setters
- **Files:** Multiple entity and DTO classes
- **Root Cause:** Entities likely missing Lombok annotations or not compiled
- **Impact:** Backend may fail to compile
- **Workaround:** Run `mvn compile` to verify compilation status

---

## Missing Critical Features

### User Authentication System
- **Problem:** No login/logout functionality on backend
- **Blocks:** User-specific operations, audit trail, access control
- **Priority:** Critical

### Role-Based Access Control (RBAC)
- **Problem:** No permission system to restrict access by role
- **Blocks:** Multi-tenant scenarios, admin vs staff workflows
- **Priority:** High

### API Rate Limiting
- **Problem:** No protection against API abuse
- **Blocks:** Production deployment
- **Priority:** Medium

### Request/Response Logging
- **Problem:** No centralized logging of API calls
- **Blocks:** Debugging production issues, audit requirements
- **Priority:** Medium

---

## Dependencies at Risk

### Spring Boot 3.2.1
- **Risk:** Older version, may have security vulnerabilities
- **Impact:** Known CVEs may affect this version
- **Migration plan:** Upgrade to latest Spring Boot 3.x LTS

### Gson Library
- **Risk:** Using Gson alongside Jackson (redundant)
- **Files:** `pom.xml` (lines 76-78)
- **Impact:** Configuration conflicts, larger bundle
- **Migration plan:** Remove Gson, use Jackson exclusively

### React 19
- **Risk:** Very new version, potential compatibility issues
- **Impact:** Third-party component compatibility
- **Migration plan:** Monitor, consider React 18.x for stability

---

## Fragile Areas

### InventoryServiceImpl (519 lines)
- **Files:** `src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java`
- **Why fragile:** Largest service class, handles complex business logic (imports, exports, transfers)
- **Safe modification:** Add unit tests before any changes
- **Test coverage:** None - very risky to modify

### CommonUtils (173 lines)
- **Files:** `src/main/java/com/sba301/retailmanagement/utils/CommonUtils.java`
- **Why fragile:** Static utility methods used everywhere, changes affect entire codebase
- **Safe modification:** Add deprecation notices before removing methods

### Frontend axiosClient
- **Files:** `RetailChainUi/src/services/api/axiosClient.js`
- **Why fragile:** Central error handling, token management - any bug affects all API calls
- **Safe modification:** Test thoroughly with mock API responses

---

## Scaling Limits

### Database
- **Current capacity:** Single MySQL instance, no read replicas
- **Limit:** Vertical scaling only
- **Scaling path:** Add read replicas, implement connection pooling (HikariCP)

### API
- **Current capacity:** Single Tomcat instance
- **Limit:** Single point of failure
- **Scaling path:** Containerize with Docker, add load balancer

### Frontend Build
- **Current:** Vite build, no code splitting beyond lazy routes
- **Limit:** Bundle size may grow with more pages
- **Scaling path:** Add dynamic imports for more routes

---

## Test Coverage Gaps

| Untested Area | Files | Risk | Priority |
|--------------|-------|------|----------|
| Inventory operations | InventoryServiceImpl | Data corruption | High |
| Warehouse CRUD | WarehouseServiceImpl | Lost inventory | High |
| Store management | StoreServiceImpl | Data inconsistency | High |
| API controllers | All controllers | Broken endpoints | High |
| React forms | All form components | User input errors | Medium |
| Navigation | App.jsx, routes | Broken flows | Medium |
| API services | All .service.js | Wrong API calls | Medium |

---

*Concerns audit: 2026-02-26*
