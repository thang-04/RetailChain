package com.sba301.retailmanagement.config;

import com.sba301.retailmanagement.entity.Permission;
import com.sba301.retailmanagement.entity.Role;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.enums.PermissionName;
import com.sba301.retailmanagement.enums.RoleConstant;
import com.sba301.retailmanagement.repository.PermissionRepository;
import com.sba301.retailmanagement.repository.RoleRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * DataSeeder - Khởi tạo dữ liệu mặc định cho hệ thống
 * 
 * Hierarchy phân quyền:
 * 1. SUPER_ADMIN: Toàn quyền hệ thống, không có scope
 * 2. REGIONAL_ADMIN: Quản lý vùng (Bắc/Trung/Nam), scope = region + warehouseId
 * 3. STORE_MANAGER: Quản lý cửa hàng, scope = storeId
 * 4. STAFF: Nhân viên bán hàng, scope = storeId (kế thừa từ manager)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("========== Starting Data Seeder ==========");

        // Bước 1: Tạo tất cả Permissions
        Set<Permission> allPermissions = syncPermissions();
        log.info("Synced {} permissions", allPermissions.size());

        // Bước 2: Tạo các Role với Permission tương ứng
        Role superAdminRole = createSuperAdminRole(allPermissions);
        Role regionalAdminRole = createRegionalAdminRole(allPermissions);
        Role storeManagerRole = createStoreManagerRole(allPermissions);
        Role staffRole = createStaffRole(allPermissions);

        // Bước 3: Tạo Super Admin mặc định
        createDefaultSuperAdmin(superAdminRole);

        log.info("========== Data Seeder Completed ==========");
    }

    /**
     * Đồng bộ tất cả Permission từ enum vào database
     */
    private Set<Permission> syncPermissions() {
        Set<Permission> permissions = new HashSet<>();

        for (PermissionName permName : PermissionName.values()) {
            Permission permission = permissionRepository.findByName(permName.name())
                    .orElseGet(() -> {
                        Permission newPermission = Permission.builder()
                                .code(permName.name())
                                .name(permName.name())
                                .description(generatePermissionDescription(permName.name()))
                                .build();
                        log.debug("Creating new permission: {}", permName.name());
                        return permissionRepository.save(newPermission);
                    });
            permissions.add(permission);
        }

        return permissions;
    }

    /**
     * SUPER_ADMIN: Có TẤT CẢ quyền trong hệ thống
     */
    private Role createSuperAdminRole(Set<Permission> allPermissions) {
        return createOrUpdateRole(
                RoleConstant.SUPER_ADMIN.name(),
                "Super Administrator - Full system access",
                allPermissions);
    }

    /**
     * REGIONAL_ADMIN: Quản lý Store Manager, phân bổ Store/Warehouse trong vùng
     */
    private Role createRegionalAdminRole(Set<Permission> allPermissions) {
        Set<String> regionalPermissions = Set.of(
                // Self-service
                "PROFILE_VIEW", "PROFILE_UPDATE", "PASSWORD_CHANGE",
                // Quản lý Store Manager
                "STORE_MANAGER_VIEW", "STORE_MANAGER_CREATE", "STORE_MANAGER_UPDATE", "STORE_MANAGER_DELETE",
                "STORE_SCOPE_ASSIGN",
                // Quản lý Store & Warehouse trong vùng
                "STORE_VIEW", "STORE_CREATE", "STORE_UPDATE",
                "WAREHOUSE_VIEW", "WAREHOUSE_CREATE", "WAREHOUSE_UPDATE",
                // Inventory trong vùng
                "INVENTORY_VIEW", "INVENTORY_CREATE", "INVENTORY_UPDATE", "INVENTORY_TRANSFER",
                // Xem sản phẩm, đơn hàng
                "PRODUCT_VIEW",
                "ORDER_VIEW",
                // Báo cáo vùng
                "REPORT_STORE_VIEW", "REPORT_REGION_VIEW",
                // Supplier
                "SUPPLIER_VIEW");

        Set<Permission> permissions = allPermissions.stream()
                .filter(p -> regionalPermissions.contains(p.getName()))
                .collect(Collectors.toSet());

        return createOrUpdateRole(
                RoleConstant.REGIONAL_ADMIN.name(),
                "Regional Administrator - Manage stores and warehouses in region",
                permissions);
    }

    /**
     * STORE_MANAGER: Quản lý Staff, vận hành cửa hàng
     */
    private Role createStoreManagerRole(Set<Permission> allPermissions) {
        Set<String> storeManagerPermissions = Set.of(
                // Self-service
                "PROFILE_VIEW", "PROFILE_UPDATE", "PASSWORD_CHANGE",
                // Quản lý Staff
                "STAFF_VIEW", "STAFF_CREATE", "STAFF_UPDATE", "STAFF_DELETE",
                // Vận hành cửa hàng
                "STORE_VIEW",
                // Inventory tại cửa hàng
                "INVENTORY_VIEW", "INVENTORY_CREATE", "INVENTORY_UPDATE",
                // Sản phẩm
                "PRODUCT_VIEW",
                // Đơn hàng tại cửa hàng
                "ORDER_VIEW", "ORDER_CREATE", "ORDER_UPDATE", "ORDER_CANCEL",
                // Báo cáo cửa hàng
                "REPORT_STORE_VIEW");

        Set<Permission> permissions = allPermissions.stream()
                .filter(p -> storeManagerPermissions.contains(p.getName()))
                .collect(Collectors.toSet());

        return createOrUpdateRole(
                RoleConstant.STORE_MANAGER.name(),
                "Store Manager - Manage staff and store operations",
                permissions);
    }

    /**
     * STAFF: Nhân viên bán hàng cơ bản
     */
    private Role createStaffRole(Set<Permission> allPermissions) {
        Set<String> staffPermissions = Set.of(
                // Self-service
                "PROFILE_VIEW", "PROFILE_UPDATE", "PASSWORD_CHANGE",
                // Xem thông tin cửa hàng (không sửa)
                "STORE_VIEW",
                // Xem tồn kho
                "INVENTORY_VIEW",
                // Xem sản phẩm
                "PRODUCT_VIEW",
                // Thao tác POS - tạo đơn hàng
                "ORDER_VIEW", "ORDER_CREATE");

        Set<Permission> permissions = allPermissions.stream()
                .filter(p -> staffPermissions.contains(p.getName()))
                .collect(Collectors.toSet());

        return createOrUpdateRole(
                RoleConstant.STAFF.name(),
                "Staff - Basic POS operations",
                permissions);
    }

    /**
     * Tạo hoặc cập nhật Role
     */
    private Role createOrUpdateRole(String roleName, String description, Set<Permission> permissions) {
        Role role = roleRepository.findByCode(roleName)
                .orElseGet(() -> roleRepository.findByName(roleName)
                        .orElseGet(() -> {
                            Role newRole = Role.builder()
                                    .code(roleName)
                                    .name(roleName)
                                    .description(description)
                                    .permissions(new HashSet<>())
                                    .build();
                            log.debug("Creating new role: {}", roleName);
                            return newRole;
                        }));

        role.setDescription(description);
        role.setPermissions(permissions);

        Role savedRole = roleRepository.save(role);
        log.info("Created/Updated {} role with {} permissions", roleName, permissions.size());
        return savedRole;
    }

    /**
     * Tạo Super Admin mặc định
     * Scope: NULL (toàn hệ thống)
     */
    private void createDefaultSuperAdmin(Role superAdminRole) {
        String adminUsername = "superadmin";
        String adminEmail = "superadmin@retailchain.com";

        if (!userRepository.existsByUsername(adminUsername)) {
            User admin = User.builder()
                    .username(adminUsername)
                    .email(adminEmail)
                    .password(passwordEncoder.encode("123"))
                    .fullName("Super Administrator")
                    .status(1) // Active
                    // Scope = NULL (toàn hệ thống)
                    .region(null)
                    .warehouseId(null)
                    .storeId(null)
                    .roles(Set.of(superAdminRole))
                    .build();

            userRepository.save(admin);
            log.info("Created default Super Admin: {}", adminUsername);
            log.warn("========================================");
            log.warn("IMPORTANT SECURITY NOTICE:");
            log.warn("Username: {}", adminUsername);
            log.warn("Password: SuperAdmin@123");
            log.warn("Please change this password immediately!");
            log.warn("========================================");
        } else {
            log.info("Super Admin already exists: {}", adminUsername);
        }
    }

    /**
     * Sinh mô tả permission từ tên
     */
    private String generatePermissionDescription(String permissionName) {
        String[] parts = permissionName.split("_");
        if (parts.length >= 2) {
            String action = parts[parts.length - 1];
            String resource = String.join(" ", Arrays.copyOf(parts, parts.length - 1));
            return String.format("%s %s", capitalize(action), resource.toLowerCase());
        }
        return permissionName;
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}
