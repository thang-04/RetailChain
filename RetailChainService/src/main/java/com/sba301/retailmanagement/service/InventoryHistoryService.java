package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.InventoryHistoryRequest;
import com.sba301.retailmanagement.dto.response.InventoryHistoryPageResponse;
import com.sba301.retailmanagement.dto.response.InventoryHistoryResponse;
import com.sba301.retailmanagement.entity.User;

import java.time.LocalDateTime;
import java.util.List;


public interface InventoryHistoryService {
    // Ghi log lịch sử tồn kho
    void recordInventoryChange(InventoryHistoryRequest request, User user);

    List<InventoryHistoryResponse> getAllInventoryHistory();

    InventoryHistoryResponse getInventoryHistoryDetail(Long id);

    /**
     * Lấy danh sách lịch sử tồn kho theo filter + phân trang (xử lý ở backend).
     */
    InventoryHistoryPageResponse getInventoryHistoryPage(String search,
                                                         String action,
                                                         LocalDateTime fromDate,
                                                         LocalDateTime toDate,
                                                         int page,
                                                         int size);

    /**
     * Xuất CSV lịch sử tồn kho theo filter (phục vụ Export Report).
     */
    String exportInventoryHistoryCsv(String search,
                                     String action,
                                     LocalDateTime fromDate,
                                     LocalDateTime toDate);

}
