package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.entity.RefreshToken;
import com.sba301.retailmanagement.entity.User;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(User user);

    RefreshToken verifyExpiration(RefreshToken token);

    void deleteByUser(User user);

    RefreshToken findByToken(String token);

    void deleteRefreshToken(RefreshToken token);
}
