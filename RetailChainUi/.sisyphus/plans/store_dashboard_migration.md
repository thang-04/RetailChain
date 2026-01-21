# Store Dashboard Migration Plan

## 1. Objective
Implement "Store A Dashboard Overview" from `template/mainA.html` as a new page in the React application, strictly adhering to `AGENTS.md` (shadcn/ui + Tailwind).

## 2. Architecture
- **Route**: `/store` (Store Level Dashboard).
- **Directory**: `src/pages/StoreDashboard/`
- **Components**:
  - `StoreDashboardPage.jsx`: Main container.
  - `components/StoreKPIGrid.jsx`: Revenue, Orders, Low Stock, Active Staff.
  - `components/StoreRevenueChart.jsx`: Area chart visualization.
  - `components/RecentOrdersTable.jsx`: Sales orders table.
  - `components/LowInventoryTable.jsx`: Low stock products table.

## 3. Implementation Details
- **UI Library**: Use `shadcn/ui` (Card, Table, Badge, Button, Input, Select, Avatar, Separator).
- **Icons**: Use Material Symbols (existing) or Lucide (shadcn default). *Decision: Stick to Material Symbols to match `mainA.html` logic unless Lucide is preferred. `mainA.html` uses Material Symbols.*
- **Layout**: Reuse `MainLayout` (Sidebar + Header). *Note: `mainA.html` has a slightly different Sidebar style ("Retail Mgr"). We should check if we update the global Sidebar or just render content. Use global Sidebar for consistency, but update content if needed.* -> **Decision**: Reuse global `MainLayout` but render the specific dashboard content. The user wants the *interface*, so I will focus on the main content area first.

## 4. Steps
1.  **Scaffold**: Create directories and files.
2.  **Components**: Implement `StoreKPIGrid`, `StoreRevenueChart`, `RecentOrdersTable`, `LowInventoryTable`.
3.  **Page**: Assemble `StoreDashboardPage`.
4.  **Routing**: Update `App.jsx` to include `/store` route.
5.  **Verification**: Ensure styling matches `mainA.html` using Tailwind v4.

