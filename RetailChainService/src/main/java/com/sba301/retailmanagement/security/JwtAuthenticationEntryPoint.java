package com.sba301.retailmanagement.security;

import com.sba301.retailmanagement.utils.ResponseUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        log.error("Unauthorized error: {}", authException.getMessage());
        ResponseUtils.writeJson(response, HttpServletResponse.SC_UNAUTHORIZED,
                "Unauthorized: " + authException.getMessage());
    }
}
