import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout/MainLayout";

// Dashboard
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ExecutiveReport from "../pages/Reports/ExecutiveReport";

// Store
import StorePage from "../pages/Store/StorePage";
import StoreDashboardPage from "../pages/StoreDashboard/StoreDashboardPage";
import StoreInventoryDetail from "../pages/StoreDashboard/StoreInventoryDetail";
import StoreStaffPage from "../pages/StoreDashboard/StoreStaffPage";

// Product
import ProductPage from "../pages/Product/ProductPage";
import ProductDetailPage from "../pages/Product/ProductDetailPage";
import ProductEditPage from "../pages/Product/ProductEditPage";

// Inventory
import InventoryPage from "../pages/Inventory/InventoryPage";
import StockLedger from "../pages/Inventory/StockLedger";
import StockInList from "../pages/StockIn/StockInList";
import CreateStockIn from "../pages/StockIn/CreateStockIn";

// Stock Out
import StockOutList from "../pages/StockOut/StockOutList";
import CreateStockOut from "../pages/StockOut/CreateStockOut";

// Staff
import StaffList from "../pages/Staff/StaffList/StaffList";
import StaffCalendar from "../pages/Staff/ShiftCalendar/StaffCalendar";
import StaffShiftsPage from "../pages/Staff/StaffShifts/StaffShiftsPage";
import StaffAttendance from "../pages/Staff/Attendance/StaffAttendance";
import StaffProfile from "../pages/Staff/Profile/StaffProfile";
import ResourceAssignment from "../pages/Staff/ResourceAssignment/ResourceAssignment";

// Warehouse
import WarehouseListPage from "../pages/Warehouse/WarehouseListPage";

import RolePermissionPage from "../pages/RolePermission/RolePermissionPage";

// User Management
import UserManagementPage from "../pages/UserManagement/UserManagementPage";

// Auth
import LoginPage from "../pages/Auth/LoginPage";
import ForbiddenPage from "../pages/Auth/ForbiddenPage";
import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<ForbiddenPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Dashboard & Reports */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/reports" element={<ExecutiveReport />} />

          {/* Store Module */}
          <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
            <Route path="/store" element={<StorePage />} />
          </Route>
          <Route path="/store/:id" element={<StoreDashboardPage />} />
          <Route path="/store/:id/inventory" element={<StoreInventoryDetail />} />
          <Route path="/store/:id/staff" element={<StoreStaffPage />} />

          <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
            {/* Warehouse Module */}
            <Route path="/warehouse" element={<WarehouseListPage />} />
          </Route>

          {/* Product Module */}
          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/create" element={<ProductEditPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/products/:slug/edit" element={<ProductEditPage />} />

          {/* Inventory Module */}
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/ledger" element={<StockLedger />} />

          {/* Stock In, Out */}
          <Route path="/stock-in" element={<StockInList />} />
          <Route path="/stock-in/create" element={<CreateStockIn />} />

          <Route path="/stock-out" element={<StockOutList />} />
          <Route path="/stock-out/create" element={<CreateStockOut />} />

          {/* Staff Module */}
          <Route path="/staff" element={<StaffList />} />
          <Route path="/staff/shifts" element={<StaffShiftsPage />} />
          <Route path="/staff/calendar" element={<StaffCalendar />} />
          <Route path="/staff/attendance" element={<StaffAttendance />} />
          <Route path="/staff/profile/:id" element={<StaffProfile />} />
          <Route path="/staff/resource" element={<ResourceAssignment />} />

          {/* User Management */}
          <Route path="/users" element={<UserManagementPage />} />

          <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
            {/* Role & Permission Management */}
            <Route path="/roles" element={<RolePermissionPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
