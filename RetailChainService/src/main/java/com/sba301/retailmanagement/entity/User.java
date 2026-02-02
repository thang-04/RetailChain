package com.sba301.retailmanagement.entity;

import com.sba301.retailmanagement.enums.Region;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity User với hỗ trợ Scope-based Authorization
 * 
 * Scope hierarchy:
 * - SUPER_ADMIN: region=null, warehouseId=null, storeId=null (toàn hệ thống)
 * - REGIONAL_ADMIN: region=NORTH/CENTRAL/SOUTH, warehouseId=ID kho tổng vùng
 * - STORE_MANAGER: storeId=ID cửa hàng cụ thể
 * - STAFF: storeId=ID cửa hàng (kế thừa từ Store Manager tạo ra)
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private Integer status = 1;

    // ==================== SCOPE FIELDS ====================

    /**
     * Region/Vùng miền - dùng cho Regional Admin
     * NULL = toàn hệ thống (Super Admin)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "region", length = 20)
    private Region region;

    /**
     * Warehouse ID - Kho tổng vùng, dùng cho Regional Admin
     * Liên kết với bảng warehouses
     */
    @Column(name = "warehouse_id")
    private Long warehouseId;

    /**
     * Store ID - Cửa hàng cụ thể, dùng cho Store Manager và Staff
     * Liên kết với bảng stores
     */
    @Column(name = "store_id")
    private Long storeId;

    /**
     * ID người tạo tài khoản này (để tracking hierarchy)
     */
    @Column(name = "created_by_user_id")
    private Long createdByUserId;

    // ==================== RELATIONSHIPS ====================

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    // ==================== AUDIT FIELDS ====================

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // ==================== HELPER METHODS ====================

    /**
     * Kiểm tra user có role cụ thể không
     */
    public boolean hasRole(String roleCode) {
        return roles.stream().anyMatch(r -> r.getCode().equals(roleCode));
    }

    /**
     * Kiểm tra user có permission cụ thể không
     */
    public boolean hasPermission(String permissionName) {
        return roles.stream()
                .flatMap(r -> r.getPermissions().stream())
                .anyMatch(p -> p.getName().equals(permissionName));
    }

    /**
     * Kiểm tra user có quyền truy cập Store cụ thể không
     * - Super Admin: truy cập tất cả
     * - Regional Admin: truy cập các store trong region của mình
     * - Store Manager/Staff: chỉ truy cập store được gán
     */
    public boolean canAccessStore(Long targetStoreId) {
        // Super Admin - no scope restriction
        if (this.region == null && this.warehouseId == null && this.storeId == null) {
            return true;
        }
        // Regional Admin - cần kiểm tra store thuộc region (cần query thêm)
        if (this.region != null && this.storeId == null) {
            return true; // Cần business logic kiểm tra store thuộc region
        }
        // Store Manager/Staff - chỉ store được gán
        return this.storeId != null && this.storeId.equals(targetStoreId);
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
