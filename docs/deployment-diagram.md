# RetailChain Deployment Diagram

## Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                      RETAILCHAIN DEPLOYMENT ARCHITECTURE                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

                                                            ┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
                                                            │                                    CI/CD PIPELINE                                                                          │
                                                            │   ┌──────────┐    ┌────────────┐    ┌───────────┐    ┌─────────────┐    ┌────────────┐    ┌────────────┐                   │
                                                            │   │  Commit  │───▶│  Build     │───▶│  Test     │───▶│  Security  │───▶│  Deploy    │───▶│  Verify    │                   │
                                                            │   │  Code    │    │  (Maven)  │    │  (JUnit)  │    │  (SonarQ)  │    │  (Docker)  │    │  (Health)  │                   │
                                                            │   └──────────┘    └────────────┘    └───────────┘    └─────────────┘    └────────────┘    └────────────┘                   │
                                                            └─────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                    │                           │                            │
                                                                    │ Build Artifacts           │ Build Artifacts           │
                                                                    ▼                           ▼                            ▼
                                    ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
                                    │                              DEVELOPMENT ENVIRONMENT (Local)                                                        │
                                    │   ┌───────────────────────────────────────────────┐    ┌─────────────────────────────────────────┐   │
                                    │   │              FRONTEND DEV                   │    │           BACKEND DEV                   │   │
                                    │   │                                               │    │                                         │   │
                                    │   │  ┌─────────────────────────────────────┐    │    │  ┌─────────────────────────────────┐ │   │
                                    │   │  │ $ npm run dev                       │    │    │  │ $ ./mvnw spring-boot:run       │ │   │
                                    │   │  │                                     │    │    │  │                                 │ │   │
                                    │   │  │  React 19 + Vite 7 (HMR)           │    │    │  │  Spring Boot 3.x + Java 17      │ │   │
                                    │   │  │  Port: 5173                        │    │    │  │  Port: 8080                      │ │   │
                                    │   │  │                                     │    │    │  │  Context: /retail-chain          │ │   │
                                    │   │  │  Tailwind CSS 4 + shadcn/ui         │    │    │  │                                 │ │   │
                                    │   │  │  Hot Module Replacement             │    │    │  │  JPA/Hibernate + MySQL Driver   │ │   │
                                    │   │  │                                     │    │    │  │                                 │ │   │
                                    │   │  └─────────────────────────────────────┘    │    │  │  Swagger/OpenAPI Enabled        │ │   │
                                    │   │                   │                          │    │  └─────────────────────────────────┘ │   │
                                    │   │                   │  Source Code             │    │                │                        │   │
                                    │   │                   ▼                          │    │                │ JDBC                    │   │
                                    │   │  ┌─────────────────────────────────────┐    │    │                ▼                        │   │
                                    │   │  │ $ npm run build                     │    │    │  ┌─────────────────────────────────┐ │   │
                                    │   │  │                                     │    │    │  │     LOCAL MYSQL (Docker)         │ │   │
                                    │   │  │  Output: dist/ (static files)       │    │    │  │     Port: 3306                   │ │   │
                                    │   │  │  - index.html                       │    │    │  │     Database: retail_chain      │ │   │
                                    │   │  │  - /assets (JS, CSS, fonts)         │    │    │  │                                 │ │   │
                                    │   │  │  - /images                         │    │    │  └─────────────────────────────────┘ │   │
                                    │   │  └─────────────────────────────────────┘    │    │                                         │   │
                                    │   └───────────────────────────────────────────────┘    └─────────────────────────────────────────┘   │
                                    │                                                      │
                                    │                                    ┌────────────────────────────────────────────────────────────────────────────┐
                                    │                                    │                            PRODUCTION ENVIRONMENT                                               │
                                    │                                    │                                                                                      │
                                    │                                    │    ┌──────────────────────────────────────────────────────────────────────────┐  │
                                    │                                    │    │                         CDN + STATIC HOSTING (Frontend)                            │  │
                                    │                                    │    │                                                                                  │  │
                                    │                                    │    │    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │  │
                                    │                                    │    │    │   Vercel    │    │  Netlify   │    │ AWS S3 +    │    │   Custom    │   │  │
                                    │                                    │    │    │  (Recommended│    │            │    │ CloudFront  │    │   Nginx     │   │  │
                                    │                                    │    │    │   for React)│    │            │    │             │    │   Server    │   │  │
                                    │                                    │    │    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘   │  │
                                    │                                    │    │         │               │               │               │              │  │
                                    │                                    │    │         └───────────────┴───────────────┴───────────────┴──────────────┘  │
                                    │                                    │    │                                  │                                             │  │
                                    │                                    │    │                                  │ Static Assets (SPA)                         │  │
                                    │                                    │    │                                  │ /, /products, /stores/*                     │  │
                                    │                                    │    └──────────────────────────────────┼────────────────────────────────────────────┘  │
                                    │                                    │                                       │                                                │
                                    │                                    │                                       │ HTTPS 443 / HTTP 80                         │
                                    │                                    │                                       ▼                                                │
                                    │                                    │    ┌──────────────────────────────────────────────────────────────────────────┐  │
                                    │                                    │    │                    LOAD BALANCER / REVERSE PROXY (Nginx)                     │  │
                                    │                                    │    │                                                                                  │  │
                                    │                                    │    │    ┌────────────────────────────────────────────────────────────────────┐  │  │
                                    │                                    │    │    │                        nginx.conf                                      │  │  │
                                    │                                    │    │    │                                                                         │  │  │
                                    │                                    │    │    │  server {                                                              │  │  │
                                    │                                    │    │    │      listen 443 ssl http2;                                             │  │  │
                                    │                                    │    │    │      server_name retailchain.example.com;                            │  │  │
                                    │                                    │    │    │                                                                         │  │  │
                                    │                                    │    │    │      # Frontend SPA (from CDN/Storage)                                │  │  │
                                    │                                    │    │    │      location / {                                                      │  │  │
                                    │                                    │    │    │          try_files $uri $uri/ /index.html;                            │  │  │
                                    │                                    │    │    │          root /var/www/html;                                          │  │  │
                                    │                                    │    │    │      }                                                                  │  │  │
                                    │                                    │    │    │                                                                         │  │  │
                                    │                                    │    │    │      # Backend API                                                     │  │  │
                                    │                                    │    │    │      location /retail-chain/ {                                          │  │  │
                                    │                                    │    │    │          proxy_pass http://backend:8080/retail-chain/;                │  │  │
                                    │                                    │    │    │          proxy_set_header Host $host;                                │  │  │
                                    │                                    │    │    │          proxy_set_header X-Real-IP $remote_addr;                    │  │  │
                                    │                                    │    │    │          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;│  │  │
                                    │                                    │    │    │      }                                                                  │  │  │
                                    │                                    │    │    │                                                                         │  │  │
                                    │                                    │    │    │      # Static uploads                                                 │  │  │
                                    │                                    │    │    │      location /uploads/ {                                             │  │  │
                                    │                                    │    │    │          alias /var/uploads/;                                         │  │  │
                                    │                                    │    │    │      }                                                                  │  │  │
                                    │                                    │    │    │  }                                                                      │  │  │
                                    │                                    │    │    └────────────────────────────────────────────────────────────────────┘  │  │
                                    │                                    │    └──────────────────────────────────────────────────────────────────────────┘  │
                                    │                                    │                                       │                                                │
                                    │                                    │                    ┌─────────────────────┼─────────────────────────┐                    │
                                    │                                    │                    │                     │                         │                    │
                                    │                                    │                    │                     ▼                         ▼                    │
                                    │                                    │                    │    ┌─────────────────────────────────────────────────────────────┐  │
                                    │                                    │                    │    │              APPLICATION TIER (Docker/K8s)                        │  │
                                    │                                    │                    │    │                                                              │  │
                                    │                                    │                    │    │    ┌─────────────────────┐      ┌─────────────────────┐    │  │
                                    │                                    │                    │    │    │   Backend Instance 1│      │   Backend Instance 2│    │  │
                                    │                                    │                    │    │    │   (Spring Boot)    │      │   (Spring Boot)    │    │  │
                                    │                                    │                    │    │    │   ┌─────────────┐   │      │   ┌─────────────┐   │    │  │
                                    │                                    │                    │    │    │   │ Tomcat      │   │      │   │ Tomcat      │   │    │  │
                                    │                                    │                    │    │    │   │ Embedded    │   │      │   │ Embedded    │   │    │  │
                                    │                                    │                    │    │    │   │ Port: 8080 │   │      │   │ Port: 8080 │   │    │  │
                                    │                                    │                    │    │    │   └─────────────┘   │      │   └─────────────┘   │    │  │
                                    │                                    │                    │    │    └─────────────────────┘      └─────────────────────┘    │  │
                                    │                                    │                    │    │                   │                         │                    │  │
                                    │                                    │                    │    │                   └────────────┬────────────────┘                    │  │
                                    │                                    │                    │    │                                │                              │  │
                                    │                                    │                    │    │                    ┌─────────▼─────────┐                    │  │
                                    │                                    │                    │    │                    │  Service Discovery │                    │  │
                                    │                                    │                    │    │                    │  (Kubernetes/Ingress)│                    │  │
                                    │                                    │                    │    └────────────────────┴─────────────────────┘                    │  │
                                    │                                    │    └─────────────────────────────────────────────────────────────────────────────┘  │
                                    │                                    │                                       │                                               │
                                    │                                    │                                       │ JDBC / Internal Network                       │
                                    │                                    │                                       ▼                                               │
                                    │                                    │    ┌─────────────────────────────────────────────────────────────────────────────┐  │
                                    │                                    │    │                         DATABASE TIER                                           │  │
                                    │                                    │    │                                                                                 │  │
                                    │                                    │    │    ┌─────────────────────────────────────────────────────────────┐              │  │
                                    │                                    │    │    │                    MySQL 8.0+ Cluster                              │              │  │
                                    │                                    │    │    │                  (InnoDB + Replication)                        │              │  │
                                    │                                    │    │    │                                                             │              │  │
                                    │                                    │    │    │   ┌────────────┐     ┌────────────┐     ┌────────────┐    │              │  │
                                    │                                    │    │    │   │   Primary   │◄────│   Replica  │◄────│   Replica  │    │              │  │
                                    │                                    │    │    │   │   (Write)  │     │   (Read)   │     │   (Read)   │    │              │  │
                                    │                                    │    │    │   └─────┬──────┘     └──────┬─────┘     └──────┬─────┘    │              │  │
                                    │                                    │    │    │         │                 │               │           │              │  │
                                    │                                    │    │    │         └─────────────────┼───────────────┘           │              │  │
                                    │                                    │    │    │                           │                           │              │  │
                                    │                                    │    │    │              ┌────────────▼────────────┐               │              │  │
                                    │                                    │    │    │              │   Binlog Replication   │               │              │  │
                                    │                                    │    │    │              │   (Async/Semi-sync)    │               │              │  │
                                    │                                    │    │    │              └─────────────────────────┘               │              │  │
                                    │                                    │    │    │                                                             │              │  │
                                    │                                    │    │    │  ┌────────────────────────────────────────────────────────┐ │              │  │
                                    │                                    │    │    │  │  DATABASE: retail_chain                                │ │              │  │
                                    │                                    │    │    │  │  - 24 tables: users, roles, stores, warehouses          │ │              │  │
                                    │                                    │    │    │  │  - products, product_variants, inventory_*               │ │              │  │
                                    │                                    │    │    │  │  - shifts, attendance_logs, stock_request               │ │              │  │
                                    │                                    │    │    │  │  Collation: utf8mb4_0900_ai_ci                        │ │              │  │
                                    │                                    │    │    │  └────────────────────────────────────────────────────────┘ │              │  │
                                    │                                    │    │    └─────────────────────────────────────────────────────────────┘              │  │
                                    │                                    │    │                                                                                 │  │
                                    │                                    │    │    ┌─────────────────────────────────────────────────────────────┐              │  │
                                    │                                    │    │    │              BACKUP STORAGE                                    │              │  │
                                    │                                    │    │    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │              │  │
                                    │                                    │    │    │  │   Daily     │  │   Weekly    │  │   Monthly   │  │              │  │
                                    │                                    │    │    │  │   Backup    │  │   Backup    │  │   Backup    │  │              │  │
                                    │                                    │    │    │  │ (mysqldump)│  │ (mysqldump) │  │ (mysqldump) │  │              │  │
                                    │                                    │    │    │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │              │  │
                                    │                                    │    │    │         │                │                │         │              │  │
                                    │                                    │    │    │         └────────────────┴────────────────┴─────────┘         │              │  │
                                    │                                    │    │    │                          │                                  │              │  │
                                    │                                    │    │    │                   ┌─────▼─────┐                            │              │  │
                                    │                                    │    │    │                   │   S3 /    │                            │              │  │
                                    │                                    │    │    │                   │   Local   │                            │              │  │
                                    │                                    │    │    │                   │  Storage  │                            │              │  │
                                    │                                    │    │    │                   └───────────┘                            │              │  │
                                    │                                    │    │    └─────────────────────────────────────────────────────────────┘              │  │
                                    │                                    │    └─────────────────────────────────────────────────────────────────────────────────┘  │
                                    └────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                      │
                                                                      │ HTTPS 443
                                                                      ▼
                                    ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
                                    │                                 USER DEVICES                                                                │
                                    │    ┌──────────┐    ┌───────────┐    ┌──────────┐    ┌───────────┐    ┌───────────┐    ┌──────────┐          │
                                    │    │  Desktop │    │  Tablet  │    │ Mobile   │    │  Mobile   │    │    PWA   │    │  API    │          │
                                    │    │  Browser │    │  Browser │    │ Browser  │    │   App     │    │  (Install)│    │ Client  │          │
                                    │    │  (SPA)  │    │   (SPA)  │    │   (SPA)  │    │           │    │           │    │(curl)   │          │
                                    │    └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘          │
                                    └─────────┼──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────────┘
                                                                     │              │              │              │              │
                                                                     │ HTTPS 443   │ HTTPS 443   │ HTTPS 443   │ HTTPS 443   │
                                                                     └──────────────┴──────────────┴──────────────┴──────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    COMPONENT DETAILS                                                                                                                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (RetailChainUi)                 │
├──────────────────────────────────────────────────────────────┤
│  Framework:      React 19 + Vite 7 (Build Tool)            │
│  Styling:        Tailwind CSS 4 + shadcn/ui                │
│  Routing:        React Router DOM v7                        │
│  State:          React Context API                          │
│  HTTP:           Axios                                      │
│  Ports:          5173 (dev), 4173 (preview)               │
│  Output:         Static files (dist/)                       │
│                                                              │
│  Build:                                                     │
│  $ npm install                                              │
│  $ npm run build                                            │
│                                                              │
│  Output Structure:                                          │
│  dist/                                                      │
│  ├── index.html                                             │
│  ├── assets/                                                │
│  │   ├── index-[hash].js                                    │
│  │   ├── index-[hash].css                                    │
│  │   └── [name]-[hash].[ext]                                │
│  └── images/                                                │
│                                                              │
│  Environment Variables (.env):                              │
│  VITE_API_URL=http://localhost:8080/retail-chain            │
│  VITE_APP_TITLE=RetailChain                                 │
│                                                              │
│  Key Dependencies:                                           │
│  - @radix-ui/* (UI components)                              │
│  - react-router-dom                                          │
│  - axios, date-fns, leaflet, react-leaflet                   │
│  - xlsx (Excel export)                                       │
│  - sonner (toast notifications)                             │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    BACKEND (RetailChainService)              │
├──────────────────────────────────────────────────────────────┤
│  Framework:      Spring Boot 3.x                            │
│  Language:       Java 17                                    │
│  ORM:            JPA / Hibernate                            │
│  Database:       MySQL 8.0+ (InnoDB)                       │
│  Security:       Spring Security + JWT                      │
│  API Docs:       SpringDoc OpenAPI / Swagger               │
│  Port:           8080                                       │
│  Context:        /retail-chain                              │
│                                                              │
│  Build:                                                     │
│  $ ./mvnw clean package -DskipTests                          │
│                                                              │
│  Run:                                                         │
│  $ java -jar target/RetailChainService-*.jar                │
│                                                              │
│  Docker Build:                                               │
│  $ docker build -t retailchain-backend .                    │
│                                                              │
│  Key Modules:                                                │
│  - Auth (JWT, Refresh Token, OTP)                           │
│  - User Management (RBAC)                                   │
│  - Store Management                                          │
│  - Warehouse & Inventory                                     │
│  - Product & Category                                        │
│  - Shift & Attendance                                        │
│  - Stock Request (Transfer)                                  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    DATABASE (retail_chain)                  │
├──────────────────────────────────────────────────────────────┤
│  Engine:         MySQL 8.0+                                 │
│  Storage:        InnoDB                                     │
│  Collation:      utf8mb4_0900_ai_ci                        │
│  Port:           3306                                       │
│  Tables:         24                                        │
│                                                              │
│  Main Tables:                                               │
│  - users, roles, permissions, user_roles                    │
│  - stores, warehouses, store_warehouses                     │
│  - products, product_categories, product_variants           │
│  - inventory_stock, inventory_document                     │
│  - inventory_history, shifts, shift_assignments            │
│  - attendance_logs, stock_request, stock_request_item       │
│  - refresh_tokens, otp_codes                                │
│                                                              │
│  Connection:                                                │
│  jdbc:mysql://localhost:3306/retail_chain                   │
└──────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DEPLOYMENT FLOW (Step by Step)                                                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND DEPLOYMENT                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. SOURCE CODE                                                        │
│     └─> Git Repository (main branch)                                    │
│          │                                                               │
│          ▼                                                               │
│  2. BUILD (CI/CD)                                                      │
│     $ npm install                                                       │
│     $ npm run build                                                     │
│     Output: dist/ (static files)                                        │
│          │                                                               │
│          ▼                                                               │
│  3. STATIC ASSET OPTIMIZATION                                          │
│     - Code splitting (automatic by Vite)                               │
│     - CSS/JS minification                                               │
│     - Image compression                                                 │
│     - Content hashing for cache busting                                 │
│          │                                                               │
│          ▼                                                               │
│  4. DEPLOY (Choose one)                                                 │
│                                                                         │
│     ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│     │  VERCEL    │  │  NETLIFY   │  │  AWS S3    │  │  NGINX     │   │
│     │            │  │            │  │ +CloudFront │  │  (Custom)  │   │
│     ├────────────┤  ├────────────┤  ├────────────┤  ├────────────┤   │
│     │Auto Deploy │  │Auto Deploy │  │Manual/CDK  │  │Manual/Docker│  │
│     │CDN Built-in│  │CDN Built-in│  │Full Control│  │Full Control│   │
│     └────────────┘  └────────────┘  └────────────┘  └────────────┘   │
│          │               │               │              │                │
│          └───────────────┴───────────────┴──────────────┘                │
│                              │                                            │
│                              ▼                                            │
│  5. CDN DISTRIBUTION                                                    │
│     - Global edge locations                                             │
│     - SSL/TLS certificates                                             │
│     - Cache headers configuration                                       │
│                              │                                            │
│                              ▼                                            │
│  6. USER ACCESS                                                        │
│     https://retailchain.example.com                                    │
│                              │                                            │
│                              │ API Calls                                  │
│                              ▼                                            │
│     ┌───────────────────────────────────────────────────────┐            │
│     │                 API PROXY (Nginx/Load Balancer)        │            │
│     │         /retail-chain/*  ───>  Backend:8080           │            │
│     └───────────────────────────────────────────────────────┘            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND DEPLOYMENT                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. SOURCE CODE                                                        │
│     └─> Git Repository                                                 │
│          │                                                               │
│          ▼                                                               │
│  2. BUILD (CI/CD)                                                      │
│     $ ./mvnw clean package -DskipTests                                 │
│     Output: target/RetailChainService-*.jar                             │
│          │                                                               │
│          ▼                                                               │
│  3. DOCKER IMAGE BUILD                                                 │
│     $ docker build -t retailchain-backend:latest .                     │
│     $ docker tag retailchain-backend:latest \                           │
│            registry.example.com/retailchain-backend:latest              │
│          │                                                               │
│          ▼                                                               │
│  4. CONTAINER REGISTRY                                                 │
│     - Docker Hub / AWS ECR / GCP Artifact Registry                     │
│          │                                                               │
│          ▼                                                               │
│  5. DEPLOY (Choose one)                                                 │
│                                                                         │
│     ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│     │  Docker    │  │ Kubernetes │  │   AWS ECS  │  │  VM/Server │   │
│     │  Compose   │  │  (K8s)     │  │            │  │            │   │
│     ├────────────┤  ├────────────┤  ├────────────┤  ├────────────┤   │
│     │Simple/Small│  │  Production│  │ AWS Native │  │ Traditional│   │
│     │Project     │  │  at Scale  │  │            │  │            │   │
│     └────────────┘  └────────────┘  └────────────┘  └────────────┘   │
│          │               │               │              │                │
│          └───────────────┴───────────────┴──────────────┘                │
│                              │                                            │
│                              ▼                                            │
│  6. DATABASE CONNECTION                                                │
│     - JDBC connection to MySQL                                          │
│     - Connection pool (HikariCP)                                         │
│     - Auto schema migration (Hibernate)                                 │
│                              │                                            │
│                              ▼                                            │
│  7. API READY                                                          │
│     http://backend:8080/retail-chain/api/v1/*                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DEPLOYMENT OPTIONS COMPARISON                                                                                                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│    OPTION 1: Basic      │     │   OPTION 2: Docker     │     │  OPTION 3: Cloud       │     │  OPTION 4: K8s        │
│    (Single Server)      │     │   (Docker Compose)     │     │  (AWS/GCP/Azure)       │     │  (Kubernetes)         │
├─────────────────────────┤     ├─────────────────────────┤     ├─────────────────────────┤     ├─────────────────────────┤
│                         │     │                         │     │                         │     │                         │
│  ┌───────────────────┐ │     │   ┌─────────────────┐   │     │   ┌─────────────────┐   │     │   ┌─────────────────┐   │
│  │   Nginx           │ │     │   │  nginx-proxy    │   │     │   │  ALB/Cloud LB  │   │     │   │  Ingress/Nginx │   │
│  │   (Port 80/443)  │ │     │   └────────┬────────┘   │     │   └────────┬────────┘   │     │   └────────┬────────┘   │
│  └─────────┬─────────┘ │     │            │            │     │            │            │     │            │            │
│            │         │     │   ┌────────┴────────┐   │     │   ┌────────┴────────┐   │     │   ┌────────┴────────┐   │
│   ┌───────┴───────┐   │     │   │                 │   │     │   │                 │   │     │   │                 │   │
│   ▼               ▼   │     │   ▼                 ▼   │     │   ▼       ▼         ▼   │     │   ▼       ▼         ▼   │
│ ┌──────┐    ┌───────┐ │     │ ┌──────┐       ┌──────┐│     │ ┌──────┐ ┌──────┐ ┌──────┐│     │ ┌──────┐ ┌──────┐ ┌──────┐│
│ │ FE   │    │ BE    │ │     │ │ FE   │       │ BE   ││     │ │ FE   │ │ BE   │ │ BE   ││     │ │ FE   │ │ BE   │ │ BE   ││
│ │(dist)│    │ :8080 │ │     │ │(dist)│       │ :8080││     │ │ S3   │ │ ECS  │ │ ECS  ││     │ │ Pod  │ │ Pod  │ │ Pod  ││
│ └──────┘    └──┬────┘ │     │ └──────┘       └──┬───┘│     │ └──┬───┘ └──┬───┘ └──┬───┘│     │ └──┬───┘ └──┬───┘ └──┬───┘│
│                │       │     │                │      │     │    └────────┬─────────┘    │     │    └────────┬─────────┘    │
│                │ JDBC  │     │                │ JDBC │     │              │            │     │              │            │
│                ▼       │     │                ▼      │     │     ┌───────▼────────┐   │     │     ┌───────▼────────┐   │
│           ┌────────┐   │     │           ┌────────┐   │     │     │  RDS MySQL     │   │     │     │  MySQL Cluster │   │
│           │ MySQL  │   │     │           │ MySQL  │   │     │     │  (Managed)    │   │     │     │  (StatefulSet) │   │
│           │ :3306  │   │     │           │ :3306  │   │     │     └───────────────┘   │     │     └─────────────────┘   │
│           └────────┘   │     │           └────────┘   │     │                          │     │                          │
│                         │     └───────────────────────┘     │     ┌───────────────┐    │     │   ┌──────────────────┐   │
│  Cost: $10-20/month   │                             │     │   │  S3 + CloudFront│    │     │   │  NFS / S3 Volume │   │
│  Complexity: Low      │     Cost: $20-40/month     │     │   │  (CDN)         │    │     │   └──────────────────┘   │
│  Scalability: Limited  │     Complexity: Medium    │     │   └───────────────┘    │     │                          │
│                         │     Scalability: Medium   │     │                         │     │   Cost: $100-500+/mo   │
│                         │                         │     │   Cost: $50-150/month   │     │   Complexity: High      │
│                         │                         │     │   Complexity: Medium   │     │   Scalability: High    │
│                         │                         │     │   Scalability: High    │     │   Auto-scaling: Yes    │
│                         │                         │     │   Auto-scaling: Yes   │     │   Self-healing: Yes    │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DATA FLOW EXAMPLES                                                                                                                            │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

Example 1: User Login Flow
────────────────────────────────────────────────────────────────────────────────

Browser                      CDN/Static                     Backend                      Database
   │                           │                              │                            │
   │  POST /api/auth/login    │                              │                            │
   │──────────────────────────│                              │                            │
   │                    (SPA served from CDN)                 │                            │
   │                           │  POST /retail-chain/auth/login                    │
   │                           │─────────────────────────────>│                            │
   │                           │                              │   SELECT users WHERE...   │
   │                           │                              │───────────────────────────>│
   │                           │                              │<───────────────────────────│
   │                           │                              │                            │
   │                           │   JWT Token + Cookie        │                            │
   │                           │<─────────────────────────────│                            │
   │<─────────────────────────│                              │                            │


Example 2: Create Stock Request (Authenticated)
────────────────────────────────────────────────────────────────────────────────

Frontend (SPA)               Nginx Proxy                   Backend                      Database
   │                           │                              │                            │
   │  POST /api/stock-request  │                              │                            │
   │  Authorization: Bearer JWT│                              │                            │
   │───────────────────────────│                              │                            │
   │                           │  POST /retail-chain/api/stock-request            │
   │                           │  Header: Authorization: Bearer JWT                │
   │                           │─────────────────────────────>│                            │
   │                           │                              │  Validate JWT Token        │
   │                           │                              │───────────────────────────>│
   │                           │                              │                            │
   │                           │                              │  INSERT stock_request      │
   │                           │                              │───────────────────────────>│
   │                           │                              │<───────────────────────────│
   │                           │                              │                            │
   │                           │                              │  INSERT stock_request_item│
   │                           │                              │───────────────────────────>│
   │                           │                              │<───────────────────────────│
   │                           │                              │                            │
   │  201 Created             │                              │                            │
   │<─────────────────────────│                              │                            │


Example 3: Export Inventory Report
────────────────────────────────────────────────────────────────────────────────

Frontend (SPA)               Backend                      Database              File Storage/S3
   │                           │                              │                        │
   │  GET /api/export/inventory                           │                        │
   │  ?format=xlsx            │                              │                        │
   │─────────────────────────>│                              │                        │
   │                           │  SELECT inventory_stock...  │                        │
   │                           │────────────────────────────>│                        │
   │                           │<────────────────────────────│                        │
   │                           │                              │                        │
   │                           │  Generate Excel (xlsx)      │                        │
   │                           │────────────────────────────>│                        │
   │                           │                              │    Write: /uploads/
   │                           │                              │    /inventory_*.xlsx    │
   │                           │                              │───────────────────────>│
   │                           │                              │                        │
   │  200 OK                  │                              │                        │
   │  (redirect to file)     │                              │                        │
   │<─────────────────────────│                              │                        │
   │                           │                              │                        │
   │  GET /uploads/inventory_report.xlsx                     │                        │
   │─────────────────────────>│────────────────────────────>│                        │
   │<─────────────────────────│                              │                        │
   │  Download Excel          │                              │                        │


┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    INFRASTRUCTURE SUMMARY                                                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

| Component        | Technology              | Port         | Description                                    |
|------------------|-------------------------|--------------|------------------------------------------------|
| Frontend Build   | Vite 7 + React 19       | 5173 (dev)   | SPA Development Server                         |
| Frontend Static  | dist/                   | -            | Static Files (CDN/Storage)                     |
| Backend          | Spring Boot 3.x + Java  | 8080         | REST API                                       |
| Database         | MySQL 8.0+ (InnoDB)     | 3306         | Primary Data Store                             |
| Reverse Proxy    | Nginx                   | 80/443       | Load Balancer, SSL Termination                |
| Email Service    | SendGrid API            | -            | OTP, Notifications                             |
| File Storage     | Local Disk / S3         | -            | Uploads, Exports, Backups                      |
| CI/CD            | GitHub Actions          | -            | Automated Build & Deploy                       |
| CDN              | CloudFlare/Vercel/Netlify| 443         | Global Static Asset Distribution              |

---

## Environment Variables

### Frontend (.env)

```bash
# API Configuration
VITE_API_URL=http://localhost:8080/retail-chain
VITE_APP_TITLE=RetailChain

# Feature Flags (optional)
VITE_ENABLE_DEBUG=false
```

### Backend (application.properties / Environment Variables)

```properties
# Server Configuration
server.port=${SERVER_PORT:8080}
server.servlet.context-path=${APP_CONTEXT:/retail-chain}

# Database Configuration
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/retail_chain
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# JWT Security
spring.security.jwt.secret=${JWT_SECRET}
spring.security.jwt.access-token-expiration=${JWT_ACCESS_EXPIRY:3600}
spring.security.jwt.refresh-token-expiration=${JWT_REFRESH_EXPIRY:604800}

# Email Service (SendGrid)
spring.sendgrid.api-key=${SENDGRID_API_KEY}
spring.sendgrid.from-email=${SENDGRID_FROM_EMAIL:nhuyduong1307@gmail.com}

# Application
spring.application.name=RetailChainService
```

---

*Generated: 2026-03-18*
