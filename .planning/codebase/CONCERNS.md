# Codebase Concerns

**Analysis Date:** 2026-03-09

## Tech Debt

### Hardcoded User ID in Inventory Service
- **Issue:** Inventory operations hardcode `createdBy(1L)` instead of extracting from SecurityContext
- **Files:** `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java` (lines 144, 213, 295, 374)
- **Impact:** All inventory documents are incorrectly attributed to user ID 1, breaking audit trail and accountability
- **Fix approach:** Inject `SecurityContextHolder.getContext().getAuthentication()` to get the actual authenticated user

### Hardcoded JWT Secrets
- **Issue:** JWT secret keys are hardcoded in `application.properties`
- **Files:** `RetailChainService/src/main/resources/application.properties` (lines 28, 31)
- **Impact:** Security vulnerability if config is committed to version control. Keys are readable in plaintext.
- **Fix approach:** Move secrets to environment variables with `.env` files, use proper secret management

### Mapper Methods Returning Null
- **Issue:** `StoreMapper` returns null in multiple mapping methods
- **Files:** `RetailChainService/src/main/java/com/sba301/retailmanagement/mapper/StoreMapper.java` (lines 15, 29, 41)
- **Impact:** Potential NullPointerException in consuming code
- **Fix approach:** Return empty objects or use Optional instead of null

### RuntimeException Usage
- **Issue:** Generic `RuntimeException` thrown instead of specific custom exceptions
- **Files:** Multiple service implementations (`InventoryServiceImpl.java:153` throws RuntimeException)
- **Impact:** Poor error handling, unclear error types, difficult to debug
- **Fix approach:** Create custom exceptions (e.g., `ProductNotFoundException`, `InsufficientStockException`)

### Frontend Console Logs
- **Issue:** Multiple `console.log` statements left in production code
- **Files:**
  - `RetailChainUi/src/services/staff.service.js` (lines 112, 119)
  - `RetailChainUi/src/pages/Product/ProductEditPage.jsx` (lines 75, 77, 92)
  - `RetailChainUi/src/pages/Product/ProductDetailPage.jsx` (lines 34, 41, 48)
  - `RetailChainUi/src/pages/Store/components/AddStoreModal.jsx` (lines 49, 69)
- **Impact:** Information leakage in browser console, performance overhead
- **Fix approach:** Remove all console.log statements or use proper logging library

## Known Bugs

### Missing User ID from Security Context
- **Symptoms:** All inventory documents show createdBy = 1 regardless of actual user
- **Files:** `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java`
- **Trigger:** Creating any inventory document (stock in, stock out, transfer)
- **Workaround:** None - this is a data integrity issue

### TODO in Staff Profile
- **Issue:** Comment indicates incomplete user fetch implementation
- **Files:** `RetailChainUi/src/pages/Staff/Profile/StaffProfile.jsx` (line 20)
- **Impact:** Potential data loading issues for staff profiles

## Security Considerations

### Hardcoded JWT Secrets in Properties File
- **Risk:** Secrets visible in plaintext configuration file
- **Files:** `RetailChainService/src/main/resources/application.properties`
- **Current mitigation:** None
- **Recommendations:**
  - Use environment variables: `${JWT_SECRET}` instead of plaintext
  - Integrate with secret management service (Vault, AWS Secrets Manager)
  - Rotate secrets regularly

### Register Endpoint Exposes Internal Errors
- **Risk:** Exception messages leaked to client on registration failure
- **Files:** `RetailChainService/src/main/java/com/sba301/retailmanagement/controller/AuthController.java` (line 42)
- **Current mitigation:** None
- **Recommendations:** Return generic error message, log detailed errors server-side

### No Rate Limiting on Auth Endpoints
- **Risk:** Brute force attacks on login/refresh token endpoints
- **Files:** `RetailChainService/src/main/java/com/sba301/retailmanagement/controller/AuthController.java`
- **Current mitigation:** None visible
- **Recommendations:** Implement rate limiting (e.g., Bucket4j, Resilience4j)

### No Input Validation on Some Endpoints
- **Risk:** SQL injection or malformed data
- **Files:** Various DTOs lack validation annotations
- **Current mitigation:** Some DTOs use `@Valid`, but not consistently
- **Recommendations:** Add validation annotations to all request DTOs

## Performance Bottlenecks

### N+1 Query Issues in Product Service
- **Problem:** `findAll()` called without pagination or fetch joins
- **Files:** `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/ProductServiceImpl.java` (lines 37, 39, 101)
- **Cause:** Loading all products and variants into memory
- **Improvement path:** Implement pagination, use `@EntityGraph` or `JOIN FETCH`

### Missing Pagination on List Endpoints
- **Problem:** Several endpoints return all records without pagination
- **Files:**
  - `PermissionServiceImpl.java` (line 26) - findAll permissions
  - `RoleServiceImpl.java` (line 34) - findAll roles
- **Cause:** Will cause memory issues with large datasets
- **Improvement path:** Add Pageable support to repository and service methods

### Unoptimized Store Queries
- **Problem:** Multiple findById calls in loops
- **Files:** `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/StoreServiceImpl.java`
- **Improvement path:** Use batch queries or JOIN FETCH

## Fragile Areas

### Inventory Service Complex Transaction Logic
- **Files:** `RetailChainService/src/main/java/com/sba301/retailmanagement/service/impl/InventoryServiceImpl.java`
- **Why fragile:** Multiple nested operations in single transaction, no compensation logic for partial failures
- **Safe modification:** Add proper transaction rollback handling, consider saga pattern for multi-step operations
- **Test coverage:** No unit tests exist for this service

### Store Mapper with Null Returns
- **Files:** `RetailChainService/src/main/java/com/sba301/retailmanagement/mapper/StoreMapper.java`
- **Why fragile:** Returns null which will cause NPE in calling code
- **Safe modification:** Return empty objects or Optional
- **Test coverage:** No tests for mapper

### Null Handling in CommonUtils
- **Files:** `RetailChainService/src/main/java/com/sba301/retailmanagement/utils/CommonUtils.java`
- **Why fragile:** Multiple null returns without context
- **Safe modification:** Add null checks, use Optional

## Scaling Limits

### No Caching Layer
- **Current capacity:** Each request hits database directly
- **Limit:** Database connection pool exhaustion under high load
- **Scaling path:** Implement caching (Redis, Caffeine) for frequently accessed data (products, categories, permissions)

### In-Memory Data Seeding
- **Current capacity:** DataSeeder runs on every startup
- **Limit:** No data persistence strategy, potential data loss on restart
- **Scaling path:** Move to proper database migration tool (Flyway, Liquibase)

### No Database Connection Pool Monitoring
- **Current capacity:** Default HikariCP settings
- **Limit:** Under high load, may exhaust connections
- **Scaling path:** Configure proper pool size, add monitoring

### No Horizontal Scaling Support
- **Current capacity:** Single instance deployment
- **Limit:** Session management may not work across instances
- **Scaling path:** Implement sticky sessions or stateless authentication with distributed cache

## Dependencies at Risk

### Spring Boot 3.2.1
- **Risk:** Older minor version, potential CVEs
- **Impact:** Security vulnerabilities if not updated
- **Migration plan:** Upgrade to latest 3.x stable release

### JJWT 0.12.6
- **Risk:** Verify latest version for security patches
- **Impact:** Token signing vulnerabilities
- **Migration plan:** Check for newer versions, review changelog

### React 19
- **Risk:** Relatively new, potential compatibility issues with libraries
- **Impact:** Runtime errors, ecosystem compatibility
- **Migration plan:** Monitor library compatibility, consider React 18 if issues arise

### Tailwind CSS 4.x
- **Risk:** Major version with breaking changes
- **Impact:** Style inconsistencies, migration effort
- **Migration plan:** Review upgrade guide, test thoroughly

## Missing Critical Features

### Email Service Not Implemented
- **Problem:** `spring-boot-starter-mail` included but not used
- **Impact:** Cannot send password reset emails, notifications
- **Blocks:** Password recovery flow, order notifications

### No Audit Logging
- **Problem:** No comprehensive audit trail for data changes
- **Impact:** Compliance issues, difficult to debug changes
- **Blocks:** GDPR compliance, security investigations

### No API Versioning
- **Problem:** No mechanism to version APIs
- **Impact:** Cannot make breaking changes without affecting clients
- **Blocks:** Long-term API maintenance

### Frontend Error Boundary Missing
- **Problem:** No React error boundaries to catch render errors
- **Impact:** Single component error crashes entire app
- **Blocks:** Production stability

### No Request/Response Logging
- **Problem:** No centralized request/response logging
- **Impact:** Difficult to debug API issues in production
- **Blocks:** Production monitoring

## Test Coverage Gaps

### Backend Test Coverage
- **What's not tested:** All service layer business logic, repositories, controllers
- **Files:** Only `RetailChainServiceApplicationTests.java` exists with empty test
- **Risk:** Any refactoring could break functionality without detection
- **Priority:** High

### Frontend Test Coverage
- **What's not tested:** All React components, pages, services, hooks
- **Files:** No test files found in `RetailChainUi/src/`
- **Risk:** UI bugs undetected, regression on changes
- **Priority:** High

### No Integration Tests
- **What's not tested:** End-to-end API workflows, database transactions
- **Risk:** Integration issues between components
- **Priority:** Medium

### No Security Tests
- **What's not tested:** Authentication flows, authorization checks, JWT validation
- **Risk:** Security vulnerabilities undetected
- **Priority:** Critical

---

*Concerns audit: 2026-03-09*
