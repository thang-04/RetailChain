package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceHistoryResponse {
    private String date;
    private String checkInTime;
    private String checkOutTime;
    private Double workHours;
    private String status;
    private String shiftName;
}
