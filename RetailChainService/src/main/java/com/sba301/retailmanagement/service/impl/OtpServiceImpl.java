package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.entity.Otp;
import com.sba301.retailmanagement.repository.OtpCodeRepository;
import com.sba301.retailmanagement.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {
    private final OtpCodeRepository otpCodeRepository;


    @Transactional
    @Override
    public String generateAndSaveOtp(String email) {
        otpCodeRepository.deleteByEmail(email);

        String code = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);
        Otp otpCode = new Otp();
        otpCode.setEmail(email);
        otpCode.setOtpCode(code);
        otpCode.setExpiresAt(expiresAt);
        otpCodeRepository.save(otpCode);

        return code;
    }

    @Transactional
    @Override
    public boolean verifyOtp(String email, String inputCode, boolean consume) {
        Optional<Otp> otpOptional = otpCodeRepository.findByEmailAndOtpCode(email, inputCode);
        if (otpOptional.isEmpty()) {
            return false;
        }
        Otp otpCode = otpOptional.get();
        if (otpCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }
        if (consume) {
            otpCodeRepository.delete(otpCode);
        }
        return true;
    }

    @Transactional
    @Override
    public boolean verifyOtp(String email, String inputCode) {
        return verifyOtp(email, inputCode, true);
    }
}