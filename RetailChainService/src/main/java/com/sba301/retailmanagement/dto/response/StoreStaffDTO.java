package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StoreStaffDTO {
    private Long id;
    private String name;
    private String role;
    private String status;
    private String statusColor;
    private String dotColor;
    private String image;
    private String initials;
    private String initialsColor;
}
