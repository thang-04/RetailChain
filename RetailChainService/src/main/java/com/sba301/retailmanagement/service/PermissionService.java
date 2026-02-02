package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.response.PermissionDTO;

import java.util.List;

public interface PermissionService {
    List<PermissionDTO> getAllPermissions();

    PermissionDTO getPermissionById(Long id);
}
