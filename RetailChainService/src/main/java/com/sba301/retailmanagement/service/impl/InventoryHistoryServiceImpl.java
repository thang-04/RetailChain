package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.InventoryHistoryRequest;
import com.sba301.retailmanagement.dto.response.InventoryHistoryResponse;
import com.sba301.retailmanagement.dto.response.UserResponse;
import com.sba301.retailmanagement.entity.InventoryHistory;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.repository.InventoryHistoryRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.service.InventoryHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class InventoryHistoryServiceImpl implements InventoryHistoryService {

    @Autowired
    private InventoryHistoryRepository inventoryHistoryRepository;
    @Autowired
    private UserRepository userRepository;


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
            dto.setActorUserId(e.getActorUser().getId());
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
