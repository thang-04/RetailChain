package com.sba301.retailmanagement.enums;

/**
 * Enum chứa tất cả các permission trong hệ thống
 * 
 * Quy tắc đặt tên: RESOURCE_ACTION
 * 
 * Phân cấp quyền hạn:
 * - SUPER_ADMIN: Có tất cả quyền
 * - REGIONAL_ADMIN: Quản lý Store Manager, phân bổ Store/Warehouse trong vùng
 * - STORE_MANAGER: Quản lý Staff trong cửa hàng
 * - STAFF: Chỉ có quyền xem thông tin cá nhân và thao tác cơ bản
 */
public enum PermissionName {

    // ==================== SELF-SERVICE (Tất cả user đều có) ====================
    PROFILE_VIEW, // Xem thông tin cá nhân
    PROFILE_UPDATE, // Cập nhật thông tin cá nhân
    PASSWORD_CHANGE, // Đổi mật khẩu

    // ==================== STAFF MANAGEMENT (Store Manager+) ====================
    STAFF_VIEW, // Xem danh sách nhân viên (trong scope)
    STAFF_CREATE, // Tạo nhân viên mới (tự động gán scope của manager)
    STAFF_UPDATE, // Cập nhật thông tin nhân viên
    STAFF_DELETE, // Xóa/vô hiệu hóa nhân viên

    // ==================== STORE MANAGEMENT (Regional Admin+) ====================
    STORE_MANAGER_VIEW, // Xem danh sách Store Manager
    STORE_MANAGER_CREATE, // Tạo Store Manager
    STORE_MANAGER_UPDATE, // Cập nhật Store Manager
    STORE_MANAGER_DELETE, // Xóa Store Manager
    STORE_SCOPE_ASSIGN, // Gán Store cho Manager

    // ==================== REGIONAL MANAGEMENT (Super Admin) ====================
    REGIONAL_ADMIN_VIEW, // Xem danh sách Regional Admin
    REGIONAL_ADMIN_CREATE, // Tạo Regional Admin
    REGIONAL_ADMIN_UPDATE, // Cập nhật Regional Admin
    REGIONAL_ADMIN_DELETE, // Xóa Regional Admin
    WAREHOUSE_SCOPE_ASSIGN, // Gán Warehouse/Region cho Admin

    // ==================== SYSTEM CONFIGURATION (Super Admin only)
    // ====================
    PERMISSION_VIEW, // Xem danh sách permission
    PERMISSION_CREATE, // Tạo permission mới
    ROLE_VIEW, // Xem danh sách role
    ROLE_CREATE, // Tạo role mới
    ROLE_UPDATE, // Cập nhật role
    ROLE_DELETE, // Xóa role
    USER_BLOCK, // Khóa tài khoản user
    USER_UNBLOCK, // Mở khóa tài khoản user

    // ==================== STORE OPERATIONS (Store Manager+) ====================
    STORE_VIEW, // Xem thông tin cửa hàng
    STORE_CREATE, // Tạo cửa hàng mới
    STORE_UPDATE, // Cập nhật thông tin cửa hàng
    STORE_DELETE, // Xóa cửa hàng

    // ==================== WAREHOUSE OPERATIONS (Regional Admin+)
    // ====================
    WAREHOUSE_VIEW, // Xem thông tin kho
    WAREHOUSE_CREATE, // Tạo kho mới
    WAREHOUSE_UPDATE, // Cập nhật thông tin kho
    WAREHOUSE_DELETE, // Xóa kho

    // ==================== INVENTORY OPERATIONS ====================
    INVENTORY_VIEW, // Xem tồn kho (theo scope)
    INVENTORY_CREATE, // Tạo phiếu nhập/xuất
    INVENTORY_UPDATE, // Cập nhật tồn kho
    INVENTORY_TRANSFER, // Chuyển kho

    // ==================== PRODUCT OPERATIONS ====================
    PRODUCT_VIEW, // Xem sản phẩm
    PRODUCT_CREATE, // Tạo sản phẩm mới
    PRODUCT_UPDATE, // Cập nhật sản phẩm
    PRODUCT_DELETE, // Xóa sản phẩm

    // ==================== ORDER/SALES OPERATIONS (Staff+) ====================
    ORDER_VIEW, // Xem đơn hàng (theo scope)
    ORDER_CREATE, // Tạo đơn hàng (POS)
    ORDER_UPDATE, // Cập nhật đơn hàng
    ORDER_CANCEL, // Hủy đơn hàng

    // ==================== REPORT OPERATIONS ====================
    REPORT_STORE_VIEW, // Xem báo cáo cửa hàng
    REPORT_REGION_VIEW, // Xem báo cáo vùng
    REPORT_SYSTEM_VIEW, // Xem báo cáo toàn hệ thống

    // ==================== SUPPLIER OPERATIONS ====================
    SUPPLIER_VIEW,
    SUPPLIER_CREATE,
    SUPPLIER_UPDATE,
    SUPPLIER_DELETE
}
