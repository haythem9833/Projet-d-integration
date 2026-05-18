package com.example.back.config;

import com.example.back.entity.User;
import com.example.back.entity.Role;
import com.example.back.repository.UserRepository;
import com.example.back.service.SubscriptionService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Optional;

@Component
public class SubscriptionInterceptor implements HandlerInterceptor {

    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    public SubscriptionInterceptor(SubscriptionService subscriptionService, UserRepository userRepository) {
        this.subscriptionService = subscriptionService;
        this.userRepository = userRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) throws Exception {
        
        // Skip subscription check for payment endpoints (students need to pay first)
        String requestPath = request.getRequestURI();
        if (requestPath.startsWith("/api/payments")) {
            return true;
        }

        // Get current authentication
        Authentication authentication = SecurityContextHolder.getContext()
            .getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return true; // Allow unauthenticated users
        }

        // Get email from principal (JWT filter sets it as String)
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof String)) {
            return true; // If principal is not a string, allow
        }

        String email = (String) principal;
        
        // Load user from database
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            return true; // User not found, allow (will fail later in controller)
        }

        User user = userOpt.get();

        // Check subscription for STUDENTS only
        if (user.getRole() == Role.STUDENT) {
            if (!subscriptionService.hasActiveSubscription(user)) {
                response.setStatus(HttpServletResponse.SC_PAYMENT_REQUIRED);
                response.setContentType("application/json");
                response.getWriter().write(
                    "{\"error\":\"SUBSCRIPTION_EXPIRED\",\"message\":\"Your subscription has expired or not found\"}"
                );
                return false;
            }
        }

        return true;
    }
}
