package com.sba301.retailmanagement.service;

import org.springframework.transaction.annotation.Transactional;

public interface OtpService {
    @Transactional
    String generateAndSaveOtp(String email);

    @Transactional
    boolean verifyOtp(String email, String inputCode, boolean consume);

    @Transactional
    boolean verifyOtp(String email, String inputCode);
}
