package com.example.back.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {

    private Long id;
    private Long userId;
    private SubscriptionPlanResponse plan;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime renewalDate;
    private Boolean autoRenew;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
