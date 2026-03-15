package com.sba301.retailmanagement.dto.request;

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

    private Set<Long> roleIds;

    private Long storeId;

    private Integer status;
}
