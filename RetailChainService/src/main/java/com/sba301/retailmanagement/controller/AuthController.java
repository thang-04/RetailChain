package com.sba301.retailmanagement.controller;

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
import org.springframework.web.bind.annotation.RequestMapping;
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
        String prefix = "[logout]|userId=" + (userDetails != null ? userDetails.getId() : "null");
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
}
