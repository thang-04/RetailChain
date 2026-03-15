package com.sba301.retailmanagement.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class InventoryDocumentResponse {
    private Long id;
    private String documentCode;
    private String documentType;
    private Long sourceWarehouseId;
    private String sourceWarehouseName;
    private Long targetWarehouseId;
    private String targetWarehouseName;
    private String note;
    private String status; // Assuming status logic or just completed
    private String createdBy; // Username
    private LocalDateTime createdAt;

    // Additional fields for UI display
    private int totalItems;
    private Long totalValue; // If applicable, or 0
    private String supplier; // If note stores supplier name or referenceType is supplier
    private List<InventoryDocumentItemResponse> items;
}
