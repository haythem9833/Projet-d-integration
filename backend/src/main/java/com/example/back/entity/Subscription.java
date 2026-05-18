package com.example.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan plan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status; // ACTIVE, CANCELLED, EXPIRED

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    private LocalDateTime renewalDate;

    @Column(nullable = false)
    private Boolean autoRenew = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ✓ Méthode utile
    public boolean isActive() {
        return status == SubscriptionStatus.ACTIVE && 
               LocalDateTime.now().isBefore(endDate);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(endDate);
    }

    public long getDaysRemaining() {
        return java.time.temporal.ChronoUnit.DAYS.between(
            LocalDateTime.now(), 
            endDate
        );
    }
}
