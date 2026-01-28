package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.InventoryHistoryRequest;
import com.sba301.retailmanagement.dto.response.InventoryHistoryResponse;
import com.sba301.retailmanagement.entity.User;

import java.util.List;


public interface InventoryHistoryService {
    // Ghi log lịch sử tồn kho
    void recordInventoryChange(InventoryHistoryRequest request, User user);
    List<InventoryHistoryResponse> getAllInventoryHistory();
    InventoryHistoryResponse getInventoryHistoryDetail(Long id);

}
