package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.config.JwtProperties;
import com.sba301.retailmanagement.dto.request.ChangePassWordRequest;
import com.sba301.retailmanagement.dto.request.ConfirmPasswordRequest;
import com.sba301.retailmanagement.dto.request.FirstTimeChangePasswordRequest;
import com.sba301.retailmanagement.dto.request.LoginRequest;
import com.sba301.retailmanagement.dto.request.RefreshTokenRequest;
import com.sba301.retailmanagement.dto.request.RegisterRequest;
import com.sba301.retailmanagement.dto.response.AuthResponse;
import com.sba301.retailmanagement.dto.response.UserDTO;
import com.sba301.retailmanagement.entity.RefreshToken;
import com.sba301.retailmanagement.entity.Role;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.enums.RoleConstant;
import com.sba301.retailmanagement.repository.RoleRepository;
import com.sba301.retailmanagement.repository.StoreRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.security.CustomUserDetails;
import com.sba301.retailmanagement.security.JwtTokenProvider;
import com.sba301.retailmanagement.service.AuthService;
import com.sba301.retailmanagement.service.OtpService;
import com.sba301.retailmanagement.service.RefreshTokenService;
import com.sba301.retailmanagement.service.SendMailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
        private final OtpService otpService;
        private final SendMailService sendMailService;
        private final AuthenticationManager authenticationManager;
        private final UserRepository userRepository;
        private final RoleRepository roleRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtTokenProvider tokenProvider;
        private final RefreshTokenService refreshTokenService;
        private final JwtProperties jwtProperties;
        private final StoreRepository storeRepository;

        @Override
        @Transactional
        public AuthResponse login(LoginRequest request) {
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
                User user = userRepository.findById(userDetails.getId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found with id: " + userDetails.getId()));

                if (Boolean.TRUE.equals(user.getIsFirstLogin())) {
                        String tempToken = tokenProvider.generateTemporaryToken(user);
                        return AuthResponse.builder()
                                        .requireChangePassword(true)
                                        .tempToken(tempToken)
                                        .user(toUserDTO(user))
                                        .message("Vui lòng đổi mật khẩu để tiếp tục.")
                                        .build();
                }

                String accessToken = tokenProvider.generateAccessToken(authentication);
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

                return AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken.getToken())
                                .expiresIn(jwtProperties.getAccessTokenExpiration())
                                .user(toUserDTO(user))
                                .requireChangePassword(false)
                                .build();
        }

        @Override
        @Transactional
        public AuthResponse firstTimeChangePassword(FirstTimeChangePasswordRequest request, String tempToken) {
                String email = tokenProvider.getEmailFromToken(tempToken);
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

                if (!Boolean.TRUE.equals(user.getIsFirstLogin())) {
                        throw new RuntimeException("Account already initialized");
                }

                if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                        throw new RuntimeException("Mật khẩu mới không được trùng với mật khẩu tạm thời");
                }

                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                user.setIsFirstLogin(false);
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);

                // Now provide full login
                return login(new LoginRequest(user.getEmail(), request.getNewPassword()));
        }

        @Override
        @Transactional
        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists: " + request.getEmail());
                }

                // Find default role (STAFF - lowest privilege role)
                Role userRole = roleRepository.findByCode(RoleConstant.STAFF.name())
                                .orElseGet(() -> roleRepository.findByName(RoleConstant.STAFF.name())
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Default role STAFF not found")));

                Set<Role> roles = new HashSet<>();
                roles.add(userRole);

                User user = new User();
                user.setUsername(request.getEmail());
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setFullName(request.getFullName());
                user.setPhone(request.getPhoneNumber());
                user.setStatus(1); // Active
                user.setRoles(roles);
                user.setCreatedAt(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());

                User savedUser = userRepository.save(user);

                String accessToken = tokenProvider.generateAccessTokenFromEmail(
                                savedUser.getEmail(),
                                savedUser.getId(),
                                savedUser.getRoles());

                RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser);

                UserDTO userDTO = toUserDTO(savedUser);

                return AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken.getToken())
                                .expiresIn(jwtProperties.getAccessTokenExpiration())
                                .user(userDTO)
                                .build();
        }

        @Override
        @Transactional
        public AuthResponse refreshToken(RefreshTokenRequest request) {
                RefreshToken refreshToken = refreshTokenService.findByToken(request.getRefreshToken());
                refreshToken = refreshTokenService.verifyExpiration(refreshToken);

                User user = refreshToken.getUser();

                refreshTokenService.deleteRefreshToken(refreshToken);
                RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);

                String accessToken = tokenProvider.generateAccessTokenFromEmail(
                                user.getEmail(),
                                user.getId(),
                                user.getRoles());

                UserDTO userDTO = toUserDTO(user);

                return AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(newRefreshToken.getToken())
                                .expiresIn(jwtProperties.getAccessTokenExpiration())
                                .user(userDTO)
                                .build();
        }

        @Override
        @Transactional
        public void logout(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

                refreshTokenService.deleteByUser(user);
        }

        @Override
        @Transactional
        public AuthResponse changePassword(ChangePassWordRequest request, String token) {
                String email = tokenProvider.getEmailFromToken(token);
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

                if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                        throw new RuntimeException("Mật khẩu hiện tại không chính xác");
                }

                if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                        throw new RuntimeException("Mật khẩu mới không được trùng với mật khẩu cũ");
                }

                if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                        throw new RuntimeException("Mật khẩu mới và xác nhận mật khẩu không khớp");
                }
                refreshTokenService.deleteByUser(user);
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);
            return login(new LoginRequest(user.getEmail(), request.getNewPassword()));
        }
        @Override
        public void forgotPassWord(String email) {
                log.info("[forgotPassWord]|email={}", email);
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy email: " + email));
                
                if (Boolean.TRUE.equals(user.getIsFirstLogin())) {
                        throw new RuntimeException("Tài khoản của bạn chưa được kích hoạt. Vui lòng đăng nhập lần đầu bằng mật khẩu tạm thời đã được gửi qua email.");
                }

                sendMailService.sendOtpEmail(email, "RetailChain Admin send code to reset password", otpService.generateAndSaveOtp(email));
        }

        @Override
        public void confirmPassWord(ConfirmPasswordRequest request) {
                log.info("[confirmPassWord]|email={}", request.getEmail());
        if (otpService.verifyOtp(request.getEmail(), request.getOtp(), true)) {
                        User user = userRepository.findByEmail(request.getEmail())
                                         .orElseThrow(() -> new ResourceNotFoundException(
                                                         "User not found with email: " + request.getEmail()));

                        // If they somehow reset via OTP, we should probably clear isFirstLogin if it was set
                        // but based on forgotPassword logic, we block it. Still, the check here is good.
                        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                                throw new RuntimeException("Mật khẩu mới không được trùng với mật khẩu cũ");
                        }

                        // Bug 1.4 fix: Revoke all refresh tokens when password is changed via OTP
                        refreshTokenService.deleteByUser(user);

                        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                        user.setIsFirstLogin(false);
                        user.setUpdatedAt(LocalDateTime.now());
                        userRepository.save(user);
                        return;
                }
                throw new RuntimeException("Otp is invalid or expired for email: " + request.getEmail());
        }

        @Override
        public boolean verifyOtp(String email, String otp) {
                log.info("[verifyOtp]|email={}|otp={}", email, otp);
                return otpService.verifyOtp(email, otp, false);
        }

        private UserDTO toUserDTO(User user) {
                List<String> roleNames = user.getRoles() != null
                                ? user.getRoles().stream().map(Role::getCode).collect(Collectors.toList())
                                : List.of();

                List<String> permissions = user.getRoles() != null
                                ? user.getRoles().stream()
                                        .flatMap(role -> {
                                                if (role.getPermissions() != null) {
                                                        return role.getPermissions().stream();
                                                }
                                                return java.util.stream.Stream.empty();
                                        })
                                        .map(com.sba301.retailmanagement.entity.Permission::getName)
                                        .distinct()
                                        .collect(Collectors.toList())
                                : List.of();

                UserDTO dto = UserDTO.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .phoneNumber(user.getPhone())
                                .avatarUrl(null) // Or handle if exists
                                .status(user.getStatus())
                                .isFirstLogin(user.getIsFirstLogin())
                                .roles(roleNames)
                                .permissions(permissions)
                                .storeId(user.getStoreId())
                                .build();
                                
                if (user.getStoreId() != null) {
                        storeRepository.findById(user.getStoreId()).ifPresent(store -> {
                                dto.setStoreCode(store.getCode());
                                dto.setStoreName(store.getName());
                        });
                }
                
                return dto;
        }
}
