package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.InventoryAdjustRequest;
import com.sba301.retailmanagement.dto.request.StockRequest;
import com.sba301.retailmanagement.dto.request.TransferRequest;
import com.sba301.retailmanagement.dto.request.WarehouseRequest;
import com.sba301.retailmanagement.dto.response.InventoryOverviewResponse;
import com.sba301.retailmanagement.dto.response.InventoryDetailResponse;
import com.sba301.retailmanagement.dto.response.InventoryStockResponse;
import com.sba301.retailmanagement.dto.response.WarehouseResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface InventoryService {
    WarehouseResponse createWarehouse(WarehouseRequest request);

    List<WarehouseResponse> getAllWarehouses();

    WarehouseResponse getCentralWarehouse();

    List<InventoryStockResponse> getStockByWarehouse(Long warehouseId);

    List<InventoryStockResponse> getStockByProduct(Long productId);

    List<InventoryStockResponse> getStockByStore(Long storeId);

    void importStock(StockRequest request);

    void exportStock(StockRequest request);

    void transferStock(TransferRequest request);

    List<com.sba301.retailmanagement.dto.response.InventoryDocumentResponse> getDocumentsByType(String type);

    WarehouseResponse updateWarehouse(Long id, WarehouseRequest request);

    void deleteWarehouse(Long id);

    void deleteDocument(Long id);

    InventoryOverviewResponse getInventoryOverview(LocalDateTime from, LocalDateTime to);

    InventoryOverviewResponse getInventoryOverview();

    void importStockFromExcel(List<Map<String, Object>> items);

    void confirmReceipt(Long documentId);

    List<com.sba301.retailmanagement.dto.response.InventoryDocumentResponse> getExportDocumentsByStore(Long storeId);

    InventoryDetailResponse getInventoryDetail(String inventoryId);

    void adjustInventory(String inventoryId, InventoryAdjustRequest request);
}
