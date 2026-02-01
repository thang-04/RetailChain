package com.sba301.retailmanagement.dto.response;


import com.sba301.retailmanagement.enums.InventoryAction;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
//v1 - sửa sau
public class InventoryHistoryResponse {
    private Long id;
    private Long documentId;
    private Long documentItemId;
    private Long warehouseId;
    private Long variantId;
    private InventoryAction action;
    private Integer quantity;
    private Integer balanceAfter;
    private Long actorUserId;
    private LocalDateTime occurredAt;

}
