package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.WarehouseRequest;
import com.sba301.retailmanagement.dto.response.WarehouseResponse;
import com.sba301.retailmanagement.entity.Warehouse;
import com.sba301.retailmanagement.repository.WarehouseRepository;
import com.sba301.retailmanagement.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;

    @Override
    @Transactional
    public WarehouseResponse createWarehouse(WarehouseRequest request) {
        if (warehouseRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Warehouse code already exists");
        }

        Warehouse warehouse = new Warehouse();
        warehouse.setCode(request.getCode());
        warehouse.setName(request.getName());
        warehouse.setAddress(request.getAddress());
        warehouse.setProvince(request.getProvince());
        warehouse.setDistrict(request.getDistrict());
        warehouse.setWard(request.getWard());
        warehouse.setContactName(request.getContactName());
        warehouse.setContactPhone(request.getContactPhone());
        warehouse.setDescription(request.getDescription());
        warehouse.setStatus(request.getStatus() != null ? request.getStatus() : 1);
        warehouse.setCreatedAt(LocalDateTime.now());
        warehouse.setUpdatedAt(LocalDateTime.now());

        Warehouse savedWarehouse = warehouseRepository.save(warehouse);

        return mapToResponse(savedWarehouse);
    }

    @Override
    public List<WarehouseResponse> getAllWarehouses() {
        return warehouseRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WarehouseResponse updateWarehouse(Long id, WarehouseRequest request) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        if (request.getCode() != null && !request.getCode().equals(warehouse.getCode())) {
            if (warehouseRepository.existsByCode(request.getCode())) {
                throw new RuntimeException("Warehouse code already exists");
            }
            warehouse.setCode(request.getCode());
        }

        if (request.getName() != null) {
            warehouse.setName(request.getName());
        }

        if (request.getAddress() != null) {
            warehouse.setAddress(request.getAddress());
        }

        if (request.getProvince() != null) {
            warehouse.setProvince(request.getProvince());
        }

        if (request.getDistrict() != null) {
            warehouse.setDistrict(request.getDistrict());
        }

        if (request.getWard() != null) {
            warehouse.setWard(request.getWard());
        }

        if (request.getContactName() != null) {
            warehouse.setContactName(request.getContactName());
        }

        if (request.getContactPhone() != null) {
            warehouse.setContactPhone(request.getContactPhone());
        }

        if (request.getDescription() != null) {
            warehouse.setDescription(request.getDescription());
        }

        if (request.getStatus() != null) {
            warehouse.setStatus(request.getStatus());
        }

        warehouse.setUpdatedAt(LocalDateTime.now());
        Warehouse saved = warehouseRepository.save(warehouse);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteWarehouse(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        try {
            warehouseRepository.delete(warehouse);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new RuntimeException(
                    "Cannot delete warehouse because it has associated documents or history. Soft delete (Deactivate) recommended instead.");
        }
    }

    private WarehouseResponse mapToResponse(Warehouse warehouse) {
        return WarehouseResponse.builder()
                .id(warehouse.getId())
                .code(warehouse.getCode())
                .name(warehouse.getName())
                .address(warehouse.getAddress())
                .province(warehouse.getProvince())
                .district(warehouse.getDistrict())
                .ward(warehouse.getWard())
                .contactName(warehouse.getContactName())
                .contactPhone(warehouse.getContactPhone())
                .description(warehouse.getDescription())
                .status(warehouse.getStatus())
                .createdAt(warehouse.getCreatedAt())
                .updatedAt(warehouse.getUpdatedAt())
                .build();
    }
}
