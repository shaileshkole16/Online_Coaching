package com.coaching.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Integer id;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private Double amount;
    private String currency;
    private String status;
    private String planType;
    private String message;
    private Integer studentId;
    private Integer courseId;
}
