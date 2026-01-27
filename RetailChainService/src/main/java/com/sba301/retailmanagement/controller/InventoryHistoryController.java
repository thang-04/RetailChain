package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.InventoryHistoryRequest;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.service.InventoryHistoryService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import static com.sba301.retailmanagement.utils.CommonUtils.gson;

@Slf4j
@RestController
@RequestMapping("/api/inventory-history")
public class InventoryHistoryController {

    @Autowired
    private InventoryHistoryService inventoryHistoryService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/record")
    public String recordInventoryHistory(
            @RequestParam Long actorUserId,
            @RequestBody InventoryHistoryRequest request
    ) {
        String prefix = "[recordInventoryHistory]"
                + "|actorUserId=" + actorUserId
                + "|warehouseId=" + request.getWarehouseId()
                + "|variantId=" + request.getVariantId();

        log.info("{}|START|warehouseId={}, variantId={}, quantity={}, action={}",
                prefix,
                request.getWarehouseId(),
                request.getVariantId(),
                request.getQuantity(),
                request.getAction()
        );
        try {
            User actorUser = userRepository.findById(actorUserId)
                    .orElse(null);

            if (actorUser == null) {
                log.error("{}|FAILED|Không tìm thấy người dùng", prefix);
                return ResponseJson.toJsonString(
                        ApiCode.UNSUCCESSFUL,
                        "Không tìm thấy người thực hiện thao tác"
                );
            }
            inventoryHistoryService.recordInventoryChange(request, actorUser);
            log.info("{}|END|Thành công", prefix);
            return ResponseJson.toJsonString(
                    ApiCode.SUCCESSFUL,
                    "Ghi nhận lịch sử tồn kho thành công"
            );
        } catch (Exception e) {
            log.error("{}|EXCEPTION|{}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(
                    ApiCode.ERROR_INTERNAL,
                    "Lỗi khi ghi nhận lịch sử tồn kho: " + e.getMessage()
            );
        }
    }
}
