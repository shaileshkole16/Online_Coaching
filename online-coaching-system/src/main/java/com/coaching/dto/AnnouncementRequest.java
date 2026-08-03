package com.coaching.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AnnouncementRequest {
    private Integer courseId;
    private Integer teacherId;
    private Integer adminId;
    private String title;
    private String content;
    private String announcementType; // GENERAL, IMPORTANT, URGENT, ASSIGNMENT, EXAM
    private String priority; // LOW, MEDIUM, HIGH
    private String attachmentUrl;
    private String status; // DRAFT, PUBLISHED, ARCHIVED
    private LocalDateTime publishDate;
    private LocalDateTime expiryDate;
}
