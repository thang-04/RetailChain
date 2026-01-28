package com.sba301.retailmanagement.controller;

import com.google.gson.JsonObject;
import com.sba301.retailmanagement.dto.request.InventoryHistoryRequest;
import com.sba301.retailmanagement.dto.response.InventoryHistoryResponse;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.service.InventoryHistoryService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/inventory-history")
public class InventoryHistoryController {

    @Autowired
    private InventoryHistoryService inventoryHistoryService;

    @Autowired
    private UserRepository userRepository;

    //get list inventory history
    @GetMapping("/record")
    public ResponseEntity<?> getAllInventoryHistory() {
        try {
            return ResponseEntity.ok(
                    inventoryHistoryService.getAllInventoryHistory()
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    "Lỗi khi lấy lịch sử tồn kho"
            );
        }
    }
    //get inventory history detail
    @GetMapping("/record/{id}")
    public InventoryHistoryResponse getInventoryHistoryDetail(
            @PathVariable Long id) {
        return inventoryHistoryService.getInventoryHistoryDetail(id);
    }



    //ghi nhận thay đổi inventory history
    @PostMapping("/record/add")
    public String recordInventoryHistory(
            @RequestParam Long actorUserId,
            @RequestBody InventoryHistoryRequest request) {
        try {
            User actorUser = userRepository.findById(actorUserId)
                    .orElse(null);

            if (actorUser == null) {
                return ResponseJson.toJsonString(
                        ApiCode.UNSUCCESSFUL,
                        "Không tìm thấy người thực hiện thao tác"
                );
            }
            inventoryHistoryService.recordInventoryChange(request, actorUser);
            return ResponseJson.toJsonString(
                    ApiCode.SUCCESSFUL,
                    "Ghi nhận lịch sử tồn kho thành công"
            );
        } catch (Exception e) {
            return ResponseJson.toJsonString(
                    ApiCode.ERROR_INTERNAL,
                    "Lỗi khi ghi nhận lịch sử tồn kho: " + e.getMessage()
            );
        }
    }
}
