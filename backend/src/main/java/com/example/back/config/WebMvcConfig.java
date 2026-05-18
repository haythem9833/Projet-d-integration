package com.example.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final SubscriptionInterceptor subscriptionInterceptor;

    public WebMvcConfig(SubscriptionInterceptor subscriptionInterceptor) {
        this.subscriptionInterceptor = subscriptionInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(subscriptionInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                    "/api/auth/**",
                    "/api/public/**"
                );
    }
}
