package com.sba301.retailmanagement.repository;
import com.sba301.retailmanagement.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpCodeRepository extends JpaRepository<Otp, Long> {

    Optional<Otp> findByEmailAndOtpCode(String email, String otpCode);

    void deleteByEmail(String email);

    void deleteByExpiresAtBefore(LocalDateTime now);
}