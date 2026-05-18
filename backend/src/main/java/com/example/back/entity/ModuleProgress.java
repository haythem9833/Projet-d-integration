package com.example.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "module_progress")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ModuleProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @Enumerated(EnumType.STRING)
    private ModuleStatus status = ModuleStatus.NOT_STARTED;

    @Column(nullable = false)
    private Double progressPercentage = 0.0;

    private LocalDateTime completedAt;
    private LocalDateTime lastAccessedAt;

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

    // Update progress based on lesson completion
    public void updateProgress(int completedLessons, int totalLessons) {
        if (totalLessons == 0) {
            progressPercentage = 0.0;
            status = ModuleStatus.NOT_STARTED;
            return;
        }

        progressPercentage = (completedLessons * 100.0) / totalLessons;

        if (progressPercentage >= 100) {
            status = ModuleStatus.COMPLETED;
            completedAt = LocalDateTime.now();
        } else if (progressPercentage > 0) {
            status = ModuleStatus.IN_PROGRESS;
        }

        lastAccessedAt = LocalDateTime.now();
    }
}
