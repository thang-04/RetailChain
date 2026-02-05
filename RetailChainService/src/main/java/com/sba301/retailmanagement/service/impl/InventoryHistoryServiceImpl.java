package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.InventoryHistoryRequest;
import com.sba301.retailmanagement.dto.response.InventoryHistoryResponse;
import com.sba301.retailmanagement.entity.InventoryDocument;
import com.sba301.retailmanagement.entity.InventoryHistory;
import com.sba301.retailmanagement.entity.Product;
import com.sba301.retailmanagement.entity.ProductVariant;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.entity.Warehouse;
import com.sba301.retailmanagement.repository.InventoryDocumentRepository;
import com.sba301.retailmanagement.repository.InventoryHistoryRepository;
import com.sba301.retailmanagement.repository.ProductVariantRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.repository.WarehouseRepository;
import com.sba301.retailmanagement.service.InventoryHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryHistoryServiceImpl implements InventoryHistoryService {

    @Autowired
    private InventoryHistoryRepository inventoryHistoryRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WarehouseRepository warehouseRepository;
    @Autowired
    private InventoryDocumentRepository inventoryDocumentRepository;
    @Autowired
    private ProductVariantRepository productVariantRepository;

    private void fillNames(InventoryHistory e, InventoryHistoryResponse dto) {
        if (e.getDocumentId() != null) {
            inventoryDocumentRepository.findById(e.getDocumentId())
                    .map(InventoryDocument::getDocumentCode)
                    .ifPresent(dto::setDocumentName);
        }
        if (e.getWarehouseId() != null) {
            warehouseRepository.findById(e.getWarehouseId())
                    .map(Warehouse::getName)
                    .ifPresent(dto::setWarehouseName);
        }
        if (e.getVariantId() != null) {
            productVariantRepository.findById(e.getVariantId())
                    .map(v -> {
                        String productName = Optional.ofNullable(v.getProduct()).map(Product::getName).orElse("");
                        String sku = v.getSku() != null ? v.getSku() : "";
                        return (productName.isEmpty() ? sku : productName + " (" + sku + ")").trim();
                    })
                    .ifPresent(dto::setVariantName);
        }
        if (e.getActorUser() != null) {
            User u = e.getActorUser();
            dto.setActorUserName(u.getFullName() != null && !u.getFullName().isBlank() ? u.getFullName() : u.getUsername());
        }
    }

    @Override
    public List<InventoryHistoryResponse> getAllInventoryHistory() {
        List<InventoryHistory> entities =
                inventoryHistoryRepository.findAllByOrderByOccurredAtDesc();
        List<InventoryHistoryResponse> responses = new ArrayList<>();
        for (InventoryHistory e : entities) {
            InventoryHistoryResponse dto = new InventoryHistoryResponse();
            dto.setId(e.getId());
            dto.setDocumentId(e.getDocumentId());
            dto.setDocumentItemId(e.getDocumentItemId());
            dto.setWarehouseId(e.getWarehouseId());
            dto.setVariantId(e.getVariantId());
            dto.setAction(e.getAction());
            dto.setQuantity(e.getQuantity());
            dto.setBalanceAfter(e.getBalanceAfter());
            dto.setOccurredAt(e.getOccurredAt());
            dto.setActorUserId(e.getActorUser() != null ? e.getActorUser().getId() : null);
            fillNames(e, dto);
            responses.add(dto);
        }
        return responses;
    }


    @Override
    public InventoryHistoryResponse getInventoryHistoryDetail(Long id) {
        InventoryHistory e = inventoryHistoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy lịch sử tồn kho :" + id)
                );

        InventoryHistoryResponse dto = new InventoryHistoryResponse();
        dto.setId(e.getId());
        dto.setDocumentId(e.getDocumentId());
        dto.setDocumentItemId(e.getDocumentItemId());
        dto.setWarehouseId(e.getWarehouseId());
        dto.setVariantId(e.getVariantId());
        dto.setAction(e.getAction());
        dto.setQuantity(e.getQuantity());
        dto.setBalanceAfter(e.getBalanceAfter());
        dto.setOccurredAt(e.getOccurredAt());
        if (e.getActorUser() != null) {
            dto.setActorUserId(e.getActorUser().getId());
        }
        fillNames(e, dto);
        return dto;
    }



    @Override
    public void recordInventoryChange(InventoryHistoryRequest request, User actorUser) {


        InventoryHistory inventoryHistory = new InventoryHistory();

        inventoryHistory.setWarehouseId(request.getWarehouseId());
        inventoryHistory.setVariantId(request.getVariantId());
        inventoryHistory.setAction(request.getAction());
        inventoryHistory.setQuantity(request.getQuantity());
        inventoryHistory.setBalanceAfter(request.getBalanceAfter());
        inventoryHistory.setDocumentId(request.getDocumentId());
        inventoryHistory.setDocumentItemId(request.getDocumentItemId());
        inventoryHistory.setActorUser( actorUser);
        inventoryHistory.setOccurredAt(LocalDateTime.now());

        inventoryHistoryRepository.save(inventoryHistory);
    }


}
