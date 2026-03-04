package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.response.PermissionDTO;
import com.sba301.retailmanagement.entity.Permission;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.repository.PermissionRepository;
import com.sba301.retailmanagement.service.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    public List<PermissionDTO> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PermissionDTO getPermissionById(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
        return toDTO(permission);
    }

    private PermissionDTO toDTO(Permission permission) {
        return PermissionDTO.builder()
                .id(permission.getId())
                .name(permission.getName())
                .description(permission.getDescription())
                .build();
    }
}
