package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.CreateStoreRequest;
import com.sba301.retailmanagement.dto.request.UpdateStoreRequest;
import com.sba301.retailmanagement.service.StoreService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import static com.sba301.retailmanagement.utils.CommonUtils.gson;
import org.springframework.security.access.prepost.PreAuthorize;
import static com.sba301.retailmanagement.security.SecurityConstants.*;

@Slf4j
@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @PreAuthorize("hasAuthority('" + STORE_VIEW + "')")
    @GetMapping
    public String getAllStores() {
        String prefix = "[getAllStores]";
        try {
            log.info("{}|START", prefix);
            var response = storeService.getAllStores();
            if (response == null) {
                log.error("{}|FAILED|Error occurred while retrieving stores", prefix);
                return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving stores");
            }
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get all stores success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving stores: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + STORE_VIEW + "')")
    @GetMapping("/{slug}")
    public String getStoreBySlug(@PathVariable String slug) {
        String prefix = "[getStoreBySlug]|slug=" + slug;
        try {
            log.info("{}|START", prefix);
            var response = storeService.getStoreBySlug(slug);
            if (response == null) {
                log.error("{}|FAILED|No data found", prefix);
                return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, "Store not found");
            }
            log.info("{}|END|data={}", prefix, gson.toJson(response));
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get store detail success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL,
                    "Error retrieving store detail: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + STORE_CREATE + "')")
    @PostMapping
    public String createStore(@RequestBody CreateStoreRequest request) {
        String prefix = "[createStore]|code=" + (request != null ? request.getCode() : "null");
        try {
            log.info("{}|START", prefix);
            var response = storeService.createStore(request);
            if (response == null) {
                log.error("{}|FAILED|Error occurred while creating store", prefix);
                return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error creating store");
            }
            log.info("{}|END|id={}", prefix, response.getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Create store success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error creating store: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + STORE_UPDATE + "')")
    @PutMapping("/{slug}")
    public String updateStore(@PathVariable String slug,
            @RequestBody UpdateStoreRequest request) {
        String prefix = "[updateStore]|slug=" + slug;
        try {
            log.info("{}|START", prefix);
            var response = storeService.updateStore(slug, request);
            if (response == null) {
                log.error("{}|FAILED|Error occurred while updating store", prefix);
                return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error updating store");
            }
            log.info("{}|END|id={}", prefix, response.getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Update store success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error updating store: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + STORE_VIEW + "')")
    @GetMapping("/{id}/staff")
    public String getStoreStaff(@PathVariable Long id) {
        // Mock response for now as User/Staff structure is complex
        // In real impl, query User repo by storeId
        return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get store staff success",
                java.util.Collections.emptyList());
    }
}
