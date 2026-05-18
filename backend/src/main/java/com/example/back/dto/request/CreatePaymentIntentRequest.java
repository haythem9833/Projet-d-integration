package com.example.back.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class CreatePaymentIntentRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Subscription plan ID is required")
    private Long subscriptionPlanId;

    @NotBlank(message = "Currency is required")
    private String currency; // e.g., "usd"

    // Constructors
    public CreatePaymentIntentRequest() {}

    public CreatePaymentIntentRequest(Long userId, Long subscriptionPlanId, String currency) {
        this.userId = userId;
        this.subscriptionPlanId = subscriptionPlanId;
        this.currency = currency;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSubscriptionPlanId() {
        return subscriptionPlanId;
    }

    public void setSubscriptionPlanId(Long subscriptionPlanId) {
        this.subscriptionPlanId = subscriptionPlanId;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
