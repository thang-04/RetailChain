package com.sba301.retailmanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
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
 * <p>
 * Scope hierarchy:
 * - SUPER_ADMIN: storeId=null (toàn hệ thống, quản lý Central Warehouse)
 * - STORE_MANAGER: storeId=ID cửa hàng cụ thể (quản lý Store Warehouse và cửa
 * hàng)
 * - STAFF: storeId=ID cửa hàng (kế thừa từ Store Manager tạo ra, thao tác tại
 * cửa hàng)
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

    @Column(name = "is_first_login", nullable = false)
    @Builder.Default
    private Boolean isFirstLogin = true;

    @Column(name = "store_id")
    private Long storeId;

    @Column(name = "created_by_user_id")
    private Long createdByUserId;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @jakarta.persistence.PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @jakarta.persistence.PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
