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
import ProductChainView from "../pages/Product/ProductDetail/ProductChainView";

// Inventory
import InventoryPage from "../pages/Inventory/InventoryPage";
import StockLedger from "../pages/Inventory/StockLedger";
import StockInList from "../pages/StockIn/StockInList";
import CreateStockIn from "../pages/StockIn/CreateStockIn";

// Stock Out
import StockOutList from "../pages/StockOut/StockOutList";
import CreateStockOut from "../pages/StockOut/CreateStockOut";

// Transfer


// Staff
import StaffList from "../pages/Staff/StaffList/StaffList";
import StaffCalendar from "../pages/Staff/ShiftCalendar/StaffCalendar";
import StaffAttendance from "../pages/Staff/Attendance/StaffAttendance";
import StaffProfile from "../pages/Staff/Profile/StaffProfile";
import ResourceAssignment from "../pages/Staff/ResourceAssignment/ResourceAssignment";

// Warehouse
import WarehouseListPage from "../pages/Warehouse/WarehouseListPage";
// import WarehouseDetail from "../pages/Warehouse/WarehouseDetail"; // Unused or replace if you have detail page

// Auth
import LoginPage from "../pages/Auth/LoginPage/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage/RegisterPage";

// Role & Permission
import RolePermissionPage from "../pages/RolePermission/RolePermissionPage";

// Route Protection
import ProtectedRoute from "../components/common/ProtectedRoute/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        {/* Dashboard & Reports */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/reports" element={<ExecutiveReport />} />

        {/* Store Module */}
        <Route path="/store" element={<StorePage />} />
        <Route path="/store/:id" element={<StoreDashboardPage />} />
        <Route path="/store/:id/inventory" element={<StoreInventoryDetail />} />
        <Route path="/store/:id/staff" element={<StoreStaffPage />} />

        {/* Warehouse Module */}
        <Route path="/warehouse" element={<WarehouseListPage />} />
        {/* <Route path="/warehouse/:id" element={<WarehouseDetail />} /> */}

        {/* Product Module */}
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductChainView />} />

        {/* Inventory Module */}
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/ledger" element={<StockLedger />} />

        {/* Stock In, Out, Transfer */}
        <Route path="/stock-in" element={<StockInList />} />
        <Route path="/stock-in/create" element={<CreateStockIn />} />

        <Route path="/stock-out" element={<StockOutList />} />
        <Route path="/stock-out/create" element={<CreateStockOut />} />



        {/* Staff Module */}
        <Route path="/staff" element={<StaffList />} />
        <Route path="/staff/calendar" element={<StaffCalendar />} />
        <Route path="/staff/attendance" element={<StaffAttendance />} />
        <Route path="/staff/profile/:id" element={<StaffProfile />} />
        <Route path="/staff/resource" element={<ResourceAssignment />} />

        {/* Role & Permission Management (Super Admin) */}
        <Route path="/roles" element={<RolePermissionPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
