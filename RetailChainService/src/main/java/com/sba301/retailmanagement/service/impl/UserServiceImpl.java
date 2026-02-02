package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.CreateUserRequest;
import com.sba301.retailmanagement.dto.response.UserDTO;
import com.sba301.retailmanagement.entity.Role;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.enums.RoleConstant;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.repository.RoleRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.security.CustomUserDetails;
import com.sba301.retailmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * UserService Implementation với hỗ trợ Scope-based Authorization
 * 
 * Quy tắc tạo user theo tầng:
 * - Super Admin → Tạo Regional Admin (gán region + warehouseId)
 * - Regional Admin → Tạo Store Manager (gán storeId trong vùng)
 * - Store Manager → Tạo Staff (tự động gán storeId của manager)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserDTO> getAllUsers() {
        User currentUser = getCurrentUser();
        List<User> users;

        // Lọc users theo scope của người đang đăng nhập
        if (isSuperAdmin(currentUser)) {
            users = userRepository.findAll();
        } else if (isRegionalAdmin(currentUser)) {
            // Regional Admin chỉ thấy users trong vùng (cùng region hoặc cùng warehouseId)
            users = userRepository.findByRegionOrWarehouseId(currentUser.getRegion(), currentUser.getWarehouseId());
        } else if (isStoreManager(currentUser)) {
            // Store Manager chỉ thấy users trong store
            users = userRepository.findByStoreId(currentUser.getStoreId());
        } else {
            // Staff chỉ thấy chính mình
            users = List.of(currentUser);
        }

        return users.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Kiểm tra scope access
        User currentUser = getCurrentUser();
        validateScopeAccess(currentUser, user);

        return toDTO(user);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return toDTO(user);
    }

    @Override
    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        log.info("Creating user: {}", request.getUsername());

        // Validate unique constraints
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        User currentUser = getCurrentUser();

        // Lấy roles được gán
        Set<Role> roles = new HashSet<>();
        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            roles = new HashSet<>(roleRepository.findAllById(request.getRoleIds()));
            // Validate: Người tạo chỉ có thể gán role cấp dưới
            validateRoleAssignment(currentUser, roles);
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhoneNumber())
                .status(1) // Active
                .roles(roles)
                .createdByUserId(currentUser != null ? currentUser.getId() : null)
                .build();

        // Gán scope cho user mới dựa trên role
        assignScopeToUser(user, request, currentUser, roles);

        User savedUser = userRepository.save(user);
        log.info("Created user {} with scope: region={}, warehouseId={}, storeId={}",
                savedUser.getUsername(), savedUser.getRegion(), savedUser.getWarehouseId(), savedUser.getStoreId());

        return toDTO(savedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Không cho xóa Super Admin
        if (user.hasRole(RoleConstant.SUPER_ADMIN.name())) {
            throw new RuntimeException("Cannot delete Super Admin account");
        }

        // Validate scope access
        User currentUser = getCurrentUser();
        validateScopeAccess(currentUser, user);

        userRepository.deleteById(id);
        log.info("Deleted user: {}", id);
    }

    /**
     * Gán scope cho user mới dựa trên role được gán
     */
    private void assignScopeToUser(User user, CreateUserRequest request, User currentUser, Set<Role> roles) {
        boolean isCreatingRegionalAdmin = roles.stream()
                .anyMatch(r -> r.getCode().equals(RoleConstant.REGIONAL_ADMIN.name()));
        boolean isCreatingStoreManager = roles.stream()
                .anyMatch(r -> r.getCode().equals(RoleConstant.STORE_MANAGER.name()));
        boolean isCreatingStaff = roles.stream().anyMatch(r -> r.getCode().equals(RoleConstant.STAFF.name()));

        if (isCreatingRegionalAdmin) {
            // Super Admin tạo Regional Admin: Phải có region + warehouseId
            if (request.getRegion() == null) {
                throw new RuntimeException("Region is required when creating Regional Admin");
            }
            user.setRegion(request.getRegion());
            user.setWarehouseId(request.getWarehouseId());
            user.setStoreId(null);
            log.debug("Assigned Regional Admin scope: region={}, warehouseId={}", request.getRegion(),
                    request.getWarehouseId());

        } else if (isCreatingStoreManager) {
            // Regional Admin tạo Store Manager: Phải có storeId
            if (request.getStoreId() == null) {
                throw new RuntimeException("Store ID is required when creating Store Manager");
            }
            // TODO: Validate storeId thuộc region của currentUser (Regional Admin)
            user.setRegion(currentUser != null ? currentUser.getRegion() : null);
            user.setStoreId(request.getStoreId());
            user.setWarehouseId(null);
            log.debug("Assigned Store Manager scope: storeId={}", request.getStoreId());

        } else if (isCreatingStaff) {
            // Store Manager tạo Staff: Tự động kế thừa storeId
            if (currentUser != null && currentUser.getStoreId() != null) {
                user.setStoreId(currentUser.getStoreId());
                user.setRegion(currentUser.getRegion());
            } else if (request.getStoreId() != null) {
                user.setStoreId(request.getStoreId());
            }
            user.setWarehouseId(null);
            log.debug("Assigned Staff scope: storeId={} (inherited from creator)", user.getStoreId());
        }
    }

    /**
     * Validate: Người tạo chỉ có thể gán role cấp dưới của mình
     */
    private void validateRoleAssignment(User currentUser, Set<Role> rolesToAssign) {
        if (currentUser == null)
            return; // Seed data case

        for (Role role : rolesToAssign) {
            String roleCode = role.getCode();

            if (roleCode.equals(RoleConstant.SUPER_ADMIN.name())) {
                throw new RuntimeException("Cannot assign SUPER_ADMIN role");
            }

            if (roleCode.equals(RoleConstant.REGIONAL_ADMIN.name()) && !isSuperAdmin(currentUser)) {
                throw new RuntimeException("Only Super Admin can create Regional Admin");
            }

            if (roleCode.equals(RoleConstant.STORE_MANAGER.name()) &&
                    !isSuperAdmin(currentUser) && !isRegionalAdmin(currentUser)) {
                throw new RuntimeException("Only Super Admin or Regional Admin can create Store Manager");
            }

            if (roleCode.equals(RoleConstant.STAFF.name()) &&
                    !isSuperAdmin(currentUser) && !isRegionalAdmin(currentUser) && !isStoreManager(currentUser)) {
                throw new RuntimeException("You don't have permission to create Staff");
            }
        }
    }

    /**
     * Validate scope access - kiểm tra người dùng có quyền truy cập user target
     * không
     */
    private void validateScopeAccess(User currentUser, User targetUser) {
        if (currentUser == null || isSuperAdmin(currentUser))
            return;

        if (isRegionalAdmin(currentUser)) {
            // Regional Admin chỉ truy cập users trong vùng
            if (targetUser.getRegion() != null && !targetUser.getRegion().equals(currentUser.getRegion())) {
                throw new RuntimeException("Access denied: User not in your region");
            }
        } else if (isStoreManager(currentUser) || isStaff(currentUser)) {
            // Store Manager/Staff chỉ truy cập users trong store
            if (targetUser.getStoreId() != null && !targetUser.getStoreId().equals(currentUser.getStoreId())) {
                throw new RuntimeException("Access denied: User not in your store");
            }
        }
    }

    private User getCurrentUser() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof CustomUserDetails) {
                CustomUserDetails userDetails = (CustomUserDetails) principal;
                return userRepository.findById(userDetails.getId()).orElse(null);
            }
        } catch (Exception e) {
            log.debug("No authenticated user found");
        }
        return null;
    }

    private boolean isSuperAdmin(User user) {
        return user != null && user.hasRole(RoleConstant.SUPER_ADMIN.name());
    }

    private boolean isRegionalAdmin(User user) {
        return user != null && user.hasRole(RoleConstant.REGIONAL_ADMIN.name());
    }

    private boolean isStoreManager(User user) {
        return user != null && user.hasRole(RoleConstant.STORE_MANAGER.name());
    }

    private boolean isStaff(User user) {
        return user != null && user.hasRole(RoleConstant.STAFF.name());
    }

    private UserDTO toDTO(User user) {
        List<String> roleNames = user.getRoles() != null
                ? user.getRoles().stream().map(Role::getName).collect(Collectors.toList())
                : List.of();

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhone())
                .status(user.getStatus())
                .roles(roleNames)
                // Scope info
                .region(user.getRegion())
                .warehouseId(user.getWarehouseId())
                .storeId(user.getStoreId())
                .build();
    }
}
