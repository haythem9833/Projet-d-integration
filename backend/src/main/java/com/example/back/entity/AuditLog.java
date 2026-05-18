package com.example.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String entityType; // COURSE, USER, PAYMENT, SUBSCRIPTION

    @Column(nullable = false)
    private Long entityId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action; // CREATE, UPDATE, DELETE, VIEW

    @ManyToOne
    @JoinColumn(name = "performed_by")
    private User performedBy;

    @Column(columnDefinition = "JSON")
    private String changes; // Avant/Après en JSON

    private String ipAddress;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
