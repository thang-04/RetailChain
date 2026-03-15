## Context

RetailChainUi hiện tại là một ứng dụng React sử dụng Vite và Tailwind CSS. Giao diện hiện tại hard-code toàn bộ text tiếng Anh, không có cơ chế hỗ trợ đa ngôn ngữ. Dự án nhắm đến thị trường Việt Nam nên cần bổ sung hỗ trợ Tiếng Việt.

**Ràng buộc:**
- Framework: React 19 + Vite
- UI Library: shadcn/ui + Tailwind CSS
- Ngôn ngữ mặc định hiện tại: Tiếng Anh
- Ngôn ngữ cần thêm: Tiếng Việt

## Goals / Non-Goals

**Goals:**
- Tích hợp react-i18next để quản lý đa ngôn ngữ
- Hỗ trợ Tiếng Việt (vi) và Tiếng Anh (en)
- Cho phép người dùng chuyển đổi ngôn ngữ qua UI
- Lưu trữ lựa chọn ngôn ngữ của người dùng (localStorage)
- Tự động phát hiện ngôn ngữ của trình duyệt

**Non-Goals:**
- Dịch toàn bộ nội dung từ API backend (backend tự xử lý)
- Hỗ trợ thêm ngôn ngữ khác ngoài vi/en (có thể mở rộng sau)
- Tích hợp với hệ thống translation API bên ngoài
- Server-side rendering (SSR)

## Decisions

### 1. Chọn thư viện i18n: react-i18next

**Quyết định:** Sử dụng react-i18next thay vì các giải pháp khác

**Lý do:**
- Tích hợp sẵn với React, cộng đồng lớn và ổn định
- Hỗ trợ lazy loading namespaces
- Có i18next-browser-languagedetector để tự động phát hiện ngôn ngữ
- Cú pháp đơn giản, dễ sử dụng với hooks

**Alternatives đã xem xét:**
- i18next: Thư viện core, cần tự tích hợp với React → Bác bỏ vì phải tự viết integration
- react-intl: Phổ biến nhưng cú pháp phức tạp hơn → Chọn react-i18next vì đơn giản hơn

### 2. Cấu trúc file translation: JSON files theo namespace

**Quyết định:** Tổ chức translation theo namespace (common, auth, product, etc.)

**Lý do:**
- Phân chia rõ ràng theo module của ứng dụng
- Lazy loading chỉ những namespace cần thiết
- Dễ bảo trì và mở rộng

**Cấu trúc:**
```
src/locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   └── ...
└── vi/
    ├── common.json
    ├── auth.json
    └── ...
```

### 3. Cơ chế lưu ngôn ngữ: localStorage

**Quyết định:** Lưu language preference vào localStorage

**Lý do:**
- Đơn giản, không cần backend
- Persist qua các phiên làm việc
- Kết hợp với i18next-browser-languagedetector

**Alternatives đã xem xét:**
- Cookie: Có thể nhưng phức tạp hơn cho use case này
- Redux Context: Overkill, không cần thiết

### 4. Language Switcher Component

**Quyết định:** Tạo component LanguageSwitcher độc lập, đặt trong Header

**Lý do:**
- Tách biệt logic i18n với các component khác
- Tái sử dụng được ở nhiều nơi
- Theo convention của dự án (component trong src/components/)

## Risks / Trade-offs

**[Risk] Translation keys không đồng nhất**

→ **Mitigation:** Quy ước đặt key theo pattern `<module>.<component>.<text>`, ví dụ: `auth.login.title`

**[Risk] Missed text không được translate**

→ **Mitigation:** Sử dụng fallback language là 'en', dev mode hiển thị warning cho missing keys

**[Risk] Performance khi load nhiều translations**

→ **Mitigation:** Sử dụng lazy loading namespaces, chỉ load những gì cần

**[Risk] Hard-to-maintain translation files khi app grow**

→ **Mitigation:** Phân chia theo namespace ngay từ đầu, có base common.json cho text dùng chung

## Migration Plan

1. Cài đặt dependencies: `npm install i18next react-i18next i18next-browser-languagedetector`
2. Tạo cấu trúc thư mục `src/locales/`
3. Tạo file i18n config (`src/i18n.js`)
4. Cập nhật `src/main.jsx` để init i18n
5. Tạo LanguageSwitcher component
6. Thêm LanguageSwitcher vào Header
7. Tạo translation files với content mẫu cho các page hiện có
8. Test chuyển đổi ngôn ngữ
