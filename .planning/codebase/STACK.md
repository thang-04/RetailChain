# Technology Stack

**Analysis Date:** 2026-03-09

## Languages

**Primary:**
- Java 21 - Backend API development, Spring Boot framework

**Secondary:**
- JavaScript (ES2022) - Frontend React components
- JSX - React component syntax

## Runtime

**Environment:**
- Java Virtual Machine (JVM) 21 - Backend execution
- Node.js (implied by Vite) - Frontend development

**Package Manager:**
- Maven 3.x - Backend dependency management (pom.xml)
- npm - Frontend dependency management
- Lockfile: `package-lock.json` (implied)

## Frameworks

**Core Backend:**
- Spring Boot 3.2.1 - Backend framework
  - Spring Web (REST APIs)
  - Spring Data JPA (Database ORM)
  - Spring Security (Authentication/Authorization)
  - Spring Validation (Input validation)

**Core Frontend:**
- React 19.2.0 - UI framework
- Vite 7.2.4 - Build tool and dev server
- React Router DOM v7.11.0 - Client-side routing
- Tailwind CSS 4.1.18 - Utility-first CSS framework
- shadcn/ui - Component library (built on Radix UI primitives)

**Testing:**
- JUnit (Spring Boot Test) - Backend unit testing
- Vitest - Frontend testing (not explicitly configured but compatible)
- ESLint 9.39.1 - Frontend linting

**Build/Dev:**
- @vitejs/plugin-react-swc 4.2.2 - Fast React HMR
- ESLint with React plugins - Code quality

## Key Dependencies

**Backend Critical:**
- Spring Boot Starters - Web, Data JPA, Security, Validation, Mail
- MySQL Connector J 8.x - Database driver
- Hibernate 6.x (via Spring Data JPA) - ORM
- JJWT 0.12.6 - JWT token generation/validation
- Lombok 1.18.30 - Code generation (getters/setters)
- Gson 2.10.1 - JSON serialization
- Jackson Annotations 2.16.x - JSON processing
- SpringDoc OpenAPI 2.3.0 - Swagger/OpenAPI documentation

**Frontend Critical:**
- axios 1.13.2 - HTTP client
- @radix-ui/* - Accessible UI component primitives
- lucide-react 0.562.0 - Icon library
- date-fns 4.1.0 - Date manipulation
- leaflet 1.9.4 + react-leaflet 5.0.0 - Map integration
- @tanstack/react-table 8.21.3 - Data table component
- sonner 2.0.7 - Toast notifications

## Configuration

**Environment:**
- Backend: `application.properties` with environment variables
  - DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD
  - APP_BASE_URL
  - JWT secret keys (hardcoded in properties)
- Frontend: `.env` file with VITE_API_URL

**Build:**
- Backend: `pom.xml` (Maven)
- Frontend: `vite.config.js`, `postcss.config.js`, `eslint.config.js`

**Backend Configuration Files:**
- `RetailChainService/src/main/resources/application.properties`

**Frontend Configuration Files:**
- `RetailChainUi/vite.config.js`
- `RetailChainUi/postcss.config.js`
- `RetailChainUi/eslint.config.js`
- `RetailChainUi/tailwind.config.js` (implied by Tailwind setup)

## Platform Requirements

**Development:**
- JDK 21+
- Node.js 18+
- MySQL 8.x running on localhost:3306
- Maven 3.8+

**Production:**
- Standard Java servlet container (embedded Tomcat in Spring Boot)
- MySQL 8.x database
- Node.js for frontend build (or pre-built static files)

---

*Stack analysis: 2026-03-09*
