package com.example.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "users")
@Setter
@Getter
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
    private Role role;

     

    private boolean blocked = false;

     

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