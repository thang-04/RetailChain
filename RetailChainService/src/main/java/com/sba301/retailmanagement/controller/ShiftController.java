package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.ShiftAssignmentRequest;
import com.sba301.retailmanagement.dto.request.ShiftRequest;
import com.sba301.retailmanagement.dto.response.ShiftAssignmentResponse;
import com.sba301.retailmanagement.dto.response.ShiftResponse;
import com.sba301.retailmanagement.service.ShiftService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    @Autowired
    private ShiftService shiftService;

    // ==================== SHIFT CRUD ====================

    @PostMapping
    public String createShift(@RequestBody ShiftRequest request) {
        String prefix = "[createShift]|name=" + (request != null ? request.getName() : "null");
        log.info("{}|START", prefix);
        try {
            ShiftResponse response = shiftService.createShift(request);
            log.info("{}|END|id={}", prefix, response.getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Create shift success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error creating shift: " + e.getMessage());
        }
    }

    @GetMapping
    public String getAllShifts() {
        String prefix = "[getAllShifts]";
        log.info("{}|START", prefix);
        try {
            List<ShiftResponse> response = shiftService.getAllShifts();
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get all shifts success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving shifts: " + e.getMessage());
        }
    }

    @GetMapping("/store/{storeId}")
    public String getShiftsByStore(@PathVariable Long storeId) {
        String prefix = "[getShiftsByStore]|storeId=" + storeId;
        log.info("{}|START", prefix);
        try {
            List<ShiftResponse> response = shiftService.getShiftsByStore(storeId);
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get shifts by store success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving shifts: " + e.getMessage());
        }
    }

    @GetMapping("/templates")
    public String getGlobalTemplates() {
        String prefix = "[getGlobalTemplates]";
        log.info("{}|START", prefix);
        try {
            List<ShiftResponse> response = shiftService.getGlobalTemplates();
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get global templates success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving templates: " + e.getMessage());
        }
    }

    @PostMapping("/store/{storeId}/import-templates")
    public String importTemplates(@PathVariable Long storeId, @RequestBody List<Long> templateIds) {
        String prefix = "[importTemplates]|storeId=" + storeId + "|templateIds=" + templateIds;
        log.info("{}|START", prefix);
        try {
            List<ShiftResponse> response = shiftService.importTemplates(storeId, templateIds);
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Import templates success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error importing templates: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public String updateShift(@PathVariable Long id, @RequestBody ShiftRequest request) {
        String prefix = "[updateShift]|id=" + id;
        log.info("{}|START", prefix);
        try {
            ShiftResponse response = shiftService.updateShift(id, request);
            log.info("{}|END|id={}", prefix, response.getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Update shift success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error updating shift: " + e.getMessage());
        }
    }

    // ==================== SHIFT ASSIGNMENT ====================

    @PostMapping("/assign")
    public String assignShifts(@RequestBody ShiftAssignmentRequest request) {
        String prefix = "[assignShifts]|shiftIds=" + (request != null ? request.getShiftIds() : "null")
                + "|userId=" + (request != null ? request.getUserId() : "null");
        log.info("{}|START", prefix);
        try {
            List<ShiftAssignmentResponse> response = shiftService.assignShifts(request);
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Assign shift success", response);
        } catch (IllegalArgumentException e) {
            log.warn("{}|BAD_REQUEST|{}", prefix, e.getMessage());
            return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, e.getMessage());
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error assigning shift: " + e.getMessage());
        }
    }

    @PutMapping("/assign/{id}/cancel")
    public String cancelAssignment(@PathVariable Long id) {
        String prefix = "[cancelAssignment]|id=" + id;
        log.info("{}|START", prefix);
        try {
            ShiftAssignmentResponse response = shiftService.cancelAssignment(id);
            log.info("{}|END|status={}", prefix, response.getStatus());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Cancel assignment success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error cancelling assignment: " + e.getMessage());
        }
    }

    @GetMapping("/assignments")
    public String getAssignments(
            @RequestParam Long storeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        String prefix = "[getAssignments]|storeId=" + storeId + "|from=" + from + "|to=" + to;
        log.info("{}|START", prefix);
        try {
            List<ShiftAssignmentResponse> response = shiftService.getAssignmentsByStoreAndDateRange(storeId, from, to);
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get assignments success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving assignments: " + e.getMessage());
        }
    }

    @GetMapping("/assignments/user/{userId}")
    public String getAssignmentsByUser(@PathVariable Long userId) {
        String prefix = "[getAssignmentsByUser]|userId=" + userId;
        log.info("{}|START", prefix);
        try {
            List<ShiftAssignmentResponse> response = shiftService.getAssignmentsByUser(userId);
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get user assignments success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving assignments: " + e.getMessage());
        }
    }
}
