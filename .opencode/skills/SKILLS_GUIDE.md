h# Hướng Dẫn Sử Dụng OpenCode Skills

Tài liệu này hướng dẫn cách sử dụng các kỹ năng (skills) có sẵn trong OpenCode để hỗ trợ phát triển dự án RetailChain.

---

## Mục Lục

1. [Cách Gọi Skill](#cách-gọi-skill)
2. [Nhóm Database](#nhóm-database)
3. [Nhóm OpenSpec Workflow](#nhóm-openspec-workflow)
4. [Nhóm UI/UX Design](#nhóm-uiux-design)
5. [Nhóm Cải Tiến Interface](#nhóm-cải-tiến-interface)
6. [Nhóm Ra Quyết Định & Giải Quyết Vấn Đề](#nhóm-ra-quyết-định--giải-quyết-vấn-đề)
7. [Sơ Đồ Chọn Skill](#sơ-đồ-chọn-skill)

---

## Cách Gọi Skill

Sử dụng command `/<tên-skill>` trong Claude Code để gọi skill. Ví dụ:

```
/mysql-tools
/ui-ux-pro-max
/audit
```

---

## 📊 Skills Database & Development

```
┌─────────────┬──────────────────────────────────────────────────────────────────────────────────────────┐
│    Skill    │                                          Mô tả                                           │
├─────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤
│ mysql-tools │ Bộ công cụ MySQL để kết nối, liệt kê bảng, xem cấu trúc schema, và thực thi SQL queries. │
└─────────────┴──────────────────────────────────────────────────────────────────────────────────────────┘
```

### mysql-tools

**Khi nào dùng:**
- Khi cần kiểm tra cấu trúc database
- Khi cần xem dữ liệu trong bảng
- Khi cần chạy SQL query để debug

**Các scripts có sẵn:**
- `mysql_connect.py` - Kiểm tra kết nối database
- `mysql_tables.py` - Liệt kê tất cả các bảng
- `mysql_schema.py` - Xem cấu trúc một bảng
- `mysql_query.py` - Chạy SQL query
- `mysql_info.py` - Lấy thông tin database

**Cách dùng:**
```bash
python scripts/mysql_tables.py --host 127.0.0.1 --user root --password YOUR_PASSWORD --database retail_chain
```

---

## 🎨 Skills OpenSpec (Quản lý thay đổi)

```
┌──────────────────────────────┬──────────────────────────────────────────────────────────────────┐
│            Skill             │                              Mô tả                               │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ openspec-propose             │ Đề xuất thay đổi mới với artifacts được tạo tự động trong 1 bước │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ openspec-new-change          │ Bắt đầu thay đổi mới theo workflow có cấu trúc từng bước         │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ openspec-continue-change     │ Tiếp tục làm việc trên thay đổi, tạo artifact tiếp theo          │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ openspec-apply-change        │ Triển khai các task từ một thay đổi OpenSpec                     │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ openspec-verify-change       │ Xác minh implementation khớp với artifacts của thay đổi          │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ openspec-archive-change      │ Lưu trữ (archive) một thay đổi đã hoàn thành                      │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ openspec-bulk-archive-change │ Lưu trữ nhiều thay đổi cùng lúc                                   │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ openspec-ff-change           │ Tạo nhanh tất cả artifacts cần thiết cho implementation            │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ openspec-sync-specs          │ Đồng bộ delta specs vào main specs                                 │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ openspec-explore             │ Chế độ khám phá - suy nghĩ về ý tưởng, điều tra vấn đề            │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────┤
│ openspec-onboard             │ Hướng dẫn workflow OpenSpec lần đầu                                │
└──────────────────────────────┴──────────────────────────────────────────────────────────────────┘
```

### Chi tiết từng Skill:

| Skill | Khi nào dùng |
|-------|--------------|
| **openspec-propose** | Muốn nhanh chóng mô tả what they want to build và nhận complete proposal |
| **openspec-new-change** | Muốn tạo feature mới với structured approach |
| **openspec-continue-change** | Đang trong quá trình implement và cần tạo artifact tiếp theo |
| **openspec-apply-change** | Sẵn sàng bắt đầu implement các tasks |
| **openspec-verify-change** | Trước khi archive change, để validate implementation is complete |
| **openspec-archive-change** | Feature đã hoàn thành và muốn đóng gói lại |
| **openspec-bulk-archive-change** | Có nhiều changes hoàn thành cùng lúc |
| **openspec-ff-change** | Muốn bỏ qua từng bước và tạo tất cả artifacts một lúc |
| **openspec-sync-specs** | Muốn cập nhật main specs mà không archive change |
| **openspec-explore** | Cần think through something before starting a change |
| **openspec-onboard** | Mới sử dụng OpenSpec lần đầu |

---

## 🖌️ Skills UI/UX Design

```
┌──────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│      Skill       │                                                        Mô tả                                                        │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ui-ux-pro-max    │ Thiết kế UI/UX toàn diện với database searchable (67 styles, 96 color palettes, 57 font pairings, 99 UX guidelines) │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ frontend-design  │ Tạo giao diện frontend chất lượng cao, sáng tạo, tránh AI aesthetic generic                                         │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ adapt            │ Thiết kế responsive - làm cho UI hoạt động trên nhiều màn hình, thiết bị                                            │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ audit            │ Kiểm tra toàn diện chất lượng interface (accessibility, performance, theming, responsive)                           │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ bolder           │ Tăng cường thiết kế nhạt nhẽo thành nổi bật, mạnh mẽ hơn                                                            │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ colorize         │ Thêm màu sắc strategic cho UI đơn điệu                                                                              │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ critique         │ Đánh giá hiệu quả thiết kế từ góc độ UX                                                                             │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ delight          │ Thêm những khoảnh khắc vui vẻ, bất ngờ vào interface                                                                │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ distill          │ Đơn giản hóa thiết kế, loại bỏ độ phức tạp không cần thiết                                                          │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ extract          │ Trích xuất components, design tokens có thể tái sử dụng                                                             │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ normalize        │ Chuẩn hóa design theo design system                                                                                 │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ polish           │ Hoàn thiện chất lượng cuối cùng - sửa alignment, spacing, consistency                                               │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ quieter          │ Giảm cường độ thiết quá mạnh                                                                                        │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ teach-impeccable │ Thiết lập một lần - thu thập design context và lưu vào AI config                                                    │
└──────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### ui-ux-pro-max

**Khi nào dùng:**
- Khi cần tạo design system mới
- Khi cần tìm color palette phù hợp
- Khi cần UX guidelines cho một feature

**Cách dùng:**
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness" --design-system -p "Project Name"
```

**Các domain có sẵn:**

| Domain | Mục đích | Ví dụ |
|--------|----------|-------|
| `product` | Gợi ý product type | SaaS, e-commerce |
| `style` | UI styles, effects | glassmorphism, dark mode |
| `typography` | Font pairings | elegant, modern |
| `color` | Color palettes | saas, healthcare |
| `landing` | Cấu trúc trang landing | hero, pricing |
| `chart` | Chart types | trend, comparison |
| `ux` | Best practices | animation, accessibility |

**Các stack có sẵn:**
`html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`

---

## ✏️ Skills Bổ sung (Micro-Improvements)

```
┌─────────────────────┬──────────────────────────────────────────────────────────────────┐
│        Skill        │                              Mô tả                               │
├─────────────────────┼──────────────────────────────────────────────────────────────────┤
│ animate             │ Thêm animations, micro-interactions cải thiện usability          │
├─────────────────────┼──────────────────────────────────────────────────────────────────┤
│ clarify             │ Cải thiện UX copy, error messages, labels, instructions          │
├─────────────────────┼──────────────────────────────────────────────────────────────────┤
│ harden              │ Cải thiện độ bền interface - error handling, i18n, text overflow │
├─────────────────────┼──────────────────────────────────────────────────────────────────┤
│ onboard             │ Thiết kế/cải thiện onboarding flows, empty states                │
├─────────────────────┼──────────────────────────────────────────────────────────────────┤
│ optimize            │ Cải thiện performance - loading speed, rendering, animations    │
├─────────────────────┼──────────────────────────────────────────────────────────────────┤
│ make-decision       │ Hỗ trợ ra quyết định với ma trận quyết định                      │
├─────────────────────┼──────────────────────────────────────────────────────────────────┤
│ problem-solving-pro │ Giải quyết vấn đề phức tạp một cách có hệ thống                  │
└─────────────────────┴──────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Chi tiết UI Enhancement Skills

| Skill | Khi nào dùng |
|-------|-------------|
| **adapt** | Khi cần responsive design cho mobile, tablet, desktop |
| **audit** | Khi cần đánh giá quality report về accessibility, performance |
| **bolder** | Khi thiết kế quá an toàn, nhàm chán |
| **colorize** | Khi UI thiếu màu sắc, nhạt nhẽo |
| **critique** | Khi cần feedback về visual hierarchy, information architecture |
| **delight** | Khi muốn nâng cao trải nghiệm người dùng |
| **distill** | Khi thiết kế quá phức tạp, rối rắm |
| **extract** | Khi muốn tái sử dụng code từ feature hiện tại |
| **normalize** | Khi cần đảm bảo consistency với design system |
| **polish** | Khi cần fix alignment, spacing, consistency trước khi ship |
| **quieter** | Khi thiết kế quá hung hãn, gây khó chịu |
| **teach-impeccable** | Khi mới bắt đầu dự án, cần thiết lập design guidelines |
| **animate** | Khi cần cải thiện usability với motion effects |
| **clarify** | Khi text trong UI khó hiểu, confuse |
| **harden** | Khi cần better error handling, i18n, text overflow handling |
| **onboard** | Khi cần hướng dẫn user mới |
| **optimize** | Khi cần improve loading speed, rendering, animations |

---

## 🧠 Nhóm Ra Quyết Định & Giải Quyết Vấn Đề

| Skill | Khi nào dùng |
|-------|-------------|
| **make-decision** | Khi cần so sánh các lựa chọn và đưa ra quyết định |
| **problem-solving-pro** | Khi gặp bug khó, architecture issue phức tạp |

---

## 🗺️ Sơ Đồ Chọn Skill

```
Bạn cần...
├── Database thao tác
│   └── /mysql-tools
├── Quản lý feature/change
│   └── /openspec-* (chọn workflow phù hợp)
├── Thiết kế UI/UX mới
│   ├── Tạo design system → /ui-ux-pro-max
│   └── Build interface → /frontend-design
├── Cải thiện UI hiện tại
│   ├── Responsive → /adapt
│   ├── Thêm màu → /colorize
│   ├── Đơn giản hóa → /distill
│   ├── Nổi bật hơn → /bolder
│   ├── Bớt hung hãn → /quieter
│   ├── Hoàn thiện → /polish
│   ├── Kiểm tra chất lượng → /audit
│   └── Thêm animation → /animate
├── Cải thiện UX
│   ├── Text/Copy → /clarify
│   ├── Onboarding → /onboard
│   └── Đánh giá → /critique
├── Cải thiện code
│   ├── Tái sử dụng → /extract
│   ├── Robust → /harden
│   ├── Performance → /optimize
│   └── Chuẩn hóa → /normalize
└── Ra quyết định
    ├── So sánh options → /make-decision
    └── Solve problem → /problem-solving-pro
```

---

## ⚡ Quick Reference

| Nhu cầu | Skill gợi ý |
|---------|-------------|
| Kiểm tra DB | `/mysql-tools` |
| Tạo feature mới | `/openspec-new-change` |
| Thiết kế UI | `/ui-ux-pro-max` |
| Responsive | `/adapt` |
| Kiểm tra quality | `/audit` |
| Hoàn thiện | `/polish` |
| Performance | `/optimize` |
| Bug khó | `/problem-solving-pro` |

---

*Lưu ý: Đây là hướng dẫn tổng quan. Chi tiết từng skill xem trong file SKILL.md tương ứng tại thư mục của mỗi skill.*
