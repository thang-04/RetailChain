package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.dto.request.ChangePassWordRequest;
import com.sba301.retailmanagement.dto.request.ConfirmPasswordRequest;
import com.sba301.retailmanagement.dto.request.LoginRequest;
import com.sba301.retailmanagement.dto.request.RefreshTokenRequest;
import com.sba301.retailmanagement.dto.request.RegisterRequest;
import com.sba301.retailmanagement.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(Long userId);

    AuthResponse changePassword(ChangePassWordRequest request, String token);

    void forgotPassWord(String email);

    void confirmPassWord(ConfirmPasswordRequest request);

    boolean verifyOtp(String email, String otp);
}
