package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceDashboardResponse {
    private Long presentToday;
    private Long completedToday;
    private Long totalStaff;
    private Long lateArrivals;
    private Long earlyLeaves;
    private Double avgWorkHours;
    private Long forgotCount;
    private String date;
    
    @Builder.Default
    private List<AttendanceHistoryResponse> recentRecords = new java.util.ArrayList<>();
}
