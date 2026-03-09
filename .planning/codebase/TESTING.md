# Testing Patterns

**Analysis Date:** 2026-03-09

## Test Framework

### Backend (Java/Spring Boot)

**Runner:**
- Framework: JUnit 5 (via Spring Boot Starter Test)
- Version: Spring Boot 3.2.1 includes JUnit 5 (Jupiter)
- Configuration: Default Maven test configuration

**Additional Test Dependencies:**
- `spring-boot-starter-test` - Includes JUnit, Mockito, AssertJ
- `spring-security-test` - For security testing

**Run Commands:**
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=RetailChainServiceApplicationTests

# Run with coverage (requires plugin configuration)
mvn test -DskipTests=false
```

### Frontend (React)

**Runner:**
- Framework: Not currently configured
- Status: No test framework installed (Vitest/Jest not in package.json)

**Coverage:**
- No coverage tool configured

## Test File Organization

### Backend

**Location:**
- `RetailChainService/src/test/java/com/sba301/retailmanagement/`

**Naming:**
- Test classes: `<ClassName>Tests.java`
- Single test file: `RetailChainServiceApplicationTests.java`

**Structure:**
```
src/test/java/com/sba301/retailmanagement/
└── RetailChainServiceApplicationTests.java
```

### Frontend

**Location:**
- Not applicable (no tests currently)

**Naming:**
- Not applicable

**Structure:**
- Not applicable

## Test Structure

### Backend Test Example

The only test file in the codebase demonstrates Spring Boot context loading:

```java
package com.sba301.retailmanagement;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RetailChainServiceApplicationTests {

    @Test
    void contextLoads() {
    }

}
```

**Observations:**
- Uses `@SpringBootTest` for integration testing
- Test method named after functionality (`contextLoads`)
- No assertions in this basic test
- No unit tests for services/controllers

## Mocking

### Backend

**Framework:**
- Mockito (included in spring-boot-starter-test)
- Spring's testing utilities

**Patterns Observed:**
- Not explicitly used in existing tests (only context loading test exists)
- Would follow standard Spring Boot testing patterns:

**Expected Patterns (based on dependencies):**
```java
// Repository mocking
@Mock
private WarehouseRepository warehouseRepository;

// Service injection
@InjectMocks
private InventoryServiceImpl inventoryService;

// Mock behavior
when(warehouseRepository.findById(1L)).thenReturn(Optional.of(warehouse));
```

### Frontend

**Framework:**
- Not applicable (no tests configured)

**Mock Data:**
- Mock data exists inline in components for development:
```javascript
// Example from ProductPage.jsx
const MOCK_PRODUCTS = [
  { id: 1, code: "FA001", name: "Áo Phông Basic", categoryId: 2, ... },
  { id: 2, code: "FA002", name: "Quần Jeans Slim", categoryId: 3, ... },
];
```

## Fixtures and Factories

### Backend

**Test Data:**
- No dedicated test fixtures or factories
- Would use inline entity creation or builders

**Example Pattern (from code analysis):**
```java
Warehouse warehouse = new Warehouse();
warehouse.setCode("WH001");
warehouse.setName("Central Warehouse");
// ... setters
```

### Frontend

**Test Data:**
- Mock data defined inline in components
- Used for offline development and fallback when backend unavailable
- Examples in `ProductPage.jsx`, `LoginPage.jsx`

## Coverage

### Backend

**Requirements:** None enforced

**Current Coverage:** Minimal - only context loading test exists

**View Coverage:**
```bash
# Not configured - would require jacoco or similar plugin
mvn jacoco:report
```

### Frontend

**Requirements:** None

**Status:** No tests written

## Test Types

### Backend

**Unit Tests:**
- Not currently implemented
- Would test Service layer methods in isolation

**Integration Tests:**
- Basic `@SpringBootTest` exists (context loading)
- No REST controller tests
- No database integration tests

**E2E Tests:**
- Not configured
- Manual testing via curl/Postman described in CLAUDE.md

### Frontend

**Unit Tests:**
- Not configured
- Not applicable

**Integration Tests:**
- Not configured
- Not applicable

**E2E Tests:**
- Not configured
- Not applicable

## Common Patterns (To Be Implemented)

### Backend - Service Testing Pattern (Expected)

```java
@ExtendWith(MockitoExtension.class)
class InventoryServiceImplTest {

    @Mock
    private WarehouseRepository warehouseRepository;

    @InjectMocks
    private InventoryServiceImpl inventoryService;

    @Test
    void createWarehouse_ShouldReturnWarehouseResponse() {
        // Arrange
        WarehouseRequest request = new WarehouseRequest();
        request.setCode("WH001");
        request.setName("Test Warehouse");

        Warehouse savedWarehouse = new Warehouse();
        savedWarehouse.setId(1L);
        savedWarehouse.setCode("WH001");
        savedWarehouse.setName("Test Warehouse");

        when(warehouseRepository.existsByCode("WH001")).thenReturn(false);
        when(warehouseRepository.save(any(Warehouse.class))).thenReturn(savedWarehouse);

        // Act
        WarehouseResponse response = inventoryService.createWarehouse(request);

        // Assert
        assertNotNull(response);
        assertEquals("WH001", response.getCode());
    }
}
```

### Backend - Controller Testing Pattern (Expected)

```java
@WebMvcTest(WarehouseController.class)
class WarehouseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WarehouseService warehouseService;

    @Test
    void getAllWarehouses_ShouldReturnList() throws Exception {
        when(warehouseService.getAllWarehouses()).thenReturn(List.of());

        mockMvc.perform(get("/api/warehouses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }
}
```

### Frontend - Component Testing Pattern (Not Implemented)

When Vitest/Jest is added, expected pattern:
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('LoginPage', () => {
  it('should render login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Email')).toBeDefined();
  });
});
```

## Backend Testing Best Practices (From CLAUDE.md)

Per the project documentation in CLAUDE.md, backend testing uses curl for API verification:

1. **Start Spring Boot server** before testing
2. **Use curl for API testing:**
```bash
# Example from documentation
curl -X POST http://localhost:8080/api/warehouse -H "Content-Type: application/json" -d '{"code":"WH001","name":"Test"}'
```
3. **Verify with MySQL tools** to confirm data persistence
4. **Restart server** after code changes for Gson/serialization fixes

---

*Testing analysis: 2026-03-09*
