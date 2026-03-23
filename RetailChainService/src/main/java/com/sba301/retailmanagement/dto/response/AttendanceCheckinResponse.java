package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceCheckinResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long storeId;
    private String storeName;
    private String checkType;
    private String status;
    private LocalDateTime occurredAt;
    private Double distanceMeters;
    private String message;
    private String warning;
}
