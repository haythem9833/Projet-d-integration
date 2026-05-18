package com.example.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class User {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    

    private String firstName;

     

    private String lastName;

     

    @Column(unique = true)
    private String email;

     

    private String password;

     

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Role role;

     

    private boolean blocked = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "student")
    private List<Enrollment> enrollments;

    @OneToMany(mappedBy = "trainer")
    private List<Course> createdCourses;

    @OneToMany(mappedBy = "user")
    private List<Payment> payments;

    @OneToMany(mappedBy = "user")
    private List<Certificate> certificates;

    // getters setters
}