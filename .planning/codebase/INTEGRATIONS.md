# External Integrations

**Analysis Date:** 2026-03-09

## APIs & External Services

**Product/Inventory Management:**
- Internal REST API - Product, Inventory, Warehouse management
  - Endpoints: `/api/product/**`, `/api/inventory/**`, `/api/warehouse/**`
  - Implemented in: `RetailChainService/src/main/java/com/sba301/retailmanagement/controller/`

**Store Management:**
- Internal REST API - Store operations
  - Endpoints: `/api/store/**`

**Supplier Management:**
- Internal REST API - Supplier operations
  - Endpoints: `/api/supplier/**`

**User & Staff Management:**
- Internal REST API - User and staff operations
  - Endpoints: `/api/user/**`, `/api/staff/**`

**Role & Permission Management:**
- Internal REST API - Role-based access control
  - Endpoints: `/api/role/**`, `/api/permission/**`

**File Upload:**
- Internal multipart endpoint for image uploads
  - Endpoint: `/api/product/upload`
  - Returns: File URL (stored locally or cloud)

## Data Storage

**Databases:**
- MySQL 8.x
  - Database name: `retail_2`
  - Connection: `jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/retail_2`
  - Credentials: Via environment variables (DB_USERNAME, DB_PASSWORD)
  - ORM: Spring Data JPA with Hibernate
  - Client: MySQL Connector/J 8.x

**File Storage:**
- Local filesystem (for uploaded product images)
- No cloud storage service detected

**Caching:**
- None currently configured

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based authentication
  - Implementation: Spring Security with JJWT library
  - Token type: Bearer JWT
  - Password encoding: BCrypt
  - Access token expiration: 3600 seconds (1 hour)
  - Refresh token expiration: 604800 seconds (7 days)

**JWT Configuration:**
- Access token secret (application.properties):
  ```
  spring.security.jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970337336763979244226452948404D6351
  ```
- Refresh token secret (application.properties):
  ```
  spring.security.jwt.refresh-token-secret=782F413F4428472B4B6250655368566D597133743677397A24432646294A404E635266556A586E327235753877217A25432A462D4A614E645267556A586E3272
  ```

**Frontend Auth Flow:**
- Token stored in localStorage
- Auto-redirect to `/login` on 401
- Auto-redirect to `/403` on 403 Forbidden

## Monitoring & Observability

**Error Tracking:**
- Not configured (no Sentry, Bugsnag, etc.)

**Logs:**
- Spring Boot default logging
- Console output with DEBUG level for core env
- SQL logging enabled (spring.jpa.show-sql=true)

## CI/CD & Deployment

**Hosting:**
- Not detected (no Dockerfile, docker-compose, or cloud deployment configs)

**CI Pipeline:**
- Not configured (no GitHub Actions, Jenkins, etc.)

## Environment Configuration

**Required env vars (Backend):**
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 3306)
- `DB_USERNAME` - Database username (required)
- `DB_PASSWORD` - Database password (required)
- `APP_BASE_URL` - Application base URL (default: http://localhost:8080/retail-chain)

**Required env vars (Frontend):**
- `VITE_API_URL` - Backend API URL (default: http://localhost:8080/retail-chain)

**Secrets location:**
- Backend: Hardcoded in `application.properties` (JWT secrets)
- Database: Environment variables
- Frontend: `.env` file (VITE_API_URL)

## Webhooks & Callbacks

**Incoming:**
- None currently configured

**Outgoing:**
- None currently configured

## External CDN Resources

**Leaflet Map Tiles:**
- OpenStreetMap tiles: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- Marker icons: `https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/`

## CORS Configuration

**Allowed Origins:**
- `http://localhost:5173` (Vite default)
- `http://localhost:5174`
- `http://localhost:5175`

**Allowed Methods:**
- GET, POST, PUT, DELETE, OPTIONS, PATCH

**Allowed Headers:**
- Authorization, Content-Type, Accept, X-Requested-With

**Exposed Headers:**
- Authorization

---

*Integration audit: 2026-03-09*
