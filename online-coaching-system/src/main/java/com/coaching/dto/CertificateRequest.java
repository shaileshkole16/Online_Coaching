package com.coaching.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CertificateRequest {
    private Integer studentId;
    private Integer courseId;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String grade;
    private Double percentage;
    private String status;
}
