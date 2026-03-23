package com.sba301.retailmanagement.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
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
    Boolean isFirstLogin;
    List<String> roles;
    List<String> permissions;
    Long storeId;
    String storeCode;
    String storeName;
    LocalDateTime createdDate;
    LocalDateTime modifiedDate;
    String createdBy;
    String modifiedBy;
}