package com.sba301.retailmanagement.security;

import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String email = tokenProvider.getEmailFromToken(jwt);
                Long userId = tokenProvider.getUserIdFromToken(jwt);
                List<GrantedAuthority> authorities = tokenProvider.getAuthoritiesFromToken(jwt);

                log.debug("JWT validated for user: {}, authorities: {}", email, authorities);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Bug 1.1 fix: Load user from database to get proper roles and status
                    User user = userRepository.findByEmailWithAuthorities(email)
                            .orElse(null);

                    if (user == null) {
                        log.warn("User not found for email: {}", email);
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
                        return;
                    }

                    // Bug 1.3 fix: Check user status
                    if (user.getStatus() == null || user.getStatus() != 1) {
                        log.warn("User account is not active: {}", email);
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Account is not active");
                        return;
                    }

                    CustomUserDetails userDetails = CustomUserDetails.build(user);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info("Security context set for user: {}", email);
                }
            } else if (StringUtils.hasText(jwt)) {
                // JWT present but invalid - return 401
                log.warn("Invalid JWT token provided");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                return;
            }
            // No JWT token - continue to next filter (allows /api/auth/login to proceed)
        } catch (Exception ex) {
            // Bug 1.2 fix: Any exception should return 401, not swallow it
            log.error("JWT authentication error", ex);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
