package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.InventoryHistoryRequest;
import com.sba301.retailmanagement.entity.User;


public interface InventoryHistoryService {
    void recordInventoryChange(InventoryHistoryRequest request, User user);

}
