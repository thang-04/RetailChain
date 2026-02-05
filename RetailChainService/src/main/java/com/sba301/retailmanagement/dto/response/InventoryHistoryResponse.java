package com.sba301.retailmanagement.dto.response;


import com.sba301.retailmanagement.enums.InventoryAction;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class InventoryHistoryResponse {
    private Long id;
    private Long documentId;
    private Long documentItemId;
    /** Mã/tên phiếu (từ inventory_document.document_code) */
    private String documentName;
    private Long warehouseId;
    /** Tên kho (từ warehouses.name) */
    private String warehouseName;
    private Long variantId;
    /** Tên hiển thị biến thể (tên sản phẩm + SKU) */
    private String variantName;
    private InventoryAction action;
    private Integer quantity;
    private Integer balanceAfter;
    private Long actorUserId;
    /** Tên người thực hiện (fullName hoặc username) */
    private String actorUserName;
    private LocalDateTime occurredAt;

}
