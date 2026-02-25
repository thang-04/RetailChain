package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.StockRequest;
import com.sba301.retailmanagement.dto.request.TransferRequest;
import com.sba301.retailmanagement.dto.response.InventoryOverviewResponse;
import com.sba301.retailmanagement.dto.response.InventoryStockResponse;

import java.util.List;

public interface InventoryService {
    
    List<InventoryStockResponse> getStockByWarehouse(Long warehouseId);

    void importStock(StockRequest request);

    void exportStock(StockRequest request);

    void transferStock(TransferRequest request);

    List<com.sba301.retailmanagement.dto.response.InventoryDocumentResponse> getDocumentsByType(String type);

    void deleteDocument(Long id);

    /**
     * Lấy thông tin tổng quan tồn kho toàn hệ thống (dùng cho dashboard Inventory).
     */
    InventoryOverviewResponse getInventoryOverview();
}
