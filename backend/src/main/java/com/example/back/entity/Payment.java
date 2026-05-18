package com.example.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(nullable = false)
    private String method; // STRIPE, PAYPAL, etc.

    @Column(name = "stripe_payment_intent_id")
    private String stripePaymentIntentId;

    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;

    @Column(nullable = false)
    private LocalDateTime paidAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "subscription_plan_id")
    private SubscriptionPlan subscriptionPlan;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = PaymentStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
