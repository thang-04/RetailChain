package com.sba301.retailmanagement.controller;

import com.sba301.retailmanagement.dto.request.ChangePassWordRequest;
import com.sba301.retailmanagement.dto.request.ConfirmPasswordRequest;
import com.sba301.retailmanagement.dto.request.LoginRequest;
import com.sba301.retailmanagement.dto.request.RefreshTokenRequest;
import com.sba301.retailmanagement.dto.request.RegisterRequest;
import com.sba301.retailmanagement.dto.response.AuthResponse;
import com.sba301.retailmanagement.security.CustomUserDetails;
import com.sba301.retailmanagement.service.AuthService;
import com.sba301.retailmanagement.utils.ApiCode;
import com.sba301.retailmanagement.utils.ResponseJson;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "APIs for user authentication and authorization")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register new account", description = "Create a new user account with email, password and full name")
    public String register(@Valid @RequestBody RegisterRequest request) {
        String prefix = "[register]|email=" + request.getEmail();
        try {
            log.info("{}|START", prefix);
            AuthResponse authResponse = authService.register(request);
            log.info("{}|END|userId={}", prefix, authResponse.getUser().getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "User registered successfully", authResponse);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate user and return access token with refresh token")
    public String login(@Valid @RequestBody LoginRequest request) {
        String prefix = "[login]|email=" + request.getEmail();
        try {
            log.info("{}|START", prefix);
            AuthResponse authResponse = authService.login(request);
            log.info("{}|END|userId={}", prefix, authResponse.getUser().getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Login successful", authResponse);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.NOT_AUTHORIZED, "Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Use refresh token to obtain new access token when the old one expires")
    public String refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        String prefix = "[refreshToken]";
        try {
            log.info("{}|START", prefix);
            AuthResponse authResponse = authService.refreshToken(request);
            log.info("{}|END|userId={}", prefix, authResponse.getUser().getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Token refreshed successfully", authResponse);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.TOKEN_EXPIRED, "Token refresh failed: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Invalidate the refresh token of the current user")
    public String logout(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseJson.toJsonString(ApiCode.NOT_AUTHORIZED, "User not authenticated");
        }
        String prefix = "[logout]|userId=" + userDetails.getId();
        try {
            log.info("{}|START", prefix);
            authService.logout(userDetails.getId());
            log.info("{}|END", prefix);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "Logout successful");
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Logout failed: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password", description = "Update user password with old password verification")
    public String changePassWord(@Valid @RequestBody ChangePassWordRequest request,
                                 @RequestHeader("Authorization") String bearertoken) {
        String prefix = "[changePassword]";
        try {
            log.info("{}|START", prefix);
            String token = bearertoken.substring(7);
            AuthResponse authResponse = authService.changePassword(request, token);
            log.info("{}|END|userId={}", prefix, authResponse.getUser().getId());
            return ResponseJson.toJsonWithData(ApiCode.SUCCESSFUL, "Password changed successfully", authResponse);
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Password change failed: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot password", description = "Request a password reset link/code to be sent to email")
    public String forgot(@RequestParam String email) {
        String prefix = "[forgotPassword]|email=" + email;
        try {
            log.info("{}|START", prefix);
            authService.forgotPassWord(email);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "Password reset request processed");
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, "Forgot password request failed: " + e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP for password reset")
    public String verifyOtp(@RequestParam String email, @RequestParam String otp) {
        String prefix = "[verifyOtp]|email=" + email;
        try {
            log.info("{}|START", prefix);
            boolean isValid = authService.verifyOtp(email, otp);
            if (isValid) {
                return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "OTP verified successfully");
            } else {
                return ResponseJson.toJsonString(ApiCode.UNSUCCESSFUL, "Invalid or expired OTP");
            }
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, e.getMessage());
        }
    }

    @PostMapping("/confirm-password")
    @Operation(summary = "Confirm password reset with OTP")
    public String confirm(@Valid @RequestBody ConfirmPasswordRequest request) {
        String prefix = "[confirmPassword]|email=" + request.getEmail();
        try {
            log.info("{}|START", prefix);
            authService.confirmPassWord(request);
            log.info("{}|END", prefix);
            return ResponseJson.toJsonString(ApiCode.SUCCESSFUL, "Password reset successfully");
        } catch (Exception e) {
            log.error("{}|Exception={}", prefix, e.getMessage(), e);
            return ResponseJson.toJsonString(ApiCode.ERROR_INTERNAL, e.getMessage());
        }
    }
}
