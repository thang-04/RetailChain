package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.CreateRoleRequest;
import com.sba301.retailmanagement.dto.request.UpdateRoleRequest;
import com.sba301.retailmanagement.dto.response.RoleDTO;

import java.util.List;

public interface RoleService {
    List<RoleDTO> getAllRoles();

    RoleDTO getRoleById(Long id);

    RoleDTO createRole(CreateRoleRequest request);

    RoleDTO updateRole(Long id, UpdateRoleRequest request);

    void deleteRole(Long id);
}
