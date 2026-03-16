package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.CreateRoleRequest;
import com.sba301.retailmanagement.dto.request.UpdateRoleRequest;
import com.sba301.retailmanagement.dto.response.PermissionDTO;
import com.sba301.retailmanagement.dto.response.RoleDTO;
import com.sba301.retailmanagement.entity.Permission;
import com.sba301.retailmanagement.entity.Role;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.repository.PermissionRepository;
import com.sba301.retailmanagement.repository.RoleRepository;
import com.sba301.retailmanagement.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoleDTO getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        return toDTO(role);
    }

    @Override
    @Transactional
    public RoleDTO createRole(CreateRoleRequest request) {
        if (roleRepository.existsByName(request.getName())) {
            throw new RuntimeException("Role name already exists: " + request.getName());
        }

        Role role = Role.builder()
                .code(request.getName().toUpperCase().replace(" ", "_"))
                .name(request.getName())
                .description(request.getDescription())
                .permissions(new HashSet<>())
                .build();

        // Set permissions if provided
        if (request.getPermissionIds() != null && !request.getPermissionIds().isEmpty()) {
            Set<Permission> permissions = new HashSet<>(
                    permissionRepository.findAllById(request.getPermissionIds()));

            if (permissions.size() != request.getPermissionIds().size()) {
                throw new RuntimeException("Some permission IDs are invalid");
            }

            role.setPermissions(permissions);
        }

        Role savedRole = roleRepository.save(role);
        return toDTO(savedRole);
    }

    @Override
    @Transactional
    public RoleDTO updateRole(Long id, UpdateRoleRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            if (!role.getName().equals(request.getName()) &&
                    roleRepository.existsByName(request.getName())) {
                throw new RuntimeException("Role name already exists: " + request.getName());
            }
            role.setName(request.getName());
            // DO NOT update code manually:
            // role.setCode(request.getName().toUpperCase().replace(" ", "_"));
        }

        if (request.getDescription() != null) {
            role.setDescription(request.getDescription());
        }

        if (request.getPermissionIds() != null) {
            if (request.getPermissionIds().isEmpty()) {
                role.getPermissions().clear();
            } else {
                Set<Permission> permissions = new HashSet<>(
                        permissionRepository.findAllById(request.getPermissionIds()));

                if (permissions.size() != request.getPermissionIds().size()) {
                    throw new RuntimeException("Some permission IDs are invalid");
                }

                role.setPermissions(permissions);
            }
        }

        Role updatedRole = roleRepository.save(role);
        return toDTO(updatedRole);
    }

    @Override
    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));

        // Prevent deleting system roles
        if ("SUPER_ADMIN".equals(role.getCode()) || "ADMIN".equals(role.getCode())) {
            throw new RuntimeException("Cannot delete system role: " + role.getName());
        }

        roleRepository.delete(role);
    }

    private RoleDTO toDTO(Role role) {
        Set<PermissionDTO> permissionDTOs = role.getPermissions() != null
                ? role.getPermissions().stream()
                        .map(p -> PermissionDTO.builder()
                                .id(p.getId())
                                .name(p.getName())
                                .description(p.getDescription())
                                .build())
                        .collect(Collectors.toSet())
                : new HashSet<>();

        return RoleDTO.builder()
                .id(role.getId())
                .code(role.getCode())
                .name(role.getName())
                .description(role.getDescription())
                .permissions(permissionDTOs)
                .build();
    }
}
