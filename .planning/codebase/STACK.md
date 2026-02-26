# Technology Stack

**Analysis Date:** 2026-02-26

## Languages

**Primary (Backend):**
- Java 17 - Spring Boot backend API

**Primary (Frontend):**
- JavaScript (ES2022) - React 19 SPA
- JSX - Component syntax

## Runtime

**Backend:**
- JVM 17 - Java 17 runtime
- Maven 3.x - Build tool

**Frontend:**
- Node.js (via Vite)
- Vite 7.2.4 - Build/dev server

**Package Manager:**
- npm - Frontend dependencies (package-lock.json present)
- Maven - Backend dependencies

## Frameworks

**Backend (Spring Boot 3.2.1):**
- `spring-boot-starter-web` - REST API
- `spring-boot-starter-data-jpa` - ORM/JPA
- `spring-boot-starter-validation` - Bean validation
- `spring-boot-starter-mail` - Email support
- `spring-boot-starter-data-jdbc` - JDBC support

**Frontend:**
- React 19.2.0 - UI framework
- React Router DOM 7.11.0 - Client-side routing
- Tailwind CSS 4.1.18 - Utility-first CSS
- shadcn/ui (Radix primitives) - UI component library

**Testing (Backend):**
- `spring-boot-starter-test` - JUnit, Mockito

**Build/Dev:**
- Vite 7.2.4 - Frontend bundler
- @vitejs/plugin-react-swc 4.2.2 - React Fast Refresh
- ESLint 9.39.1 - Linting

## Key Dependencies

**Backend Critical:**
- `mysql-connector-j` - MySQL JDBC driver
- `lombok` 1.18.30 - Code generation
- `gson` - JSON serialization
- `jackson-annotations` - JSON processing
- `springdoc-openapi-starter-webmvc-ui` 2.3.0 - OpenAPI/Swagger documentation

**Frontend UI:**
- `@radix-ui/*` (various) - Accessible UI primitives
- `lucide-react` 0.562.0 - Icons
- `tailwindcss-animate` - Animation utilities
- `@tanstack/react-table` 8.21.3 - Data tables

**Frontend Data:**
- `axios` 1.13.2 - HTTP client
- `date-fns` 4.1.0 - Date utilities
- `leaflet` 1.9.4 - Maps
- `react-leaflet` 5.0.0 - React Map integration

## Configuration

**Backend:**
- `application.properties` - Spring Boot configuration
- Database: MySQL via JDBC
- Port: 8080, Context path: `/retail-chain`
- JPA: Hibernate with MySQL dialect, auto-ddl update

**Frontend:**
- `vite.config.js` - Vite configuration with path aliases (`@/` → `./src`)
- React 19 with JSX transform (no React import needed)

**Environment Variables:**
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` - Database config
- `APP_BASE_URL` - API base URL for Swagger

## Platform Requirements

**Development:**
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

**Production:**
- Standard WAR/JAR deployment for Spring Boot
- Static file hosting for React build output

---

*Stack analysis: 2026-02-26*
