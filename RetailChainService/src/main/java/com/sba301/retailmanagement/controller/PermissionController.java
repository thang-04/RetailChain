package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.service.PermissionService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.sba301.retailmanagement.security.SecurityConstants.PERMISSION_VIEW;

@Slf4j
@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
@Tag(name = "Permission", description = "APIs for managing permissions in the system")
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    @Operation(summary = "Get all permissions", description = "Returns a list of all permissions in the system. Requires PERMISSION_VIEW authority")
    @PreAuthorize("hasAuthority('" + PERMISSION_VIEW + "')")
    public String getAllPermissions() {
        String prefix = "[getAllPermissions]";
        try {
            log.info("{}|START", prefix);
            var permissions = permissionService.getAllPermissions();
            log.info("{}|END|size={}", prefix, permissions.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get all permissions successfully", permissions);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving permissions: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get permission by ID", description = "Returns details of a specific permission by ID. Requires PERMISSION_VIEW authority")
    @PreAuthorize("hasAuthority('" + PERMISSION_VIEW + "')")
    public String getPermissionById(@PathVariable Long id) {
        String prefix = "[getPermissionById]|id=" + id;
        try {
            log.info("{}|START", prefix);
            var permission = permissionService.getPermissionById(id);
            if (permission == null) {
                log.error("{}|FAILED|Permission not found", prefix);
                return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, "Permission not found");
            }
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get permission by id successfully", permission);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving permission: " + e.getMessage());
        }
    }
}
