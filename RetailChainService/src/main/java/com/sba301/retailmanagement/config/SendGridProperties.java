package com.sba301.retailmanagement.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "spring.sendgrid")
@Getter
@Setter
public class SendGridProperties {
    private String apiKey;
    private String fromEmail;
}
