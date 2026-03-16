package com.sba301.retailmanagement.service.impl;
import com.sba301.retailmanagement.repository.OtpCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class OtpCleanupTask {

    private OtpCodeRepository otpCodeRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void cleanUpExpiredOps() {
        LocalDateTime now = LocalDateTime.now();
        otpCodeRepository.deleteByExpiresAtBefore(now);
        log.info("Đã dọn dẹp các mã OTP hết hạn lúc: {}", now);
    }
}