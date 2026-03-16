package com.sba301.retailmanagement.config;

import com.sendgrid.SendGrid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class MailConfig {

    private final SendGridProperties sendGridProperties;

    @Bean
    public SendGrid sendGrid() {
        return new SendGrid(sendGridProperties.getApiKey());
    }
}
