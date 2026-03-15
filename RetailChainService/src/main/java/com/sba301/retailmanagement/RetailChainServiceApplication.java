package com.sba301.retailmanagement;

import com.sba301.retailmanagement.config.SendGridProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({ SendGridProperties.class })
public class RetailChainServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RetailChainServiceApplication.class, args);
    }

}
