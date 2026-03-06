package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.InventoryHistoryRequest;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.service.InventoryHistoryService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import org.springframework.security.access.prepost.PreAuthorize;
import static com.sba301.retailmanagement.security.SecurityConstants.*;

@Slf4j
@RestController
@RequestMapping("/api/inventory-history")
@RequiredArgsConstructor
public class InventoryHistoryController {

    private final InventoryHistoryService inventoryHistoryService;
    private final UserRepository userRepository;

    // get list inventory history
    @PreAuthorize("hasAuthority('" + INVENTORY_VIEW + "')")
    @GetMapping("/record")
    public String getAllInventoryHistory(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String prefix = "[getAllInventoryHistory]";
        try {
            log.info("{}|START|search={}|action={}|fromDate={}|toDate={}|page={}|size={}",
                    prefix, search, action, fromDate, toDate, page, size);
            var response = inventoryHistoryService.getInventoryHistoryPage(search, action, fromDate, toDate, page,
                    size);
            log.info("{}|END|total={}", prefix, response.getTotalElements());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get all inventory history success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL,
                    "Error retrieving inventory history: " + e.getMessage());
        }
    }

    // get inventory history detail
    @PreAuthorize("hasAuthority('" + INVENTORY_VIEW + "')")
    @GetMapping("/record/{id}")
    public String getInventoryHistoryDetail(@PathVariable Long id) {
        String prefix = "[getInventoryHistoryDetail]|id=" + id;
        try {
            log.info("{}|START", prefix);
            var response = inventoryHistoryService.getInventoryHistoryDetail(id);
            if (response == null) {
                log.error("{}|FAILED|No data found", prefix);
                return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, "Inventory history not found");
            }
            log.info("{}|END", prefix);
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get inventory history detail success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL,
                    "Error retrieving inventory history detail: " + e.getMessage());
        }
    }

    // ghi nhận thay đổi inventory history
    @PreAuthorize("hasAuthority('" + INVENTORY_CREATE + "')")
    @PostMapping("/record/add")
    public String recordInventoryHistory(
            @RequestParam Long actorUserId,
            @RequestBody InventoryHistoryRequest request) {
        String prefix = "[recordInventoryHistory]|actorUserId=" + actorUserId;
        try {
            log.info("{}|START", prefix);
            User actorUser = userRepository.findById(actorUserId).orElse(null);

            if (actorUser == null) {
                log.error("{}|FAILED|User not found", prefix);
                return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, "Không tìm thấy người thực hiện thao tác");
            }
            inventoryHistoryService.recordInventoryChange(request, actorUser);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "Ghi nhận lịch sử tồn kho thành công");
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL,
                    "Lỗi khi ghi nhận lịch sử tồn kho: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('" + INVENTORY_VIEW + "')")
    @GetMapping("/record/export")
    public ResponseEntity<String> exportInventoryHistory(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        String prefix = "[exportInventoryHistory]";
        try {
            log.info("{}|START|search={}|action={}|fromDate={}|toDate={}", prefix, search, action, fromDate, toDate);
            String csv = inventoryHistoryService.exportInventoryHistoryCsv(search, action, fromDate, toDate);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN);
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=inventory-history.csv");

            log.info("{}|END|length={}", prefix, csv != null ? csv.length() : 0);
            return new ResponseEntity<>(csv, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error exporting inventory history: " + e.getMessage());
        }
    }
}
