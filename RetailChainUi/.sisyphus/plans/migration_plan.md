# Dashboard Migration Plan

## 1. Environment Setup
- [ ] **Install Tailwind CSS**:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] **Configure Tailwind**:
  - Update `tailwind.config.js` with colors and fonts from `main.txt`.
  - Update `src/index.css` with `@tailwind` directives.
- [ ] **Assets**:
  - Update `index.html` with Google Fonts (Manrope) and Material Symbols.

## 2. Component Architecture
We will break down `main.txt` into the following React components:

- **Layout**:
  - `src/components/layout/Sidebar/Sidebar.jsx` (Navigation & Logo)
  - `src/components/layout/Header/Header.jsx` (Topbar)
  - `src/components/layout/MainLayout/MainLayout.jsx` (Wrapper)
- **Dashboard**:
  - `src/pages/Dashboard/DashboardPage.jsx` (Main container)
  - `src/pages/Dashboard/components/KPIGrid.jsx` (The 4 cards)
  - `src/pages/Dashboard/components/RevenueChart.jsx` (Line chart)
  - `src/pages/Dashboard/components/StoreRanking.jsx` (Bar chart)
  - `src/pages/Dashboard/components/StoreTable.jsx` (Data table)

## 3. Implementation Steps
1.  **Setup CSS & Config**: Ensure styles match the design system.
2.  **Create Layout Components**: Sidebar and Header.
3.  **Create Dashboard Components**: Isolate the complex parts (Charts, Table).
4.  **Assemble Page**: Combine everything in `DashboardPage.jsx`.
5.  **Route**: Add route in `App.jsx`.

## 4. Verification
- [ ] Run `npm run dev` and verify visual parity with `main.txt`.
- [ ] Check responsive behavior (Sidebar/Grid).
