package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.InventoryAdjustRequest;
import com.sba301.retailmanagement.dto.request.StockRequest;
import com.sba301.retailmanagement.dto.request.TransferRequest;
import com.sba301.retailmanagement.dto.request.WarehouseRequest;
import com.sba301.retailmanagement.dto.response.InventoryOverviewResponse;
import com.sba301.retailmanagement.dto.response.InventoryDetailResponse;
import com.sba301.retailmanagement.dto.response.InventoryStockResponse;
import com.sba301.retailmanagement.dto.response.WarehouseResponse;
import java.util.List;
import java.util.Map;

public interface InventoryService {
    WarehouseResponse createWarehouse(WarehouseRequest request);

    List<WarehouseResponse> getAllWarehouses();

    List<InventoryStockResponse> getStockByWarehouse(Long warehouseId);

    List<InventoryStockResponse> getStockByProduct(Long productId);

    void importStock(StockRequest request);

    void exportStock(StockRequest request);

    void transferStock(TransferRequest request);

    List<com.sba301.retailmanagement.dto.response.InventoryDocumentResponse> getDocumentsByType(String type);

    WarehouseResponse updateWarehouse(Long id, WarehouseRequest request);

    void deleteWarehouse(Long id);

    void deleteDocument(Long id);

    /**
     * Lấy thông tin tổng quan tồn kho toàn hệ thống (dùng cho dashboard Inventory).
     */
    InventoryOverviewResponse getInventoryOverview();

    /**
     * Nhập kho từ Excel data.
     * @param items List of items with sku, productName, quantity, unitPrice, note
     */
    void importStockFromExcel(List<Map<String, Object>> items);

    /**
     * Lấy danh sách tồn kho theo store (mapping từ store -> warehouse).
     */
    List<InventoryStockResponse> getStockByStore(Long storeId);

    /**
     * Lấy chi tiết một bản ghi tồn kho theo inventoryId (warehouseId-variantId).
     */
    InventoryDetailResponse getInventoryDetail(String inventoryId);

    /**
     * Điều chỉnh tồn kho thủ công, đồng thời ghi nhận lịch sử điều chỉnh.
     */
    void adjustInventory(String inventoryId, InventoryAdjustRequest request);
}
