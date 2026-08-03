package com.coaching.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LiveClassRequest {
    private Integer courseId;
    private Integer teacherId;
    private String title;
    private String description;
    private String meetingLink;
    private String meetingId;
    private String meetingPassword;
    private LocalDateTime scheduledDate;
    private Integer duration;
    private Integer maxParticipants;
    private String thumbnailUrl;
}
