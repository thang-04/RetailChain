package com.sba301.retailmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private Long storeId;
    private String username;
    private String fullName;
    private String phone;
    private String email;
    private Integer status;
}
