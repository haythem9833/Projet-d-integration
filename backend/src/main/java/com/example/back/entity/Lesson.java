package com.example.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    

    private String videoUrl;
    

     

    private String content;

    

    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;

     
}