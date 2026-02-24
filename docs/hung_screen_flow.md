# Screen Flow Documentation - Các Chức Năng Của hung

---

## 1. Tổng Quan Navigation

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    MAIN NAVIGATION STRUCTURE                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────────┐
                                    │   Dashboard    │
                                    │      (/)       │
                                    └────────┬────────┘
                                             │
            ┌────────────────────────────────┼────────────────────────────────┐
            │                                │                                │
            ▼                                ▼                                ▼
┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
│  Store Management  │         │  Product Module   │         │  Inventory Module │
│    (/store)        │         │   (/products)     │         │   (/inventory)    │
└─────────┬─────────┘         └─────────┬─────────┘         └────────┬──────────┘
          │                             │                              │
          ▼                             ▼                              ▼
┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
│ Store Dashboard   │         │ Product Detail    │         │  Stock Ledger     │
│ /store/:id        │         │ /products/:id    │         │/inventory/ledger │
└───────────────────┘         └───────────────────┘         └───────────────────┘

          │                                                           │
          ▼                             ▼                              ▼
┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
│ Store Inventory   │         │                   │         │    Stock In       │
│ /store/:id/      │         │                   │         │   (/stock-in)     │
│ inventory        │         │                   │         └─────────┬─────────┘
└───────────────────┘         │                   │                   │
          │                   │                   │                   ▼
          ▼                   │                   │         ┌───────────────────┐
┌───────────────────┐         │                   │         │ Create Stock In   │
│   Store Staff     │         │                   │         │/stock-in/create  │
│ /store/:id/staff │         │                   │         └───────────────────┘
└───────────────────┘         │                   │                   │
                              │                   │                   ▼
                              │                   │         ┌───────────────────┐
                              │                   │         │    Stock Out      │
                              │                   │         │  (/stock-out)     │
                              │                   │         └─────────┬─────────┘
                              │                   │                   │
                              │                   │                   ▼
                              │                   │         ┌───────────────────┐
                              │                   │         │Create Stock Out   │
                              │                   │         │/stock-out/create │
                              │                   │         └───────────────────┘
                              │                   │
                              │                   ▼
                              │         ┌───────────────────┐
                              │         │   Warehouse       │
                              │         │  (/warehouse)     │
                              │         └───────────────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    Reports        │
                    │   (/reports)      │
                    └───────────────────┘

          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│    Staff List     │   │ Staff Calendar    │   │    Staff          │
│    (/staff)       │   │(/staff/calendar)  │   │  Attendance       │
└───────────────────┘   └───────────────────┘   │(/staff/attendance)│
                                                └───────────────────┘
          │
          ▼
┌───────────────────┐
│  Staff Profile   │
│/staff/profile/:id│
└───────────────────┘

          │
          ▼
┌───────────────────┐
│Resource Assignment│
│ /staff/resource  │
└───────────────────┘
```

---

## 2. Module Product - Screen Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 PRODUCT MODULE SCREEN FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Product Page                │
│        (/products)                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     ProductHeader            │   │
│  │  - Title "Quản Lý Sản Phẩm" │   │
│  │  - Add Product Button       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     ProductFilter           │   │
│  │  - Search Input            │   │
│  │  - Category Select         │   │
│  │  - Status Filter           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     ProductTable             │   │
│  │  - List of products         │   │
│  │  - Click row → Navigate     │───┘
│  │    /products/:id             │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
              │
              │ Click product row
              ▼
┌─────────────────────────────────────┐
│       Product Chain View            │
│       (/products/:id)                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Product Info Card         │   │
│  │  - Product Name, Code       │   │
│  │  - Price, Category          │   │
│  │  - Image, Description       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Variants Table            │   │
│  │  - SKU, Size, Color         │   │
│  │  - Stock per warehouse      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Stock by Store            │   │
│  │  - Store name               │   │
│  │  - Quantity available      │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Back to Products]                │
└─────────────────────────────────────┘

```

### Product Screen Flow Details

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           PRODUCT CREATE/EDIT FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────────────────┘

START: ProductPage
       │
       │ Click "Add Product" button
       ▼
┌──────────────────────┐
│  Create Product     │
│  Modal / Page        │
│                      │
│  Fields:             │
│  - Code (*)          │
│  - Name (*)          │
│  - Price (*)         │
│  - Category          │
│  - Description       │
│  - Image URL         │
│                      │
│  [Cancel] [Save]    │
└──────────┬───────────┘
           │
           │ Save Success
           ▼
    ┌──────────────┐
    │  Call API    │
    │ POST /api/  │
    │   product    │
    └──────┬───────┘
           │
           │ Response OK
           ▼
    ┌──────────────┐
    │  Show Toast  │
    │ "Thêm sản    │
    │  phẩm thành  │
    │  công"       │
    └──────┬───────┘
           │
           ▼
       [Refresh List]
           │
           ▼
    BACK TO LIST
```

---

## 3. Module Inventory - Screen Flow

### 3.1 Stock In Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 STOCK IN SCREEN FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│        Stock In List Page           │
│         (/stock-in)                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Header                   │   │
│  │  - Title "Quản Lý Nhập Kho" │   │
│  │  - Import Excel Button       │   │
│  │  - Create New Button  ───────┼───┐
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Filter Bar               │   │
│  │  - Search (code, supplier,   │   │
│  │    warehouse)                │   │
│  │  - Status Select (All/       │   │
│  │    Pending/Completed/        │   │
│  │    Cancelled)               │   │
│  │  - Date Range (Start/End)   │   │
│  │  - Reset Button             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Data Table               │   │
│  │  - STT, Document Code       │   │
│  │  - Date, Supplier           │   │
│  │  - Target Warehouse         │   │
│  │  - Items, Total Value       │   │
│  │  - Status Badge             │   │
│  │  - Actions (View/Edit/      │   │
│  │    Delete)                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Pagination               │   │
│  │  - Items per page (5/10/20) │   │
│  │  - Page navigation          │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
              │
              │ Click "Tạo Phiếu Mới" / "Create New"
              ▼
┌─────────────────────────────────────┐
│       Create Stock In Page          │
│      (/stock-in/create)             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Form Fields              │   │
│  │                              │   │
│  │  1. Supplier Selection      │   │
│  │     [Select Supplier ▼]     │   │
│  │                              │   │
│  │  2. Target Warehouse        │   │
│  │     [Select Warehouse ▼]   │   │
│  │                              │   │
│  │  3. Products Table          │   │
│  │     - Add Product           │   │
│  │     - Enter Quantity        │   │
│  │     - Enter Unit Price      │   │
│  │                              │   │
│  │  4. Note                    │   │
│  │     [Textarea]              │   │
│  │                              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Summary                  │   │
│  │  - Total Items: X          │   │
│  │  - Total Value: X VND      │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Cancel]              [Save]     │
└─────────────────────────────────────┘
              │
              │ Submit
              ▼
┌─────────────────────────────┐
│    Call API                │
│  POST /api/inventory/import│
└────────────┬──────────────┘
             │
             │ Success
             ▼
┌─────────────────────────────┐
│   Redirect to Stock In List │
│   Show success toast        │
└─────────────────────────────┘
```

### 3.2 Stock Out Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 STOCK OUT SCREEN FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│        Stock Out List Page          │
│         (/stock-out)                │
│                                     │
│  [Similar to Stock In List]         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Header                   │   │
│  │  - Title "Quản Lý Xuất Kho" │   │
│  │  - Create New Button ────────┼───┐
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Filter Bar               │   │
│  │  - Search, Status, Date     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Data Table               │   │
│  │  - Document Code             │   │
│  │  - Date, Target Store       │   │
│  │  - Items, Value, Status     │   │
│  │  - Actions                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Pagination               │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
              │
              │ Click "Tạo Phiếu Mới"
              ▼
┌─────────────────────────────────────┐
│       Create Stock Out Page         │
│      (/stock-out/create)            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Form Fields              │   │
│  │                              │   │
│  │  1. Source Warehouse        │   │
│  │     [Select Warehouse ▼]   │   │
│  │                              │   │
│  │  2. Target Store            │   │
│  │     [Select Store ▼]       │   │
│  │                              │   │
│  │  3. Products Table          │   │
│  │     - Add Product           │   │
│  │     - Check Stock Available │   │
│  │     - Enter Quantity       │   │
│  │                              │   │
│  │  4. Reason/Note             │   │
│  │     [Textarea]              │   │
│  │                              │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Cancel]              [Save]     │
└─────────────────────────────────────┘
              │
              │ Submit → API /api/inventory/export
              ▼
       [Redirect to List + Success Toast]
```

### 3.3 Transfer Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 TRANSFER SCREEN FLOW                                        │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│       Transfer List Page            │
│        (/transfer)                  │
│                                     │
│  [Similar structure to Stock In/Out]│
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Header                   │   │
│  │  - Title "Chuyển Kho"        │   │
│  │  - Create New Button         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Filter Bar               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Data Table               │   │
│  │  - Transfer Code            │   │
│  │  - From Warehouse           │   │
│  │  - To Warehouse             │   │
│  │  - Date, Status, Actions    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Pagination               │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
              │
              │ Click "Tạo Phiếu Mới"
              ▼
┌─────────────────────────────────────┐
│       Create Transfer Page          │
│       (/transfer/create)            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Form Fields              │   │
│  │                              │   │
│  │  1. Source Warehouse        │   │
│  │     [Select ▼]              │   │
│  │                              │   │
│  │  2. Destination Warehouse   │   │
│  │     [Select ▼]              │   │
│  │                              │   │
│  │  3. Products                │   │
│  │     - Select Product        │   │
│  │     - Check stock           │   │
│  │     - Enter quantity        │   │
│  │                              │   │
│  │  4. Note                    │   │
│  │                              │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Cancel]              [Save]     │
└─────────────────────────────────────┘
              │
              │ Submit → API /api/inventory/transfer
              ▼
       [Redirect + Success Toast]
```

### 3.4 Inventory Page & Stock Ledger

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            INVENTORY OVERVIEW SCREEN FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│        Inventory Page               │
│        (/inventory)                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Stats Cards              │   │
│  │  - Total Products            │   │
│  │  - Total Stock Value         │   │
│  │  - Low Stock Items           │   │
│  │  - Out of Stock             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     InventoryTable           │   │
│  │  - Product Name             │   │
│  │  - SKU                     │   │
│  │  - Warehouse               │   │
│  │  - Quantity                │   │
│  │  - Status                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  [View Ledger] ────────────────────┘
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Pagination               │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
              │
              │ Click "View Ledger"
              ▼
┌─────────────────────────────────────┐
│        Stock Ledger Page            │
│     (/inventory/ledger)              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Header                   │   │
│  │  - Title "Sổ Kho"          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Filter Bar               │   │
│  │  - Product Select            │   │
│  │  - Warehouse Select          │   │
│  │  - Date Range               │   │
│  │  - Action Type (IN/OUT/     │   │
│  │    TRANSFER)                │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Ledger Table             │   │
│  │  - Date                     │   │
│  │  - Document Code            │   │
│  │  - Action (Nhập/Xuất/       │   │
│  │    Chuyển)                 │   │
│  │  - Product                  │   │
│  │  - Warehouse (In/Out)       │   │
│  │  - Quantity                 │   │
│  │  - Balance                  │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 3.5 Warehouse Management

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                               WAREHOUSE SCREEN FLOW                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│       Warehouse List Page           │
│        (/warehouse)                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Header                   │   │
│  │  - Title "Quản Lý Kho"      │   │
│  │  - Add Warehouse Button ────┼───┐
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Filter Bar               │   │
│  │  - Search by name           │   │
│  │  - Type Filter              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Warehouse Cards          │   │
│  │  - Warehouse Name           │   │
│  │  - Address                  │   │
│  │  - Type (Central/Branch)    │   │
│  │  - Total Products           │   │
│  │  - Actions: View/Edit/Delete│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Pagination               │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
              │
              │ Click "Add Warehouse" / "Edit"
              ▼
┌─────────────────────────────────────┐
│    Create/Edit Warehouse Modal      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Form Fields              │   │
│  │                              │   │
│  │  - Name (*)                  │   │
│  │  - Address (*)               │   │
│  │  - Type: Central / Branch   │   │
│  │                              │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Cancel]              [Save]     │
└─────────────────────────────────────┘
              │
              │ Submit → API POST/PUT /api/inventory/warehouse
              ▼
       [Close Modal + Refresh + Toast]
```

---

## 4. Module Store - Screen Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 STORE MODULE SCREEN FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Store Page                  │
│        (/store)                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Header                   │   │
│  │  - Title "Store Management" │   │
│  │  - Add Store Button ────────┼───┐
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Filter Bar               │   │
│  │  - Search by name/code      │   │
│  │  - Status Filter            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Store List/Grid          │   │
│  │  - Store Name               │   │
│  │  - Code                     │   │
│  │  - Address                  │   │
│  │  - Phone                    │   │
│  │  - Status                   │   │
│  │  - Click → /store/:id       │───┘
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Pagination               │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
              │
              │ Click Add Store Button
              ▼
┌─────────────────────────────────────┐
│       Add Store Modal               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Form Fields              │   │
│  │                              │   │
│  │  - Code (*)                 │   │
│  │  - Name (*)                 │   │
│  │  - Address (*)              │   │
│  │  - Phone                    │   │
│  │                              │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Cancel]              [Save]     │
└─────────────────────────────────────┘
              │
              │ Click Store Card/Row
              ▼
┌─────────────────────────────────────┐
│      Store Dashboard Page           │
│      (/store/:id)                   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Store Info               │   │
│  │  - Store Name, Code          │   │
│  │  - Address, Phone            │   │
│  │  - Edit Button              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     KPI Cards                │   │
│  │  - Today's Revenue          │   │
│  │  - Orders                   │   │
│  │  - Customers                │   │
│  │  - Rating                   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Quick Actions            │   │
│  │  - [View Inventory] ─────────┼───┐
│  │  - [View Staff] ────────────┼───┤
│  │  - [Edit Store]             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Recent Orders Table      │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Back to Store List]              │
└─────────────────────────────────────┘
              │
              │ Click "View Inventory"
              ▼
┌─────────────────────────────────────┐
│   Store Inventory Detail Page       │
│   (/store/:id/inventory)             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Header                   │   │
│  │  - Store Name + "Inventory" │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Inventory Table          │   │
│  │  - Product                  │   │
│  │  - SKU                     │   │
│  │  - Quantity                 │   │
│  │  - Status                   │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Back to Store Dashboard]         │
└─────────────────────────────────────┘

              │
              │ Click "View Staff"
              ▼
┌─────────────────────────────────────┐
│      Store Staff Page               │
│      (/store/:id/staff)              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Header                   │   │
│  │  - Store Name + "Staff"     │   │
│  │  - Add Staff Button         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Staff List               │   │
│  │  - Name, Role               │   │
│  │  - Phone                    │   │
│  │  - Status                   │   │
│  │  - Actions                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Back to Store Dashboard]         │
└─────────────────────────────────────┘
```

---

## 5. Module Dashboard & Reports - Screen Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              DASHBOARD & REPORTS FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Dashboard Page              │
│            (/)                       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     KPI Grid                 │   │
│  │  - Total Revenue            │   │
│  │  - Total Orders             │   │
│  │  - Total Stores             │   │
│  │  - Total Products           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Revenue Chart            │   │
│  │  - Line/Bar Chart          │   │
│  │  - By day/week/month       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Store Ranking            │   │
│  │  - Top stores by revenue   │   │
│  └─────────────────────────────┘   │
│                                     │
│  [View Reports] ───────────────────┘
│                                     │
└─────────────────────────────────────┘
              │
              │ Click "View Reports"
              ▼
┌─────────────────────────────────────┐
│      Executive Reports Page         │
│         (/reports)                   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Report Header            │   │
│  │  - Title "Báo Cáo Tổng Hợp"│   │
│  │  - Date Range Picker        │   │
│  │  - Export Button            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Executive Summary        │   │
│  │  - Revenue Analysis         │   │
│  │  - Store Performance        │   │
│  │  - Product Performance      │   │
│  │  - Staff Performance        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Charts & Graphs          │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 6. Module Staff - Screen Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 STAFF MODULE SCREEN FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│        Staff List Page              │
│          (/staff)                    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Header                   │   │
│  │  - Title "Nhân Viên"        │   │
│  │  - Add Staff Button         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Filter Bar               │   │
│  │  - Search                    │   │
│  │  - Store Filter              │   │
│  │  - Status Filter             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Staff Table              │   │
│  │  - Name, Code               │   │
│  │  - Store                    │   │
│  │  - Role                     │   │
│  │  - Status                   │   │
│  │  - Click → /staff/profile/  │───┘
│  │    :id                       │
│  └─────────────────────────────┘   │
│                                     │
│  [Calendar] ───────────────────────┘
│                                     │
│  [Attendance] ──────────────────────┘
│                                     │
│  [Resource Assignment] ────────────┘
└─────────────────────────────────────┘
              │
              │ Click Staff Row
              ▼
┌─────────────────────────────────────┐
│       Staff Profile Page            │
│     (/staff/profile/:id)             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Staff Info Card          │   │
│  │  - Avatar, Name             │   │
│  │  - Code, Role               │   │
│  │  - Store, Contact           │   │
│  │  - Edit Button              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Work History             │   │
│  │  - Shifts                   │   │
│  │  - Attendance               │   │
│  │  - Performance              │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘

              │
              │ Click "Calendar"
              ▼
┌─────────────────────────────────────┐
│      Staff Calendar Page            │
│     (/staff/calendar)                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Calendar View            │   │
│  │  - Monthly Calendar         │   │
│  │  - Shift schedules          │   │
│  │  - Drag & Drop (if enabled) │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Legend / Filters         │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

              │
              │ Click "Attendance"
              ▼
┌─────────────────────────────────────┐
│     Staff Attendance Page            │
│    (/staff/attendance)               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Attendance Table          │   │
│  │  - Staff Name               │   │
│  │  - Date                     │   │
│  │  - Check In Time            │   │
│  │  - Check Out Time           │   │
│  │  - Status                   │   │
│  │  - Notes                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Date Picker              │   │
│  │  - Filter by date range     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

              │
              │ Click "Resource Assignment"
              ▼
┌─────────────────────────────────────┐
│   Resource Assignment Page          │
│     (/staff/resource)                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Assignment Matrix        │   │
│  │  - Staff vs Stores          │   │
│  │  - Shift assignments        │   │
│  │  - Drag & Drop to assign   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Save / Reset Buttons    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 7. Screen Flow Summary Table

| Module | Page | Path | Parent | Key Actions |
|--------|------|------|--------|-------------|
| **Dashboard** | Dashboard | `/` | - | View KPIs, Charts |
| | Reports | `/reports` | Dashboard | View Executive Reports |
| **Product** | Product List | `/products` | - | List, Filter, Search |
| | Product Detail | `/products/:id` | Product List | View Product Chain |
| **Store** | Store List | `/store` | - | List, Add, Filter |
| | Store Dashboard | `/store/:id` | Store List | View Dashboard |
| | Store Inventory | `/store/:id/inventory` | Store Dashboard | View Store Stock |
| | Store Staff | `/store/:id/staff` | Store Dashboard | View Store Staff |
| **Warehouse** | Warehouse List | `/warehouse` | - | List, Add, Edit |
| **Inventory** | Inventory Overview | `/inventory` | - | View Stock Overview |
| | Stock Ledger | `/inventory/ledger` | Inventory | View Transaction History |
| | Stock In List | `/stock-in` | - | List Stock In |
| | Create Stock In | `/stock-in/create` | Stock In List | Create Stock In |
| | Stock Out List | `/stock-out` | - | List Stock Out |
| | Create Stock Out | `/stock-out/create` | Stock Out List | Create Stock Out |
| | Transfer List | `/transfer` | - | List Transfers |
| | Create Transfer | `/transfer/create` | Transfer List | Create Transfer |
| **Staff** | Staff List | `/staff` | - | List Staff |
| | Staff Profile | `/staff/profile/:id` | Staff List | View/Edit Profile |
| | Staff Calendar | `/staff/calendar` | Staff | View Shifts |
| | Staff Attendance | `/staff/attendance` | Staff | View Attendance |
| | Resource Assignment | `/staff/resource` | Staff | Assign Resources |

---

## 8. User Interaction Patterns

### 8.1 Common Navigation Flow
```
┌─────────────────────────────────────────────────────────────┐
│                    COMMON INTERACTION PATTERNS               │
└─────────────────────────────────────────────────────────────┘

Pattern 1: List → Detail → Back
────────────────────────────────
[List Page] → Click Item → [Detail Page] → [Back Button] → [List Page]


Pattern 2: List → Create → List
────────────────────────────────
[List Page] → Click "Add New" → [Create Form] → Submit → [List Page + Toast]


Pattern 3: List → Edit → List  
────────────────────────────────
[List Page] → Click Edit → [Edit Form] → Submit → [List Page + Toast]


Pattern 4: List → Delete → Confirm → List
────────────────────────────────────────
[List Page] → Click Delete → [Confirm Dialog] → Confirm → [List Page + Toast]


Pattern 5: Filter → List → Pagination
─────────────────────────────────────
[Filter Form] → Apply Filter → [Filtered List] → Select Page → [Paginated List]
```

### 8.2 Modal vs Page Patterns
```
┌─────────────────────────────────────────────────────────────┐
│                    MODAL VS PAGE PATTERNS                    │
└─────────────────────────────────────────────────────────────┘

MODAL (Quick Actions)
─────────────────────
- Add Store Modal
- Edit Store Modal
- Add Warehouse Modal
- Edit Warehouse Modal
- Confirm Delete Dialog
- View Detail Dialog

PAGE (Complex Flows)
────────────────────
- Create Stock In (/stock-in/create)
- Create Stock Out (/stock-out/create)
- Create Transfer (/transfer/create)
- Product Detail (/products/:id)
- Store Dashboard (/store/:id)
- Staff Profile (/staff/profile/:id)
```

---

*Tài liệu được tạo tự động từ phân tích frontend codebase*
