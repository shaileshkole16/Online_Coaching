package com.coaching.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LiveClassResponse {
    private Integer id;
    private Integer courseId;
    private String courseName;
    private Integer teacherId;
    private String teacherName;
    private String title;
    private String description;
    private String meetingLink;
    private String meetingId;
    private String meetingPassword;
    private LocalDateTime scheduledDate;
    private Integer duration;
    private String status;
    private String recordingUrl;
    private Integer maxParticipants;
    private Integer participantCount;
    private String thumbnailUrl;
    private String createdBy;
    private String createdAt;
    private String updatedAt;
}
