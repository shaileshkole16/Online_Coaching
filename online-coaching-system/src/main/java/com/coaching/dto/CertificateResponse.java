package com.coaching.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CertificateResponse {
    private Integer id;
    private Integer studentId;
    private String studentName;
    private Integer courseId;
    private String courseName;
    private String certificateNumber;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String status;
    private String grade;
    private Double percentage;
    private String certificateUrl;
    private String verificationCode;
    private String issuedBy;
    private String createdAt;
}
