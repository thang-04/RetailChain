package com.sba301.retailmanagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class StockRequestResponse {
    private Long id;
    private String requestCode;
    private Long storeId;
    private String storeName;
    private Long targetWarehouseId;
    private String targetWarehouseName;
    private String status;
    private String note;
    private String priority;
    private Long createdBy;
    private String createdByName;
    private LocalDateTime createdAt;
    private Long approvedBy;
    private String approvedByName;
    private LocalDateTime approvedAt;
    private Long rejectedBy;
    private String rejectedByName;
    private LocalDateTime rejectedAt;
    private String rejectReason;
    private Long cancelledBy;
    private String cancelledByName;
    private LocalDateTime cancelledAt;
    private String cancelReason;
    private Long exportedDocumentId;
    private String exportedDocumentCode;
    private int totalItems;
    private List<StockRequestItemResponse> items;
}
