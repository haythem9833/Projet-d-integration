package com.example.back.dto.response;

import com.example.back.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long paymentId;
    private Long userId;
    private Double amount;
    private PaymentStatus status;
    private String method;
    private String stripePaymentIntentId;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;

    // For payment intent creation response
    private String clientSecret;
    private Long subscriptionId;
    private SubscriptionPlanResponse subscriptionPlan;

    // Constructors
    public PaymentResponse(Long paymentId, Long userId, Double amount, PaymentStatus status) {
        this.paymentId = paymentId;
        this.userId = userId;
        this.amount = amount;
        this.status = status;
    }

    public PaymentResponse(Long paymentId, Long userId, Double amount, PaymentStatus status, String method) {
        this.paymentId = paymentId;
        this.userId = userId;
        this.amount = amount;
        this.status = status;
        this.method = method;
    }
}
