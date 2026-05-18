package com.example.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscription_plans")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // BASIC, PRO, PREMIUM

    @Column(nullable = false)
    private Double price;

    @Enumerated(EnumType.STRING)
    private BillingCycle billingCycle; // MONTHLY, YEARLY

    private Integer maxCourses; // null = illimité
    private Integer maxStudents; // null = illimité

    @Column(columnDefinition = "JSON")
    private String features; // JSON array

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
