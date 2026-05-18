package com.example.back.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlanResponse {

    private Long id;
    private String name;
    private Double price;
    private String billingCycle;
    private Integer maxCourses;
    private Integer maxStudents;
    private String features;
}
