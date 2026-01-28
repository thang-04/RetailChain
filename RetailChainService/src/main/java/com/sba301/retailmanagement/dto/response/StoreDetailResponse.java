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
public class StoreDetailResponse {
    private Long id;
    private String code;
    private String name;
    private String address;
    private String manager; // Mock
    private String phone; // Mock
    private String email; // Mock
    private String status;
    private String type; // Mock
    private StoreKpiDTO kpi;
    private List<StoreInventoryDTO> inventory;
    private List<StoreStaffDTO> staff;
}
