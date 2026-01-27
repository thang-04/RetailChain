package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.InventoryHistoryRequest;
import com.sba301.retailmanagement.entity.InventoryHistory;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.repository.InventoryHistoryRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.service.InventoryHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class InventoryHistoryServiceImpl implements InventoryHistoryService {

    @Autowired
    private InventoryHistoryRepository inventoryHistoryRepository;
    @Autowired
    private UserRepository userRepository;


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
