package com.example.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionText;
     

    private String optionA;
    

    private String optionB;
     

    private String optionC;
     

    private String optionD;
     

    private String correctAnswer;

     

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    // getters setters
}