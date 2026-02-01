package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.InventoryHistoryRequest;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.service.InventoryHistoryService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/inventory-history")
@RequiredArgsConstructor
public class InventoryHistoryController {

    private final InventoryHistoryService inventoryHistoryService;
    private final UserRepository userRepository;

    // get list inventory history
    @GetMapping("/record")
    public String getAllInventoryHistory() {
        String prefix = "[getAllInventoryHistory]";
        try {
            log.info("{}|START", prefix);
            var response = inventoryHistoryService.getAllInventoryHistory();
            log.info("{}|END|size={}", prefix, response.size());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Get all inventory history success", response);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving inventory history: " + e.getMessage());
        }
    }

    // get inventory history detail
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
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Error retrieving inventory history detail: " + e.getMessage());
        }
    }

    // ghi nhận thay đổi inventory history
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
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Lỗi khi ghi nhận lịch sử tồn kho: " + e.getMessage());
        }
    }
}
