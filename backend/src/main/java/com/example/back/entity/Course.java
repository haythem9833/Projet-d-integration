package com.example.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private Double price;

    private String category;

    private String level;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private User trainer;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Module> modules;

    @OneToMany(mappedBy = "course")
    private List<Enrollment> enrollments;

    @OneToMany(mappedBy = "course")
    private List<Certificate> certificates;
}