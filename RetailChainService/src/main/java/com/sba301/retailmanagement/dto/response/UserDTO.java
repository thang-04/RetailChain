package com.sba301.retailmanagement.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sba301.retailmanagement.enums.Region;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UserDTO implements Serializable {
    Long id;
    String username;
    String email;
    String fullName;
    String phoneNumber;
    String avatarUrl;
    Integer status;

    // Roles
    List<String> roles;

    // ==================== SCOPE INFO ====================
    /**
     * Region cho Regional Admin
     */
    Region region;

    /**
     * Warehouse ID - Kho tổng vùng (cho Regional Admin)
     */
    Long warehouseId;

    /**
     * Store ID - Cửa hàng (cho Store Manager/Staff)
     */
    Long storeId;

    /**
     * Tên cửa hàng (để hiển thị)
     */
    String storeName;

    /**
     * Tên kho (để hiển thị)
     */
    String warehouseName;

    // ==================== AUDIT INFO ====================
    LocalDateTime createdDate;
    LocalDateTime modifiedDate;
    String createdBy;
    String modifiedBy;
}