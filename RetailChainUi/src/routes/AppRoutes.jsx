import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout/MainLayout";

// Dashboard
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ExecutiveReport from "../pages/Reports/ExecutiveReport";

// Store
import StorePage from "../pages/Store/StorePage";
import StoreDashboardPage from "../pages/StoreDashboard/StoreDashboardPage";
import StoreInventoryDetail from "../pages/StoreDashboard/InventoryDetail/StoreInventoryDetail";

// Product
import ProductPage from "../pages/Product/ProductPage";
import ProductChainView from "../pages/Product/ProductDetail/ProductChainView";

// Inventory
import InventoryPage from "../pages/Inventory/InventoryPage";
import StockLedger from "../pages/Inventory/StockLedger";
import StockInList from "../pages/StockIn/StockInList";

// Staff
import StaffList from "../pages/Staff/StaffList/StaffList";
import StaffCalendar from "../pages/Staff/ShiftCalendar/StaffCalendar";
import StaffAttendance from "../pages/Staff/Attendance/StaffAttendance";
import StaffProfile from "../pages/Staff/Profile/StaffProfile";
import ResourceAssignment from "../pages/Staff/ResourceAssignment/ResourceAssignment";

// Warehouse
import WarehouseList from "../pages/Warehouse/WarehouseList";
import WarehouseDetail from "../pages/Warehouse/WarehouseDetail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Dashboard & Reports */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/reports" element={<ExecutiveReport />} />

        {/* Store Module */}
        <Route path="/store" element={<StorePage />} />
        <Route path="/store/:id" element={<StoreDashboardPage />} />
        <Route path="/store/:id/inventory" element={<StoreInventoryDetail />} />

        {/* Warehouse Module */}
        <Route path="/warehouse" element={<WarehouseList />} />
        <Route path="/warehouse/:id" element={<WarehouseDetail />} />

        {/* Product Module */}
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductChainView />} />

        {/* Inventory Module */}
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/ledger" element={<StockLedger />} />
        <Route path="/stock-in" element={<StockInList />} />

        {/* Staff Module */}
        <Route path="/staff" element={<StaffList />} />
        <Route path="/staff/calendar" element={<StaffCalendar />} />
        <Route path="/staff/attendance" element={<StaffAttendance />} />
        <Route path="/staff/profile/:id" element={<StaffProfile />} />
        <Route path="/staff/resource" element={<ResourceAssignment />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
