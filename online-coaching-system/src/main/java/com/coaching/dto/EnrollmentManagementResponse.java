package com.coaching.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentManagementResponse {
    private Integer enrollmentId;
    private String studentName;
    private String studentEmail;
    private String courseTitle;
    private String courseDescription;
    private String teacherName;
    private String teacherEmail;
    private LocalDate enrollDate;
    private String status;
    private String planType;
    private Double amountPaid;
}