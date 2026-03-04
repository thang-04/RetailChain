package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.StockRequest;
import com.sba301.retailmanagement.dto.request.TransferRequest;
import com.sba301.retailmanagement.dto.response.InventoryOverviewResponse;
import com.sba301.retailmanagement.dto.response.InventoryStockResponse;
import com.sba301.retailmanagement.service.InventoryService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.sba301.retailmanagement.utils.CommonUtils.gson;

@Slf4j
@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/stock/{warehouseId}")
    public String getStockByWarehouse(@PathVariable Long warehouseId) {
        String prefix = "[getStockByWarehouse]|warehouseId=" + warehouseId;
        log.info("{}|START", prefix);
        try {
            List<InventoryStockResponse> response = inventoryService.getStockByWarehouse(warehouseId);
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Stock retrieved successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving stock: " + e.getMessage());
        }
    }

    @GetMapping("/product/{productId}")
    public String getStockByProduct(@PathVariable Long productId) {
        String prefix = "[getStockByProduct]|productId=" + productId;
        log.info("{}|START", prefix);
        try {
            List<InventoryStockResponse> response = inventoryService.getStockByProduct(productId);
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Stock retrieved successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving stock: " + e.getMessage());
        }
    }

    @PostMapping("/import")
    public String importStock(@RequestBody StockRequest request) {
        String prefix = "[importStock]";
        log.info("{}|START|request={}", prefix, gson.toJson(request));
        try {
            inventoryService.importStock(request);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "Stock imported successfully");
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error importing stock: " + e.getMessage());
        }
    }

    @PostMapping("/export")
    public String exportStock(@RequestBody StockRequest request) {
        String prefix = "[exportStock]";
        log.info("{}|START|request={}", prefix, gson.toJson(request));
        try {
            inventoryService.exportStock(request);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "Stock exported successfully");
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error exporting stock: " + e.getMessage());
        }
    }

    @PostMapping("/transfer")
    public String transferStock(@RequestBody TransferRequest request) {
        String prefix = "[transferStock]";
        log.info("{}|START|request={}", prefix, gson.toJson(request));
        try {
            inventoryService.transferStock(request);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "Stock transferred successfully");
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error transferring stock: " + e.getMessage());
        }
    }

    @GetMapping("/documents")
    public String getDocuments(@RequestParam String type) {
        String prefix = "[getDocuments]|type=" + type;
        log.info("{}|START", prefix);
        try {
            List<com.sba301.retailmanagement.dto.response.InventoryDocumentResponse> response = inventoryService
                    .getDocumentsByType(type);
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Documents retrieved successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving documents: " + e.getMessage());
        }
    }

    @DeleteMapping("/documents/{id}")
    public String deleteDocument(@PathVariable Long id) {
        String prefix = "[deleteDocument]|id=" + id;
        log.info("{}|START", prefix);
        try {
            inventoryService.deleteDocument(id);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "Document deleted successfully");
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error deleting document: " + e.getMessage());
        }
    }

    @GetMapping("/overview")
    public String getInventoryOverview() {
        String prefix = "[getInventoryOverview]";
        log.info("{}|START", prefix);
        try {
            InventoryOverviewResponse response = inventoryService.getInventoryOverview();
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Inventory overview retrieved successfully",
                    response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL,
                    "Error retrieving inventory overview: " + e.getMessage());
        }
    }
}
