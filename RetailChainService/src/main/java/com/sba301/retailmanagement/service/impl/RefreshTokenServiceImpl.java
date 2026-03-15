package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.config.JwtProperties;
import com.sba301.retailmanagement.entity.RefreshToken;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.exception.ResourceNotFoundException;
import com.sba301.retailmanagement.repository.RefreshTokenRepository;
import com.sba301.retailmanagement.security.JwtTokenProvider;
import com.sba301.retailmanagement.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;
    private final JwtTokenProvider tokenProvider;

    @Override
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(tokenProvider.generateRefreshToken(user))
                .expiryDate(Instant.now().plusSeconds(jwtProperties.getRefreshTokenExpiration()))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token has expired. Please login again.");
        }
        return token;
    }

    @Override
    @Transactional
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }

    @Override
    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Refresh token not found"));
    }

    @Override
    @Transactional
    public void deleteRefreshToken(RefreshToken token) {
        refreshTokenRepository.delete(token);
    }
}
