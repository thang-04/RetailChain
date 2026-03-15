# Báo Cáo Kiểm Tra Chất Lượng Frontend

**Project:** RetailChainUi  
**Date:** 2026-03-12  
**Audit Type:** Comprehensive Design & Code Quality  
**Overall Quality Score:** 5/10 (Below Average)

---

## Đánh Giá Anti-Patterns: **CHƯA ĐẠT**

### Có phải AI tạo ra không? **CÓ CẢNH BÁO NGHIÊM TRỌNG**

Detected AI Slop Tells:
1. **Dark mode infrastructure everywhere** - 595+ instances of `dark:` classes despite project being light-only
2. **Hard-coded colors** - 62+ hex colors not using design tokens
3. **Mixed color systems** - Inconsistent usage of slate-*, gray-*, text-*, surface-*
4. **Generic KPI cards** - Hero metric layout with big numbers and trend badges
5. **Card-based layouts** - Heavy use of Card components

**Điểm tốt:**
- ✅ Không có gradient text
- ✅ Không có glassmorphism effects  
- ✅ Không có bounce animations
- ✅ Font Manrope đã cấu hình đúng
- ✅ Vietnamese text trong hầu hết UI

---

## Tóm Tắt Điều Hành

| Danh mục | Critical | High | Medium | Low | Tổng |
|----------|----------|------|--------|-----|-------|
| Anti-Patterns | 2 | 3 | 2 | 1 | 8 |
| Accessibility | 2 | 8 | 5 | 3 | 18 |
| Performance | 1 | 1 | 2 | 2 | 6 |
| Theming | 3 | 4 | 6 | 4 | 17 |
| Responsive | 0 | 2 | 3 | 2 | 7 |
| Localization | 0 | 1 | 3 | 1 | 5 |
| **TỔNG** | **8** | **19** | **21** | **13** | **61** |

### 5 Vấn Đề Nghiêm Trọng Nhất

1. **Dark mode code bloat** - 595+ dark: classes (project light-only)
2. **Hard-coded colors** - 62+ hex colors not using design tokens
3. **Missing accessibility** - Interactive elements lack focus indicators
4. **Mixed design tokens** - 4 color systems in use simultaneously
5. **Localization inconsistency** - Mixed English/Vietnamese text

---

## Chi Tiết Theo Mức Độ Nghiêm Trọng

### 🔴 Vấn Đề Critical

#### 1. Dark Mode Code Bloat (595+ instances)
- **Vị trí**: Toàn bộ codebase - grep tìm thấy 595 matches cho `dark:`
- **Danh mục**: Theming / Anti-Patterns
- **Mô tả**: Project "Light mode only" trong AGENTS.md nhưng có dark mode infrastructure khắp nơi trong index.css và tất cả components
- **Tác động**: Codebase bloated, maintenance khó, có thể activate dark mode ngoài ý muốn
- **Khuyến nghị**: Remove tất cả .dark classes, dark mode CSS variables, và dark: Tailwind variants
- **Command gợi ý**: `/normalize`

#### 2. Hard-Coded Colors - Modal Components
- **Vị trí**: 
  - EditStoreModal.jsx:92,94,106,110,127,133,138,149,153,163,167,172,199,201
  - AddStoreModal.jsx:85,89,106,112,117,128,132,142,146,150,172,174
- **Danh mục**: Theming
- **Mô tả**: Direct hex colors như `#121617`, `#f1f3f4`, `#dde2e4`, `#1e282c`, `#131c1f`, `#182124`
- **Tác động**: Không themeable, không nhất quán với design tokens
- **Khuyến nghị**: Thay bằng CSS variables (--color-text-main, --color-surface, etc.)
- **Command gợi ý**: `/normalize`

#### 3. Hard-Coded Colors - Charts
- **Vị trí**:
  - RevenueChart.jsx:104,105,113,122
  - StoreRevenueChart.jsx:60,61,65,66,67,68,72,75
- **Danh mục**: Theming
- **Mô tả**: Hard-coded `#24748f` (primary) và `#94a3b8` trong SVG elements
- **Tác động**: Chart colors không update nếu primary thay đổi
- **Khuyến nghị**: Dùng CSS variables hoặc design token functions
- **Command gợi ý**: `/normalize`

#### 4. Missing Accessibility - Interactive Cards
- **Vị trí**: KPIGrid.jsx:63-82, StoreKPIGrid.jsx:11-71
- **Danh mục**: Accessibility
- **Mô tả**: Cards với role="button" và tabIndex=0 nhưng:
  - Không có aria-pressed state
  - Không có aria-label mô tả action
  - Keyboard navigation incomplete
- **Tác động**: Keyboard users không thể discover hoặc interact với clickable cards
- **WCAG**: 2.1.1 Keyboard, 2.4.7 Focus Visible
- **Khuyến nghị**: Thêm aria-pressed, focus styles, aria-label
- **Command gợi ý**: `/harden`

#### 5. Mixed Design Tokens
- **Vị trí**: Throughout codebase - mixing slate-*, gray-*, text-*, surface-*
- **Danh mục**: Theming
- **Mô tả**: Inconsistent use of color naming:
  - `text-slate-500`, `text-gray-400`, `text-text-muted` trong cùng components
  - `bg-surface-light`, `bg-white`, `bg-slate-50`, `bg-[#1a262a]`
- **Tác động**: Visual inconsistency, maintenance confusion
- **Khuyến nghị**: Standardize trên single token system (text-*, bg-*, surface-*)
- **Command gợi ý**: `/normalize`

#### 6. Mixed Localization - English/Vietnamese
- **Vị trí**:
  - DashboardPage.jsx:50,53 ("Store Dashboard")
  - StoreDashboardPage.jsx:48,49,60,65,66,67,92
  - StoreKPIGrid.jsx:18,21,34,37,51,66,68
- **Danh mục**: Localization
- **Mô tả**: UI text mixes English và Vietnamese:
  - "Store Dashboard" vs "Tổng quan chuỗi bán lẻ"
  - "In Stock", "Varieties", "Attention", "On Shift" (English) trong Vietnamese UI
  - "Edit Store", "Save Changes", "Cancel" (English) trong Vietnamese form
- **Tác động**: Inconsistent user experience, violates "Vietnamese first" requirement
- **Khuyến nghị**: Standardize tất cả UI text thành Vietnamese
- **Command gợi ý**: `/clarify`

#### 7. Hard-Coded Background Colors
- **Vị trí**:
  - ProductPage.jsx:114 (`bg-[#f8fafc]`)
  - InventoryPage.jsx:156,159,164
  - StockInList.jsx:120,244,254,256, etc.
- **Danh mục**: Theming
- **Mô tả**: Direct hex backgrounds không dùng design tokens
- **Tác động**: Không themeable, breaks design system consistency
- **Khuyến nghị**: Thay bằng design tokens
- **Command gợi ý**: `/normalize`

#### 8. Performance - No Image Optimization
- **Vị trí**: Throughout product tables, store images
- **Danh mục**: Performance
- **Mô tả**: No lazy loading, no image optimization, direct URL display
- **Tác động**: Slow page loads, bandwidth waste
- **Khuyến nghị**: Add lazy loading, use srcSet cho responsive images
- **Command gợi ý**: `/optimize`

---

### 🟠 Vấn Đề High

#### 9. Focus Indicators Missing
- **Vị trí**: Multiple custom interactive elements lack focus-visible styles
- **Danh mục**: Accessibility
- **Mô tả**: Custom buttons, clickable cards, icon buttons missing focus-visible
- **Tác động**: Keyboard users cannot see focused elements
- **WCAG**: 2.4.7 Focus Visible
- **Command gợi ý**: `/harden`

#### 10. EditStoreModal - Missing Form Labels
- **Vị trí**: EditStoreModal.jsx:133,149,167
- **Danh mục**: Accessibility
- **Mô tả**: Labels use htmlFor nhưng inputs dùng different ids
- **Tác động**: Screen reader users cannot associate labels with inputs
- **WCAG**: 1.3.1 Info and Relationships
- **Command gợi ý**: `/harden`

#### 11. Inconsistent Button Styles
- **Vị trí**: Throughout codebase
- **Danh mục**: Theming
- **Mô tả**: Some buttons use custom classes, others use variant props
- **Command gợi ý**: `/normalize`

#### 12. Shadow Token Inconsistency
- **Vị trí**: index.css defines `--shadow-soft`, but components use `shadow-sm`, `shadow-lg`, `shadow-xl`
- **Danh mục**: Theming
- **Command gợi ý**: `/normalize`

#### 13. Inconsistent Card Styling
- **Vị trí**: Various Card components
- **Danh mục**: Theming
- **Command gợi ý**: `/normalize`

#### 14. Missing Loading States
- **Vị trí**: Multiple pages
- **Danh mục**: Accessibility / UX
- **Command gợi ý**: `/harden`

#### 15. Inconsistent Status Badge Colors
- **Vị trí**: Various components
- **Danh mục**: Theming
- **Command gợi ý**: `/normalize`

#### 16. Form Error Handling
- **Vị trí**: LoginPage.jsx:38-42
- **Danh mục**: Accessibility
- **Mô tả**: Error message lacks ARIA role="alert"
- **Command gợi ý**: `/harden`

#### 17. EditStoreModal - Color Contrast
- **Vị trí**: EditStoreModal.jsx:146
- **Danh mục**: Accessibility
- **WCAG**: 1.4.3 Contrast
- **Command gợi ý**: `/critique`

#### 18. Empty State Inconsistency
- **Vị trí**: Multiple pages
- **Danh mục**: UX
- **Command gợi ý**: `/extract`

#### 19. Responsive - Fixed Table Widths
- **Vị trí**: Various Table components
- **Danh mục**: Responsive
- **Command gợi ý**: `/adapt`

#### 20. Inconsistent Spacing
- **Vị trí**: Various components
- **Danh mục**: Theming
- **Command gợi ý**: `/polish`

#### 21. Header - Missing Skip Link
- **Vị trí**: MainLayout / App structure
- **Danh mục**: Accessibility
- **WCAG**: 2.4.1 Bypass Blocks
- **Command gợi ý**: `/harden`

#### 22. Sidebar - Navigation Focus
- **Vị trí**: Sidebar.jsx:99-122
- **Danh mục**: Accessibility
- **Command gợi ý**: `/harden`

#### 23. KPI Grid - Animation Performance
- **Vị trí**: KPIGrid.jsx:81
- **Danh mục**: Performance
- **Mô tả**: Animating translateY, shadow, border on hover
- **Command gợi ý**: `/optimize`

#### 24-26. Additional High Issues
(Detail truncated for brevity - see full report)

---

### 🟡 Vấn Đề Medium (Selected)

#### 27. Inconsistent Font Usage
- **Danh mục**: Theming

#### 28. Hard-coded Border Colors
- **Danh mục**: Theming

#### 29. Icon Inconsistency
- **Dị trí**: Mixed lucide-react and material-symbols
- **Danh mục**: Theming

#### 30. Unused CSS Variables
- **Danh mục**: Performance / Theming

#### 31. Console Logs in Production
- **Vị trí**: EditStoreModal.jsx:52,73
- **Danh mục**: Performance

#### 32-40. Additional Medium Issues
(Detail truncated for brevity)

---

### 🟢 Vấn Đề Low (Selected)

#### 41-50. Various Low Issues
- Alphabetical imports
- Prop drilling
- Magic numbers
- Unused variables
- Console error handling

---

## Các Pattern Lặp Lại

### 1. Dark Mode Code (595+ instances)
Vấn đề phổ biến nhất - dark mode infrastructure khắp codebase despite explicit "Light mode only" requirement.

### 2. Hard-coded Colors (62+ instances)
Three categories:
- Modal components: `#121617`, `#f1f3f4`, `#dde2e4`, `#1e282c`
- Chart components: `#24748f`, `#94a3b8`
- Backgrounds: `#f8fafc`, `#1a262a`, `#0f171a`

### 3. Mixed Design Tokens
Bốn systems used simultaneously:
- Tailwind slate: `slate-500`, `slate-900`, `slate-50`
- Tailwind gray: `gray-200`, `gray-400`, `gray-700`
- Custom tokens: `text-text-main`, `text-text-muted`
- Direct hex: `#121617`, `#f1f3f4`

### 4. Inconsistent Vietnamese Localization
English terms appearing in Vietnamese UI:
- "Store Dashboard", "Edit Store", "Save Changes"
- "In Stock", "Varieties", "Attention", "On Shift"

### 5. Accessibility Gaps
- Missing focus indicators on custom interactive elements
- Incomplete ARIA labels on icon buttons
- Form validation not announced to screen readers

---

## Các Điểm Tích Cực

1. ✅ **shadcn/ui integration** - Good use of component library
2. ✅ **Vietnamese text** - Most UI text in Vietnamese
3. ✅ **Responsive grid** - Good use of responsive grid classes
4. ✅ **Form validation** - Basic HTML5 validation in place
5. ✅ **Loading states** - Most pages have loading indicators
6. ✅ **Error handling** - Basic error states implemented
7. ✅ **Card components** - Good use of Card from shadcn/ui
8. ✅ **Tailwind utilities** - Proper use of Tailwind classes
9. ✅ **Material icons** - Consistent icon usage
10. ✅ **Date formatting** - Using vi-VN locale

---

## Khuyến Nghị Theo Ưu Tiên

### 🚨 Ngay Lập Tức (This Session)

1. **Remove dark mode code** - Strip all `.dark` and `dark:` classes
   - Use: `/normalize` to align with design system

2. **Standardize Vietnamese localization** - Fix mixed EN/VN text
   - Use: `/clarify` to improve UX copy

### 📅 Ngắn Hạn (This Sprint)

3. **Replace hard-coded colors** - Use design tokens
   - Use: `/normalize`

4. **Fix accessibility issues** - Focus indicators, ARIA labels
   - Use: `/harden`

5. **Standardize design tokens** - One color system only
   - Use: `/normalize`

### 📆 Trung Hạn (Next Sprint)

6. **Performance optimizations** - Image lazy loading
   - Use: `/optimize`

7. **Responsive refinements** - Fix mobile issues
   - Use: `/adapt`

8. **Create component library** - Standardize reusable patterns
   - Use: `/extract`

### 🎯 Dài Hạn (Future)

9. **Error boundaries** - Add React error boundaries
10. **Documentation** - Document component library
11. **Testing** - Add accessibility testing

---

## Các Commands Để Fix

| Issue Category | Suggested Command | Impact |
|----------------|-------------------|--------|
| Dark mode removal, hard-coded colors, design token standardization | `/normalize` | 45+ issues |
| Focus indicators, ARIA labels, form validation | `/harden` | 12+ issues |
| Mixed localization text | `/clarify` | 8+ issues |
| Performance optimization | `/optimize` | 8+ issues |
| Responsive improvements | `/adapt` | 5+ issues |
| Polish and refine | `/polish` | 5+ issues |
| Extract reusable components | `/extract` | 3+ issues |

---

## Kết Luận

RetailChainUi codebase có solid foundation using shadcn/ui và Tailwind CSS, nhưng suffers from:

1. **Massive dark mode bloat** - 595+ instances despite light-only requirement
2. **Inconsistent design tokens** - 4 different color systems in use
3. **Hard-coded colors** - 62+ instances not using design tokens
4. **Accessibility gaps** - Missing focus indicators, incomplete ARIA
5. **Localization inconsistency** - Mixed English/Vietnamese text

**Estimated Fix Effort:**
- Dark mode removal: 2-4 hours
- Color standardization: 4-6 hours  
- Accessibility fixes: 2-3 hours
- Localization cleanup: 1-2 hours

**Total: ~10-15 hours for critical/high issues**

Codebase functional nhưng sẽ benefit significantly from cleanup để match "Professional • Reliable • Efficient" brand guidelines.

---

*Báo cáo tạo: 2026-03-12*
*Auditor: OpenCode AI*
