import { Suspense, lazy } from 'react';
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy load all page components for code splitting
const LoginPage = lazy(() => import("../pages/Auth/LoginPage"));
const ForbiddenPage = lazy(() => import("../pages/Auth/ForbiddenPage"));

const DashboardPage = lazy(() => import("../pages/Dashboard/DashboardPage"));
const ExecutiveReport = lazy(() => import("../pages/Reports/ExecutiveReport"));

const StorePage = lazy(() => import("../pages/Store/StorePage"));
const StoreDashboardPage = lazy(() => import("../pages/StoreDashboard/StoreDashboardPage"));
const StoreInventoryDetail = lazy(() => import("../pages/StoreDashboard/StoreInventoryDetail"));
const StoreStaffPage = lazy(() => import("../pages/StoreDashboard/StoreStaffPage"));

const ProductPage = lazy(() => import("../pages/Product/ProductPage"));
const ProductDetailPage = lazy(() => import("../pages/Product/ProductDetailPage"));
const ProductEditPage = lazy(() => import("../pages/Product/ProductEditPage"));
const ProductCategoryPage = lazy(() => import("../pages/Product/ProductCategoryPage"));

const InventoryPage = lazy(() => import("../pages/Inventory/InventoryPage"));
const StockLedger = lazy(() => import("../pages/Inventory/StockLedger"));
const StockInList = lazy(() => import("../pages/StockIn/StockInList"));
const CreateStockIn = lazy(() => import("../pages/StockIn/CreateStockIn"));

const StockOutList = lazy(() => import("../pages/StockOut/StockOutList"));
const CreateStockOut = lazy(() => import("../pages/StockOut/CreateStockOut"));

const StaffList = lazy(() => import("../pages/Staff/StaffList/StaffList"));
const StaffCalendar = lazy(() => import("../pages/Staff/ShiftCalendar/StaffCalendar"));
const StaffShiftsPage = lazy(() => import("../pages/Staff/StaffShifts/StaffShiftsPage"));
const StaffAttendance = lazy(() => import("../pages/Staff/Attendance/StaffAttendance"));
const StaffProfile = lazy(() => import("../pages/Staff/Profile/StaffProfile"));
const ResourceAssignment = lazy(() => import("../pages/Staff/ResourceAssignment/ResourceAssignment"));

const WarehouseListPage = lazy(() => import("../pages/Warehouse/WarehouseListPage"));

const RolePermissionPage = lazy(() => import("../pages/RolePermission/RolePermissionPage"));

const UserManagementPage = lazy(() => import("../pages/UserManagement/UserManagementPage"));

const ProfilePage = lazy(() => import("../pages/Profile/ProfilePage"));

const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
);

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/403" element={<ForbiddenPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        {/* Dashboard & Reports - All authenticated users */}
                        <Route path="/" element={<DashboardPage />} />
                        <Route 
                            path="/reports" 
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']}>
                                    <ExecutiveReport />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Store Module - SUPER_ADMIN only */}
                        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
                            <Route path="/store" element={<StorePage />} />
                        </Route>
                        <Route path="/store/:id" element={<StoreDashboardPage />} />
                        <Route path="/store/:id/inventory" element={<StoreInventoryDetail />} />
                        <Route 
                            path="/store/:id/staff" 
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']}>
                                    <StoreStaffPage />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Warehouse Module - SUPER_ADMIN only */}
                        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
                            <Route path="/warehouse" element={<WarehouseListPage />} />
                        </Route>

                        {/* Product Module - All roles can view */}
                        <Route path="/products" element={<ProductPage />} />
                        <Route 
                            path="/products/create" 
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']}>
                                    <ProductEditPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/products/categories" 
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']}>
                                    <ProductCategoryPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route path="/products/:slug" element={<ProductDetailPage />} />
                        <Route 
                            path="/products/:slug/edit" 
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']}>
                                    <ProductEditPage />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Inventory Module - All roles can view */}
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/inventory/ledger" element={<StockLedger />} />

                        {/* Stock In - VIEW for all, CREATE for STORE_MANAGER+ */}
                        <Route path="/stock-in" element={<StockInList />} />
                        <Route 
                            path="/stock-in/create" 
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']}>
                                    <CreateStockIn />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Stock Out - VIEW for all, CREATE for STORE_MANAGER+ */}
                        <Route path="/stock-out" element={<StockOutList />} />
                        <Route 
                            path="/stock-out/create" 
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']}>
                                    <CreateStockOut />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Staff Module - STORE_MANAGER+ for management */}
                        <Route 
                            path="/staff" 
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']}>
                                    <StaffList />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/staff/shifts" 
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']}>
                                    <StaffShiftsPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/store/:id/shifts" 
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']}>
                                    <StaffShiftsPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route path="/staff/calendar" element={<StaffCalendar />} />
                        <Route 
                            path="/staff/attendance" 
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']}>
                                    <StaffAttendance />
                                </ProtectedRoute>
                            } 
                        />
                        <Route path="/staff/profile/:id" element={<StaffProfile />} />
                        <Route 
                            path="/staff/resource" 
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']}>
                                    <ResourceAssignment />
                                </ProtectedRoute>
                            } 
                        />

                        {/* User Management - STORE_MANAGER+ */}
                        <Route 
                            path="/users" 
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STORE_MANAGER']}>
                                    <UserManagementPage />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Profile - All authenticated users */}
                        <Route path="/profile" element={<ProfilePage />} />

                        {/* Role & Permission - SUPER_ADMIN only */}
                        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
                            <Route path="/roles" element={<RolePermissionPage />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
