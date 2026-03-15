# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-27
**Type:** Monorepo (Spring Boot + React)

## Design Context

### Users
- **Nhân viên nội bộ**: Quản lý cửa hàng, nhân viên kho, nhân viên bán hàng
- **Context**: Sử dụng trong giờ làm việc, cần thao tác nhanh, chính xác
- **Job to be done**: Quản lý kho, chuyển hàng, theo dõi tồn kho, báo cáo doanh số

### Brand Personality
- **Giọng điệu**: Chuyên nghiệp, đáng tin cậy, rõ ràng
- **3 từ khóa**: Professional • Reliable • Efficient
- **Mục tiêu cảm xúc**: Tạo cảm giác tin tưởng, giúp người dùng hoàn thành công việc nhanh chóng

### Aesthetic Direction
- **Visual tone**: Clean, modern, functional
- **Primary color**: Xanh teal (#24748f) - giữ nguyên
- **Theme**: Light mode only (không hỗ trợ dark mode)
- **Typography**: Manrope (display & body)
- **Spacing**: Sử dụng Tailwind CSS với @theme inline
- **Radius**: 0.625rem (rounded-xl)

### Design Principles
1. **Clarity first**: Mọi UI element phải có mục đích rõ ràng, không thừa
2. **Efficiency**: Tối ưu hóa workflow - giảm số click, hiển thị đúng thông tin cần thiết
3. **Consistency**: Sử dụng shadcn/ui components đồng nhất trong toàn hệ thống
4. **Professional polish**: Giao diện không cần hoa mỹ, nhưng phải tinh tế và cohesive
5. **Vietnamese first**: Mọi text phải bằng tiếng Việt, phù hợp với người dùng nội bộ

## Rules
1. Tất cả các file md đều được lưu trong folder `/docs` của project hiện tại.
2. Use 'bd' or 'beads' for task tracking.
3. Audit reports: `/docs/FRONTEND_AUDIT_REPORT.md`



## STRUCTURE
```
.
├── RetailChainService/    # Backend: Spring Boot, MySQL, JPA
└── RetailChainUi/         # Frontend: React, Vite, Tailwind
```

## RetailChainService Codebase Guide

# Quy Trình Phát Triển & Kiểm Thử Module Inventory

Tài liệu này mô tả chi tiết quy trình phát triển backend theo luồng tiêu chuẩn đã được thống nhất, đảm bảo tính tuần tự và chính xác từ Database đến API.

## 1. Kiểm Tra Môi Trường (Pre-check)

**Câu hỏi tiên quyết:** "Người dùng đã chạy server Spring Boot chưa?"

*   **Yêu cầu:** Server phải được khởi động trước khi test API.
*   **Ràng buộc Quan trọng:**
    *   Nếu gặp lỗi biên dịch liên quan đến **Lombok**: **BỎ QUA**, không được tự ý sửa file `pom.xml`.
    *   Chỉ tập trung sửa logic code Java, không can thiệp cấu hình build tool trừ khi được yêu cầu rõ ràng.

---

## 2. Quy Trình Phát Triển (Development Workflow)

### Bước 1: Kiểm tra & Đồng bộ Entity với Database
*   **Công cụ:** Sử dụng `mysql-tools` (scripts `mysql_tables.py`, `mysql_schema.py`) để lấy cấu trúc bảng thực tế.
*   **Hành động:**
    1.  Liệt kê toàn bộ bảng trong DB `retail_chain`.
    2.  So sánh với các class trong package `entity`.
    3.  **Kết quả thực hiện:**
        *   Phát hiện thiếu Entity: `Product`, `Role`, `InventoryDocument`, v.v.
        *   -> Đã tạo mới các Entity này khớp 100% với schema DB.
        *   -> Cập nhật quan hệ (Relationships) cho `User`, `Warehouse`, `StoreWarehouse`.

### Bước 2: Xây dựng Repository Layer
*   **Logic:** Kiểm tra xem Repository đã tồn tại chưa?
    *   Nếu chưa -> Tạo mới interface kế thừa `JpaRepository`.
    *   Nếu có -> Bổ sung các method query cần thiết.
*   **Kết quả thực hiện:**
    *   Tạo `WarehouseRepository`, `StoreWarehouseRepository`, `InventoryStockRepository`.

### Bước 3: Xây dựng Service Layer
*   **Logic:**
    1.  Tạo Interface Service (`InventoryService`).
    2.  Tạo Class Implementation (`InventoryServiceImpl`).
*   **Kết quả thực hiện:**
    *   Implement logic `createWarehouse`: Xử lý tạo kho tổng và kho cửa hàng (tự động link với Store).
    *   Implement logic `getStockByWarehouse`: Truy vấn tồn kho.

### Bước 4: Xây dựng DTO (Data Transfer Object)
*   **Logic:** Định nghĩa các object request/response để không lộ Entity trực tiếp ra ngoài.
*   **Kết quả thực hiện:**
    *   Tạo `WarehouseRequest` (Input tạo kho).
    *   Tạo `WarehouseResponse`, `InventoryStockResponse` (Output API).

### Bước 5: Xây dựng Controller & Config
*   **Logic:**
    1.  Tạo Controller (`InventoryController`) để expose API.
    2.  Kiểm tra Config (`CommonUtils`, `ResponseJson`) để đảm bảo format dữ liệu đúng.
*   **Kết quả thực hiện:**
    *   Expose các endpoint: `POST /warehouse`, `GET /warehouse`, `GET /stock/{id}`.
    *   **Fix Config:** Phát hiện lỗi Gson không serialize được `LocalDateTime` -> Đã cập nhật `CommonUtils.java` thêm Adapter.

---

## 3. Kiểm Thử & Vòng Lặp Sửa Lỗi (Testing Loop)

### Bước 6: Kiểm tra API (Verification)
*   **Công cụ:** Sử dụng `bash` (lệnh `curl`) để gọi vào API đang chạy.
*   **Quy trình lặp:**
    1.  Gọi API Test.
    2.  **Nếu Lỗi:** Phân tích nguyên nhân -> Quay lại sửa code (Config/Logic) -> Test lại.
    3.  **Nếu Đúng:** Xác nhận hoàn thành.

### Lịch sử Kiểm thử Thực tế:
1.  **Lần 1:** Gọi API tạo kho -> Trả về lỗi `500` (Lỗi Gson serialization).
    *   *Kiểm tra chéo:* Dùng `mysql-tools` check DB -> Dữ liệu **ĐÃ VÀO**.
    *   *Nguyên nhân:* Server chưa restart để nhận code fix Gson.
2.  **Lần 2 (Sau khi User restart server):** Gọi lại API.
    *   **Kết quả:** Trả về `200 OK`.
    *   JSON response hiển thị đúng ngày giờ.
    *   Dữ liệu khớp hoàn toàn với DB.

---

## 4. Trạng Thái Hiện Tại
Hệ thống đã hoàn tất toàn bộ quy trình trên. Các API hoạt động ổn định và đúng thiết kế.


## STRUCTURE BACKEND
```
.
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── sba301/
│   │   │           └── retailmanagement/
│   │   │               ├── config/            # Configuration
│   │   │               ├── controller/        # REST controllers
│   │   │               ├── dto/               # Data Transfer Objects
│   │   │               ├── entity/            # JPA entities
│   │   │               ├── enums/             # Enumerations
│   │   │               ├── exception/         # Exception handling
│   │   │               ├── mapper/            # DTO to entity mapping
│   │   │               ├── repository/        # JPA repositories
│   │   │               ├── service/           # Business services
│   │   │               └── utils/             # Utility classes
│   │   └── resources/     # Config files, messages, templates
│   └── test/              # Unit tests
└── target/                # Compiled output
```

# RetailChainUi Codebase Guide

# VAI TRÒ (ROLE)
Bạn là một Senior Frontend Developer chịu trách nhiệm phát triển dự án "RetailChainUi". Bạn cực kỳ nghiêm khắc trong việc tuân thủ kiến trúc phần mềm và quy chuẩn code (Coding Conventions).
# QUY TẮC CỐT LÕI (CORE RULES) - BẮT BUỘC TUÂN THỦ
1.  **NGÔN NGỮ:** Mọi câu trả lời, giải thích, và comment trong code **BẮT BUỘC phải sử dụng Tiếng Việt**.
2.  **UI LIBRARY:** **BẮT BUỘC** sử dụng **shadcn/ui** (kết hợp Tailwind CSS) cho các thành phần giao diện. Không tự viết CSS thủ công nếu có thể dùng utility classes của Tailwind.
3.  **CẤU TRÚC:** Tuân thủ tuyệt đối cấu trúc thư mục (Directory Structure) bên dưới.
    - Các components của shadcn/ui (Button, Input, Select...) phải đặt trong `src/components/ui`.
    - Các components tự build (ProductCard, Navbar...) đặt trong `src/components/common` hoặc `src/components/layout`.
4.  **CODE STYLE:**
    - Luôn sử dụng Functional Components với Arrow Functions.
    - Sử dụng `cn()` (từ `lib/utils`) để merge classes thay vì nối chuỗi thủ công.
    - Không dùng `export default` cho components nhỏ (dùng Named Export), chỉ dùng `export default` cho Pages.
5.  **ĐƯỜNG DẪN:** Luôn ghi rõ đường dẫn file (ví dụ: `src/components/ui/button.jsx`) ở dòng đầu tiên trước khi viết code.
## Project Overview
- **Framework**: React 19 + Vite (SWC)
- **Language**: JavaScript (.jsx for components, .js for logic)
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: **Tailwind CSS** + **shadcn/ui** (Thay thế cho Standard CSS)
## Build & Run Commands
- **Start Dev Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Lint Code**: `npm run lint`
## Directory Structure
Follow this feature-based architecture:

## STRUCTURE FRONTEND
```
src/
├── assets/
│   ├── images/
│   │   ├── auth/            # Ảnh nền login, register
│   │   │   └── bg-login.jpg
│   │   └── banners/         # Banner trang chủ
│   ├── icons/               # SVG icons (nếu không dùng thư viện)
│   │   └── CartIcon.jsx     # Convert SVG thành React Component
│   └── styles/
│       ├── _variables.css  # Màu sắc, font-size (SASS variables)
│       ├── _mixins.css     # Media queries, flexbox helpers
│       └── global.css      # Reset CSS, import variables
│
├── components/              # GLOBAL UI (Atomic Design đơn giản)
│   ├── common/              # Các thành phần nhỏ nhất
│   │   ├── Button/          # FOLDER COMPONENT (Pattern quan trọng)
│   │   │   ├── Button.jsx   # Logic & UI chính
│   │   │   ├── Button.module.css # Style riêng biệt (Module CSS)
│   │   │   └── index.js     # File export (Barrel file)
│   │   ├── Input/
│   │   │   ├── Input.jsx
│   │   │   ├── Input.module.css
│   │   │   └── index.js
│   │   └── Modal/
│   └── layout/
│       ├── Header/
│       │   ├── Header.jsx
│       │   ├── Header.module.css
│       │   └── UserDropdown.jsx # Component con nhỏ xíu chỉ dùng trong Header
│       └── Sidebar/
│
├── configs/                 # Cấu hình môi trường & hằng số hệ thống
│   ├── app.config.js        # Config pagination limit, timeout
│   └── routes.config.js     # List danh sách routes (dùng để render động)
│
├── context/
│   └── AuthContext/         # Tách Context thành folder nếu logic phức tạp
│       ├── AuthContext.jsx  # Tạo Context
│       ├── AuthProvider.jsx # Component bao bọc (Provider)
│       └── authReducer.js   # Xử lý logic state (nếu dùng useReducer)
│
├── hooks/                   # GLOBAL HOOKS
│   ├── useAxios.js          # Hook bọc axios có loading/error state
│   └── useDebounce.js
│
├── pages/                   # MODULES (Các "Mini-Apps")
│   ├── Auth/
│   │   ├── LoginPage/       # Tách riêng từng màn hình
│   │   │   ├── LoginPage.jsx
│   │   │   └── LoginForm.jsx # Tách Form ra khỏi Page
│   │   ├── RegisterPage/
│   │   │   ├── RegisterPage.jsx
│   │   │   └── RegisterForm.jsx
│   │   └── route.js         # Định nghĩa route con cho phần Auth (nếu cần)
│   │
│   ├── Product/             # Module phức tạp nhất
│   │   ├── components/      # LOCAL COMPONENTS (Chỉ dùng cho Product)
│   │   │   ├── ProductCard/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   └── ProductCard.module.css
│   │   │   └── FilterBar/
│   │   ├── hooks/           # LOCAL HOOKS
│   │   │   └── useProductFilter.js # Logic lọc sản phẩm
│   │   ├── helpers/         # LOCAL UTILS
│   │   │   └── transformData.js # Chuyển đổi dữ liệu API trước khi render
│   │   ├── ProductList.jsx  # Trang danh sách
│   │   └── ProductDetail.jsx # Trang chi tiết
│   │
│   └── index.js             # Export tất cả pages (Lazy load imports)
│
├── services/                # API LAYER
│   ├── api/                 # Cấu hình cốt lõi
│   │   ├── axiosClient.js   # Instance chính
│   │   └── interceptors.js  # Xử lý request/response (Token, Error 401)
│   ├── auth.service.js      # Các hàm gọi API Auth
│   └── product.service.js   # Các hàm gọi API Product
│
├── utils/
│   ├── storage.js           # Wrapper cho LocalStorage (get, set, remove)
│   └── validators.js        # Hàm check regex email, phone
│
├── App.jsx
├── main.jsx
└── vite.config.js           # Cấu hình Alias (@/components...)
           # Helper functions
```


## Code Style & Conventions

### General
- **Functional Components**: Use arrow functions for components.
  ```jsx
  const ComponentName = () => { ... };
  ```
- **Exports**: Use `export default` for page components; Named exports for common components and utilities are acceptable but stay consistent.
- **Hooks**: Always use custom hooks for complex logic. Prefix with `use`.

### Naming
- **Components**: PascalCase (e.g., `ProductCard.jsx`).
- **Files**: PascalCase for components, camelCase for hooks/utils (e.g., `useAuth.js`, `formatDate.js`).
- **Variables/Functions**: camelCase.
- **Constants**: UPPER_SNAKE_CASE.

### Imports
- **React**: No need to import `React` from 'react' (JSX transform enabled).
- **Paths**: Use relative paths (e.g., `../../components/common/Button`) as no aliases are configured in `vite.config.js`.

### State Management
- Use **Context API** for global state (Auth, Theme).
- Use **Local State** (`useState`, `useReducer`) for component-specific data.
- Avoid prop drilling; utilize Context or Composition.

### API & Data Fetching
- **Service Layer**: All API calls must go through `src/services/`.
- **Axios**: Use a configured Axios instance (to be created in `src/services/api`) for interceptors and base URLs.
- **Error Handling**: Wrap async calls in `try/catch` blocks and handle errors gracefully (UI feedback).

### Routing
- Use `react-router-dom` v7.
- Define routes in a centralized configuration or standard `<Routes>` setup in `App.jsx`.

## Development Rules
2. **File Extensions**: Use `.jsx` for files containing JSX, `.js` for pure JavaScript.
3. **Empty Directories**: If you encounter an empty directory (like `src/components/common/Button`), it is a placeholder. You are expected to create the implementation files (e.g., `index.js`, `Button.jsx`, `Button.css`) inside it.


## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| **Backend API** | `RetailChainService/` | Core business logic, DB entities |
| **Frontend UI** | `RetailChainUi/` | React components, pages, state |


## Bàn giao & Tích hợp Frontend (Handover & Integration)
Điều kiện tiên quyết: API đã vượt qua  (Backend test bằng curl hoặc Postman trả về 200 OK, dữ liệu đúng logic).

Quy trình chuyển giao:

Backend Developer: "Vứt" thông tin Endpoint (URL, Method, JSON Request/Response mẫu) sang cho Frontend.
Frontend Developer: Tiếp nhận và đưa vào tầng Service của RetailChainUi.
Thao tác kỹ thuật (Frontend):

Vị trí file: Mở (hoặc tạo mới) file trong thư mục src/services/ (ví dụ: inventory.service.js hoặc product.service.js).
Yêu cầu code:
Import axiosClient từ cấu hình gốc.
Viết hàm export tương ứng để gọi API.
Ví dụ triển khai:
<JAVASCRIPT>
// File: src/services/inventory.service.js
import axiosClient from './api/axiosClient';
const inventoryService = {
    // Hàm gọi API tạo kho (đã được Backend test OK)
    createWarehouse: (data) => {
        return axiosClient.post('/warehouse', data);
    },
    // Hàm lấy tồn kho
    getStockByWarehouse: (id) => {
        return axiosClient.get(`/stock/${id}`);
    }
};
export default inventoryService;
Kết quả: API Backend chính thức được kết nối vào luồng xử lý của Frontend, sẵn sàng để gọi trong các Components hoặc Hooks.

U s e   ' b d '   f o r   t a s k   t r a c k i n g 
 
 

<!-- BEGIN BEADS INTEGRATION -->
## Issue Tracking with bd (beads)

**IMPORTANT**: This project uses **bd (beads)** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other tracking methods.

### Why bd?

- Dependency-aware: Track blockers and relationships between issues
- Git-friendly: Dolt-powered version control with native sync
- Agent-optimized: JSON output, ready work detection, discovered-from links
- Prevents duplicate tracking systems and confusion

### Quick Start

**Check for ready work:**

```bash
bd ready --json
```

**Create new issues:**

```bash
bd create "Issue title" --description="Detailed context" -t bug|feature|task -p 0-4 --json
bd create "Issue title" --description="What this issue is about" -p 1 --deps discovered-from:bd-123 --json
```

**Claim and update:**

```bash
bd update <id> --claim --json
bd update bd-42 --priority 1 --json
```

**Complete work:**

```bash
bd close bd-42 --reason "Completed" --json
```

### Issue Types

- `bug` - Something broken
- `feature` - New functionality
- `task` - Work item (tests, docs, refactoring)
- `epic` - Large feature with subtasks
- `chore` - Maintenance (dependencies, tooling)

### Priorities

- `0` - Critical (security, data loss, broken builds)
- `1` - High (major features, important bugs)
- `2` - Medium (default, nice-to-have)
- `3` - Low (polish, optimization)
- `4` - Backlog (future ideas)

### Workflow for AI Agents

1. **Check ready work**: `bd ready` shows unblocked issues
2. **Claim your task atomically**: `bd update <id> --claim`
3. **Work on it**: Implement, test, document
4. **Discover new work?** Create linked issue:
   - `bd create "Found bug" --description="Details about what was found" -p 1 --deps discovered-from:<parent-id>`
5. **Complete**: `bd close <id> --reason "Done"`

### Auto-Sync

bd automatically syncs via Dolt:

- Each write auto-commits to Dolt history
- Use `bd dolt push`/`bd dolt pull` for remote sync
- No manual export/import needed!

### Important Rules

- ✅ Use bd for ALL task tracking
- ✅ Always use `--json` flag for programmatic use
- ✅ Link discovered work with `discovered-from` dependencies
- ✅ Check `bd ready` before asking "what should I work on?"
- ❌ Do NOT create markdown TODO lists
- ❌ Do NOT use external issue trackers
- ❌ Do NOT duplicate tracking systems

For more details, see README.md and docs/QUICKSTART.md.

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

<!-- END BEADS INTEGRATION -->

When searching or reading code, prefer using these codebase-memory-mcp tools instead of the default OpenCode tools:

  1. Use `search_code` instead of `grep` for code search
  2. Use `search_graph` instead of `glob` for finding files by pattern
  3. Use `get_code_snippet` instead of `read` when you need to read source code of specific functions

  Additionally, leverage these powerful tools when appropriate:
  - `trace_call_path` - to find who calls or is called by a specific function
  - `detect_changes` - to analyze git diff and predict affected symbols
  - `get_architecture` - to understand the codebase structure (languages, packages, routes, layers)
  - `query_graph` - for complex graph queries using Cypher syntax
  

<!-- LAYOUT FLOW -->
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HỆ THỐNG KHO RETAILCHAIN                        │
└─────────────────────────────────────────────────────────────────────────────┘
                              ┌──────────────────┐
                              │   KHO TỔNG      │
                              │  (Central WH)    │
                              │  is_central = 1  │
                              └────────┬─────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
          ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
          │   KHO CỬA HÀNG  │ │   KHO CỬA HÀNG  │ │   KHO CỬA HÀNG  │
          │      Store 1     │ │      Store 2     │ │      Store 3     │
          │  is_central = 0 │ │  is_central = 0  │ │  is_central = 0  │
          │  warehouse_id=1  │ │  warehouse_id=2  │ │  warehouse_id=3  │
          └─────────────────┘ └─────────────────┘ └─────────────────┘