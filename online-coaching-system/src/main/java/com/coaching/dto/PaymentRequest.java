package com.coaching.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Integer studentId;
    private Integer courseId;
    private Double amount;
    private String currency;
    private String planType; // FULL, BASIC
    private String receipt;
    private String notes;
}
