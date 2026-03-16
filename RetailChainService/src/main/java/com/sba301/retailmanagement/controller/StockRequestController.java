package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.StockRequestCreateRequest;
import com.sba301.retailmanagement.dto.request.StockRequestRejectRequest;
import com.sba301.retailmanagement.dto.response.StockRequestResponse;
import com.sba301.retailmanagement.service.StockRequestService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.sba301.retailmanagement.security.SecurityConstants.*;

@Slf4j
@RestController
@RequestMapping("/api/stock-request")
@RequiredArgsConstructor
public class StockRequestController {

    private final StockRequestService stockRequestService;

    @PreAuthorize("hasAuthority('" + INVENTORY_CREATE + "')")
    @PostMapping
    public String createRequest(@RequestBody StockRequestCreateRequest request) {
        String prefix = "[createRequest]";
        log.info("{}|START", prefix);
        try {
            StockRequestResponse response = stockRequestService.createRequest(request);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Stock request created successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error creating stock request: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + INVENTORY_VIEW + "')")
    @GetMapping("/store/{storeId}")
    public String getStoreRequests(@PathVariable Long storeId) {
        String prefix = "[getStoreRequests]|storeId=" + storeId;
        log.info("{}|START", prefix);
        try {
            List<StockRequestResponse> response = stockRequestService.getStoreRequests(storeId);
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Store requests retrieved successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving store requests: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + INVENTORY_VIEW + "')")
    @GetMapping("/pending")
    public String getPendingRequests() {
        String prefix = "[getPendingRequests]";
        log.info("{}|START", prefix);
        try {
            List<StockRequestResponse> response = stockRequestService.getPendingRequests();
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Pending requests retrieved successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving pending requests: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + INVENTORY_VIEW + "')")
    @GetMapping("/{id}")
    public String getRequestById(@PathVariable Long id) {
        String prefix = "[getRequestById]|id=" + id;
        log.info("{}|START", prefix);
        try {
            StockRequestResponse response = stockRequestService.getRequestById(id);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Request retrieved successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving request: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + INVENTORY_UPDATE + "')")
    @PutMapping("/{id}/approve")
    public String approveRequest(@PathVariable Long id) {
        String prefix = "[approveRequest]|id=" + id;
        log.info("{}|START", prefix);
        try {
            StockRequestResponse response = stockRequestService.approveRequest(id);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Request approved successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error approving request: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + INVENTORY_UPDATE + "')")
    @PutMapping("/{id}/reject")
    public String rejectRequest(@PathVariable Long id, @RequestBody StockRequestRejectRequest request) {
        String prefix = "[rejectRequest]|id=" + id;
        log.info("{}|START", prefix);
        try {
            StockRequestResponse response = stockRequestService.rejectRequest(id, request);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Request rejected successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error rejecting request: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + INVENTORY_CREATE + "')")
    @PutMapping("/{id}/cancel")
    public String cancelRequest(@PathVariable Long id, @RequestParam String reason) {
        String prefix = "[cancelRequest]|id=" + id;
        log.info("{}|START", prefix);
        try {
            StockRequestResponse response = stockRequestService.cancelRequest(id, reason);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Request cancelled successfully", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error cancelling request: " + e.getMessage());
        }
    }
}
