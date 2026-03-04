package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.service.UserService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import com.sba301.retailmanagement.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.sba301.retailmanagement.security.SecurityConstants.USER_CREATE;
import static com.sba301.retailmanagement.security.SecurityConstants.USER_DELETE;
import static com.sba301.retailmanagement.security.SecurityConstants.USER_VIEW;
import static com.sba301.retailmanagement.security.SecurityConstants.USER_UPDATE;
import static com.sba301.retailmanagement.security.SecurityConstants.USER_BLOCK;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "User", description = "APIs for user management")
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get all users", description = "Returns a list of all users in the system. Only accessible by ADMIN role")
    @PreAuthorize("hasAuthority('" + USER_VIEW + "')")
    public String getAllUsers() {
        String prefix = "[getAllUsers]";
        try {
            log.info("{}|START", prefix);
            var users = userService.getAllUsers();
            log.info("{}|END|size={}", prefix, users.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get all users successfully", users);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving users: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Returns detailed information of the currently authenticated user")
    public String getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String prefix = "[getCurrentUser]|userId=" + userDetails.getId();
        try {
            log.info("{}|START", prefix);
            var user = userService.getUserById(userDetails.getId());
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get current user successfully", user);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL,
                    "Error retrieving current user: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Returns details of a specific user by ID. Only accessible by ADMIN role")
    @PreAuthorize("hasAuthority('" + USER_VIEW + "')")
    public String getUserById(@PathVariable Long id) {
        String prefix = "[getUserById]|id=" + id;
        try {
            log.info("{}|START", prefix);
            var user = userService.getUserById(id);
            if (user == null) {
                log.error("{}|FAILED|User not found", prefix);
                return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, "User not found");
            }
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get user successfully", user);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving user: " + e.getMessage());
        }
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get user by email", description = "Returns details of a specific user by email address")
    @PreAuthorize("hasAuthority('" + USER_VIEW + "')")
    public String getUserByEmail(@PathVariable String email) {
        String prefix = "[getUserByEmail]|email=" + email;
        try {
            log.info("{}|START", prefix);
            var user = userService.getUserByEmail(email);
            if (user == null) {
                log.error("{}|FAILED|User not found", prefix);
                return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, "User not found");
            }
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get user successfully", user);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving user: " + e.getMessage());
        }
    }

    @PostMapping
    @Operation(summary = "Create new user", description = "Create a new user account with basic information")
    @PreAuthorize("hasAuthority('" + USER_CREATE + "')")
    public String createUser(@RequestBody com.sba301.retailmanagement.dto.request.CreateUserRequest request) {
        String prefix = "[createUser]|email=" + (request != null ? request.getEmail() : "null");
        try {
            log.info("{}|START", prefix);
            var user = userService.createUser(request);
            log.info("{}|END|userId={}", prefix, user.getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "User created successfully", user);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error creating user: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user", description = "Delete a user from the system by ID. Only accessible by ADMIN role")
    @PreAuthorize("hasAuthority('" + USER_DELETE + "')")
    public String deleteUser(@PathVariable Long id) {
        String prefix = "[deleteUser]|id=" + id;
        try {
            log.info("{}|START", prefix);
            userService.deleteUser(id);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "User deleted successfully");
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error deleting user: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user", description = "Update user information including scope and roles")
    @PreAuthorize("hasAuthority('" + USER_UPDATE + "')")
    public String updateUser(@PathVariable Long id,
            @RequestBody com.sba301.retailmanagement.dto.request.UpdateUserRequest request) {
        String prefix = "[updateUser]|id=" + id;
        try {
            log.info("{}|START", prefix);
            var user = userService.updateUser(id, request);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "User updated successfully", user);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error updating user: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/block")
    @Operation(summary = "Toggle block user", description = "Toggle user status between Active and Blocked")
    @PreAuthorize("hasAuthority('" + USER_BLOCK + "')")
    public String toggleBlockUser(@PathVariable Long id) {
        String prefix = "[toggleBlockUser]|id=" + id;
        try {
            log.info("{}|START", prefix);
            var user = userService.toggleBlockUser(id);
            log.info("{}|END|newStatus={}", prefix, user.getStatus());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "User block status toggled successfully", user);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL,
                    "Error toggling user block status: " + e.getMessage());
        }
    }
}
