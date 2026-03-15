package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.WarehouseRequest;
import com.sba301.retailmanagement.dto.response.WarehouseResponse;
import com.sba301.retailmanagement.service.InventoryService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.sba301.retailmanagement.utils.CommonUtils.gson;
import org.springframework.security.access.prepost.PreAuthorize;
import static com.sba301.retailmanagement.security.SecurityConstants.*;

@Slf4j
@RestController
@RequestMapping("/api/warehouse")
@RequiredArgsConstructor
public class WarehouseController {

    private final InventoryService inventoryService;

    @PreAuthorize("hasAuthority('" + WAREHOUSE_CREATE + "')")
    @PostMapping
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

    @PreAuthorize("hasAuthority('" + WAREHOUSE_VIEW + "')")
    @GetMapping
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

    @GetMapping("/central")
    public String getCentralWarehouse() {
        String prefix = "[getCentralWarehouse]";
        log.info("{}|START", prefix);
        try {
            WarehouseResponse response = inventoryService.getCentralWarehouse();
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Central warehouse retrieved successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving central warehouse: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + WAREHOUSE_UPDATE + "')")
    @PutMapping("/{id}")
    public String updateWarehouse(@PathVariable Long id, @RequestBody WarehouseRequest request) {
        String prefix = "[updateWarehouse]|id=" + id;
        log.info("{}|START|request={}", prefix, gson.toJson(request));
        try {
            WarehouseResponse response = inventoryService.updateWarehouse(id, request);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Warehouse updated successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error updating warehouse: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + WAREHOUSE_DELETE + "')")
    @DeleteMapping("/{id}")
    public String deleteWarehouse(@PathVariable Long id) {
        String prefix = "[deleteWarehouse]|id=" + id;
        log.info("{}|START", prefix);
        try {
            inventoryService.deleteWarehouse(id);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "Warehouse deleted successfully");
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error deleting warehouse: " + e.getMessage());
        }
    }
}
