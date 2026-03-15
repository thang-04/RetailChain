## Why

Hệ thống RetailChain hiện tại chưa hỗ trợ đa ngôn ngữ, trong khi người dùng là thị trường Việt Nam cần giao diện Tiếng Việt để sử dụng thuận tiện hơn. Việc tích hợp i18n giúp mở rộng khả năng tiếp cận và nâng cao trải nghiệm người dùng.

## What Changes

- Tích hợp thư viện i18n (react-i18next) vào RetailChainUi
- Cấu hình hai ngôn ngữ: Tiếng Việt (vi) và Tiếng Anh (en)
- Thiết lập cơ chế chuyển đổi ngôn ngữ (language switcher)
- Tạo các file translate cho các thành phần giao diện hiện có
- Cập nhật các component để sử dụng translation key thay vì hard-code text

## Capabilities

### New Capabilities

- `i18n-configuration`: Cấu hình i18n cơ bản với react-i18next, bao gồm init, language detection, và namespace management
- `language-switcher`: Component cho phép người dùng chuyển đổi giữa Tiếng Việt và Tiếng Anh
- `translation-files`: Các file JSON chứa nội dung dịch cho từng ngôn ngữ

### Modified Capabilities

- (Không có capability hiện tại nào bị ảnh hưởng về mặt requirements)

## Impact

- Thêm dependencies: react-i18next, i18next, i18next-browser-languagedetector
- Tạo thư mục `src/locales/` chứa các file translation
- Cập nhật `src/main.jsx` để khởi tạo i18n
- Tạo component LanguageSwitcher trong UI
- Ảnh hưởng đến tất cả các page và component có text hiển thị
