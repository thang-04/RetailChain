package com.sba301.retailmanagement.config;

import com.sba301.retailmanagement.entity.Permission;
import com.sba301.retailmanagement.entity.Role;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.enums.RoleConstant;
import com.sba301.retailmanagement.repository.PermissionRepository;
import com.sba301.retailmanagement.repository.RoleRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.security.SecurityConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Checking and seeding default data...");

        List<String> allPermissions = Arrays.asList(
                SecurityConstants.WAREHOUSE_VIEW, SecurityConstants.WAREHOUSE_CREATE,
                SecurityConstants.WAREHOUSE_UPDATE, SecurityConstants.WAREHOUSE_DELETE,
                SecurityConstants.STORE_VIEW, SecurityConstants.STORE_CREATE, SecurityConstants.STORE_UPDATE,
                SecurityConstants.STORE_DELETE,
                "STOCKIN_CREATE", "STOCKIN_VIEW", "STOCKOUT_CREATE", "STOCKOUT_VIEW",
                "REPORT_VIEW", "HR_VIEW", "HR_UPDATE", "SHIFT_VIEW", "SHIFT_UPDATE",
                SecurityConstants.ROLE_VIEW, SecurityConstants.ROLE_CREATE, SecurityConstants.ROLE_UPDATE,
                SecurityConstants.ROLE_DELETE,
                SecurityConstants.PERMISSION_VIEW, SecurityConstants.PERMISSION_CREATE,
                SecurityConstants.USER_VIEW, SecurityConstants.USER_CREATE, SecurityConstants.USER_UPDATE,
                SecurityConstants.USER_BLOCK, SecurityConstants.USER_UNBLOCK, SecurityConstants.USER_DELETE,
                SecurityConstants.PRODUCT_VIEW, SecurityConstants.PRODUCT_CREATE, SecurityConstants.PRODUCT_UPDATE,
                SecurityConstants.PRODUCT_DELETE,
                SecurityConstants.INVENTORY_VIEW, SecurityConstants.INVENTORY_CREATE,
                SecurityConstants.INVENTORY_UPDATE, SecurityConstants.INVENTORY_TRANSFER);

        for (String permCode : allPermissions) {
            if (!permissionRepository.existsByCode(permCode)) {
                Permission perm = new Permission();
                perm.setCode(permCode);
                perm.setName(permCode);
                permissionRepository.save(perm);
            }
        }

        // 2. Map Permissions exactly per user requirements
        // Super Admin: Central Ware House, Stores, Stockin, Stockout, Report, Human
        // Resource, Role & Permission, User Manager, Product, Inventory
        Set<String> superAdminPerms = new HashSet<>(Arrays.asList(
                SecurityConstants.WAREHOUSE_VIEW, SecurityConstants.WAREHOUSE_CREATE,
                SecurityConstants.WAREHOUSE_UPDATE, SecurityConstants.WAREHOUSE_DELETE,
                SecurityConstants.STORE_VIEW, SecurityConstants.STORE_CREATE, SecurityConstants.STORE_UPDATE,
                SecurityConstants.STORE_DELETE,
                "STOCKIN_CREATE", "STOCKIN_VIEW", "STOCKOUT_CREATE", "STOCKOUT_VIEW",
                "REPORT_VIEW", "HR_VIEW", "HR_UPDATE", "SHIFT_VIEW", "SHIFT_UPDATE",
                SecurityConstants.ROLE_VIEW, SecurityConstants.ROLE_CREATE, SecurityConstants.ROLE_UPDATE,
                SecurityConstants.ROLE_DELETE,
                SecurityConstants.PERMISSION_VIEW, SecurityConstants.PERMISSION_CREATE,
                SecurityConstants.USER_VIEW, SecurityConstants.USER_CREATE, SecurityConstants.USER_UPDATE,
                SecurityConstants.USER_BLOCK, SecurityConstants.USER_UNBLOCK, SecurityConstants.USER_DELETE,
                SecurityConstants.PRODUCT_VIEW, SecurityConstants.PRODUCT_CREATE, SecurityConstants.PRODUCT_UPDATE,
                SecurityConstants.PRODUCT_DELETE,
                SecurityConstants.INVENTORY_VIEW, SecurityConstants.INVENTORY_CREATE,
                SecurityConstants.INVENTORY_UPDATE, SecurityConstants.INVENTORY_TRANSFER));

        // Store Manager: Stockin, Stockout, Report, Human Resource, User Manager(tạo
        // tài khoản staff), Product, Inventory, Store, Staff Shift
        Set<String> storeManagerPerms = new HashSet<>(Arrays.asList(
                "STOCKIN_CREATE", "STOCKIN_VIEW", "STOCKOUT_CREATE", "STOCKOUT_VIEW",
                "REPORT_VIEW", "HR_VIEW", "HR_UPDATE", "SHIFT_VIEW", "SHIFT_UPDATE",
                SecurityConstants.USER_VIEW, SecurityConstants.USER_CREATE, SecurityConstants.USER_UPDATE,
                SecurityConstants.USER_BLOCK, SecurityConstants.USER_UNBLOCK,
                SecurityConstants.PRODUCT_VIEW,
                SecurityConstants.INVENTORY_VIEW, SecurityConstants.INVENTORY_UPDATE,
                SecurityConstants.INVENTORY_TRANSFER,
                SecurityConstants.STORE_VIEW));

        // Staff: Store, Product, Inventory
        Set<String> staffPerms = new HashSet<>(Arrays.asList(
                SecurityConstants.STORE_VIEW,
                SecurityConstants.PRODUCT_VIEW,
                SecurityConstants.INVENTORY_VIEW));

        Role superAdmin = seedRole(RoleConstant.SUPER_ADMIN.name(), "Super Administrator", superAdminPerms);
        Role storeManager = seedRole(RoleConstant.STORE_MANAGER.name(), "Store Manager", storeManagerPerms);
        Role staff = seedRole(RoleConstant.STAFF.name(), "Staff", staffPerms);

        // 3. Seed Super Admin User
        if (!userRepository.existsByEmail("admin@retailchain.com")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@retailchain.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("System Admin");
            admin.setStatus(1);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            Set<Role> roles = new HashSet<>();
            roles.add(superAdmin);
            admin.setRoles(roles);
            userRepository.save(admin);
            log.info("Seeded default Super Admin account (admin@retailchain.com / admin123)");
        }
    }

    private Role seedRole(String code, String name, Set<String> permCodes) {
        return roleRepository.findByCode(code).orElseGet(() -> {
            Role newRole = new Role();
            newRole.setCode(code);
            newRole.setName(name);

            List<Permission> allPerms = permissionRepository.findAll();
            Set<Permission> assignedPerms = allPerms.stream()
                    .filter(p -> permCodes.contains(p.getCode()))
                    .collect(Collectors.toSet());

            newRole.setPermissions(assignedPerms);
            return roleRepository.save(newRole);
        });
    }
}
