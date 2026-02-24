package com.sba301.retailmanagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class InventoryHistoryPageResponse {
    private List<InventoryHistoryResponse> items;
    private long totalElements;
    private int page;
    private int size;
}

