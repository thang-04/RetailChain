package com.sba301.retailmanagement.dto.request;

import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.enums.InventoryAction;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class InventoryHistoryRequest {
    // init trước - change sau
    private Long documentId;
    private Long documentItemId;
    private Long warehouseId;
    private Long variantId;
    private InventoryAction action;
    private Integer quantity;
    private Integer balanceAfter;
    private LocalDateTime occurredAt;
}
