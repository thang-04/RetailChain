package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.CreateUserRequest;
import com.sba301.retailmanagement.dto.request.UpdateUserRequest;
import com.sba301.retailmanagement.dto.response.UserDTO;
import com.sba301.retailmanagement.entity.Role;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.enums.RoleConstant;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.repository.RoleRepository;
import com.sba301.retailmanagement.repository.StoreRepository;
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
 * - Super Admin → Tạo Store Manager (gán storeId)
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
    private final StoreRepository storeRepository;
    private final com.sba301.retailmanagement.service.SendMailService sendMailService;

    // get user theo scope
    @Override
    public List<UserDTO> getAllUsers() {
        User currentUser = getCurrentUser();
        List<User> users;
        if (isSuperAdmin(currentUser)) {
            // Super Admin sees all users EXCEPT other Super Admins
            users = userRepository.findUsersNotHavingRole(RoleConstant.SUPER_ADMIN.name());
        } else if (isStoreManager(currentUser)) {
            // Store Manager sees only Staff in their store
            users = userRepository.findByStoreId(currentUser.getStoreId())
                    .stream()
                    .filter(this::isStaff)
                    .collect(Collectors.toList());
        } else {
            // Staff sees themselves
            users = List.of(currentUser);
        }
        return users.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> getUnassignedStaff() {
        // Staff that doesn't belong to any store
        List<User> unassigned = userRepository.findByStoreIdIsNullAndRoles_CodeIgnoreCase(RoleConstant.STAFF.name());
        return unassigned.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
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

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        User currentUser = getCurrentUser();
        Set<Role> roles = new HashSet<>();
        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            roles = new HashSet<>(roleRepository.findAllById(request.getRoleIds()));
            validateRoleAssignment(currentUser, roles);
        } else {
            if (isStoreManager(currentUser)) {
                Role staffRole = roleRepository.findByCode(RoleConstant.STAFF.name())
                        .orElseThrow(() -> new RuntimeException("STAFF role not found"));
                roles.add(staffRole);
            } else {
                throw new RuntimeException("Role must be specified");
            }
        }

        // Use provided password or generate random one
        String passwordToUse = (request.getPassword() != null && !request.getPassword().isBlank()) 
                ? request.getPassword() 
                : generateRandomPassword();
        boolean isFirstLogin = (request.getPassword() == null || request.getPassword().isBlank());

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(passwordToUse))
                .fullName(request.getFullName())
                .phone(request.getPhoneNumber())
                .status(1) // Active
                .isFirstLogin(isFirstLogin)
                .roles(roles)
                .createdByUserId(currentUser != null ? currentUser.getId() : null)
                .build();

        assignScopeToUser(user, request, currentUser, roles);

        User savedUser = userRepository.save(user);
        log.info("Created user {} with scope: storeId={}. Status={}, isFirstLogin={}",
                savedUser.getUsername(), savedUser.getStoreId(), savedUser.getStatus(), savedUser.getIsFirstLogin());

        // Send welcome email only if a random password was generated
        if (isFirstLogin) {
            sendMailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFullName(), passwordToUse);
        }

        return toDTO(savedUser);
    }

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        java.util.Random rnd = new java.util.Random();
        StringBuilder sb = new StringBuilder(10);
        for (int i = 0; i < 10; i++)
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        return sb.toString();
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (isSuperAdmin(user)) {
            throw new RuntimeException("Cannot delete Super Admin account");
        }

        User currentUser = getCurrentUser();
        validateScopeAccess(currentUser, user);

        userRepository.deleteById(id);
        log.info("Deleted user: {}", id);
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        User currentUser = getCurrentUser();
        validateScopeAccess(currentUser, user);

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhone(request.getPhoneNumber());
        }

        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            Set<Role> newRoles = new HashSet<>(roleRepository.findAllById(request.getRoleIds()));
            validateRoleAssignment(currentUser, newRoles);
            user.setRoles(newRoles);
        }

        if (request.getStoreId() != null) {
            user.setStoreId(request.getStoreId());
        }

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        User savedUser = userRepository.save(user);
        log.info("Updated user: {} (id={})", savedUser.getUsername(), savedUser.getId());
        return toDTO(savedUser);
    }

    @Override
    @Transactional
    public UserDTO toggleBlockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (isSuperAdmin(user)) {
            throw new RuntimeException("Cannot block Super Admin account");
        }

        User currentUser = getCurrentUser();
        validateScopeAccess(currentUser, user);

        int newStatus = (user.getStatus() != null && user.getStatus() == 1) ? 0 : 1;
        user.setStatus(newStatus);

        User savedUser = userRepository.save(user);
        log.info("Toggled block status for user {} (id={}) to status={}", savedUser.getUsername(), id, newStatus);
        return toDTO(savedUser);
    }

    private void assignScopeToUser(User user, CreateUserRequest request, User currentUser, Set<Role> roles) {
        boolean isCreatingStoreManager = roles.stream()
                .anyMatch(r -> r.getCode().equalsIgnoreCase(RoleConstant.STORE_MANAGER.name()));
        boolean isCreatingStaff = roles.stream().anyMatch(r -> r.getCode().equalsIgnoreCase(RoleConstant.STAFF.name()));

        if (isCreatingStoreManager) {
            if (request.getStoreId() == null) {
                throw new RuntimeException("Store ID is required when creating Store Manager");
            }
            user.setStoreId(request.getStoreId());
            log.debug("Assigned Store Manager scope: storeId={}", request.getStoreId());

        } else if (isCreatingStaff) {
            if (currentUser != null && currentUser.getStoreId() != null) {
                user.setStoreId(currentUser.getStoreId());
            } else if (request.getStoreId() != null) {
                user.setStoreId(request.getStoreId());
            }
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

            if (roleCode.equalsIgnoreCase(RoleConstant.SUPER_ADMIN.name())) {
                throw new RuntimeException("Cannot assign SUPER_ADMIN role");
            }

            if (roleCode.equalsIgnoreCase(RoleConstant.STORE_MANAGER.name()) &&
                    !isSuperAdmin(currentUser)) {
                throw new RuntimeException("Only Super Admin can create Store Manager");
            }

            if (roleCode.equalsIgnoreCase(RoleConstant.STAFF.name()) &&
                    !isSuperAdmin(currentUser) && !isStoreManager(currentUser)) {
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

        if (isStoreManager(currentUser) || isStaff(currentUser)) {
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
        return user != null && user.getRoles() != null && user.getRoles().stream()
                .anyMatch(r -> r.getCode().equalsIgnoreCase(RoleConstant.SUPER_ADMIN.name()));
    }

    private boolean isStoreManager(User user) {
        return user != null && user.getRoles() != null && user.getRoles().stream()
                .anyMatch(r -> r.getCode().equalsIgnoreCase(RoleConstant.STORE_MANAGER.name()));
    }

    private boolean isStaff(User user) {
        return user != null && user.getRoles() != null && user.getRoles().stream()
                .anyMatch(r -> r.getCode().equalsIgnoreCase(RoleConstant.STAFF.name()));
    }

    private UserDTO toDTO(User user) {
        List<String> roleNames = user.getRoles() != null
                ? user.getRoles().stream().map(Role::getCode).collect(Collectors.toList())
                : List.of();

        List<String> permissions = user.getRoles() != null
                ? user.getRoles().stream()
                        .flatMap(role -> {
                            if (role.getPermissions() != null) {
                                return role.getPermissions().stream();
                            }
                            return java.util.stream.Stream.empty();
                        })
                        .map(com.sba301.retailmanagement.entity.Permission::getName)
                        .distinct()
                        .collect(Collectors.toList())
                : List.of();

        UserDTO dto = UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhone())
                .status(user.getStatus())
                .isFirstLogin(user.getIsFirstLogin())
                .roles(roleNames)
                .permissions(permissions)
                // Scope info
                .storeId(user.getStoreId())
                .build();

        if (user.getStoreId() != null) {
            storeRepository.findById(user.getStoreId()).ifPresent(store -> {
                dto.setStoreCode(store.getCode());
                dto.setStoreName(store.getName());
            });
        }

        return dto;
    }
}
