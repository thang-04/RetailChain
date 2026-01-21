package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.response.UserResponse;

public interface UserService {
    UserResponse getProfile(Long id);
}
