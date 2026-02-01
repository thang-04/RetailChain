package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.WarehouseRequest;
import com.sba301.retailmanagement.dto.request.StockRequest;
import com.sba301.retailmanagement.dto.request.TransferRequest;
import com.sba301.retailmanagement.dto.response.InventoryStockResponse;
import com.sba301.retailmanagement.dto.response.WarehouseResponse;
import java.util.List;

public interface InventoryService {
    WarehouseResponse createWarehouse(WarehouseRequest request);

    List<WarehouseResponse> getAllWarehouses();

    List<InventoryStockResponse> getStockByWarehouse(Long warehouseId);

    void importStock(StockRequest request);

    void exportStock(StockRequest request);

    void transferStock(TransferRequest request);

    List<com.sba301.retailmanagement.dto.response.InventoryDocumentResponse> getDocumentsByType(String type);

    WarehouseResponse updateWarehouse(Long id, WarehouseRequest request);

    void deleteWarehouse(Long id);

    void deleteDocument(Long id);
}
