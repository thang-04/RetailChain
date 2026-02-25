package com.sba301.retailmanagement.dto.request;

import com.sba301.retailmanagement.enums.Region;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * DTO cho việc cập nhật User
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    private String fullName;

    private String phoneNumber;

    /**
     * Role IDs để gán cho user (thay thế toàn bộ roles hiện tại)
     */
    private Set<Long> roleIds;

    // ==================== SCOPE FIELDS ====================

    private Region region;

    private Long warehouseId;

    private Long storeId;
}
