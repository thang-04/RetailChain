# Testing Patterns

**Analysis Date:** 2026-02-26

## Overview

This codebase has **minimal test coverage**. Both backend and frontend lack comprehensive testing infrastructure.

---

## Backend Testing (Java/Spring Boot)

### Test Framework

**Framework:** Spring Boot Test (JUnit 5)
- Version: `spring-boot-starter-test` (included in parent POM)
- JUnit 5 (`junit-jupiter`)

**Build Tool:** Maven

**Run Commands:**
```bash
mvn test                    # Run all tests
mvn test -Dtest=ClassName  # Run specific test class
mvn verify                 # Run tests with verification
```

### Test File Organization

**Location:** `src/test/java/com/sba301/retailmanagement/`

**Naming Convention:** `*Tests.java`

**Current Test Structure:**
```
src/test/java/com/sba301/retailmanagement/
└── RetailChainServiceApplicationTests.java  # Only test file
```

### Existing Test

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

**Assessment:** Only a basic Spring Context test exists. No unit tests, integration tests, or controller tests.

### Test Configuration

**Annotations Used:**
- `@SpringBootTest` - Loads full application context
- `@Test` - JUnit 5 test marker

**Missing Configuration:**
- No `@DataJpaTest` for repository tests
- No `@WebMvcTest` for controller tests
- No `@MockBean` for service mocking
- No Testcontainers configuration
- No database seeding/fixtures

### Patterns to Implement

**Repository Test:**
```java
@DataJpaTest
class WarehouseRepositoryTests {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private WarehouseRepository warehouseRepository;
    
    @Test
    void findByCode_shouldReturnWarehouse() {
        // Arrange
        Warehouse warehouse = new Warehouse();
        warehouse.setCode("WH001");
        warehouse.setName("Test Warehouse");
        entityManager.persist(warehouse);
        entityManager.flush();
        
        // Act
        Optional<Warehouse> found = warehouseRepository.findByCode("WH001");
        
        // Assert
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Test Warehouse");
    }
}
```

**Service Test:**
```java
@ExtendWith(MockitoExtension.class)
class InventoryServiceImplTests {
    
    @Mock
    private WarehouseRepository warehouseRepository;
    
    @InjectMocks
    private InventoryServiceImpl inventoryService;
    
    @Test
    void createWarehouse_shouldThrowException_whenCodeExists() {
        // Arrange
        WarehouseRequest request = new WarehouseRequest();
        request.setCode("WH001");
        
        when(warehouseRepository.existsByCode("WH001")).thenReturn(true);
        
        // Act & Assert
        assertThatThrownBy(() -> inventoryService.createWarehouse(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("already exists");
    }
}
```

**Controller Test:**
```java
@WebMvcTest(InventoryController.class)
class InventoryControllerTests {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private InventoryService inventoryService;
    
    @Test
    void getStockByWarehouse_shouldReturn200() throws Exception {
        // Arrange
        when(inventoryService.getStockByWarehouse(1L))
                .thenReturn(List.of());
        
        // Act & Assert
        mockMvc.perform(get("/api/inventory/stock/1"))
                .andExpect(status().isOk());
    }
}
```

### Recommended Test Dependencies

Add to `pom.xml`:
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

---

## Frontend Testing (React)

### Test Framework

**Status:** Not configured

**Current State:**
- No test runner (Jest/Vitest)
- No test files found (`*.test.jsx`, `*.spec.jsx`)
- No assertion library
- No testing utilities

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

**Missing:**
- No `test` script
- No `test:watch` script
- No `coverage` script

### Test File Organization

**Expected Location:** `src/` or `__tests__/` directories

**Not Found:**
- `src/**/*.test.jsx`
- `src/**/*.spec.jsx`
- `__tests__/`

### Patterns to Implement

**Setup Vitest:**
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

**Configuration (vite.config.js):**
```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
```

**Component Test:**
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InventoryPage from './InventoryPage';

describe('InventoryPage', () => {
  it('should render loading state', () => {
    render(<InventoryPage />);
    expect(screen.getByText('Đang tải lịch sử tồn kho...')).toBeInTheDocument();
  });

  it('should render error message', () => {
    render(<InventoryPage />);
    // After setting error state
    expect(screen.getByText('Không tải được dữ liệu')).toBeInTheDocument();
  });
});
```

**Service Test:**
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import inventoryService from '../services/inventory.service';

vi.mock('./api/axiosClient', () => ({
  axiosPrivate: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('inventoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call getStockByWarehouse with correct URL', async () => {
    const { axiosPrivate } = await import('./api/axiosClient');
    await inventoryService.getStockByWarehouse(1);
    expect(axiosPrivate.get).toHaveBeenCalledWith('/inventory/stock/1');
  });
});
```

### Package.json Additions

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/react": "^14.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "jsdom": "^23.0.0",
    "vitest": "^1.0.0"
  }
}
```

---

## Test Coverage Gaps

### Backend Gaps

| Area | Current | Recommended |
|------|---------|-------------|
| Repository | 0 tests | 15+ tests |
| Service | 0 tests | 20+ tests |
| Controller | 0 tests | 15+ tests |
| Integration | 1 test | 10+ tests |
| Exception Handling | 0 tests | 5+ tests |

### Frontend Gaps

| Area | Current | Recommended |
|------|---------|-------------|
| Components | 0 tests | 30+ tests |
| Services | 0 tests | 15+ tests |
| Hooks | 0 tests | 10+ tests |
| Pages | 0 tests | 15+ tests |

### Priority Recommendations

1. **High Priority:**
   - Backend: `InventoryServiceImpl` - Complex business logic
   - Frontend: `inventory.service.js` - API calls

2. **Medium Priority:**
   - Backend: Repository CRUD operations
   - Frontend: Form components and validation

3. **Lower Priority:**
   - Integration tests (require database setup)
   - E2E tests (require separate framework)

---

## Test Data & Fixtures

### Backend

**Fixtures Location:** Not established

**Pattern to Implement:**
```java
class Fixtures {
    public static Warehouse createWarehouse(String code) {
        Warehouse warehouse = new Warehouse();
        warehouse.setCode(code);
        warehouse.setName("Test " + code);
        warehouse.setStatus(1);
        warehouse.setCreatedAt(LocalDateTime.now());
        warehouse.setUpdatedAt(LocalDateTime.now());
        return warehouse;
    }
}
```

### Frontend

**Mock Location:** Not established

**Pattern to Implement:**
```javascript
// src/test/__mocks__/inventory.service.js
export const mockInventoryData = [
  {
    id: 1,
    code: 'WH001',
    name: 'Kho Tổng',
    quantity: 100,
  },
];

export default {
  getStockByWarehouse: vi.fn().mockResolvedValue(mockInventoryData),
  createWarehouse: vi.fn().mockResolvedValue({ id: 1 }),
};
```

---

## CI/CD Integration

**Current:** No CI pipeline detected

**Recommended GitHub Actions:**
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Backend Tests
        run: mvn test
      - name: Frontend Tests
        run: npm test
```

---

*Testing analysis: 2026-02-26*
