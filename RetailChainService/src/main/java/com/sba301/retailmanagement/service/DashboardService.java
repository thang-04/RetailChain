package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.response.DashboardSummaryResponse;

public interface DashboardService {
    /**
     * Tổng hợp dữ liệu dashboard theo timeRange.
     * timeRange: "30days" | "quarter" | "ytd"
     */
    DashboardSummaryResponse getSummary(String timeRange);
}

