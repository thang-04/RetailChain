package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.CreateRoleRequest;
import com.sba301.retailmanagement.dto.request.UpdateRoleRequest;
import com.sba301.retailmanagement.service.RoleService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.sba301.retailmanagement.security.SecurityConstants.ROLE_CREATE;
import static com.sba301.retailmanagement.security.SecurityConstants.ROLE_DELETE;
import static com.sba301.retailmanagement.security.SecurityConstants.ROLE_UPDATE;
import static com.sba301.retailmanagement.security.SecurityConstants.ROLE_VIEW;

@Slf4j
@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Tag(name = "Role", description = "APIs for managing roles and permissions")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @Operation(summary = "Get all roles", description = "Returns a list of all roles in the system. Requires ROLE_VIEW authority")
    @PreAuthorize("hasAuthority('" + ROLE_VIEW + "')")
    public String getAllRoles() {
        String prefix = "[getAllRoles]";
        try {
            log.info("{}|START", prefix);
            var roles = roleService.getAllRoles();
            log.info("{}|END|size={}", prefix, roles.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get all roles successfully", roles);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving roles: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get role by ID", description = "Returns details of a specific role by ID. Requires ROLE_VIEW authority")
    @PreAuthorize("hasAuthority('" + ROLE_VIEW + "')")
    public String getRoleById(@PathVariable Long id) {
        String prefix = "[getRoleById]|id=" + id;
        try {
            log.info("{}|START", prefix);
            var role = roleService.getRoleById(id);
            if (role == null) {
                log.error("{}|FAILED|Role not found", prefix);
                return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, "Role not found");
            }
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get role by id successfully", role);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving role: " + e.getMessage());
        }
    }

    @PostMapping
    @Operation(summary = "Create new role", description = "Create a new role with name and list of permissions. Requires ROLE_CREATE authority")
    @PreAuthorize("hasAuthority('" + ROLE_CREATE + "')")
    public String createRole(@Valid @RequestBody CreateRoleRequest request) {
        String prefix = "[createRole]|name=" + (request != null ? request.getName() : "null");
        try {
            log.info("{}|START", prefix);
            var role = roleService.createRole(request);
            log.info("{}|END|roleId={}", prefix, role.getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Create role successfully", role);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error creating role: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update role", description = "Update role information including name and list of permissions. Requires ROLE_UPDATE authority")
    @PreAuthorize("hasAuthority('" + ROLE_UPDATE + "')")
    public String updateRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoleRequest request) {
        String prefix = "[updateRole]|id=" + id;
        try {
            log.info("{}|START", prefix);
            var role = roleService.updateRole(id, request);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Update role successfully", role);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error updating role: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete role", description = "Delete a role from the system by ID. Requires ROLE_DELETE authority")
    @PreAuthorize("hasAuthority('" + ROLE_DELETE + "')")
    public String deleteRole(@PathVariable Long id) {
        String prefix = "[deleteRole]|id=" + id;
        try {
            log.info("{}|START", prefix);
            roleService.deleteRole(id);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "Delete role successfully");
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error deleting role: " + e.getMessage());
        }
    }
}
