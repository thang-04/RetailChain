package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryResponse {
    private List<DashboardKpiItemDTO> kpis;
    private List<RevenueDataDTO> revenueSeries;
    private List<DashboardStoreRankingDTO> storeRanking;
    private List<DashboardStoreRowDTO> storeTable;
}

