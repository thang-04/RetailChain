package com.sba301.retailmanagement.security;

/**
 * Security Constants - Định nghĩa tất cả permission names cho @PreAuthorize
 * 
 * Phân cấp quyền hạn:
 * - SUPER_ADMIN: Có tất cả quyền
 * - REGIONAL_ADMIN: Quản lý vùng (Store Manager, Store, Warehouse trong vùng)
 * - STORE_MANAGER: Quản lý cửa hàng (Staff, đơn hàng, kho tại store)
 * - STAFF: Thao tác cơ bản (POS, xem thông tin)
 */
public final class SecurityConstants {

    private SecurityConstants() {
    }

    // ==================== SELF-SERVICE (Tất cả user) ====================
    public static final String PROFILE_VIEW = "PROFILE_VIEW";
    public static final String PROFILE_UPDATE = "PROFILE_UPDATE";
    public static final String PASSWORD_CHANGE = "PASSWORD_CHANGE";

    // ==================== STAFF MANAGEMENT (Store Manager+) ====================
    public static final String STAFF_VIEW = "STAFF_VIEW";
    public static final String STAFF_CREATE = "STAFF_CREATE";
    public static final String STAFF_UPDATE = "STAFF_UPDATE";
    public static final String STAFF_DELETE = "STAFF_DELETE";

    // ==================== STORE MANAGER MANAGEMENT (Regional Admin+)
    // ====================
    public static final String STORE_MANAGER_VIEW = "STORE_MANAGER_VIEW";
    public static final String STORE_MANAGER_CREATE = "STORE_MANAGER_CREATE";
    public static final String STORE_MANAGER_UPDATE = "STORE_MANAGER_UPDATE";
    public static final String STORE_MANAGER_DELETE = "STORE_MANAGER_DELETE";
    public static final String STORE_SCOPE_ASSIGN = "STORE_SCOPE_ASSIGN";

    // ==================== REGIONAL ADMIN MANAGEMENT (Super Admin)
    // ====================
    public static final String REGIONAL_ADMIN_VIEW = "REGIONAL_ADMIN_VIEW";
    public static final String REGIONAL_ADMIN_CREATE = "REGIONAL_ADMIN_CREATE";
    public static final String REGIONAL_ADMIN_UPDATE = "REGIONAL_ADMIN_UPDATE";
    public static final String REGIONAL_ADMIN_DELETE = "REGIONAL_ADMIN_DELETE";
    public static final String WAREHOUSE_SCOPE_ASSIGN = "WAREHOUSE_SCOPE_ASSIGN";

    // ==================== SYSTEM CONFIGURATION (Super Admin) ====================
    public static final String PERMISSION_VIEW = "PERMISSION_VIEW";
    public static final String PERMISSION_CREATE = "PERMISSION_CREATE";
    public static final String ROLE_VIEW = "ROLE_VIEW";
    public static final String ROLE_CREATE = "ROLE_CREATE";
    public static final String ROLE_UPDATE = "ROLE_UPDATE";
    public static final String ROLE_DELETE = "ROLE_DELETE";
    public static final String USER_BLOCK = "USER_BLOCK";
    public static final String USER_UNBLOCK = "USER_UNBLOCK";

    // ==================== LEGACY USER PERMISSIONS (để backward compatible)
    // ====================
    public static final String USER_VIEW = "STAFF_VIEW"; // Map to STAFF_VIEW
    public static final String USER_CREATE = "STAFF_CREATE";
    public static final String USER_UPDATE = "STAFF_UPDATE";
    public static final String USER_DELETE = "STAFF_DELETE";

    // ==================== STORE OPERATIONS ====================
    public static final String STORE_VIEW = "STORE_VIEW";
    public static final String STORE_CREATE = "STORE_CREATE";
    public static final String STORE_UPDATE = "STORE_UPDATE";
    public static final String STORE_DELETE = "STORE_DELETE";

    // ==================== WAREHOUSE OPERATIONS ====================
    public static final String WAREHOUSE_VIEW = "WAREHOUSE_VIEW";
    public static final String WAREHOUSE_CREATE = "WAREHOUSE_CREATE";
    public static final String WAREHOUSE_UPDATE = "WAREHOUSE_UPDATE";
    public static final String WAREHOUSE_DELETE = "WAREHOUSE_DELETE";

    // ==================== INVENTORY OPERATIONS ====================
    public static final String INVENTORY_VIEW = "INVENTORY_VIEW";
    public static final String INVENTORY_CREATE = "INVENTORY_CREATE";
    public static final String INVENTORY_UPDATE = "INVENTORY_UPDATE";
    public static final String INVENTORY_TRANSFER = "INVENTORY_TRANSFER";

    // ==================== PRODUCT OPERATIONS ====================
    public static final String PRODUCT_VIEW = "PRODUCT_VIEW";
    public static final String PRODUCT_CREATE = "PRODUCT_CREATE";
    public static final String PRODUCT_UPDATE = "PRODUCT_UPDATE";
    public static final String PRODUCT_DELETE = "PRODUCT_DELETE";

    // ==================== ORDER/SALES OPERATIONS ====================
    public static final String ORDER_VIEW = "ORDER_VIEW";
    public static final String ORDER_CREATE = "ORDER_CREATE";
    public static final String ORDER_UPDATE = "ORDER_UPDATE";
    public static final String ORDER_CANCEL = "ORDER_CANCEL";
    public static final String ORDER_DELETE = "ORDER_DELETE"; // Legacy
    public static final String ORDER_APPROVE = "ORDER_APPROVE"; // Legacy

    // ==================== REPORT OPERATIONS ====================
    public static final String REPORT_STORE_VIEW = "REPORT_STORE_VIEW";
    public static final String REPORT_REGION_VIEW = "REPORT_REGION_VIEW";
    public static final String REPORT_SYSTEM_VIEW = "REPORT_SYSTEM_VIEW";

    // ==================== SUPPLIER OPERATIONS ====================
    public static final String SUPPLIER_VIEW = "SUPPLIER_VIEW";
    public static final String SUPPLIER_CREATE = "SUPPLIER_CREATE";
    public static final String SUPPLIER_UPDATE = "SUPPLIER_UPDATE";
    public static final String SUPPLIER_DELETE = "SUPPLIER_DELETE";

    // ==================== DESIGN OPERATIONS (Legacy) ====================
    public static final String DESIGN_VIEW = "DESIGN_VIEW";
    public static final String DESIGN_CREATE = "DESIGN_CREATE";
    public static final String DESIGN_UPDATE = "DESIGN_UPDATE";
    public static final String DESIGN_DELETE = "DESIGN_DELETE";
}
