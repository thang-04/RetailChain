package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.WarehouseRequest;
import com.sba301.retailmanagement.dto.response.InventoryStockResponse;
import com.sba301.retailmanagement.dto.response.WarehouseResponse;
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

    @PostMapping("/warehouse")
    public String createWarehouse(@RequestBody WarehouseRequest request) {
        String prefix = "[createWarehouse]";
        log.info("{}|START|request={}", prefix, gson.toJson(request));
        try {
            WarehouseResponse response = inventoryService.createWarehouse(request);
            log.info("{}|END|response={}", prefix, gson.toJson(response));
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Warehouse created successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error creating warehouse: " + e.getMessage());
        }
    }

    @GetMapping("/warehouse")
    public String getAllWarehouses() {
        String prefix = "[getAllWarehouses]";
        log.info("{}|START", prefix);
        try {
            List<WarehouseResponse> response = inventoryService.getAllWarehouses();
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Warehouses retrieved successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving warehouses: " + e.getMessage());
        }
    }

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
}
