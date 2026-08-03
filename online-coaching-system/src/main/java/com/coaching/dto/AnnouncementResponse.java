package com.coaching.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AnnouncementResponse {
    private Integer id;
    private Integer courseId;
    private String courseName;
    private Integer teacherId;
    private String teacherName;
    private Integer adminId;
    private String adminName;
    private String title;
    private String content;
    private String announcementType;
    private String priority;
    private String attachmentUrl;
    private String status;
    private LocalDateTime publishDate;
    private LocalDateTime expiryDate;
    private Boolean isRead;
    private Integer readCount;
    private String createdAt;
    private String updatedAt;
}
