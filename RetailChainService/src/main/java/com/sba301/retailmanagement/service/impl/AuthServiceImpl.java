package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.config.JwtProperties;
import com.sba301.retailmanagement.dto.request.LoginRequest;
import com.sba301.retailmanagement.dto.request.RefreshTokenRequest;
import com.sba301.retailmanagement.dto.request.RegisterRequest;
import com.sba301.retailmanagement.dto.response.AuthResponse;
import com.sba301.retailmanagement.dto.response.UserDTO;
import com.sba301.retailmanagement.entity.RefreshToken;
import com.sba301.retailmanagement.entity.Role;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.repository.RoleRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.security.CustomUserDetails;
import com.sba301.retailmanagement.security.JwtTokenProvider;
import com.sba301.retailmanagement.service.AuthService;
import com.sba301.retailmanagement.service.RefreshTokenService;
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

        private final AuthenticationManager authenticationManager;
        private final UserRepository userRepository;
        private final RoleRepository roleRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtTokenProvider tokenProvider;
        private final RefreshTokenService refreshTokenService;
        private final JwtProperties jwtProperties;

        @Override
        @Transactional
        public AuthResponse login(LoginRequest request) {
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                String accessToken = tokenProvider.generateAccessToken(authentication);

                CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
                User user = userRepository.findById(userDetails.getId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found with id: " + userDetails.getId()));

                RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

                UserDTO userDTO = toUserDTO(user);

                return AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken.getToken())
                                .expiresIn(jwtProperties.getAccessTokenExpiration())
                                .user(userDTO)
                                .build();
        }

        @Override
        @Transactional
        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists: " + request.getEmail());
                }

                // Find default role (USER)
                Role userRole = roleRepository.findByCode("USER")
                                .orElseGet(() -> roleRepository.findByName("USER")
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Default role USER not found")));

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

        private UserDTO toUserDTO(User user) {
                List<String> roleNames = user.getRoles() != null
                                ? user.getRoles().stream().map(Role::getName).collect(Collectors.toList())
                                : List.of();

                return UserDTO.builder()
                                .id(user.getId())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .phoneNumber(user.getPhone())
                                .status(user.getStatus())
                                .roles(roleNames)
                                .build();
        }
}
