package com.example.back.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.back.security.JwtFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;  

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Unauthorized\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Access Denied - Insufficient permissions\"}");
                        }))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/auth/login", "/api/auth/signup", "/api/auth/logout", "/api/quizzes", "/api/modules/**", "/api/lessons/**", "/api/enrollments/student/**", "/api/payments/plans", "/api/migration/**", "/api/cleanup/**", "/", "/favicon.ico", "/error").permitAll()
                        
                        // Admin endpoints - only ADMIN role
                        .requestMatchers("/api/admin/**", "/api/auth/users").hasRole("ADMIN")
                        
                        // Professor/Trainer endpoints - PROFESSOR or TRAINER role
                        .requestMatchers("/api/professor/**", "/api/courses/create", "/api/courses/*/update", "/api/courses/*/delete", "/api/modules/**", "/api/lessons/**").hasAnyRole("PROFESSOR", "TRAINER")
                        
                        // Student endpoints - STUDENT role
                        .requestMatchers("/api/student/**", "/api/enrollments/**").hasRole("STUDENT")
                        
                        // Courses endpoint - requires authentication (any role)
                        .requestMatchers("/api/courses").authenticated()
                        
                        // All other requests require authentication
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);  

        return http.build();
    }
}