package com.coaching.dto;

import lombok.Data;

@Data
public class SupportTicketRequest {
    private Integer userId;
    private String category; // TECHNICAL, BILLING, ACCOUNT, COURSE_CONTENT, ENROLLMENT, CERTIFICATE, OTHER
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    private String status; // OPEN, IN_PROGRESS, RESOLVED, CLOSED
    private String subject;
    private String description;
    private String attachmentUrl;
    private Integer assignedTo;
    private String resolution;
}
