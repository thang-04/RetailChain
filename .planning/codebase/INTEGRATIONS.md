# External Integrations

**Analysis Date:** 2026-02-26

## APIs & External Services

**Backend API:**
- Spring Boot REST API running on port 8080
- Context path: `/retail-chain`
- OpenAPI/Swagger documentation available at `/v3/api-docs`
- Swagger UI: `/swagger-ui.html` (configurable)

## Data Storage

**Database:**
- MySQL 8.0+
- Database name: `retail_chain`
- Connection: JDBC URL configured via environment variables
- Client: JPA/Hibernate ORM
- Connector: `mysql-connector-j`

**Environment Variables:**
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 3306)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

**ORM Configuration:**
- `spring.jpa.hibernate.ddl-auto=update` - Auto schema updates
- Hibernate dialect: `org.hibernate.dialect.MySQLDialect`

## Authentication & Identity

**Auth Approach:**
- Custom JWT-based authentication (implied from service structure)
- Session-based or token-based auth flow
- User entity with roles (`Role` entity exists)

**No external identity provider detected** - Internal user management.

## File Storage

**Local filesystem only** - No cloud storage integration detected.

## Email

**Email Support:**
- `spring-boot-starter-mail` included
- Not explicitly configured in `application.properties`
- Likely SMTP configuration needed for production

## Monitoring & Observability

**Error Tracking:**
- Not detected - No Sentry, Rollbar, or similar

**Logging:**
- Spring Boot logging via `logging.level.*` configuration
- `logging.level.org.springframework.core.env=DEBUG` enabled

**API Documentation:**
- SpringDoc OpenAPI integration
- Swagger UI available at `/swagger-ui.html`

## CI/CD & Deployment

**Hosting:**
- Not detected - Self-hosted deployment expected

**CI Pipeline:**
- Not detected in codebase

## Environment Configuration

**Required env vars:**
- `DB_USERNAME` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_HOST` - Database host (optional, default: localhost)
- `DB_PORT` - Database port (optional, default: 3306)
- `APP_BASE_URL` - API base URL (optional, default: http://localhost:8080/retail-chain)

**Secrets location:**
- Database credentials via environment variables
- No secrets files committed to repository

## Webhooks & Callbacks

**Incoming:**
- Not detected - No webhook endpoints configured

**Outgoing:**
- Not detected - No outgoing webhook integrations

## Database Schema (Entities)

The backend manages the following domain entities:
- `User` - User accounts
- `Role` - User roles
- `Store` - Retail store locations
- `Warehouse` - Warehouse facilities
- `StoreWarehouse` - Store-warehouse associations
- `Product` - Products
- `ProductCategory` - Product categories
- `ProductVariant` - Product variants (sizes, colors)
- `Supplier` - Supplier management
- `InventoryStock` - Current inventory levels
- `InventoryHistory` - Inventory changes
- `InventoryDocument` - Inventory documents
- `InventoryDocumentItem` - Document line items
- `Shift` - Work shifts
- `ShiftAssignment` - Employee shift assignments
- `AttendanceLog` - Employee attendance

---

*Integration audit: 2026-02-26*
