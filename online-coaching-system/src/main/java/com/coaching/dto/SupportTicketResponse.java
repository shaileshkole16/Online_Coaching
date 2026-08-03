package com.coaching.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SupportTicketResponse {
    private Integer id;
    private String ticketNumber;
    private Integer userId;
    private String userName;
    private String category;
    private String priority;
    private String status;
    private String subject;
    private String description;
    private String attachmentUrl;
    private Integer assignedTo;
    private String assignedToName;
    private String resolution;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}
